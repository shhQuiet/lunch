var context = null; // instance context

exports.initialize = function(ctx) {
    context = ctx;
    context.db.collection('users').ensureIndex({
        username: 1
    }, {
        unique: true
    }, function(err, result) {
        if (err) {
            console.log("Can't create index!");
            throw err;
        }
    });

    // if there is no admin user, create a default...
    exports.svc.getAdmin(function(admin) {
        if (admin.length === 0) {
            console.log("Creating default admin user...  please change password ASAP");
            context.db.collection('users').insert({
                username: "admin",
                basicAuth: context.config.get('defaultAdminAuth'), // admin:admin
                isAdmin: true
            }, function(err, obj) {
                if (err) {
                    console.log("Can't create default user!");
                    throw err;
                }
            });
        }
    });
};

function beforeUserSend(users) {
    users.forEach(function(user) {
        delete user.basicAuth; // hide the auth for security.
    });
}

exports.getUsers = function(req, res) {
    context.api.getCollection('users', context, req, res, beforeUserSend);
};

exports.deleteUser = function(req, res) {
    context.api.deleteObj('user', req.params.user_id, context, req, res);
};

exports.updateUser = function(req, res) {
    context.api.update('user', req.params.user_id, context, req, res, beforeUserSend);
};

exports.createNewUser = function(req, res) {
    context.api.createNew('user', context, req, res, beforeUserSend);
};

exports.getById = function(req, res) {
    context.api.getById('user', req.params.user_id, context, req, res, beforeUserSend);
};

exports.checkAuth = function(req, res, next) {
    var auth = req.get('Authorization');
    if (!auth) {
        res.send(401);
        return;
    }

    auth = auth.match(/Basic (.*)/)[1];
    console.log("Checking auth:" + auth);
    context.db.collection('users').find({
        basicAuth: auth
    }).toArray(function(err, result) {
        if (err) {
            res.send(500, err.message);
            throw err;
        }
        if (result.length === 0) {
            res.send(401);
        } else {
            next();
        }
    });
}

//
// services
exports.svc = {};

exports.svc.getAdmin = function(next) {
    context.db.collection('users').find({
        isAdmin: true
    }).toArray(function(err, result) {
        if (err) {
            throw err;
        }
        next(result);
    });
};
