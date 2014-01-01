var context = null; // instance context

exports.initialize = function(ctx) {
    context = ctx;
    context.db.collection('places').ensureIndex({
        name: 1
    }, {
        unique: true
    }, function(err, result) {
        if (err) {
            console.log("Can't create index!");
            throw err;
        }
    });
};

exports.getPlaces = function(req, res) {
    console.log('getPlaces()');
    context.api.getCollection('places', context, req, res);
};

exports.deletePlace = function(req, res) {
    context.api.deleteObj('place', req.params.place_id, context, req, res);
};

exports.updatePlace = function(req, res) {
    context.api.update('place', req.params.place_id, context, req, res);
};

exports.createNewPlace = function(req, res) {
    context.api.createNew('place', context, req, res);
};

exports.getById = function(req, res) {
    context.api.getById('place', req.params.place_id, context, req, res);
};
