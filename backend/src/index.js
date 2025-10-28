// backend/src/index.js (The Vercel-ready file)

import { createApp } from './app.js';

// We get the app instance asynchronously
let app;
try {
  app = await createApp();
} catch (err) {
  console.error('Failed to create app:', err);
  // You can handle initial setup failures here
}

// *** CRITICAL CHANGE: Export the app instance instead of calling app.listen() ***
export default app;

// Remove the app.listen() and config.port logic entirely.
// Vercel handles all networking and port listening.
