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

app.use(express.bodyParser());

app.get('/places', function(req, res) {
    places.getPlaces(context, req, res);
});

app.post('/places', function(req, res) {
    places.createNewPlace(context, req, res);
});

app.get('/places/:place_id', function(req, res) {
    places.getById(context, req, res);
});

app.delete('/places/:place_id', function(req, res) {
    places.deletePlace(context, req, res);
});

app.get('/places/:place_id/logs', function(req, res) {
    logs.getByPlace(context, req, res);
});

app.post('/places/:place_id/logs', function(req, res) {
    logs.addNewPlaceLog(context, req, res);
});

app.get('/logs', function(req, res) {
    logs.getLogs(context, req, res);
});

app.get('/logs/:log_id', function(req, res) {
    logs.getById(context, req, res);
});

app.delete('/logs/:log_id', function(req, res) {
    logs.deleteLog(context, req, res);
});


mongodb.MongoClient.connect(dbUrl, function(err, ref) {
    if (err) {
        throw err;
    }
    context.db = ref;
    app.listen(3000);
    console.log('Database connected, listening at port 3000');
});
