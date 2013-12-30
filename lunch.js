var express = require('express'),
    app = express(),
    context,
    mongodb = require('mongodb'),
    places = require('./routes/places.js'),
    logs = require('./routes/logs.js'),
    diners = require('./routes/diners.js'),
    nconf = require('nconf');

context = {
    places: places,
    logs: logs,
    mongodb: mongodb,
    newId: function(obj) {
        obj._id = new mongodb.ObjectID();
        return obj;
    },
    convertToExternal: function(item) {
        item.id = item._id.toString();
        delete item._id;
    }
};

function setHeaders(req, res) {
    var o = req.get('Origin'),
        m = req.get('Access-Control-Request-Method'),
        h = req.get('Access-Control-Request-Headers');

    // console.log('o:' + o);
    // console.log('m:' + m);
    // console.log('h:' + h);
    res.set('Access-Control-Allow-Origin', o);
    res.set('Access-Control-Allow-Methods', m);
    res.set('Access-Control-Allow-Headers', h);
}

exports.start = function(config) {
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

    app.put('/places/:place_id', function(req, res) {
        setHeaders(req, res);
        places.updatePlace(context, req, res);
    })
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

    //
    // Diners
    //
    app.get('/diners', function(req, res) {
        setHeaders(req, res);
        diners.getDiners(context, req, res);
    });

    app.post('/diners', function(req, res) {
        setHeaders(req, res);
        diners.createNewDiner(context, req, res);
    });

    app.get('/diners/:diner_id', function(req, res) {
        setHeaders(req, res);
        diners.getById(context, req, res);
    });

    app.put('/diners/:diner_id', function(req, res) {
        setHeaders(req, res);
        diners.updateDiner(context, req, res);
    })
    app.delete('/diners/:diner_id', function(req, res) {
        setHeaders(req, res);
        diners.deleteDiner(context, req, res);
    });

    app.options('*', function(req, res) {
        setHeaders(req, res);
        res.send(200);
    });

    mongodb.MongoClient.connect(config.get('database:url'), function(err, ref) {
        var port = config.get('PORT');
        if (err) {
            throw err;
        }
        context.db = ref;
        app.listen(port);
        console.log('Database connected, listening at port ' + port);
    });
}
