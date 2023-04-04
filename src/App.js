// React Imports
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import './App.css';

// Modules Imports
import axios from 'axios';

// Components Imports

// Other Files Imports
import * as ROUTES from './constants/routes';

// Styling Imports
import './App.css';

function App() {
  const summonerRef = useRef();
  const regionRef = useRef();

  useEffect(() => {
    console.log("Appjs Mounted");
  }, []);

  let formSubmitHandler = async (event) => {
    event.preventDefault();

    let summoner = summonerRef?.current?.value;
    let matchHistoryLimit = 5;
    let region = regionRef?.current?.value;
    region = region.split(' ')[0];

    console.log(`Form submitted. Get ${matchHistoryLimit} matches of player ${summoner} in region ${region}`);
  }

  return (
    <div className='m-auto'>
      <div className='mt-20 mx-60 py-11 flex justify-around align-middle border bg-slate-200 border-slate-300 rounded-md shadow-md'>
        <form className="w-full max-w-lg" onSubmit={formSubmitHandler}>

          <div className='w-full px-3 py-5 mb-7 font-bold border bg-white rounded-md'>
            <p className='w-fit mx-auto text-lg text-sky-500 tracking-wide'>League of Legends Match Stats</p>
          </div>

          <div className="flex flex-wrap mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 mx-auto md:mb-0">
              <label className="block uppercase tracking-wide text-sky-500 text-xs font-bold mb-2" htmlFor="grid-summoner-name">
                Summoner Name
              </label>
              <input ref={summonerRef} required className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "id="grid-summoner-name" type="text" placeholder="Jane" />
            </div>
          </div>

          <div className="flex flex-wrap mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 mx-auto md:mb-0">
              <label className="block uppercase tracking-wide text-sky-500 text-xs font-bold mb-2" htmlFor="grid-region">
                Region/Platform ID
              </label>
              <div className="relative">
                <select ref={regionRef} required defaultValue="NA (North America)" className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 "id="grid-region">
                  <option>NA (North America)</option>
                  <option>BR (Brazil)</option>
                  <option>EUNE (EU Nordic East)</option>
                  <option>EUW (EU West)</option>
                  <option>JP (Japan)</option>
                  <option>KR (Korea)</option>
                  <option>LAN (Latin America North)</option>
                  <option>LAS (Latin America South)</option>
                  <option>OCE (Oceania)</option>
                  <option>TR (Turkey)</option>
                  <option>RU (Russia)</option>
                  <option>PBE (Public Beta Environment)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 mx-auto md:mb-0">
              <button type='submit' className="w-full py-3 px-7 mx-auto my-3 text-white bg-sky-500 focus:border-white font-medium text-center rounded-md shadow-md hover:shadow-lg transition-all">
                Get Stats
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default App;
