const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const Nunomatic = require('./nunomatic');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
var exphbs  = require('express-handlebars');
var hbs = exphbs.create({
  extname: '.hbs',
  partialsDir: __dirname + '/views/partials',
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

let nuno;

app.get('/', (req, res) => {
  if (!nuno) {
    return res.json({status: 500, error: 'No nuno set'})
  }


  res.render('home', {
    layout: 'main',
    description: nuno.description,
    todayRank: nuno.currentVal,
    yesterdayRank: nuno.previousVal,
    status: nuno.status,
    debugging: nuno.debugging,
  });
});

app.post('/', (req, res) => {
  const { description, url, selector, debugging } = req.body;
  nuno = new Nunomatic(description, url, selector, debugging);
  res.json({status: 200, 'current-nuno-status': nuno.status})
});

app.get('/refresh', (req, res) => {
  nuno.updateVal();
  res.json({status: 200, 'current-nuno-status': nuno.status})
});

app.listen(3012, () => console.log(`App listening on port ${3012}!`));