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
    users: users,
    mongodb: mongodb,
    api: require('./api.js')
};

// express app middleware
var authFilters = {
    admin: function(req, res, next) {
        var auth = req.get('Authorization');
        if (!auth) {
            res.send(401);
            return;
        }
        users.svc.getAdmin(function(admin) {
            if (admin.length === 0) {
                console.log("No admin user defined!  Restart server to create!");
                res.send(401);
                return;
            }
            if (auth !== admin[0].basicAuth) {
                res.send(401);
                return;
            }
            next();
        });
    },
    adminOrSelf: function(req, res, next) {

    }
};

function inspectRequest(req) {
    var result = [];
    result.push('-------------------------------------------');
    result.push('Method:' + req.method);
    result.push('Origin:' + req.get('Origin'));
    result.push('Access-Control-Request-Method:' + req.get('Access-Control-Request-Method'));
    result.push('Access-Control-Request-Headers:' + req.get('Access-Control-Request-Headers'));
    result.push('Authorization:' + req.get('Authorization'));
    result.push('Body:' + JSON.stringify(req.body));
    console.log(result.join('\n'));
}

function corsFilter(req, res, next) {
    var o = req.get('Origin'),
        m = req.get('Access-Control-Request-Method'),
        h = req.get('Access-Control-Request-Headers');

    // uncomment for debugging...
    inspectRequest(req);

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
    context.config = config;
    app.configure(function() {
        app.use(express.json());
    });

    ///////////////////////////////////////////////////////////////////
    // Places
    //
    app.get('/places', corsFilter, places.getPlaces);
    app.post('/places', corsFilter, places.createNewPlace);
    app.get('/places/:place_id', corsFilter, places.getById);
    app.put('/places/:place_id', corsFilter, places.updatePlace);
    app.delete('/places/:place_id', corsFilter, places.deletePlace);
    app.get('/places/:place_id/visits', corsFilter, visits.getByPlace);
    app.post('/places/:place_id/visits', corsFilter, visits.addNewPlaceVisit);

    ///////////////////////////////////////////////////////////////////
    // Visits
    //
    app.get('/visits', corsFilter, visits.getVisits);
    app.post('/visits', corsFilter, visits.addNewVisit);
    app.get('/visits/:visit_id', corsFilter, visits.getById);
    app.delete('/visits/:visit_id', corsFilter, visits.deleteVisit);

    ///////////////////////////////////////////////////////////////////
    // Users
    //
    app.get('/users', corsFilter, users.getUsers);
    app.post('/users', corsFilter, authFilters.admin, users.createNewUser);
    app.get('/users/:user_id', corsFilter, users.getById);
    app.put('/users/:user_id', corsFilter, authFilters.adminOrSelf, users.updateUser);
    app.delete('/users/:user_id', corsFilter, authFilters.admin, users.deleteUser);
    app.get('/users/:user_id/visits', corsFilter);
    app.post('/users/:user_id/visits', corsFilter, authFilters.adminOrSelf);
    app.post('/users/check_auth', corsFilter, users.checkAuth);

    ///////////////////////////////////////////////////////////////////
    // Other
    //

    app.options('*', corsFilter, function(req, res) {
        res.send(200);
    });

    function appStartup(err, ref) {
        var port = config.get('PORT');
        if (err) {
            throw err;
        }
        context.db = ref;
        initialize();
        app.listen(port);
        console.log('Database connected, listening at port ' + port);
    }

    mongodb.MongoClient.connect(config.get('database:url'), appStartup);
};
