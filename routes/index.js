const meterReadings = require("../controllers/meterReadings");

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

  fastify.get('/', function (request, reply) {
    reply.send({ message: "Meter readings, Visit http://localhost:5000/docs for Swagger docs", code: 200 });
  });
  // Get all readings
  fastify.get('/readings', getReadingsOpts)

  done()
}

module.exports = readingsRoutes
