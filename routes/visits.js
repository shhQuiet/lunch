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
    ctx.getCollection('visits', ctx, req, res);
};

exports.deleteVisit = function(ctx, req, res) {
    ctx.deleteObj('visit', req.params.visit_id, ctx, req, res);
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
    ctx.getById('visit', req.params.visit_id, ctx, req, res);
};

exports.addNewVisit = function(ctx, req, res) {
    if (!req.body.visit.place) {
        res.send(400, {
            message: "You must specify the place ID"
        });
        return;
    }
    ctx.createNew('visit', ctx, req, res, function(result) {
        result.place = result.place.toString();
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
