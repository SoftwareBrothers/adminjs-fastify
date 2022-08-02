import Fastify from 'fastify';
import setupAdmin from './admin/admin';
import mongoose from 'mongoose';
import fastifyStatic from '@fastify/static';
import path from 'path';

const app = Fastify();
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
    await app.register(fastifyStatic, {
      root: path.join(__dirname, '../public'),
      prefix: '/public/',
    });

    const admin = await setupAdmin(app);
    app.listen({ port }, (err, addr) => {
      if (err) { console.log(err) }
      else console.log(`App started on ${addr}${admin.options.rootPath}`)
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

run();
