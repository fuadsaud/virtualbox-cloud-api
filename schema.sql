CREATE TABLE vms (id INTEGER PRIMARY KEY, name TEXT, os_id INTEGER, provisioned INTEGER, status INTEGER DEFAULT 1);
CREATE TABLE oss (id INTEGER PRIMARY KEY, name TEXT, path TEXT, vboxid TEXT);
