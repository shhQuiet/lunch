lunch
=====

**lunch** is a node.js server that uses **mongodb** as a data store and **express** as an HTTP router.

**lunch** responds to HTTP REST requests for:

- _places_ - Locations of places to eat lunch.
- _logs_ - A log of visits to locations
- _diners_ - People that may or may not have lunch.

The server is completely agnostic toward the contents of the objects.  It only maintains the relationships between the objects:

_places_ can have zero or more _logs_ representing visits

_logs_ can have zero or more _diners_ that were present during the visit

configuration
=============

**lunch** uses **nconf** for application configuration.  The file `config.json` contains the default configuration information:

- default port is `3000`
- The default database is assumed to be on localhost at the default mongodb port of `27017`.  DB named `lunch`

You may change these values in the environment or on the command line or by changing config.json.
