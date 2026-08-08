/**
 * Simple server code to run web site in browser.
 * Point your browser to http://localhost:9240
 */
// Get express node module
import express from 'express';

// Create server
const server = express();

// Create and add the static public HTML middleware module
server.use(express.static('./web-dev'));

// Start server on port 9240
server.listen(9240);

// Log ready
console.log('Ready');
