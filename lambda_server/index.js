// Imports
const LeagueJS = require('leaguejs');

// Create LeagueJS client
const leagueJs = new LeagueJS('RGAPI-7a708be1-fbe1-4c64-bf13-a526a858e012', { PLATFORM_ID: 'na'});

// Extracts and Formats match detials
async function getMatchDetails(match, summoner) {
    try {
        // Get all participants and summonerSpells from the match
        const { participants } = match.info;
    
        // Find summoner participant data
        let myParticipant = participants.find(p => p.puuid === summoner.puuid);
    
        console.log("MyParticipant Retrieved");
    
        let matchData = {
            summonerName: summoner.name
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
      
            console.log("Query Param Extraction Complete: ", summonerName, region, matchHistoryLimit);
      
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
            return  {
            statusCode: 500,
            body: 'RIOT API Rate Limit Exceeded'
            };
        } else {
            return  {
            statusCode: 500,
            body: 'Internal server error'
            };
        }
        }
    }
    // else if { method == "" && path == "" }
    else {
        return { statusCode: 404, body: "404 Not Found" }
    }
}