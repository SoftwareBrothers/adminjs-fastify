import AdminJSFastify from '@adminjs/fastify';
import MongooseAdapter from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import { createUserResource } from './resources/user/user.resource';
import { FastifyInstance } from 'fastify';

const setupAdmin = async (app: FastifyInstance): Promise<void> => {
  AdminJS.registerAdapter(MongooseAdapter);
  const admin = new AdminJS({
    rootPath: '/admin',
    resources: [createUserResource()],
  });

  await AdminJSFastify.buildRouter(
    admin,
    // {
    //   cookiePassword: 'secretsecretsecretsecretsecretsecretsecretsecret',
    //   authenticate: () => {
    //     return {
    //       id: 1,
    //       email: 'Admin',
    //     };
    //   },
    // },
    app
  );
};

export default setupAdmin;
