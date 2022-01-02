const mysql = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
require("dotenv").config();

const User = function (user) {
  this.uuid = user.uuid;
  this.id = user.id;
  this.username = user.name;
};

User.findById = async function (id) {
  const connection = await mysql.DATABASE.getConnection();
  var res = [{}];
  try {
    res = await connection.execute(
      `SELECT * FROM customers where uuid = ? ORDER BY id`,
      [id]
    );
    connection.release();
  } catch (err) {
    console.error(err);
    connection.release();
    return false;
  }
  if (res[0].length > 0) {
    this.uuid = res[0][0].uuid;
    this.id = res[0][0].id;
    return this;
  }
  return false;
};
User.findByCredentials = async function (username, password) {
  const connection = await mysql.DATABASE.getConnection();
  
  try {
    const [users, fields] = await connection.query(
      `SELECT * FROM customers where username = ?;`,
      [username]
    );
    connection.release();
    if (users.length > 0) {
      const isMatch = await bcrypt.compare(password, users[0].password);
      if (!isMatch) {
        throw new Error("Unable to login. Wrong Password!");
      }
      this.uuid = users[0].uuid;
      return this;
    }
    return false;
  } catch (error) {
    connection.release();
    return false;
  }
};

User.findByToken = async function (token) {
  let decoded;
  try {
    if (!token) {
      return new Error("Missing token header");
    }
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return false;
  }
  return await User.findById(decoded.id);
};
User.generateToken = async function () {
  let user = this;
  user.token = jwt.sign({ id: user.uuid }, process.env.JWT_SECRET, {
    expiresIn: 86400, // 86400 // 24 hours
  });
  return;
};
User.generatePassword = async function (password) {
  let user = this;
  user.password = password;
  user.epassword = await bcrypt.hash(password, 8);
  return user
};

module.exports = User;
