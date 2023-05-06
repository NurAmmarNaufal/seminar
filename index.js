const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "success boss" });
});

app.post("/ulala", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");

  let msg = 'ulala'
  res.json(msg);
});
app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
