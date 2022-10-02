var express = require('express');
const clientHelpers = require('../helpers/client-helpers');
var router = express.Router();
const bcrypt = require('bcrypt');
const { response } = require('../app');
/* GET home page. */



router.get('/', function (req, res) {
  if (req.session.login) {
    res.redirect('index')
  } else {
    res.render('Client/login', { loginErr: req.session.loginErr })
    req.session.loginErr = null
  }
});

router.post('/', (req, res) => {
  clientHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.userId = response.userId
      req.session.login = true
      res.redirect('index')
    } else {
      req.session.loginErr = "Invalid user name or password"
      res.redirect('/')
    }
  })
})



router.get('/signup', (req, res) => {
 
    res.render('Client/signup', { SigninErr: req.session.SigninErr, sign: req.session.sign, count: req.session.count })
    req.session.SigninErr = null
    req.session.sign = null

})

router.post('/signup', (req, res) => {
  console.log(req.body)
  if (req.body.Name == '') {
    req.session.sign = "email id and password is required."
    res.redirect('/signup')

  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.Password, salt, function (err, hash) {
        req.body.Password = hash;
        clientHelpers.signup(req.body).then((response) => {
          if (response.status) {
            console.log("same aan")
            req.session.SigninErr = "email id already existed"
            res.redirect('/signup')


          } else {
            clientHelpers.dosignup(req.body).then((response) => {
              res.redirect('/')

            })
          }
        })
      })
    })

  }



})



router.get('/index', (req, res) => {
  if (req.session.login) {
    clientHelpers.userDetails(req.session.userId).then((result) => {
      res.render('index', { result })
    })
  } else {
    res.redirect('/')
  }


})


router.post('/updatestatu/:id', (req, res) => {
  let id = req.params.id
  clientHelpers.statusUpdate(req.params.id, req.session.userId)
  res.json({ status: true })
})


router.post('/commentstatu/:id', (req, res) => {
  let id = req.params.id
  clientHelpers.commentUpdate(req.params.id, req.session.userId, req.body)
  res.json({ status: true })
})







router.get('/logout', (req, res) => {
  req.session.login = false
  res.redirect('/')
})
module.exports = router;
