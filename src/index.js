/* eslint-disable no-console */
import express from 'express';
import './config/database';
import middlewareConfig from './config/middlewares';

const app = express();

const PORT = process.env.PORT || 3000;

middlewareConfig(app);
app.listen(PORT, err => {
  if (err) {
    throw err;
  } else {
    console.log(`
        Death star deployed on port: ${PORT}
        ----------
        Running on ${process.env.NODE_ENV}
        ----------
        Waiting for the command sir!
         `);
  }
});
