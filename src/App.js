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

  const [showMatchHistoryDetails, setShowMatchHistoryDetails] = useState(false);

  const [matchHistoryDetailsTable, setMatchHistoryDetailsTable] = useState("");
  const [dataFetching, setDataFetching] = useState(false);
  const [isDataFetchingError, setIsDataFetchingError] = useState(false);
  const [dataFetchingError, setDataFetchingError] = useState("");

  useEffect(() => {
    console.log("Appjs Mounted");
  }, []);

  // Formats matchData to table rows
  let formatMatchHistoryDetailsData = (data) => {
    let rows = data.map((match, index) => {
      return (
        <tr key={index} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
          <td className='text-sm text-center px-6 py-4'>{match.summonerName}</td>
          <td className='text-sm text-center px-6 py-4'>{match.summonerLevel}</td>
          <td className='text-sm text-center px-6 py-4 whitespace-pre-wrap'>{match.summonerSpells.map((spell) => `${spell}\n`)}</td>
          <td className='text-sm text-center px-6 py-4 whitespace-pre-wrap'>{Object.keys(match.summonerPerks).map((key) => `${key}(${match.summonerPerks[key]})\n`)}</td>
          <td className='text-sm text-center px-6 py-4'>{match.championName}</td>
          <td className='text-sm text-center px-6 py-4'>{match.championLevel}</td>
          <td className='text-sm text-center px-6 py-4 whitespace-pre-wrap'>{match.championSpells.map((spell) => `${spell}\n`)}</td>
          <td className='text-sm text-center px-6 py-4'>{(match.gameDurationSeconds / 60).toFixed(2)}</td>
          <td className='text-sm text-center px-6 py-4'>{match.outcome}</td>
          <td className='text-sm text-center px-6 py-4'>{(match.totalCreepScore).toFixed(2)}</td>
          <td className='text-sm text-center px-6 py-4'>{(match.creepScorePerMin).toFixed(2)}</td>
          <td className='text-sm text-center px-6 py-4'>{(match.kda).toFixed(2)}</td>
          <td className='text-sm text-center px-6 py-4'>{match.totalKills}/{match.totalDeaths}/{match.totalAssists}</td>
          <td className='text-sm text-center px-6 py-4 whitespace-pre-wrap'>{match.items.map((item) => `${item}\n`)}</td>
        </tr>
      )
    })
    setMatchHistoryDetailsTable(rows);
    setDataFetching(false);
  }

  // Handles Form submission
  let formSubmitHandler = async (event) => {
    event.preventDefault();

    let summoner = summonerRef?.current?.value;
    let matchHistoryLimit = 5;
    let region = regionRef?.current?.value;
    region = region.split(' ')[0];

    let matchHistoryDetailsURL = `https://ues5f21gk3.execute-api.us-west-2.amazonaws.com/matchHistoryDetails?summonerName=${summoner}&region=${region}&matchHistoryLimit=${matchHistoryLimit}`;
    
    // Retrieve info. from cache
    const cache = await caches.open('my-api-cache');
    const cachedResponse = await cache.match(new Request(matchHistoryDetailsURL, { method: 'GET' }));

    setShowMatchHistoryDetails(true);
    setDataFetching(true);
    setIsDataFetchingError(false);
    setDataFetchingError("");

    // Check cache validity, else network request
    if (cachedResponse) {
      let data = await cachedResponse.json()
      formatMatchHistoryDetailsData(data);
    } else {
      axios.get(matchHistoryDetailsURL)
      .then(response => {
        if(response?.data){
          formatMatchHistoryDetailsData(response.data);
        } else {
          setIsDataFetchingError(true);
          setDataFetchingError("Looks like RIOT API limiter is prevent the request from processing. Please try again in a few minutes.");
        }
      })
      .catch(error => {
        console.log(error);
        setDataFetchingError(error.message);
      }); 
    }
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

      {(showMatchHistoryDetails) ?
        <div className='mt-20 mx-10 border bg-slate-200 border-slate-300 rounded-md shadow-md'>
          {(dataFetching) ? 
            <div className='w-fit mx-auto my-11' role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 mr-2 text-gray-600 animate-spin dark:text-gray-600 fill-sky-500 dark:fill-sky-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            :
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
                  <tr>
                    <th className='text-center px-6 py-3' scope='col'>Summoner Name</th>
                    <th className='text-center px-6 py-3' scope='col'>Summoner Level</th>
                    <th className='text-center px-6 py-3' scope='col'>Summoner Spells</th>
                    <th className='text-center px-6 py-3' scope='col'>Summoner Perks</th>
                    <th className='text-center px-6 py-3' scope='col'>Champion Name</th>
                    <th className='text-center px-6 py-3' scope='col'>Champion Level</th>
                    <th className='text-center px-6 py-3' scope='col'>Champion Spells</th>
                    <th className='text-center px-6 py-3' scope='col'>Game Duration(min.)</th>
                    <th className='text-center px-6 py-3' scope='col'>Outcome</th>
                    <th className='text-center px-6 py-3' scope='col'>Total Creep Score</th>
                    <th className='text-center px-6 py-3' scope='col'>Creep Score per Min.</th>
                    <th className='text-center px-6 py-3' scope='col'>KDA Score</th>
                    <th className='text-center px-6 py-3' scope='col'>K/D/A</th>
                    <th className='text-center px-6 py-3' scope='col'>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistoryDetailsTable}
                </tbody>
              </table>
            </div> 
        }
        {(isDataFetchingError) ? 
          <p className='text-sm text-red-400 text-center mb-7'>{dataFetchingError}</p>
          : ""
        }
        </div>
        : ""
      }
    </div>
  );
}

export default App;
