var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Tournament = require('./models/tournamentModel'),
    bodyParser = require('body-parser'),
    path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tournamentdb-test');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'Client')));

app.get('/', function (req, res) {
    res.sendfile('', { root: __dirname + "/Client/index.html" });
});



var routes = require('./routes/tournamentRoutes');
routes(app);


app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
