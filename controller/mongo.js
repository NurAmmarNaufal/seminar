const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.URI_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
  return (
    ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin
  );
}

async function mongo(req, res) {
  const { temp, tanah } = req.body;

  if (temp < 20) {
    temp = 20;
  }
  if (temp > 35) {
    temp = 35;
  }
  if (tanah > 100) {
    tanah = 100;
  }

  let kipas = mapRange(temp, 20, 40, 0, 255);
  let kipasListrik = mapRange(temp, 20, 40, 0, 3);
  let kelembapanTanah = mapRange(tanah, 0, 100, 20, 0);

  try {
    await client.connect();
    console.log("Connect");
    const db = client.db("mymongo");
    const result = await db.collection("pertanian").insertOne({
      timestamp: Date.now(),
      temp: temp,
      tanah: tanah,
    });
    const dataRespon = {
      create: result,
      data: {
        kipas: { value: Math.ceil(kipas), satuan: "PWM" },
        kipasListrik: {
          value: Math.ceil(kipasListrik),
          satuan: "level kecepatan",
        },
        pompa: { value: Math.ceil(kelembapanTanah), satuan: "detik" },
      },
    };
    res.status(200).json(dataRespon);
  } catch (error) {
    res.status(200).json("Error connecting to MongoDB Atlas", error);
  }
}

async function find(req, res) {
  const { find } = req.body;
  try {
    await client.connect();
    console.log("Connect");
    const db = client.db("mymongo");
    if (find === "one") {
      const result = await db
        .collection("pertanian")
        .findOne({}, { sort: { timestamp: -1 } });
      res.status(200).json(result);
    } else if (find === "many") {
      const result = await db.collection("pertanian").find().toArray();
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(200).json("Error connecting to MongoDB Atlas", error);
  }
}

async function hapus(req, res) {
  try {
    await client.connect();
    console.log("Connect");
    const db = client.db("mymongo");
    const result = await db.collection("pertanian").deleteMany({});
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json("Error connecting to MongoDB Atlas", error);
  }
}

module.exports = { mongo, find, hapus };
