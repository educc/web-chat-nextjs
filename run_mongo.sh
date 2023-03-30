#!/bin/bash

echo 'after the execution, executes "mongosh" and "rs.initiate()"'

sleep 5

mongod --port 27017 --replSet rs0 --bind_ip 0.0.0.0 --dbpath /Users/ecacho/data/mongo --oplogSize 128

