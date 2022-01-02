const meterReadingsModel = require( '../models/meterReadings.model.js');

const MeterReadings = {} 
MeterReadings.
getMeterReadingsList = async function (request, reply) {
    var limit   = 20;
    var offset  = 0;
    var page    = 1;
    
    if (typeof request.query.limit !== "undefined") {
      if (parseInt(request.query.limit) > 0) {
        limit = parseInt(request.query.limit);
      }
    }

    if (typeof request.query.page !== "undefined") {
      if (parseInt(request.query.page) > 0) {
        page = parseInt(request.query.page);
        offset = (page-1)*limit
      }
    }

    var queryParams = { offset: offset, limit: limit }
    queryParams.user = request.user;
    const meterReadingsData = await meterReadingsModel.meterReadingsList(queryParams);
    
    var response = {page: page, per_page: limit, readings:meterReadingsData[0]}
    reply.send(response);
}

module.exports = MeterReadings;

