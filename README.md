#tTransfer
Media transfer service based on telegram auth.

##Src:
* config - config/config-loader classes for provide configuration dependencies.
* domain - directory with domain classes
* files - directory with file-loader classes
* listener - directory for describe reactive-style classes based on listeners
* logger - directory with classes for provide logging system in application
* message - directory for describe reactive-style classes for messages between any services
* server - directory for describe server/server core -like classes

index.ts - entry point application

##npm installation:
```
 $ npm i          #install all dependencies
 $ npm run build  #build application and run it
 $ npm run watch  #enable watcher for develop
```
All building files locate in /build directory.
