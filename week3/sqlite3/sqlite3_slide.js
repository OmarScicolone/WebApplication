'use strict';

const sqlite = require('sqlite3');
const db = new sqlite.Database('exams.sqlite', (err) => { if (err) throw err; });
let result = [];
let sql = "SELECT * FROM course LEFT JOIN score ON course.code=score.coursecode";

db.all(sql, (err, rows) => {
    if (err) throw err; //con la throw uscirei

    for (let row of rows) {
        console.log(row);
        //console.log(row.code, row.name);
        result.push(row);
    }
}); //in realtà il codice della callback viene eseguito dopo

console.log('********************');
for (let row of result) {
    console.log(row.code, row.name);
}//questa non stampa niente perchè al momento result è vuoto
console.log('*** END of list ***');

//questo è stato il nostro primo incotro con la programmazione asincrona facendo i/o su un DB 
//ASINCRONA perchè non vogliamo che il codice si blocchi
