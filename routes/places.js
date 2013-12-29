var collName = 'places',
    coll = null;

function getCollection(ctx) {
    if (coll) {
        return coll;
    }
    coll = ctx.db.collection(collName);
    return coll;
};

exports.getPlaces = function(ctx, req, res) {
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
    console.log('Removing place ' + req.params.place_id);
    getCollection(ctx).remove({
        _id: new ctx.mongodb.ObjectID(req.params.place_id)
    }, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(200, {
            recordsDeleted: obj
        });
    });
};

exports.updatePlace = function(ctx, req, res) {
    console.log('Updating place ' + req.params.place_id);
    getCollection(ctx).remove({
        _id: new ctx.mongodb.ObjectID(req.params.place_id)
    }, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(200, {
            places: [obj]
        });
    });
};
exports.createNewPlace = function(ctx, req, res) {
    var newPlace = req.body;
    ctx.newId(newPlace);
    console.log('new place:' + newPlace._id);
    getCollection(ctx).insert(newPlace, function(err, obj) {
        if (err) {
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
    getCollection(ctx).find({
        _id: new ctx.mongodb.ObjectID(req.params.place_id)
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
