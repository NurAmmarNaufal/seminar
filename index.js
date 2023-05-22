const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "HI there 👋", v: 1.2 });
});

app.post("/httpreq", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  let { temp, tanah } = req.body;

  function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (
      ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
      outputMin
    );
  }

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

  res.json({
    status: "OK",
    data: {
      kipas: { value: Math.ceil(kipas), satuan: "PWM" },
      kipasListrik: {
        value: Math.ceil(kipasListrik),
        satuan: "level kecepatan",
      },
      pompa: { value: Math.ceil(kelembapanTanah), satuan: "detik" },
    },
  });
});

app.post("/mongo/create", require("./config/mongoConnection").mongo);
app.post("/mongo/find", require("./config/mongoConnection").find);
app.get("/mongo/hapus", require("./config/mongoConnection").hapus);

app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
