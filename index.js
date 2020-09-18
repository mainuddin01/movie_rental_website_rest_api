const express = require("express");
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to mongodb...");
  })
  .catch((error) => {
    console.log("Failed to connect mongodb...");
  });

app.use(express.json());

app.use("/api/genres", genres);

app.use("/api/customers", customers);

const port = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
