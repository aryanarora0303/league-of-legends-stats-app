// Imports
const LeagueJS = require('leaguejs');

// Create LeagueJS client
const leagueJs = new LeagueJS('RGAPI-8b4bdf52-7e65-4a9c-bf54-80d6215b9ea5', { PLATFORM_ID: 'na'});

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
    
        let matchData = {
            outcome,
            gameDurationSeconds,
            summonerName,
            summonerLevel,
            summonerPerks,
            championSpellCounts,
            totalKills,
            totalDeaths,
            totalAssists,
            kda,
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