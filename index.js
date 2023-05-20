const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "HI there 👋", v: 1.1 });
});

app.post("/httpreq", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const { temp, tanah } = req.body;

  function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (
      ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
      outputMin
    );
  }

  let mappedValue = mapRange(temp, 20, 35, 100, 255);
  let kelembapanTanah = mapRange(tanah, 0, 100, 20, 0);

  res.json({
    status: "OK",
    respond: {
      kipas: Math.ceil(mappedValue),
      pompa: Math.ceil(kelembapanTanah)
    },
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
