exports.initialize = function(ctx) {
    ctx.db.collection('places').ensureIndex({
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

exports.getPlaces = function(ctx, req, res) {
    console.log('getPlaces()');
    ctx.api.getCollection('places', ctx, req, res);
};

exports.deletePlace = function(ctx, req, res) {
    ctx.api.deleteObj('place', req.params.place_id, ctx, req, res);
};

exports.updatePlace = function(ctx, req, res) {
    ctx.api.update('place', req.params.place_id, ctx, req, res);
};

exports.createNewPlace = function(ctx, req, res) {
    ctx.api.createNew('place', ctx, req, res);
};

exports.getById = function(ctx, req, res) {
    ctx.api.getById('place', req.params.place_id, ctx, req, res);
};
