import { openDatabase } from "./db";
import { Device } from "@capacitor/device";
import { Capacitor } from '@capacitor/core';

//////////Create hadithAppActivation table if not, this determine the user is first installing ///

import localforage from "localforage";

localforage.config({
    name: "HadithApp",
    storeName: "HadithAppStore"
});

export async function setDataLocalForge(data){
    await localforage.setItem('hadithAppActivation', data);
}

export async function getDataLocalForge(){
    const data = await localforage.getItem('hadithAppActivation');
    return data;
}

export async function getHadits() {

    let names=[
        {
            name:'সহীহ বুখারী',
            nameEnglish:'Sahi Bukhari',
            link:'/hadithContent/bukhari'
        },
        {
            name:'সহীহ মুসলিম',
            nameEnglish:'Sahi Muslim',
            link:'/hadithContent/muslim'
        },
        {
            name:'সুনান আবূ দাউদ',
            nameEnglish:'Sunan Abu Daud',
            link:'/hadithContent/sunan_abu_daud'
        },
        {
            name:'সুনান আত তিরমিজী',
            nameEnglish:'Sunan At Tirmizi',
            link:'/hadithContent/sunan_at_tirmizi'
        },
        {
            name:'সুনান ইবনু মাজাহ',
            nameEnglish:'Sunan Abn Mazah',
            link:'/hadithContent/sunan_ibn_mazah'
        },
        {
            name:'সুনান আন-নাসায়ী',
            nameEnglish:'Sunan An Nasai',
            link:'/hadithContent/sunan_an_nasai'
        },
        {
            name:'মিশকাতুল মাসাবীহ',
            nameEnglish:'Mishkatul Misbah',
            link:'/hadithContent/mishkatul_misbah'
        }                
    ]
    return names; 
}

export async function createHadithAppActivation(){

    const isNative = Capacitor.isNativePlatform();
    const platform= Capacitor.getPlatform();
    const { identifier } = await Device.getId();
    const BASE_API = import.meta.env.VITE_API_BASE_URL;
    try{
        const obj={
            deviceId: identifier
        }

        const hadithAppActivation= await localforage.getItem('hadithAppActivation');
        if(!hadithAppActivation){
            // Register device with server
            const res = await fetch(`${BASE_API}/hadithApp/checkActivation`,{
                method:"POST",
                headers:{
                'content-type' : 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();
            if(data.success){
                await localforage.setItem('hadithAppActivation', data.data);
                console.log("First installation completed.");
            }            
        }
    }catch(err){
        alert(err.message)
    }
}

export async function checkIfTrialEnd() {
    let activation =  await localforage.getItem('hadithAppActivation');

    if (!activation) {
        return false;
    }     
    // Already inactive
    if (activation.activated !== 1) {
        return false;
    }

    // Invalid date
    if (!activation.trialEnd) {
        return false;
    }

    const trialEnd = new Date(activation.trialEnd);

    if (isNaN(trialEnd.getTime())) {
        return false;
    }
    // Trial expired
    if (new Date() > trialEnd) {
        activation.activated=0
        await localforage.setItem('hadithAppActivation', activation); 
        return false;
    }
    return true;
}

export async function getBooks() {

    const db = await openDatabase();
    const books= getHadits();
    return books
}


export function parseJson(value){
    if(!value) return [];
    try{
        return JSON.parse(value);
    }
    catch{
        try{
            return JSON.parse(
                value.replace(/\\"/g,'"')
            );
        }
        catch{
            return [];
        }
    }
}

export async function getHadithsContent(bookName, page, limit) {

    const db = await openDatabase();
    const offset = (page - 1) * limit;

    if (Capacitor.isNativePlatform()) {

        const totalResult = await db.query( "SELECT COUNT(*) AS total FROM hadiths WHERE bookName=?", [bookName]);

        const total = totalResult.values[0].total;
        const totalPages = Math.ceil(total / limit);

        const result = await db.query(
            ` SELECT id, title, arabicText, banglaText, englishTitle, englishText, hadithNumber FROM hadiths
            WHERE bookName=? ORDER BY id LIMIT ? OFFSET ? `, [bookName, limit, offset]
        );

        const rows = result.values.map(row => ({
            id: row.id,
            title: row.title,
            arabicText: parseJson(row.arabicText),
            banglaText: parseJson(row.banglaText),
            englishTitle: row.englishTitle,
            englishText: row.englishText,
            hadithNumber: row.hadithNumber
        }));

        return {
            success: true,
            message: rows,
            total,
            totalPages
        };
    }
    
    // Total
    const totalResult = db.exec(` SELECT COUNT(*) as total FROM hadiths WHERE bookName='${bookName}' `);

    const total = totalResult[0].values[0][0];
    const totalPages = Math.ceil(total / limit);
    const result = db.exec(`
        SELECT id, title, arabicText, banglaText, englishTitle, englishText, hadithNumber FROM hadiths
        WHERE bookName='${bookName}' ORDER BY id LIMIT ${limit} OFFSET ${offset}
    `);

    let rows = [];
    if(result.length>0){
        rows = result[0].values.map(row=>({
            id: row[0],
            title: row[1],        
            arabicText: parseJson(row[2]),        
            banglaText: parseJson(row[3]),        
            englishTitle: row[4],        
            englishText: row[5],        
            hadithNumber: row[6]
        }));

    }

    return{
        success:true,
        message:rows,
        total,
        totalPages
    };

}

export async function saveHadithBookmark(newBookmark){
    let bookmarks = await localforage.getItem("hadithBookmarks") || [];
    bookmarks.push(newBookmark);
    localforage.setItem( "hadithBookmarks",bookmarks);
    return true;
}

export async function getHadithBookmark(){
    let bookmarks = await localforage.getItem("hadithBookmarks") || [];
    return bookmarks;
}

export async function deleteBookmark(bookmarkIndex){
    let bookmarks = await localforage.getItem("hadithBookmarks") || [];
    bookmarks.splice(bookmarkIndex, 1);
    localforage.setItem( "hadithBookmarks",bookmarks);
}

export async function getQuranSuras() {

    const db = await openDatabase();

    if (Capacitor.isNativePlatform()) {

        const result = await db.query(`SELECT DISTINCT surahHeader, surahNameEng, surahNameBn, surahId FROM quran ORDER BY surahId`);

        return result.values.map(row => ({
            surahHeader: row.surahHeader,
            surahNameEng: row.surahNameEng,
            surahNameBn: row.surahNameBn,
            surahId: row.surahId,
            link: `/surahContent/${row.surahId}`
        }));
    }    
    
    const result = db.exec(` SELECT DISTINCT  surahHeader, surahNameEng, surahNameBn, surahId FROM quran ORDER BY id`);    
    if(result.length===0) return [];
    const books = result[0].values.map(row=>({
        surahHeader: row[0],
        surahNameEng: row[1],
        surahNameBn: row[2],
        surahId: row[3],
        link: `/surahContent/${row[3]}`
    }));

    return books
}

export async function getSurahContent(surahId, page) {

    const db = await openDatabase();

    if (Capacitor.isNativePlatform()) {

        const totalResult = await db.query( "SELECT COUNT(*) as total FROM quran WHERE surahId=?", [surahId]);

        const total = totalResult.values[0].total;

        const result = await db.query(
            ` SELECT id, surahHeader, surahNameEng, surahNameBn, ayatNo, arabicText, banglaText, englishText
            FROM quran WHERE surahId= ? ORDER BY id `, [surahId]
        );

        const rows = result.values.map(row => ({
            id: row.id,
            surahHeader: row.surahHeader,        
            surahNameEng: row.surahNameEng,        
            surahNameBn: row.surahNameBn,        
            ayatNo: row.ayatNo,        
            arabicText: row.arabicText,        
            banglaText: row.banglaText,
            englishText: row.englishText
        }));
        
        return {
            success: true,
            message: rows,
            total            
        };
    }    
    
    // Total
    const totalResult = db.exec(` SELECT COUNT(*) as total FROM quran WHERE surahId='${surahId}' `);

    const total = totalResult[0].values[0][0];

    const result = db.exec(`
        SELECT id, surahHeader, surahNameEng, surahNameBn, ayatNo, arabicText, banglaText, englishText
        FROM quran WHERE surahId='${surahId}'ORDER BY id
    `);

    let rows = [];
    if(result.length>0){
        rows = result[0].values.map(row=>({
            id: row[0],
            surahHeader: row[1],        
            surahNameEng: row[2],        
            surahNameBn: row[3],        
            ayatNo: row[4],        
            arabicText: row[5],        
            banglaText: row[6],
            englishText: row[7]
        }));

    }
    return{
        success:true,
        message:rows,
        total
    };

}


export async function subjectivesContent(bookId, chapterId, titleId) {

    const db = await openDatabase();

    if (Capacitor.isNativePlatform()) {

        const totalResult = await db.query( "SELECT COUNT(*) AS total FROM subjectives WHERE bookId=? AND chapterId=? AND titleId=?", [bookId, chapterId, titleId]);
        const total = totalResult.values[0].total;

        const bookDetails = await db.query( "SELECT distinct bookName, chapterTitle, chapterTitleIndexName FROM subjectives WHERE bookId=? AND chapterId=? AND titleId=?", [bookId, chapterId, titleId]);
        const bookDetailsObj={ 
            bookName : bookDetails.values[0].bookName,
            chapterTitle: bookDetails.values[0].chapterTitle,
            chapterTitleIndexName:bookDetails.values[0].chapterTitleIndexName
        }

        const result = await db.query(
            `SELECT bookName, chapterTitle, chapterTitleIndexName, contentTitle, banglaTexts, arabicTexts
             FROM subjectives WHERE bookId=? AND chapterId=? AND titleId=? `, [bookId, chapterId, titleId]
        );

        const rows = result.values.map(row => ({
            bookName: row.bookName,
            chapterTitle: row.chapterTitle,
            chapterTitleIndexName:  row.chapterTitleIndexName,
            contentTitle: row.contentTitle,
            arabicText: parseJson(row.arabicTexts),
            banglaText: parseJson(row.banglaTexts),
        }));

        return {
            success: true,
            message: rows,
            total,
            bookDetails: bookDetailsObj
        };
    }
    
    // Total
    const totalResult = await db.exec(`SELECT COUNT(*) AS total FROM subjectives WHERE bookId=${bookId} AND chapterId=${chapterId} AND titleId=${titleId}`);
    const total = totalResult[0].values[0][0];
    const bookDetails = await db.exec( "SELECT distinct bookName, chapterTitle, chapterTitleIndexName FROM subjectives WHERE bookId=? AND chapterId=? AND titleId=?", [bookId, chapterId, titleId]);
    const bookDetailsObj={ 
            bookName : bookDetails[0].values[0][0],
            chapterTitle: bookDetails[0].values[0][1],
            chapterTitleIndexName:bookDetails[0].values[0][2]
        }

    const result = db.exec(
    `SELECT bookName, chapterTitle, chapterTitleIndexName, contentTitle, banglaTexts, arabicTexts
    FROM subjectives WHERE bookId= ${bookId} AND chapterId= ${chapterId} AND titleId= ${titleId} `
    );

    let rows = [];
    if(result.length>0){
        rows = result[0].values.map(row=>({
            bookName: row[0],
            chapterTitle: row[1],
            chapterTitleIndexName: row[2],
            contentTitle: row[3],
            banglaText: parseJson(row[4]),
            arabicText: parseJson(row[5])
        }));

    }

    return{
        success:true,
        message:rows,
        total,
        bookDetails: bookDetailsObj
    };

}