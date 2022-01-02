const FastifyAuth = require("fastify-auth");
const meterReadings = require("../controllers/meterReadings");
const User = require("../models/user.model");


//Reading Schema
const Reading = {
  type: 'object',
  properties: {
    id: {type: 'string' },
    KW: {type: 'string' },
    reading: {type: 'string'},
    datetime: {type: 'string' }
  }
}

// Options for get all readings
const getReadingsOpts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties:{
          page:{type:'string'},
          per_page:{type: 'string'},
          readings:{
            type: 'array',
            items: Reading,
          }
        }
      },
    },
  },
  handler: meterReadings.getMeterReadingsList,
}

function readingsRoutes(fastify, options, done) {
  fastify
  .decorate("asyncVerifyJWT", async (request, reply) => {
    try {
      if (!request.headers.authorization) {
        throw new Error("No token was sent");
      }
      const token = request.headers.authorization.replace("Bearer ", "");
      const user = await User.findByToken(token);
      if (!user) {
        // handles logged out user with valid token
        throw new Error("Authentication failed!");
      }
      request.user = user;
      request.token = token; // used in logout route
    } catch (error) {
      reply.code(401).send(error);
    }
  })
  .decorate("asyncVerifyUsernameAndPassword", async (request, reply) => {
    
    try {
      if (!request.body) {
        throw new Error("username and Password is required!");
      }

      const user = await User.findByCredentials(
        request.body.username,
        request.body.password
      );
      if (!user) {
        // handles logged out user with valid token
        throw new Error("Authentication failed!");
      }
      request.user = user;
    } catch (error) {
      reply.code(400).send(error);
    }
  })
  .register(FastifyAuth)
  .after(() => {

     // Get all readings
    fastify.get('/', function (request, reply) {
      reply.send({ message: "Meter readings, Visit http://localhost:5000/docs for Swagger docs", code: 200 });
    });
   
    fastify.get('/readings',{preHandler: fastify.auth([ fastify.asyncVerifyJWT ]), ...getReadingsOpts})
    fastify.post('/makePassword',{
      handler: async (request, reply) => {
        
        const user = await User.generatePassword(request.body.password);
        console.log(user)
        reply.send({ status: 'Password', password:user.password ,epassword:user.epassword});
      }
    })

    //Login
    fastify.route({
      method: [ 'POST', 'HEAD' ],
      url: '/login',
      logLevel: 'warn',
      preHandler: fastify.auth([ fastify.asyncVerifyUsernameAndPassword ]),
      handler: async (req, reply) => {
          await req.user.generateToken();

          reply.send({ status: 'You are logged in', token:req.user.token });
      }
    });
  });


  done()
}

module.exports = readingsRoutes
