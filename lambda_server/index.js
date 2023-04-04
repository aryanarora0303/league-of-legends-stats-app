// Imports
const LeagueJS = require('leaguejs');

// Create LeagueJS client
const leagueJs = new LeagueJS('RGAPI-8b4bdf52-7e65-4a9c-bf54-80d6215b9ea5', { PLATFORM_ID: 'na'});

// Global Variables
let summonerSpellData;
let itemData;
let championsData;

// Retrives Static data from Data Dragon
async function getStaticData() {
    try {
      console.log("Retrieving Static Data");
      summonerSpellData = fs.readFileSync('./node_modules/leaguejs/StaticDataDefaultRoot/13.6.1/en_US/summoner.json', 'utf8');
      summonerSpellData = JSON.parse(summonerSpellData);
      summonerSpellData = summonerSpellData.data;
      console.log(summonerSpellData);
      // ALT:
      // summonerSpellData = (await DataDragonHelper.gettingSummonerSpellsList()).data;
      // summonerSpellData = (await axios.get(`http://ddragon.leagueoflegends.com/cdn/13.6.1/data/en_US/summoner.json`)).data;
  
      itemData = fs.readFileSync('./node_modules/leaguejs/StaticDataDefaultRoot/13.6.1/en_US/item.json', 'utf8');
      itemData = JSON.parse(itemData);
      itemData = itemData.data;
      console.log(itemData);
      // ALT:
      // itemData = (await DataDragonHelper.gettingItemList()).data;
      // itemData = (await axios.get('https://ddragon.leagueoflegends.com/cdn/13.6.1/data/en_US/item.json')).data;
  
      championsData = fs.readFileSync('./node_modules/leaguejs/StaticDataDefaultRoot/13.6.1/en_US/championFull.json', 'utf8');
      championsData = JSON.parse(championsData);
      championsData = championsData.data;
      console.log(championsData);
      // ALT:
      // championsData = (NO DataDragonHelper Method to retrieve this data);
      // championData = (await axios.get(`https://ddragon.leagueoflegends.com/cdn/13.6.1/data/en_US/champion/${championName}.json`)).data.data;
    } catch(error) {
      console.error('Error retrieving static data:', error);
      throw error;
    }
  }

// Extracts and Formats match detials
async function getMatchDetails(match, summoner) {
    try {
        // Get all participants and summonerSpells from the match
        const { participants } = match.info;
    
        // Find summoner participant data
        let myParticipant = participants.find(p => p.puuid === summoner.puuid);
    
        console.log("MyParticipant Retrieved");

        // Extract summoner participant data
        let outcome = myParticipant.win ? 'Victory' : 'Defeat';
        let gameDurationSeconds = match.info.gameDuration;
        let summonerName = summoner.name;
        let summonerLevel = summoner.summonerLevel;
        let summonerPerks = myParticipant.perks.statPerks;
        let totalKills = myParticipant.kills;
        let totalDeaths = myParticipant.deaths;
        let totalAssists = myParticipant.assists;
        let kda = myParticipant.challenges.kda;
        let itemIDs = [ myParticipant.item0, myParticipant.item1, myParticipant.item2, myParticipant.item3, myParticipant.item4, myParticipant.item5, myParticipant.item6 ];
        let championId = myParticipant.championId;
        let championName = myParticipant.championName;
        let championLevel = myParticipant.champLevel;
        let championSpellCounts = [ myParticipant.spell1Casts, myParticipant.spell2Casts, myParticipant.spell3Casts, myParticipant.spell4Casts ];
        let totalCreepScore = myParticipant.totalMinionsKilled;
        let creepScorePerMin = (totalCreepScore / (gameDurationSeconds/60));

        console.log("MyParticipant Basic Info Retrieved");

        // Lookup spells casted by champion
        let championData = championsData[championName];
        let championSpells = []
        for (let spell of championData.spells) { // championData.spells format: [ Object, Object, ... ]
            if (spell?.name) {
                championSpells.push(spell.name);
            }
        }

        console.log("MyParticipant championSpells Retrieved");

        // Lookup spells casted by summoner
        let summonerSpells = []
        for (let key of Object.keys(summonerSpellData)) { // summonerSpellData format: { Object, Object, ... }
            let spell = summonerSpellData[key];
            if (spell?.name && spell?.id && ((spell.id == myParticipant.summoner1Id) || (spell.id == myParticipant.summoner2Id))) {
                summonerSpells.push(spell.name);
            } 
        }

        console.log("MyParticipant summonerSpells Retrieved");


        // Lookup items used by summoner
        let items = []
        for (let key of itemIDs) { // itemIDs format: [ id, id, ... ]
            let item = itemData[key];
            if (item?.name) {
                items.push(item.name);
            }
        }

        console.log("MyParticipant items Retrieved");
    
        let matchData = {
            outcome,
            gameDurationSeconds,
            summonerName,
            summonerLevel,
            summonerSpells,
            summonerPerks,
            championSpells,
            championSpellCounts,
            totalKills,
            totalDeaths,
            totalAssists,
            kda,
            items,
            championName,
            championLevel,
            totalCreepScore,
            creepScorePerMin
        };
    
        console.log("MyParticipant Match Data Retrieved");
    
        return matchData;
    
    } catch (error) {
        console.error('Error fetching match details:', error);
        throw error;
    }
}

// Main Entry Point
// Lambda Handler
exports.handler = async (event) => {

    console.log("Event", event);
    let method = event?.requestContext?.http?.method;
    let path = event?.requestContext?.http?.path;
  
    if (method == "GET" && path == "/matchHistoryDetails") {
      console.log("Requesting: ", method, path);
      try {
        // Extract Query Params
        let summonerName = event?.queryStringParameters?.summonerName;
        let region = event?.queryStringParameters?.region;
        let matchHistoryLimit = event?.queryStringParameters?.matchHistoryLimit;
  
        // TODO: Delete it, For testing
        summonerName = 'EldoranDev';
        region = 'euw1';
        matchHistoryLimit = 5;
        
        // Check Query Params
        if (!summonerName) {
          return { statusCode: 400, body: JSON.stringify('Summoner name is required') };
        }
        if(!region) {
          region = 'na';
        }
        if (!matchHistoryLimit) {
          return { statusCode: 400, body: JSON.stringify('Match History Limit is required') };
        }
  
        console.log("Query Param Extraction Complete: ", summonerName, region, matchHistoryLimit);
  
        // Download static data from DataDragon
        getStaticData();
  
        console.log("Static Data Extracted");
  
        // Get summoner info
        let summoner = await leagueJs.Summoner.gettingByName(summonerName, region);
  
        console.log("Summoner Retrieved");
  
        // Get recent matches
        let { matches } = await leagueJs.Match.gettingListByAccount(summoner.puuid, region, { beginIndex: 0, endIndex: parseInt(matchHistoryLimit) });
  
        console.log("Matched Retrieved", matches);
  
        // Get all match detials
        let matchDetails = await Promise.all(matches.map(async (match) => {
          return await getMatchDetails(match, summoner);
        }));
  
        console.log("All Match Details Retrieved");
  
        // TODO: Remove Logs
        console.log(summoner, matchDetails);
        // TODO: Remove Logs
  
        return  {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(matchDetails)
        };
      } catch (error) {
        console.log(error);
        if (error instanceof leagueJs.RateError) {
          console.log('Rate limit exceeded');
          return  { statusCode: 500, body: JSON.stringify('RIOT API Rate Limit Exceeded') };
        } else {
          return  { statusCode: 500, body: JSON.stringify('Internal server error') };
        }
      }
    }
    // else if { method == "" && path == "" }
    else {
      return { statusCode: 404, body: JSON.stringify("404 Not Found") }
    }
  };