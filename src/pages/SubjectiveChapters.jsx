import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import SubjectiveBanner from "../components/SubjectiveBanner";
import { openDatabase } from "../database/db";
import { checkIfTrialEnd, createHadithAppActivation } from "../database/hadithRepository";
import { Capacitor } from '@capacitor/core';

export default function SubjectiveChapters(){

    const [subjectiveHadiths, setSubjectiveHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);    
    const {bookId} =  useParams();


    useEffect(()=>{
        window.scrollTo(0,0)
        getSubjectiveHadiths();
    },[])

    const getSubjectiveHadiths=async()=>{
        setLoading(true)
        try{

            await createHadithAppActivation();
            const data= await checkIfTrialEnd();
            if(!data) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            } 
    
            const db = await openDatabase();
    
            if (Capacitor.isNativePlatform()) {

                let totalChapter = await db.query(`SELECT  COUNT ( DISTINCT chapterId) AS totalChapter FROM subjectives WHERE bookId=?`, [bookId]);
                totalChapter = totalChapter.values[0].totalChapter - 1; 

                const result = await db.query(`SELECT chapterId, chapterTitle, bookName,
                                            COUNT(DISTINCT titleId) AS totalTitle
                                            FROM subjectives where bookId=?
                                            GROUP BY chapterId, chapterTitle
                                            ORDER BY chapterId`, [bookId]);
        
                const books2= result.values.map(row => ({
                    chapterId: row.chapterId,
                    chapterTitle: row.chapterTitle,
                    bookName: row.bookName,
                    totalChapter: totalChapter,
                    totalTitle: row.totalTitle,
                    link: `/subjective/book/${bookId}/chapter/${row.chapterId}/titles`
                }));
    
                setSubjectiveHadiths(books2);
            }    
            
            else{
                let totalChapter = await db.exec(`SELECT  COUNT ( DISTINCT chapterId) AS totalChapter FROM subjectives WHERE bookId=${bookId}`);
                totalChapter = totalChapter[0].values[0][0] - 1;
               const result = await db.exec(`SELECT chapterId, chapterTitle, bookName,
                                            COUNT(DISTINCT titleId) AS totalTitle
                                            FROM subjectives where bookId=${bookId}
                                            GROUP BY chapterId, chapterTitle
                                            ORDER BY chapterId`);
       
               const books = result[0].values.map(row=>({
                   chapterId: row[0],
                   chapterTitle: row[1],
                   bookName: row[2],
                   totalTitle:row[3],
                   totalChapter,
                   link: `/subjective/book/${bookId}/chapter/${row[0]}/titles`
               }));
       
               setSubjectiveHadiths(books);
            }
        }catch(err){
            alert(err.message);
        }
        finally{    
            setLoading(false);    
        } 
    }

    if(!activated){
        return(
            <>
                <HeaderLibrary />
                {loading && (
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <p className="text-lg">Fetching Hadiths...</p>
                    </div>
                )}
                {
                    !loading &&
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <Link to ='/activationCompo' class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Check Status
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </Link>
                    </div>
                }                              
            </>
        )
    }

    return(
        <>
            <HeaderLibrary />
            <SubjectiveBanner title={`${subjectiveHadiths[0].bookName} - এর অধ্যায়সমূহ `} 
                              subTitle={`${subjectiveHadiths[0].totalChapter} - টি অধ্যায় `} />
            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}
            {
                !loading && 
                <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">
                    <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {
                            ( subjectiveHadiths && subjectiveHadiths.length > 0 ) && 
                            subjectiveHadiths.map(item=>{
                                return(
                                    <Link to ={item.link} class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                        <div class="flex flex-col justify-between md:p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">{item.chapterTitle}</h5>
                                            <p class="mb-2 text-md font-semibold tracking-tight text-heading">মোট পরিচ্ছেদ - {item.totalTitle}</p>                                            
                                            <div>
                                                <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                    Read more
                                                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </Link>                            
                                )
                            })
                        }
                    </div>                    
                </div>
                

            }

        </>
    )
}