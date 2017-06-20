var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Tournament = require('./models/tournamentModel'),
    bodyParser = require('body-parser'),
    path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tournamentdb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'Client')));

var routes = require('./routes/tournamentRoutes');

app.get('/', function (req, res) {
    res.sendfile('', { root: __dirname + "/Client/index.html" });
});

app.get('/tournamentmode', function (req, res) {
    res.sendfile('', { root: __dirname + "/Client/index.html" });
});

routes(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
