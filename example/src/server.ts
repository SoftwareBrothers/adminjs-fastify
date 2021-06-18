import fastify from 'fastify';
import setupAdmin from './admin/admin';
import mongoose from 'mongoose';
import fastifyStatic from 'fastify-static';
import path from 'path';

const app = fastify();
const port = 3000;

const run = async (): Promise<void> => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL ?? 'mongodb://localhost/fastify',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    app.register(fastifyStatic, {
      root: path.join(__dirname, '../public'),
      prefix: '/public/',
    });

    await setupAdmin(app);
    await app.listen(port);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

run();
