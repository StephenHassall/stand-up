/**
 * Simple server code to run web site in browser.
 * Point your browser to http://localhost:9241
 */
// Get express node module
import express from 'express';

// Create server
const server = express();

// Create and add the static public HTML middleware module
server.use(express.static('./web-live'));

// Start server on port 9241
server.listen(9241);

// Log ready
console.log('Ready');
