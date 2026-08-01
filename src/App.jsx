import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ActivationCompo from './pages/ActivationCompo';

import HadithContent from './pages/HadithContent';
import Hadiths from './pages/Hadiths';
import Suras from './pages/Suras';
import SurahContent from './pages/SurahContent';
import HadithBookmarks from './pages/HadithBookmarks';
import BackHandler from './components/BackHandler';
import SubjectiveHadiths from './pages/SubjectiveHadiths';
import SubjectiveChapters from './pages/SubjectiveChapters';
import SubjectiveTitles from './pages/SubjectiveTitles';
import SubjectiveContents from './pages/SubjectiveContents';
import Search from './pages/Search';

import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';

export default function App(){


  useEffect(()=>{
    setupSystemBars();
  },[])

  async function setupSystemBars() {
    if (!Capacitor.isNativePlatform()) return;

    // Status bar
    await StatusBar.setOverlaysWebView({ overlay: false });

    await StatusBar.setBackgroundColor({
      color: "#164e63", // bg-cyan-900
    });


    // Navigation bar
    await NavigationBar.setNavigationBarColor({
      color: "#0c171a",
      darkButtons: false,
    });
  }  
   
  return(

      <BrowserRouter>      
        <BackHandler />
        <Routes>        
          <Route path='/' element={<Hadiths />} />
          <Route path='/hadiths' element={<Hadiths />} />
          <Route path='/activationCompo' element={<ActivationCompo />} />
          <Route path='/hadithContent/:bookName' element={<HadithContent />} />
          <Route path='/hadithBookmarks' element={<HadithBookmarks />} />
          <Route path='/suras' element={<Suras />} />
          <Route path='/surahContent/:surahId' element={<SurahContent />} />
          <Route path='/subjectiveHadiths' element={<SubjectiveHadiths />} />
          <Route path='/subjective/book/:bookId/chapters' element={<SubjectiveChapters />} />
          <Route path='/subjective/book/:bookId/chapter/:chapterId/titles' element={<SubjectiveTitles />} />
          <Route path='/subjective/book/:bookId/chapter/:chapterId/title/:titleId/contents' element={<SubjectiveContents />} />
          <Route path='/search' element={<Search />} />
        </Routes>
      </BrowserRouter>    

  )
}