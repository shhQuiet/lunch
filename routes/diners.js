exports.initialize = function(ctx) {

};

exports.getDiners = function(ctx, req, res) {
    console.log('getDiners()');
    ctx.api.getCollection('diners', ctx, req, res);
};

exports.deleteDiner = function(ctx, req, res) {
    ctx.api.deleteObj('diner', req.params.diner_id, ctx, req, res);
};

exports.updateDiner = function(ctx, req, res) {
    ctx.api.update('diner', req.params.diner_id, ctx, req, res);
};

exports.createNewDiner = function(ctx, req, res) {
    ctx.api.createNew('diner', ctx, req, res);
};

exports.getById = function(ctx, req, res) {
    ctx.api.getById('diner', req.params.diner_id, ctx, req, res);
};
