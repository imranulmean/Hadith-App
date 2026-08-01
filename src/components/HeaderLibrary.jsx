import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";


export default function HeaderLibrary(){

    const navigate = useNavigate();
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const location = useLocation();   
    const [menuOpen, setMenuOpen] = useState(false);
           
    return (
        <>
            {/* <nav className="hidden md:block bg-cyan-900 sticky top-0 z-50 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">Islamic Library</span>
                    </Link>

                    <div className={`w-full md:block md:w-auto`}>
                        <ul className="font-medium flex flex-col gap-2 p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">

                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${(location.pathname === '/') ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Home</Link>
                            </li>

                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/subjectiveHadiths" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${(location.pathname === '/subjectiveHadiths') ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Subjective</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/suras" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${(location.pathname === '/suras') ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Al-Quran</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/search" 
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${(location.pathname === '/search') ? 'text-white border border-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>Search</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav> */}

            {/* Mobile Header */}
            
            <nav className="block bg-cyan-900 sticky top-0 z-50 print:hidden">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-2">
                    <Link to="/" className="flex shrink-0 items-center gap-2">
                        <span className="text-white self-center text-xl font-semibold whitespace-nowrap">Islamic Library</span>
                    </Link>
                </div>

                <div className="w-full md:block md:w-auto">
                        <ul className="font-medium flex justify-center gap-2 p-2 border-t  border-default bg-neutral-secondary-soft">
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${( location.pathname === '/' || location.pathname.includes('hadithContent')) ? 'text-white border border-white' : 'text-gray-300'}`}>Books কিতাব</Link>
                            </li>                            
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/subjectiveHadiths" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${( location.pathname.includes('subjective')) ? 'text-white border border-white' : 'text-gray-300'}`}>Subjective বিষয়ভিত্তিক</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/suras" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${(location.pathname.includes('sura')) ? 'text-white border border-white' : 'text-gray-300 '}`}>Al-Quran কুরআন</Link>
                            </li>
                            <li>
                                <Link onClick={() => setMenuOpen(false)} to="/search" 
                                    className={`flex text-center rounded-md px-3 py-1 text-sm font-medium ${(location.pathname === '/search') ? 'text-white border border-white' : 'text-gray-300 '}`}>Search খুঁজুন</Link>
                            </li>
                        </ul>
                    </div>                
            </nav>              
        </>
        
      ); 
}