// var MySQLEvents = require('mysql-events');
const mysql = require("mysql2");
const MySQLEvents = require("@rodrigogs/mysql-events");

const dbInfos = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  database: "expenses_tracker",
};

const program = async (callback) => {
  const instance = new MySQLEvents(dbInfos, {
    startAtEnd: true,
    excludedSchemas: {
      mysql: true,
    },
  });

  await instance.start();

  instance.addTrigger({
    name: "all",
    expression: "*",
    statement: MySQLEvents.STATEMENTS.ALL,
    onEvent: async (event) => {
      var data = event;

      if (
        event.table === "expenses" &&
        (event.type === "UPDATE" || event.type === "INSERT")
      ) {
        console.log("if ok");
        for (var index in event.affectedRows) {
          var row = event.affectedRows[index];
          var expense = await getExpenseById(row.after.id);
          data.affectedRows[index].after = expense;
        }
        console.log(data);
        callback(data);
      } else {
        callback(data);
      }
    },
  });

  instance.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
  instance.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
};

const connection = mysql.createPool(dbInfos);
const promisePool = connection.promise();

// connection.connect((error) => {
//   if (error) {
//     console.error("Error connecting to database: ", error);
//   } else {
//     console.log("Connected to database successfully!");
//   }
// });

function setEventCallback(callback) {
  program(callback)
    .then(() => console.log("Waiting for database events..."))
    .catch(console.error);
}

async function getExpenseById(id) {
  const [rows] = await promisePool.execute(
    `SELECT e.*, c.name as category_name
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.id = ${id}`
  );
  return rows[0];
}

module.exports = {
  sql: connection,
  setEventCallback: setEventCallback,
};
