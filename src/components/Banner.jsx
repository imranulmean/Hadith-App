import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Banner({loading}){
    return(
        <>
            <div className="w-full">
                {/* Container with relative positioning to hold the text overlay */}
                <div className="flex flex-col relative z-1 h-[50vh] md:h-[70vh] bg-[url('/islamic-logo.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
                    
                    {/* Dark Overlay - ensures text is readable regardless of the image brightness */}
                    <div className="absolute inset-0 bg-[#00000080]"></div>
                    
                    {/* Text Content */}
                    <div className="relative z-10 text-center px-4">
                        <h1 className="mb-4 text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                            Explore the Beauty of the Quran
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl mx-auto">
                            Discover profound wisdom and guidance through authentic narrations and verses.
                        </p>
                    </div>

                    <div className="flex flex-col p-4 z-10 gap-2">
                        <div className="flex gap-2 justify-center">
                            {
                                (!loading && localStorage.getItem('lastHadith')) &&
                                <Link
                                    to={localStorage.getItem('lastHadith')}
                                    className="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Last Read (Hadith)
                                </Link>                            
                            }
                            {
                                (!loading && localStorage.getItem('lastAyat')) &&
                                <Link
                                    to={localStorage.getItem('lastAyat')}
                                    className="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Last Read (Ayat)
                                </Link>                            
                            } 
                            {
                                !loading &&
                                <Link
                                    to='/hadithBookmarks'
                                    className="inline-flex items-center w-auto text-gray-100 bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none"
                                >
                                    Hadith Bookmarks
                                </Link>                            
                            }                                                         
                        </div>                                                                       
                    </div>                    

                </div>
            </div>      
        </>
    )
}