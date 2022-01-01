const mysql = require("../config/database");

const meterReadingsModel = {
    meterReadingsList: async function (params) {
      const connection = await mysql.DATABASE.getConnection();
      var res = [{}];
      try {
        res = await connection.execute(
          `SELECT id,datetime,KW,reading FROM meter_readings where id_customer = ? ORDER BY id DESC LIMIT ?, ?`,
          [50,params.offset, params.limit]
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