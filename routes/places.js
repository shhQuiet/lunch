var collName = 'places',
    coll = null;

function getCollection(ctx) {
    if (coll) {
        return coll;
    }
    coll = ctx.db.collection(collName);
    return coll;
}

exports.initialize = function(ctx) {
    getCollection(ctx).ensureIndex({
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
    getCollection(ctx).find().toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        result.forEach(ctx.convertToExternal);
        res.send({
            places: result
        });
    });
};

exports.deletePlace = function(ctx, req, res) {
    console.log('deletePlace:' + req.params.place_id);
    getCollection(ctx).remove({
        _id: new ctx.mongodb.ObjectID(req.params.place_id)
    }, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(204);
    });
};

exports.updatePlace = function(ctx, req, res) {
    var place = req.body.place;
    console.log('updatePlace:' + place.name);
    delete place.id;
    place._id = new ctx.mongodb.ObjectID(req.params.place_id);


    getCollection(ctx).save(place, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        getCollection(ctx).find({
            _id: place._id
        }).toArray(function(err, newPlaces) {
            newPlaces.forEach(ctx.convertToExternal);
            res.send(200, {
                place: newPlaces[0]
            });
        });
    });
};

exports.createNewPlace = function(ctx, req, res) {
    var newPlace = req.body.place;
    console.log('createNewPlace:' + newPlace.name);
    ctx.newId(newPlace);
    getCollection(ctx).insert(newPlace, function(err, obj) {
        if (err) {
            if (err.code === 11000) {
                res.send(409, {
                    message: "Name is a duplicate",
                    name: newPlace.name
                });
                return;
            }
            res.send(500, err);
            throw err;
        }
        obj.forEach(ctx.convertToExternal);
        res.send(200, {
            places: obj
        });
    });
};

exports.getById = function(ctx, req, res) {
    var place_id = null;
    try {
        place_id = new ctx.mongodb.ObjectID(req.params.place_id);
    } catch (e) {
        res.send(404);
        return;
    }
    getCollection(ctx).find({
        _id: place_id
    }).toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        if (result.length === 0) {
            res.send(404);
            return;
        }
        result.forEach(ctx.convertToExternal);
        res.send(200, {
            place: result[0]
        });
    });
};
