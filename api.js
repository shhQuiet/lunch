exports.convertToExternal = function(item) {
    item.id = item._id.toString();
    delete item._id;
};

exports.getCollection = function(name, ctx, req, res, beforeSend) {
    console.log('getCollection()');
    ctx.db.collection(name).find().limit(100).toArray(function(err, result) {
        var response = {};
        if (err) {
            res.send(500, err);
            throw err;
        }
        result.forEach(ctx.api.convertToExternal);
        if (beforeSend) {
            beforeSend(result);
        }
        response[name] = result;
        res.send(response);
    });
};

exports.getById = function(name, id, ctx, req, res) {
    var newId = null;
    try {
        newId = new ctx.mongodb.ObjectID(id);
    } catch (e) {
        res.send(404);
        return;
    }
    ctx.db.collection(name + 's').find({
        _id: newId
    }).toArray(function(err, result) {
        var response = {};
        if (err) {
            res.send(500, err);
            throw err;
        }
        if (result.length === 0) {
            res.send(404);
            return;
        }
        result.forEach(ctx.api.convertToExternal);
        response[name] = result[0];
        res.send(200, response);
    });
};

exports.update = function(name, id, ctx, req, res) {
    var obj = req.body[name],
        objCollection;
    delete obj.id;
    obj._id = new ctx.mongodb.ObjectID(id);

    objCollection = ctx.db.collection(name + 's');

    objCollection.save(obj, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        objCollection.find({
            _id: obj._id
        }).toArray(function(err, newColl) {
            var result = {};
            newColl.forEach(ctx.api.convertToExternal);
            result[name] = newColl[0];
            res.send(200, result);
        });
    });
};

exports.createNew = function(name, ctx, req, res, beforeSend) {
    var newObj = req.body[name];
    var objCollection = ctx.db.collection(name + 's');

    ctx.api.newId(newObj);
    objCollection.insert(newObj, function(err, obj) {
        var response = {};
        if (err) {
            if (err.code === 11000) {
                res.send(409, {
                    message: "Duplicate " + name
                });
                return;
            }
            res.send(500, err);
            throw err;
        }
        obj.forEach(ctx.api.convertToExternal);
        if (beforeSend) {
            beforeSend(obj);
        }
        response[name + 's'] = obj;
        res.send(200, response);
    });
};

exports.deleteObj = function(name, id, ctx, req, res) {
    ctx.db.collection(name + 's').remove({
        _id: new ctx.mongodb.ObjectID(id)
    }, function(err, obj) {
        if (err) {
            res.send(500, err);
            throw err;
        }
        res.send(204);
    });
};
