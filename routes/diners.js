var collName = 'diners',
    coll = null;

function getCollection(ctx) {
    if (coll) {
        return coll;
    }
    coll = ctx.db.collection(collName);
    return coll;
};

exports.initialize = function(ctx) {

}

exports.getDiners = function(ctx, req, res) {
    getCollection(ctx).find().toArray(function(err, result) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        result.forEach(ctx.convertToExternal);
        res.send({
            diners: result
        });
    });
};

exports.deleteDiner = function(ctx, req, res) {
    console.log('Removing diner ' + req.params.diner_id);
    getCollection(ctx).remove({
        _id: new ctx.mongodb.ObjectID(req.params.diner_id)
    }, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(204);
    });
};

exports.updateDiner = function(ctx, req, res) {
    var diner = req.body.diner;
    delete diner.id;
    diner._id = new ctx.mongodb.ObjectID(req.params.diner_id);

    console.log('Updating diner ' + JSON.stringify(diner));

    getCollection(ctx).save(diner, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        getCollection(ctx).find({
            _id: diner._id
        }).toArray(function(err, newDiners) {
            newDiners.forEach(ctx.convertToExternal);
            res.send(200, {
                diner: newDiners[0]
            });
        });
    });
};

exports.createNewDiner = function(ctx, req, res) {
    var newDiner = req.body.diner;
    ctx.newId(newDiner);
    console.log('new diner:' + JSON.stringify(newDiner));
    getCollection(ctx).insert(newDiner, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        obj.forEach(ctx.convertToExternal);
        res.send(200, {
            diners: obj
        });
    });
};

exports.getById = function(ctx, req, res) {
    var diner_id = null;
    try {
        diner_id = new ctx.mongodb.ObjectID(req.params.diner_id);
    } catch (e) {
        res.send(404);
        return;
    }
    getCollection(ctx).find({
        _id: diner_id
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
            diner: result[0]
        });
    });
};
