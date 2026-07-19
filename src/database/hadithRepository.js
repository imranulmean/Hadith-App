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
    // const result = db.exec(` SELECT DISTINCT bookName FROM hadiths ORDER BY bookName `);

    // if(result.length===0)
    //     return [];
    // const books = result[0].values.map(row=>({
    //     name: row[0],
    //     link: `/hadithContent/${row[0]}`
    // }));
    const books= getHadits();
    return books
}


function parseJson(value){
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
    // Total
    const totalResult = db.exec(` SELECT COUNT(*) as total FROM hadiths WHERE bookName='${bookName}' `);

    const total = totalResult[0].values[0][0];
    const totalPages = Math.ceil(total / limit);

    const offset = (page - 1) * limit;

    const result = db.exec(`
        SELECT
            id,
            title,
            arabicText,
            banglaText,
            englishTitle,
            englishText,
            hadithNumber
        FROM hadiths
        WHERE bookName='${bookName}'
        ORDER BY id
        LIMIT ${limit}
        OFFSET ${offset}
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
    const result = db.exec(` SELECT DISTINCT  surahHeader, surahNameEng, surahNameBn, surahId FROM quran ORDER BY id`);    
    if(result.length===0)
        return [];
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
    // Total
    const totalResult = db.exec(` SELECT COUNT(*) as total FROM quran WHERE surahId='${surahId}' `);

    const total = totalResult[0].values[0][0];

    const result = db.exec(`
        SELECT
            id,
            surahHeader,
            surahNameEng,
            surahNameBn,
            ayatNo,
            arabicText,
            banglaText,
            englishText
        FROM quran
        WHERE surahId='${surahId}'
        ORDER BY id
    `);

    let rows = [];
    if(result.length>0){
        rows = result[0].values.map(row=>({
            id: row[0],
            surahHeader: row[1],        
            surahNameEng: parseJson(row[2]),        
            surahNameBn: parseJson(row[3]),        
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