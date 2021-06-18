import fastify from 'fastify';
import setupAdmin from './admin/admin';
import mongoose from 'mongoose';

const app = fastify();
const port = 3000;

const run = async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://localhost/fastify', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await setupAdmin(app);
    await app.listen(port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

run();
