var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/reserve/done', async function (req, res) {
  console.log(req.body)

  await Reservation.create(req.body)

  res.json({
    result: "ok"
  })

})

router.post('/reserve/list', async function (req, res) {
  console.log(req.body.userId)
  var userId = req.body.userId;
  var reserveList = await Reservation.findAll({
    where: {
      userId: userId
    }
  })


  console.log(reserveList)

  res.json({
    result: "ok",
    reserveList: reserveList
  })
})

router.post('/reserve/list/manager', async function (req, res) {
  console.log(req.body)

  var place = await Manager.findOne({
    where: {
      id: req.body.userId
    }
  })

  var placeAdd = place ? place.placeAdd : null;

  var reserveList = await Reservation.findAll({
    where: {
      placeAdd: placeAdd
    }
  })
  console.log(reserveList)

  res.json({
    result: "ok",
    reserveList: reserveList
  })
})

router.post('/reserve/setState', async function (req, res) {
  console.log(req.body)

  await Reservation.update({
    reserveState: req.body.reserveState
  }, {
    where: {
      id: req.body.id
    }
  })

  res.json({
    result: "ok"
  })
})

router.post('/reserve/remove', async function (req, res) {
  console.log(req.body)

  await Reservation.destroy({
    where: {
      id: req.body.id
    }
  })


  res.json({
    result: "ok"
  })
})


module.exports = router;
