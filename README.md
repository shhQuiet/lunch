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

