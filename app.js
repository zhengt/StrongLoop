/**
 * App Dependencies.
 */

require('strong-agent').profile();

var control = require('strong-cluster-control');
var options = control.loadOptions();

// If configured as a cluster master, just start controller
if (options.clustered && options.isMaster) {
  return control.start(options);
}

var loopback = require('loopback')
  , app = module.exports = loopback()
  , fs = require('fs')
  , path = require('path')
  , cors = require('cors')
  , request = require('request')
  , TaskEmitter = require('strong-task-emitter');

// Set up the HTTP listener ip & port
var ip = process.env.IP || '0.0.0.0'
var port = process.env.PORT || 3000;
var baseURL = 'https://' + process.env.C9_PROJECT + '-c9-' + process.env.C9_USER + '.c9.io';
app.set('ip', ip);
app.set('port', port);

// Establish our overly-permissive CORS rules.
app.use(cors());

// Expose a rest api
app.use(loopback.rest());

// Add static files
app.use(loopback.static(path.join(__dirname, 'public')));

// Require models
fs
  .readdirSync(path.join(__dirname, './models'))
  .filter(function(m) {
    return path.extname(m) === '.js';
  })
  .forEach(function(m) {
    // expose model over rest
    app.model(require('./models/' + m));
  });

// Enable docs
app.docs({basePath: baseURL});

// Start the server
app.listen(port, ip, function() {
  console.error('StrongLoop Suite sample is now ready at ' + baseURL);
});
