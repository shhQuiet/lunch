lunch
=====

**lunch** is a node.js server that uses **mongodb** <https://github.com/mongodb/node-mongodb-native> as a data store and **express** <https://github.com/visionmedia/express> as an HTTP router.

**lunch** responds to HTTP REST requests for:

- _places_ - Locations of places to eat lunch.
- _visits_ - A log of visits to locations
- _diners_ - People that may or may not have lunch.

The server is completely agnostic toward the contents of the objects.  It only maintains the relationships between the objects in the collections:

_places_ can have zero or more _visits_

_visits_ can have zero or more _diners_ that were present during the visit

_visits_ can have only one _place_

configuration
=============

**lunch** uses **nconf** for application configuration.  The file `config.json` contains the default configuration information:

- default port is `3000`
- The default database is assumed to be on localhost at the default mongodb port of `27017`.  DB named `lunch`

You may change these values in the environment or on the command line or by changing config.json.

For example, to connect to a different database:

`$ node server.js --database:url=mongodb://myHost.com:12345/someDb`
