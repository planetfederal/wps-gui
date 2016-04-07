## wps-gui


## Installation

run

    npm install
    bower install
    gulp

WAR file

    ant clean war

## Debug

To run wps-gui in a debug server, run `gulp develop`.

The geoserver endpoint can be changed by editing the line `var options = url.parse('http://horizon.boundlessgeo.com/geoserver');` in `dev-server.js`.

To use the non-minified source file, edit `index.html`, replacing `<script src="dist/wps-gui.min.js"></script>` with `<script src="dist/wps-gui.js"></script>`

## License

Copyright 2014 Boundless Spatial, Inc.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
