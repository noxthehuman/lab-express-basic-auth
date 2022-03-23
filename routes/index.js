const bcryptjs = require("bcryptjs")
const saltRounds = 10

const router = require("express").Router()
const User = require('../models/User.model')
const isLoggedIn = require('../middlewear/isLoggedIn')

/* GET home page */
router.get("/", (req, res) => {
  res.render("index")
});

router.get('/auth/login', (req, res) => {
  res.render('auth/login')
})

router.post("/auth/login", (req, res, next) => {
  const user = req.body
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(user.password, salt))
    .then(hashedPassword => {
      return User.create({
        username: user.username,
        password: hashedPassword})
    })
    .then(userFromDB => {
      req.session.currentUser = user;
      res.redirect('/')
      console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
})

router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err)
    res.redirect('/')
  })
})

router.get('/main', isLoggedIn, (req, res, next) => {
  res.render('auth/main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
  res.render('auth/private')
})

module.exports = router
