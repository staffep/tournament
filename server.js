var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Tournament = require('./models/tournamentModel'),
    Bracket = require('./models/bracketModel'),
    bodyParser = require('body-parser'),
    path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://tournament-test:oDciE7a3W0kpsqRRnLMc6sJINSC4w6QmP0SiXAfO20hFCWtFxrFpZywL6U9jFrOGDKIkTAiLq6aOYOWm80Yy9Q==@tournament-test.documents.azure.com:10255/?ssl=true');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'Client')));

var routes = require('./routes/tournamentRoutes');

app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname + "/Client/" });
});

app.get('/tournamentmode', function (req, res) {
    res.sendfile('index.html', { root: __dirname + "/Client" });
});

routes(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
