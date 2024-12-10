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
  secret: 'QasrAbdeen1863', // fun fact : 1863 is the year Qasr Abdeen was built (not sure tbh)
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));

var MongoClient = require('mongodb').MongoClient;

var db;

async function connectToDb() {
  try {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
    db = client.db('myDB');
  } catch (err) {
    console.error('Failed to connect to the DB', err);
    process.exit(1);
  }
}

connectToDb();

function checkAuth(req, res, next) {
  if (!req.session.isAuthenticated && req.path !== '/' && req.path !== '/registration' && req.path !== '/register') {
    req.session.redirectTo = req.originalUrl;
    return res.redirect('/');
  }
  next();
}

app.use(checkAuth);

app.get('/', function (req, res) {
  const successMessage = req.query.success || '';
  res.render('login', { errormsg: '', success: successMessage });
});

app.post('/', async function (req, res) {
  const usname = req.body.username;
  const pass = req.body.password;

  if (!usname || !pass) {
    return res.render('login', { errormsg: "Username and password cannot be empty", success: '' });
  }

  const user = await db.collection('myCollection').findOne({ usname: usname });

  if (!user) {
    return res.render('login', { errormsg: "User not found. Please register.", success: '' });
  }

  if (user.pass === pass) {
    req.session.isAuthenticated = true;
    const redirectTo = req.session.redirectTo || '/home';
    delete req.session.redirectTo;
    req.session.username = usname;
    return res.redirect(redirectTo);
  } else {
    res.render('login', { errormsg: "Invalid password", success: '' });
  }
});

app.get('/registration', function (req, res) {
  res.render('registration', { errormsg: '' });
});


app.post('/register', async function (req, res) {
  const usname = req.body.username;
  const pass = req.body.password;
  var wanttogolist = [];

  if (!usname || !pass) {
    return res.render('registration', { errormsg: "Username and password cannot be empty" });
  }

  const user = await db.collection('myCollection').findOne({ usname: usname });

  if (user) {
    return res.render('registration', { errormsg: "Username already taken" });
  }

  const result = await db.collection('myCollection').insertOne({ usname, pass, wanttogolist });

  res.redirect('/?success=Registration was successful!');
});


app.post('/addtowanttogo', async function (req, res) {

  const destination = req.body.destination;
  const username = req.session.username;

  const user = await db.collection('myCollection').findOne({ usname: username });
 
  if (user) {
    if (user.wanttogolist.includes(destination)) {
      return res.status(200).json({ message: 'Destination is already in your Want-to-Go list!' });
    }
    else {
      await db.collection('myCollection').updateOne(
        { usname: username },
        { $push: { wanttogolist: destination } }
      );
      return res.status(200).json({ message: 'Destination is added to your Want-to-Go list!' });
    }
  }
  else {
    return res.status(404).send('User not found'); //m4 3aref hayewsal hena ezay lw hwa m4 user bs aho e7tyaty
                                                   //update: b2aly sa3a basala7 fe error 34an m4 la2y el user "clown emoji"
  }

});

app.get('/home', function (req, res) {
  res.render('home');
});

app.get('/hiking', function (req, res) {
  res.render('hiking');
});

app.get('/annapurna', function (req, res) {
  res.render('annapurna');
});

app.get('/bali', function (req, res) {
  res.render('bali');
});

app.get('/cities', function (req, res) {
  res.render('cities');
});

app.get('/inca', function (req, res) {
  res.render('inca');
});

app.get('/islands', function (req, res) {
  res.render('islands');
});

app.get('/paris', function (req, res) {
  res.render('paris');
});

app.get('/rome', function (req, res) {
  res.render('rome');
});

app.get('/santorini', function (req, res) {
  res.render('santorini');
});

app.get('/searchresults', function (req, res) {
  res.render('searchresults');
});

app.get('/wanttogo', async function (req, res) {
  const username = req.session.username;

  const user = await db.collection('myCollection').findOne({ usname: username });

  if (!user) {
    return res.status(404).send('User not found'); //line #123 beysalem 3leek
  }

  const wantToGoList = user.wanttogolist;

  res.render('wanttogo', { wantToGoList });
});

//favicon.png is just a photo of the real Qasr Abdeen :)
//sometimes the app fails to GET favicon.ico . just reload the home page from the url

//Dedicated to Ahmed Helmy, the best Networks TA to ever exist

app.listen(3000);
