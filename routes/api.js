const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({body}, res) => {
  Transaction.create(body)
    .then(transactionDB => {
      res.json(transactionDB);
    })
    .catch(err => {
      res.json(err);
    });
});

router.post("/api/transaction/bulk", ({body}, res) => {
  Transaction.insertMany(body)
    .then(transactionDB => {
      res.json(transactionDB);
    })
    .catch(err => {
      res.json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({}).sort({date: -1})
    .then(transactionDB => {
      res.json(transactionDB);
    })
    .catch(err => {
      res.json(err);
    });
});

module.exports = router;