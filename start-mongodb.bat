@echo off
echo Starting MongoDB...
mongod --dbpath "%~dp0database\mongo-data" --bind_ip 127.0.0.1 --port 27017
pause
