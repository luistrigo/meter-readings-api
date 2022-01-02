const mysql = require("../config/database");

const meterReadingsModel = {
    meterReadingsList: async function (params) {
      const connection = await mysql.DATABASE.getConnection();
      var res = [{}];
      try {
        res = await connection.execute(
          `SELECT id,datetime,KW,reading FROM meter_readings where id_customer = ? AND datetime >  DATE_SUB(now(), INTERVAL 12 MONTH) AND datetime <= now() order by datetime`,
          [params.user.id]
        );
        connection.release();
      } catch (err) {
        console.error(err);
        connection.release();
        return false;
      }
      
      return res.length > 0 ? res : null;
    }
  };
  module.exports =  meterReadingsModel;