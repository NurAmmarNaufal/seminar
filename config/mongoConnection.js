const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.URI_MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function mongo(req, res) {
  const { temp, tanah } = req.body;
  try {
    await client.connect();
    console.log("Connect");
    const db = client.db("mymongo");
    const result = await db.collection("pertanian").insertOne({
      timestamp: Date.now(),
      temp: temp,
      tanah: tanah,
    });
    res.status(200).json(result);
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
