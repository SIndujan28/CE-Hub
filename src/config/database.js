import mongoose from 'mongoose';

require('dotenv').config();

mongoose.Promise = global.Promise;

try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  mongoose.createConnection(process.env.MONGO_URL);
}

mongoose.connection
  .once('open', () => { console.log('Mongo database running ....'); })
  .on('error', e => {
    throw e;
  });
