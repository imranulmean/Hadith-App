import initSqlJs from "sql.js";

let db = null;
let dbPromise = null;

export async function openDatabase() {
    if (db) return db;
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
        // const SQL = await initSqlJs({ locateFile: file => `/node_modules/sql.js/dist/${file}` });
        const SQL = await initSqlJs({ locateFile: file => `${file}` });
        const response = await fetch("/database/hadiths.db");
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));      
        return db;
    })();

    return dbPromise;
}