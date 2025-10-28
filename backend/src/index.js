import { createApp } from './app.js';

// This is a common and reliable pattern for Vercel Serverless Functions
// that have asynchronous setup logic (like initializing Apollo or DB).

// 1. Run the async setup function ONCE when the module loads.
const appPromise = createApp();

// 2. Define the Vercel handler function.
// This handler will be executed on every incoming request.
const handler = async (req, res) => {
  try {
    // Wait for the Express app to be fully initialized
    const app = await appPromise;

    // Delegate the request handling to the Express app instance.
    // The Express app instance is a valid HTTP handler function.
    return app(req, res);
  } catch (error) {
    console.error('Server Initialization Crash:', error);
    // If createApp() failed, return a 500 error to the client
    res.statusCode = 500;
    res.end('Internal Server Error: Application failed to initialize.');
  }
};

// 3. CRITICAL CHANGE: Export the handler function as the default export.
// Vercel expects the handler to be the default export in an ES Module file.
export default handler;
