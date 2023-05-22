const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ msg: "HI there 👋", v: 1.3 });
});

app.post("/httpreq", require("./controller/httpreq").basic);
app.post("/mongo/create", require("./controller/mongo").mongo);
app.post("/mongo/find", require("./controller/mongo").find);
app.get("/mongo/hapus", require("./controller/mongo").hapus);

app.listen(process.env.PORT || 8000, () => {
  console.log("listening on port 8000");
});
