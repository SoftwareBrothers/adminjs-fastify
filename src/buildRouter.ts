import fastifyMultipart from '@fastify/multipart';
import AdminJS, { Router as AdminRouter } from 'adminjs';
import { FastifyInstance } from 'fastify';
import { RouteHandlerMethod } from 'fastify/types/route.js';
import { readFile } from 'fs/promises';
import fromPairs from 'lodash/fromPairs.js';
import * as mime from 'mime-types';
import path from 'path';

import os from 'os';
import fs from 'fs';


import { WrongArgumentError } from './errors.js';
import { log } from './logger.js';

const INVALID_ADMIN_JS_INSTANCE =
  'You have to pass an instance of AdminJS to the buildRouter() function';

async function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(null);
            }
        });
    });
}

const getFile = async (fileField) => {
    if (fileField.type === 'file') {
        fileField.name = fileField.filename;
        const buffer = await fileField.toBuffer();
        const tmpFilePath = path.join(os.tmpdir(), fileField.filename);
        await writeFile(tmpFilePath, buffer);
        return {
            name: fileField.filename,
            path: tmpFilePath
        };
    }
    return null;
};

Array.prototype.asyncMap = async function (callback) {
    const result = [];
    for (let index = 0; index < this.length; index++) {
        result.push(await callback(this[index], index, this));
    }
    return result;
};

export const buildRouter = async (
  admin: AdminJS,
  fastifyApp: FastifyInstance
): Promise<void> => {
  const { assets } = AdminRouter;
  if (admin?.constructor?.name !== 'AdminJS') {
    throw new WrongArgumentError(INVALID_ADMIN_JS_INSTANCE);
  }

  await fastifyApp.register(fastifyMultipart, { attachFieldsToBody: true });

  admin.initialize().then(() => {
    log.debug('AdminJS: bundle ready');
  });

  const { routes } = AdminRouter;

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
        await Object.keys((body ?? {}) as Record<string, unknown>).map(async key => [
          key,
          await getFile(body[key] as any) ?? body[key].value,
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
        return reply.send(html);
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
      async (_req, reply) => {
        const mimeType = mime.lookup(asset.src)
        const file = await readFile(path.resolve(asset.src))

        if (mimeType) {
          return reply.type(mimeType).send(file);
        }
        return reply.send(file);
      }
    );
  });
};
