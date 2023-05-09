const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "HI there 👋", v: 4 });
});

app.post("/ulala", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  const { hum, temp } = req.body;

  function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    return (
      ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
      outputMin
    );
  }

  let mappedValue = String(mapRange(temp, 20, 35, 0, 100), 2);

  res.json({ status: "OK", respond: { data: mappedValue, msg: `i received temp value ${temp}` } });
});
app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
