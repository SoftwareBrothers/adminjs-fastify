import AdminJSFastify from '@softwarebrothers/admin-js-fastify';
import MongooseAdapter from '@admin-bro/mongoose';
import AdminJS from 'admin-bro';
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
