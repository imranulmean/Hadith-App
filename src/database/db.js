import initSqlJs from "sql.js";
import { Capacitor } from "@capacitor/core";
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite";
import { getLocalforageItem, setLocalforageItem } from "./hadithRepository";

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
    // \android\app\src\main\assets\public\assets\databases\hadithsSQLite.db
    // -------------------------
    const sqliteVer = 3;
    const savedSqliteVer = await getLocalforageItem("sqliteVer");

    if (Capacitor.isNativePlatform()) {

        if (sqliteDb) return sqliteDb;

        sqlite = new SQLiteConnection(CapacitorSQLite);
        const isDb = await sqlite.isDatabase("hadiths", false);

        if (!isDb.result) {
            await sqlite.copyFromAssets();
            await setLocalforageItem("sqliteVer", sqliteVer);
        }
        else if(savedSqliteVer !== sqliteVer ){
            const conn = await sqlite.createConnection("hadiths", false, "no-encryption", 1, false);
            await conn.open();
            await conn.delete();
             await sqlite.closeConnection("hadiths", false);
            await sqlite.copyFromAssets();
            await setLocalforageItem("sqliteVer", sqliteVer);
        }

        sqliteDb = await sqlite.createConnection("hadiths", false, "no-encryption", 1, false );
        await sqliteDb.open();
        return sqliteDb;
    }

    // -------------------------
    // Web
    // -------------------------
    else{
        console.log(`savedSqliteVer: ${savedSqliteVer}`)        
        if(savedSqliteVer!== sqliteVer){
            console.log(`Saving new Sqlite Vers: ${sqliteVer}`)
            await setLocalforageItem("sqliteVer", sqliteVer);
        }
        
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

}


        // If We want to download the db

        // if (!isDb.result) {
        //     const response = await fetch(`${BASE_API}/database/hadithsSQLite.db`);
        //     const blob = await response.blob();
        
        //     await writeBlob({
        //         path: 'databases/hadithsSQLite.db',
        //         directory: Directory.Data,
        //         blob,
        //         recursive: true,
        //         fast_mode: true
        //     });
        // }        

        ///////////////////////////////