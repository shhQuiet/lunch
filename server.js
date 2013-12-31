var fs = require('fs'),
    nconf = require('nconf'),
    lunch = require('./lunch.js');

//
// Setup nconf to use (in-order):
//   1. Command-line arguments
//   2. Environment variables
//   3. A file located at 'path/to/config.json'
//
nconf.argv()
    .env()
    .file({
        file: 'config.json'
    });

console.log("======== Starting server ========");
console.log("Using port    [" + nconf.get("PORT") + "]");
console.log("Database URL  [" + nconf.get('database:url') + "]");

lunch.start(nconf);
