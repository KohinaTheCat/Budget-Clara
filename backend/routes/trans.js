const router = require("express").Router();
let Trans = require("../models/trans.model");

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

router.get("/", (req, res) => {
  Trans.find()
    .sort({ when: "desc" })
    .then((v) => res.json(v))
    .catch((err) => res.json(err));
});

router.get("/total", (req, res) => {
  Trans
  .aggregate([{
      $group: {_id: null, total: {$sum: "$amount"}}
  }]).then((v) => res.json(v))
  .catch((err) => res.json(err));
});

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

router.delete("/:id", (req, res) => {
  Trans.findByIdAndDelete(req.params.id)
    .then(() => res.json("deleted."))
    .catch((err) => res.json(err));
});

module.exports = router;
