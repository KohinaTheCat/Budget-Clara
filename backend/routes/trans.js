/*
for transaction types
*/

const router = require("express").Router();
let Trans = require("../models/trans.model");

//add a transaction
router.post("/", (req, res) => {
  const essential = req.body.essential;
  const amount = parseFloat(req.body.amount);
  const where = req.body.where;
  const what = req.body.what;
  const when = Date.parse(req.body.when);

  const newTrans = new Trans({
    essential,
    amount,
    where,
    what,
    when,
  });

  newTrans
    .save()
    .then(() => res.json("transaction added"))
    .catch((err) => res.json(err));
});

//get a transaction
router.get("/", (req, res) => {
  Trans.find()
    .sort({ when: "desc" })
    .then((v) => res.json(v))
    .catch((err) => res.json(err));
});

//get sum
router.get("/total", (req, res) => {
  Trans.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        gain: { $sum: { $cond: [{ $gt: ["$amount", 0] }, "$amount", 0] } },
        loss: { $sum: { $cond: [{ $lt: ["$amount", 0] }, "$amount", 0] } },
      },
      //{ $cond: [ <boolean-expression>, <true-case>, <false-case> ] }
    },
  ])
    .then((v) => res.json(v))
    .catch((err) => res.json(err));
});

//edit transaction
router.route("/:id").post((req, res) => {
  Trans.findById(req.params.id)
    .then((v) => {
      v.essential = req.body.essential;
      v.what = req.body.what;
      v.amount = parseFloat(req.body.amount);
      v.where = req.body.where;
      v.when = Date.parse(req.body.when);

      v.save()
        .then(() => res.json("transaction updated"))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

//delete transaction
router.delete("/:id", (req, res) => {
  Trans.findByIdAndDelete(req.params.id)
    .then(() => res.json("deleted."))
    .catch((err) => res.json(err));
});

module.exports = router;
