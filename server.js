//Install express server
const proxy = require('express-http-proxy');
const express = require('express');
const app = express();

const path = require('path');

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

// app.use('/api', proxy('https://code-name-node-server.herokuapp.com'));
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
