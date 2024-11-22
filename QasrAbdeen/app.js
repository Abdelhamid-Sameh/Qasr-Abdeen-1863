var express = require('express');
var path = require('path');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'QasrAbdeen1863', 
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));

function checkAuth(req, res, next) {
  if (!req.session.isAuthenticated && req.path !== '/') {
      req.session.redirectTo = req.originalUrl;
      return res.redirect('/');
  }
  next();
}

app.use(checkAuth);

app.get('/', function(req,res){
  res.render('login', { errormsg: ''});
});

app.post('/', function(req, res) {
  if (req.body.username === 'admin' && req.body.password === 'admin') {
      req.session.isAuthenticated = true;
      const redirectTo = req.session.redirectTo || '/home';
      delete req.session.redirectTo; 
      return res.redirect(redirectTo);
  } else {
      res.render('login', { errormsg: "Invalid username or password" });
  }
});

app.get('/registration', function(req,res){
  res.render('registration');
});

app.get('/home', function(req,res){
  res.render('home');
});

app.get('/hiking', function(req,res){
  res.render('hiking');
});

app.get('/annapurna', function(req,res){
  res.render('annapurna');
});

app.get('/bali', function(req,res){
  res.render('bali');
});

app.get('/cities', function(req,res){
  res.render('cities');
});

app.get('/inca', function(req,res){
  res.render('inca');
});

app.get('/islands', function(req,res){
  res.render('islands');
});

app.get('/paris', function(req,res){
  res.render('paris');
});

app.get('/rome', function(req,res){
  res.render('rome');
});

app.get('/santorini', function(req,res){
  res.render('santorini');
});

app.get('/searchresults', function(req,res){
  res.render('searchresults');
});

app.get('/wanttogo', function(req,res){
  res.render('wanttogo');
});


app.listen(3000);
