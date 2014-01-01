var express = require('express'),
    app = express(),
    context,
    mongodb = require('mongodb'),
    places = require('./routes/places.js'),
    visits = require('./routes/visits.js'),
    users = require('./routes/users.js');

context = {
    places: places,
    visits: visits,
    mongodb: mongodb,
    api: require('./api.js')
};

var authFilters = {
    admin: function(req, res, next) {
        var auth = req.get('Authorization');
        var admin = users.svc.getAdmin(function() {
            if (auth !== admin.basicAuth) {
                req.send(401);
                return;
            }
            next();
        });
    },
    adminOrSelf: function(req, res, next) {

    },
    defaultFilter: function(req, res, next) {
        next();
    }
};

function headerFilter(req, res, next) {
    var o = req.get('Origin'),
        m = req.get('Access-Control-Request-Method'),
        h = req.get('Access-Control-Request-Headers');

    // ask and ye shall receive... (for CORS purposes)
    res.set('Access-Control-Allow-Origin', o);
    res.set('Access-Control-Allow-Methods', m);
    res.set('Access-Control-Allow-Headers', h);
    next();
}

// do application initialization,
// call each module in "routes/" to initialize as well.

function initialize() {
    [places, visits, users].forEach(function(module) {
        module.initialize(context);
    });
}

exports.start = function(config) {

    app.configure(function() {
        // app.use(express.static('public'));
        // app.use(express.cookieParser());
        app.use(express.bodyParser());
        // app.use(express.session({
        //     secret: 'soooo hungry...'
        // }));
        // app.use(passport.initialize());
        // app.use(passport.session());
        // app.use(app.router);
    });
    ///////////////////////////////////////////////////////////////////
    // Places
    //
    app.get('/places', headerFilter, authFilters.defaultFilter, places.getPlaces);
    app.post('/places', headerFilter, places.createNewPlace);
    app.get('/places/:place_id', headerFilter, places.getById);
    app.put('/places/:place_id', headerFilter, places.updatePlace);
    app.delete('/places/:place_id', headerFilter, places.deletePlace);
    app.get('/places/:place_id/visits', headerFilter, visits.getByPlace);
    app.post('/places/:place_id/visits', headerFilter, visits.addNewPlaceVisit);

    ///////////////////////////////////////////////////////////////////
    // Visits
    //
    app.get('/visits', headerFilter, visits.getVisits);
    app.post('/visits', headerFilter, visits.addNewVisit);
    app.get('/visits/:visit_id', headerFilter, visits.getById);
    app.delete('/visits/:visit_id', headerFilter, visits.deleteVisit);

    ///////////////////////////////////////////////////////////////////
    // Users
    //
    app.get('/users', headerFilter, authFilters.defaultFilter, users.getUsers);
    app.post('/users', headerFilter, authFilters.admin, users.createNewUser);
    app.get('/users/:user_id', headerFilter, authFilters.defaultFilter, users.getById);
    app.put('/users/:user_id', headerFilter, authFilters.admin, users.updateUser);
    app.delete('/users/:user_id', headerFilter, authFilters.admin, users.deleteUser);
    app.get('/users/:user_id/visits', headerFilter, authFilters.defaultFilter);
    app.post('/users/:user_id/visits', headerFilter, authFilters.defaultFilter);

    ///////////////////////////////////////////////////////////////////
    // Other
    //

    app.options('*', headerFilter, function(req, res) {
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
