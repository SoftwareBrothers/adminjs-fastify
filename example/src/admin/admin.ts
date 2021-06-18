import AdminBroExpress from 'admin-bro-expressjs';
import MongooseAdapter from '@admin-bro/mongoose';
import AdminBro from 'admin-bro';
import { Express } from 'express';
import { createUserResource } from './resources/user/user.resource';

const setupAdmin = async (app: Express): Promise<void> => {
  AdminBro.registerAdapter(MongooseAdapter);
  const adminBro = new AdminBro({
    resources: [createUserResource()],
  });

  const router = await AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};

export default setupAdmin;
