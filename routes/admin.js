var express = require('express');
const { response } = require('../app');
var router = express.Router();
const clientHelpers = require('../helpers/client-helpers');

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.adminSignin) {
    res.redirect('/admin/adminhome')
  } else {
    res.render('admin/admin', { adminErr: req.session.adminErr })
    req.session.adminErr = null
  }

});
router.post('/admin', (req, res) => {
  console.log(req.body)
  
  if (req.body.Email == "admin@gmail.com" && req.body.Password == 123) {
    req.session.adminSignin = true
    res.redirect('/admin/adminhome')

  } else {
    req.session.adminErr = "Invalid user name or Password"
    res.redirect('/admin')
  }
})
router.get('/adminhome', (req, res) => {
  if(req.session.adminSignin){
    clientHelpers.getUserdetail().then((data) => {
      res.render('Admin/adminhome', { data })
    })
  }else{
    res.redirect('/')
  }
 


})

router.get('/logout', (req, res) => {
  req.session.adminSignin = false
  res.redirect('/admin')
})
module.exports = router;
