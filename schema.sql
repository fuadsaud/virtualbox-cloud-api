DROP TABLE IF EXISTS vms;
DROP TABLE IF EXISTS oss;

CREATE TABLE vms (id INTEGER PRIMARY KEY, name TEXT, os_id INTEGER, provisioned INTEGER, status INTEGER DEFAULT 1, port INTEGER);
CREATE TABLE oss (id INTEGER PRIMARY KEY, name TEXT, path TEXT, vboxid TEXT, hd_format);

INSERT INTO oss VALUES(NULL, 'Lubuntu 12.10 x86 - VDI', '/lubuntu-12_10-x86.vdi', 'Ubuntu', 'VDI');
