import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

export default app => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }
  if (isDev) {
    app.use(morgan('dev'));
  }
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
;
