const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

require("./memberdetails.model.js");
const MemberDetails = mongoose.model("memberdetails");
const url = process.env.MONGO_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established with Book");
  })
  .catch((e) => {
    console.log("Connection failed",e);
  });

app.get("/", (req, res) => {
  res.send("This is books service");
});

app.post("/memberdetails", (req, res) => {
  const memberdetails = new MemberDetails(req.body);
  memberdetails
    .save()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/memberdetails", (req, res) => {
  MemberDetails.find()
    .then((data) => {
      console.log(data,"data")
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.get("/book/:id", (req, res) => {
  memberdetails.findById(req.params.id)
    .then((memberdetails) => {
      if (memberdetails) {
        res.status(200).send(memberdetails);
      } else {
        res.status(404).send("No such book found");
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.delete("/book/:id", (req, res) => {
  memberdetails.findByIdAndDelete(req.params.id)
    .then((memberdetails) => {
      if (memberdetails) {
        res.status(200).send(memberdetails);
      } else {
        res.status(404).send("No book found");
      }
    })
    .catch((err) => res.status(400).send(err));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
  console.log("Up and running books service");
});
