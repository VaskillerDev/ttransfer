#tTransfer
Media transfer service based on telegram auth.

##Src:
* config - config/config-loader classes for provide configuration dependencies.
* domain - directory with domain classes
* listener - directory for describe reactive-style classes based on listeners
* telegramBot - directory with telegram bot logic

index.ts - entry point application

##npm installation:
```
 $ npm i          #install all dependencies
 $ npm run build  #build application and run it
 $ npm run watch  #enable watcher for develop
```
All building files locate in /build directory.

##env variables
```
PATH    = $PATH (default)
KEY     = /path/to/tls/key
CERT    = /path/to/tls/cert

PG_USER = username
PG_PWD  = pwd
PG_DB   = database
PG_HOST = localhost
PG_PORT = port
```
