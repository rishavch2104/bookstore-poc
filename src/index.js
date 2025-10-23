import { createApp } from './app.js';
import { config } from './config/index.js';

createApp()
  .then((app) => {
    app.listen(config.port, () => {
      console.log('Server ready');
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
