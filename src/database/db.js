import initSqlJs from "sql.js";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";

// let db = null;
// let dbPromise = null;

// export async function openDatabase() {
//     if (db) return db;
//     if (dbPromise) return dbPromise;

//     dbPromise = (async () => {
//         // const SQL = await initSqlJs({ locateFile: file => `/node_modules/sql.js/dist/${file}` });
//         const SQL = await initSqlJs({ locateFile: file => `${file}` });
//         const response = await fetch("/database/hadiths.db");
//         const buffer = await response.arrayBuffer();
//         db = new SQL.Database(new Uint8Array(buffer));      
//         return db;
//     })();

//     return dbPromise;
// }
let db = null;
let dbPromise = null;

let sqlite = null;
let sqliteDb = null;

export async function openDatabase() {

    // -------------------------
    // Native (Android/iOS)
    // android\app\src\main\assets\public\assets\databases\hadithsSQLite.db
    // -------------------------
    if (Capacitor.isNativePlatform()) {

        if (sqliteDb) return sqliteDb;

        sqlite = new SQLiteConnection(CapacitorSQLite);

        const isDb = await sqlite.isDatabase("hadiths", false);        
        if (!isDb.result) {
            await sqlite.copyFromAssets();
        }

        sqliteDb = await sqlite.createConnection("hadiths", false, "no-encryption", 1, false );

        await sqliteDb.open();

        return sqliteDb;
    }

    // -------------------------
    // Web
    // -------------------------
    if (db) return db;
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {

        const SQL = await initSqlJs({ locateFile: file => `${file}` });
        const response = await fetch("/database/hadiths.db");
        const buffer = await response.arrayBuffer();

        db = new SQL.Database(new Uint8Array(buffer));

        return db;

    })();

    return dbPromise;
}