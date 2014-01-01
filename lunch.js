var express = require('express'),
    app = express(),
    context,
    mongodb = require('mongodb'),
    places = require('./routes/places.js'),
    visits = require('./routes/visits.js'),
    diners = require('./routes/diners.js');

context = {
    places: places,
    visits: visits,
    diners: diners,
    mongodb: mongodb,
    api: require('./api.js')
};

function preFilter(req, res, next) {
    var o = req.get('Origin'),
        m = req.get('Access-Control-Request-Method'),
        h = req.get('Access-Control-Request-Headers');

    res.set('Access-Control-Allow-Origin', o);
    res.set('Access-Control-Allow-Methods', m);
    res.set('Access-Control-Allow-Headers', h);
    next();
}

// do application initialization,
// call each module in "routes/" to initialize as well.

function initialize() {
    places.initialize(context);
    visits.initialize(context);
    diners.initialize(context);
}

exports.start = function(config) {

    app.use(express.bodyParser());

    app.get('/places', preFilter, function(req, res) {
        places.getPlaces(context, req, res);
    });

    app.post('/places', preFilter, function(req, res) {
        places.createNewPlace(context, req, res);
    });

    app.get('/places/:place_id', preFilter, function(req, res) {
        places.getById(context, req, res);
    });

    app.put('/places/:place_id', preFilter, function(req, res) {
        places.updatePlace(context, req, res);
    });

    app.delete('/places/:place_id', preFilter, function(req, res) {
        places.deletePlace(context, req, res);
    });

    app.get('/places/:place_id/visits', preFilter, function(req, res) {
        visits.getByPlace(context, req, res);
    });

    app.post('/places/:place_id/visits', preFilter, function(req, res) {
        visits.addNewPlaceVisit(context, req, res);
    });

    app.get('/visits', preFilter, function(req, res) {
        visits.getVisits(context, req, res);
    });

    app.post('/visits', preFilter, function(req, res) {
        visits.addNewVisit(context, req, res);
    });

    app.get('/visits/:visit_id', preFilter, function(req, res) {
        visits.getById(context, req, res);
    });

    app.delete('/visits/:visit_id', preFilter, function(req, res) {
        visits.deleteVisit(context, req, res);
    });

    //
    // Diners
    //
    app.get('/diners', preFilter, function(req, res) {
        diners.getDiners(context, req, res);
    });

    app.post('/diners', preFilter, function(req, res) {
        diners.createNewDiner(context, req, res);
    });

    app.get('/diners/:diner_id', preFilter, function(req, res) {
        diners.getById(context, req, res);
    });

    app.put('/diners/:diner_id', preFilter, function(req, res) {
        diners.updateDiner(context, req, res);
    });

    app.delete('/diners/:diner_id', preFilter, function(req, res) {
        diners.deleteDiner(context, req, res);
    });

    app.options('*', preFilter, function(req, res) {
        res.send(200);
    });

    mongodb.MongoClient.connect(config.get('database:url'), function(err, ref) {
        var port = config.get('PORT');
        if (err) {
            throw err;
        }
        context.db = ref;
        initialize();
        app.listen(port);
        console.log('Database connected, listening at port ' + port);
    });
};
