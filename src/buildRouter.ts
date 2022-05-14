import AdminJS, { Router as AdminRouter } from 'adminjs';
import path from 'path';
import { WrongArgumentError } from './errors';
import { log } from './logger';
import { FastifyInstance } from 'fastify';
import { RouteHandlerMethod } from 'fastify/types/route';
import { fromPairs } from 'lodash';
import * as fs from 'fs';
import * as mime from 'mime-types';

import fastifyMultipart from '@fastify/multipart';

const INVALID_ADMIN_BRO_INSTANCE =
  'You have to pass an instance of AdminJS to the buildRouter() function';

const getFile = (fileField?: {
  fieldname: string;
  filename: string;
  file: Record<string, unknown>;
}) => {
  if (!fileField?.file) {
    return null;
  }
  const { file, filename } = fileField;
  file.name = filename;
  return file;
};

export const buildRouter = (
  admin: AdminJS,
  fastifyApp: FastifyInstance
): void => {
  if (admin?.constructor?.name !== 'AdminJS') {
    throw new WrongArgumentError(INVALID_ADMIN_BRO_INSTANCE);
  }
  fastifyApp.register(fastifyMultipart, { attachFieldsToBody: true });

  admin.initialize().then(() => {
    log.debug('AdminJS: bundle ready');
  });

  const { routes, assets } = AdminRouter;

  routes.forEach(route => {
    // we have to change routes defined in AdminJS from {recordId} to :recordId
    const path = route.path.replace(/{/g, ':').replace(/}/g, '');

    const handler: RouteHandlerMethod = async (request, reply) => {
      const controller = new route.Controller(
        { admin },
        request.session?.adminUser
      );
      const { params, query } = request;
      const method = request.method.toLowerCase();

      const body = request.body as Record<
        string,
        { value: string; file?: File }
      >;
      const fields = fromPairs(
        Object.keys((body ?? {}) as Record<string, unknown>).map(key => [
          key,
          getFile(body[key] as any) ?? body[key].value,
        ])
      );
      const html = await controller[route.action](
        {
          ...request,
          params,
          query,
          payload: fields ?? {},
          method,
        },
        reply
      );

      if (route.contentType) {
        reply.type(route.contentType);
      } else if (typeof html === 'string') {
        reply.type('text/html');
      }
      if (html) {
        reply.send(html);
      }
    };

    if (route.method === 'GET') {
      fastifyApp.get(`${admin.options.rootPath}${path}`, handler);
    }

    if (route.method === 'POST') {
      fastifyApp.post(`${admin.options.rootPath}${path}`, handler);
    }
  });

  assets.forEach(asset => {
    fastifyApp.get(
      `${admin.options.rootPath}${asset.path}`,
      async (req, reply) => {
        reply.header('content-type', mime.lookup(asset.src));
        reply.send(fs.createReadStream(path.resolve(asset.src)));
      }
    );
  });
};
