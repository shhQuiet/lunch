var express = require('express'),
    app = express(),
    context,
    mongodb = require('mongodb'),
    // dbUrl = "mongodb://localhost:27017/lunch",
    // mongodb://<user>:<password>@linus.mongohq.com:10089/app20771452
    dbUrl = "mongodb://luncheon:is_served@linus.mongohq.com:10089/app20771452",
    places = require('./routes/places.js'),
    logs = require('./routes/logs.js');

context = {
    places: places,
    logs: logs,
    mongodb: mongodb,
    newId: function(obj) {
        obj._id = new mongodb.ObjectID();
        return obj;
    },
    convertToExternal: function(item) {
        item.id = item._id;
        delete item._id;
    }
};

function setHeaders(req, res) {
    res.set('Access-Control-Allow-Origin', req.get('Origin'));
    res.set('Access-Control-Allow-Methods', req.get('Access-Control-Request-Method'));
    res.set('Access-Control-Allow-Headers'), req.get('Access-Control-Request-Headers')
}

app.use(express.bodyParser());

app.get('/places', function(req, res) {
    setHeaders(req, res);
    places.getPlaces(context, req, res);
});

app.post('/places', function(req, res) {
    setHeaders(req, res);
    places.createNewPlace(context, req, res);
});

app.get('/places/:place_id', function(req, res) {
    setHeaders(req, res);
    places.getById(context, req, res);
});

app.delete('/places/:place_id', function(req, res) {
    setHeaders(req, res);
    places.deletePlace(context, req, res);
});

app.get('/places/:place_id/logs', function(req, res) {
    setHeaders(req, res);
    logs.getByPlace(context, req, res);
});

app.post('/places/:place_id/logs', function(req, res) {
    setHeaders(req, res);
    logs.addNewPlaceLog(context, req, res);
});

app.get('/logs', function(req, res) {
    setHeaders(req, res);
    logs.getLogs(context, req, res);
});

app.get('/logs/:log_id', function(req, res) {
    setHeaders(req, res);
    logs.getById(context, req, res);
});

app.delete('/logs/:log_id', function(req, res) {
    setHeaders(req, res);
    logs.deleteLog(context, req, res);
});

app.options('*', function(req, res) {
    console.log('Processing OPTIONS');
    setHeaders(req, res);
    // res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'content-type, accept');
    res.send(200);
});

mongodb.MongoClient.connect(dbUrl, function(err, ref) {
    var port = process.env.PORT || 3000;
    if (err) {
        throw err;
    }
    context.db = ref;
    app.listen(port);
    console.log('Database connected, listening at port ' + port);
});
