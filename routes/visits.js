var collName = 'visits',
    coll = null;

function getCollection(ctx) {
    if (coll) {
        return coll;
    }
    coll = ctx.db.collection(collName);
    return coll;
}

exports.initialize = function(ctx) {

};

exports.getVisits = function(ctx, req, res) {
    console.log('getVisits()');
    getCollection(ctx).find().toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        result.forEach(ctx.convertToExternal);
        res.send(200, {
            visits: result
        });
    });
};

exports.deleteVisit = function(ctx, req, res) {
    console.visit('deleteVisit:' + req.params.visit_id);
    getCollection(ctx).remove({
        _id: new ctx.mongodb.ObjectID(req.params.visit_id)
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

exports.getByPlace = function(ctx, req, res) {
    console.log('getByPlace:' + req.params.place_id);
    getCollection(ctx).find({
        place_id: new ctx.mongodb.ObjectID(req.params.place_id)
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
            visits: result
        });
    });
};

exports.getById = function(ctx, req, res) {
    console.log('getById:' + req.params.visit_id);
    getCollection(ctx).find({
        _id: new ctx.mongodb.ObjectID(req.params.visit_id)
    }).toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        if (result.length === 0) {
            res.send(404);
            return;
        }
        res.send(200, result);
    });
};

exports.addNewVisit = function(ctx, req, res) {
    var newVisit = req.body.visit;
    console.log('addNewVisit:' + newVisit.place);
    if (!newVisit.place) {
        res.send(400, {
            message: "You must specify the place ID"
        });
        return;
    }
    newVisit.place = new ctx.mongodb.ObjectID(newVisit.place);
    delete newVisit.id;
    getCollection(ctx).insert(newVisit, function(err, obj) {
        var result;
        if (err) {
            res.send(500, err);
            throw err;
        }
        result = obj[0];
        ctx.convertToExternal(result);
        result.place = result.place.toString();
        res.send(200, {
            visit: result
        });
    });
};

exports.addNewPlaceVisit = function(ctx, req, res) {
    var newVisit = req.body;
    ctx.newId(newVisit);
    newVisit.place_id = new ctx.mongodb.ObjectID(req.params.place_id);
    getCollection(ctx).insert(newVisit, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(200, obj);
    });
};
