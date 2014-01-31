var collName = 'visits',
    coll = null,
    context = null;

function getCollection() {
    if (coll) {
        return coll;
    }
    coll = context.db.collection(collName);
    return coll;
}

exports.initialize = function(ctx) {
    context = ctx;
};

exports.getVisits = function(context, req, res) {
    console.log('getVisits()');
    context.getCollection('visits', context, req, res);
};

exports.updateVisit = function(context, req, res) {
    context.api.update('visit', req.params.visit_id, context, req, res);
};

exports.deleteVisit = function(context, req, res) {
    context.deleteObj('visit', req.params.visit_id, context, req, res);
};

exports.getByPlace = function(context, req, res) {
    console.log('getByPlace:' + req.params.place_id);
    getCollection(context).find({
        place_id: new context.mongodb.ObjectID(req.params.place_id)
    }).toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        if (result.length === 0) {
            res.send(404);
            return;
        }
        result.forEach(context.convertToExternal);
        res.send(200, {
            visits: result
        });
    });
};

exports.getById = function(context, req, res) {
    context.getById('visit', req.params.visit_id, context, req, res);
};

exports.addNewVisit = function(context, req, res) {
    if (!req.body.visit.place) {
        res.send(400, {
            message: "You must specify the place ID"
        });
        return;
    }
    context.createNew('visit', context, req, res, function(result) {
        result.place = result.place.toString();
    });
};

exports.addNewPlaceVisit = function(context, req, res) {
    var newVisit = req.body;
    context.newId(newVisit);
    newVisit.place_id = new context.mongodb.ObjectID(req.params.place_id);
    getCollection(context).insert(newVisit, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(200, obj);
    });
};
