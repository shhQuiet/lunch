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
            context.db.collection('users').find({
                isAdmin: true
            }).toArray(function(err, result) {
                if (err) {
                    console.log("Can't read users:" + err);
                    throw err;
                }
                if (result.length === 0) {
                    console.log("Creating default admin user...  please change password ASAP");
                    context.db.collection('users').insert({
                        username: "admin",
                        basicAuth: "YWRtaW46YWRtaW4=", // admin:admin
                        isAdmin: true
                    }, function(err, obj) {
                        if (err) {
                            console.log("Can't create default user!");
                            throw err;
                        }
                    });
                }
            });
        }
    });
};

exports.getUsers = function(req, res) {
    console.log('getUsers()');
    context.api.getCollection('users', context, req, res);
};

exports.deleteUser = function(req, res) {
    context.api.deleteObj('user', req.params.user_id, context, req, res);
};

exports.updateUser = function(req, res) {
    context.api.update('user', req.params.user_id, context, req, res);
};

exports.createNewUser = function(req, res) {
    context.api.createNew('user', context, req, res);
};

exports.getById = function(req, res) {
    context.api.getById('user', req.params.user_id, context, req, res);
};

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

exports.svc.getUser = function(id, next) {
    // var id = new context.req.params.user_id
};
