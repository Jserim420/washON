var express = require('express');
var router = express.Router();

/* GET users listing. */

// 비밀번호 암호화 모듈
var Password = require("password-encrypt-util")
var password = new Password("mjc801!")

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post("/join", async function (req, res) {
  console.log(req.body)
  // 같은 이메일로 가입되어있는지 확인
  var alreadyUser = await User.findOne({
    where: {
      id: req.body.id
    }
  })

  if (alreadyUser) {
    res.json({
      result: "fail",
      message: "이미 가입된 이메일 입니다."
    })
    return
  }

  // 비밀번호 암호화
  req.body.password = password.getHashPassword(req.body.password)

  await User.create(req.body)
  res.json({
    result: "ok"
  })

})

router.post('/manager', async function (req, res) {
  console.log(req.body)

  await Manager.create(req.body)
  res.json({
    result: "ok"
  })

})

router.post("/login", async function (req, res) {
  console.log(req.body)
  var user = await User.findOne({
    where: {
      id: req.body.id,
      password: password.getHashPassword(req.body.password)
    }
  })

  if (!user) {
    res.json({
      result: "fail",
      message: "아이디 또는 비밀번호가 일치하지 않습니다."
    })
    return
  }

  req.session.user = user

  res.json({
    result: "ok",
    user: user
  })
})

router.post("/info", async function (req, res) {
  // 로그인된 사용자의 정보 저장
  if (req.session.user) {
    res.json({
      result: "ok",
      user: req.session.user
    })
  }
  else { // 로그인이 안되어 있을경우
    res.json({
      result: "fail"
    })
  }
})

router.post("/logout", async function (req, res) {
  req.session.destroy()
  res.json({
    result: "ok"
  })
})

router.post("/change/phoneNo", async function (req, res) {
  console.log(req.body)

  await User.update({
    phoneNo: req.body.phoneNo
  }, {
    where: {
      id: req.body.userId
    }
  })

  res.json({
    result: "ok"
  })
})

router.post("/change/password", async function (req, res) {
  console.log(req.body)

  await User.update({
    password: password.getHashPassword(req.body.password)
  }, {
    where: {
      id: req.body.userId
    }
  })

  res.json({
    result: "ok"
  })


})



module.exports = router;
