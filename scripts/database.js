const mysql = require("mysql2");

module.exports = DBComponent = (conf) => {
    console.log(conf)
    const connection = mysql.createConnection(conf);

    const executeQuery = (sql) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject();
                }
                console.log("done");
                resolve(result);
            });
        });
    };

    const createTable = async () => {
        await executeQuery(
            `
    CREATE TABLE IF NOT EXISTS type (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name varchar(20)
        );`
        )
        return await executeQuery(`
        CREATE TABLE IF NOT EXISTS booking (
            id int PRIMARY KEY AUTO_INCREMENT,
            idType int NOT NULL,
            date DATE NOT NULL,
            hour INT NOT NULL,
            name VARCHAR(50),
            FOREIGN KEY (idType) REFERENCES type(id)  
            );`
        );
    };
    (async () => { await createTable() })();

    return {
        insert: async (visit) => {
            const elements = visit.date.split("/");
            const date = new Date(elements[2], elements[1] - 1, elements[0]).toISOString().split("T")[0];
            console.log(date);
            if(!date) return;
            const response = await executeQuery(`SELECT name,id FROM type where name='${visit.idType}'`);
            if(!response) return;
            const template = `INSERT INTO booking (idType, date, hour, name) VALUES (${response[0].id}, '$DATE', ${visit.hour}, '$NAME')`;
            let sql = template.replace("$DATE", date);
            sql = sql.replace("$NAME", visit.name);
            return await executeQuery(sql);
        },

        select: async () => {
            const sql = `SELECT * FROM booking`;
            return await executeQuery(sql);
        },
        selectTypes: async () => {
            const sql = `SELECT * FROM type`;
            return await executeQuery(sql);
        }

    };
};