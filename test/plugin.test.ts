import { AdminJS } from "adminjs";
import { FastifyInstance } from 'fastify';
import fastifyFormBody from '@fastify/formbody';
import { jest } from "@jest/globals";

import { buildRouter } from "../src/buildRouter";

jest.useFakeTimers();


describe("plugin", () => {
  describe(".buildRouter", () => {
    // it("returns an express router when AdminJS instance given as an argument", () => {
    //     const  fastifyApp = await new FastifyInstance()
    //   expect(buildRouter(new AdminJS(), await fastifyApp.register(fastifyFormBody); )).toBeInstanceOf(
    //     FastifyInstance
    //   );
    // });
  });
});
