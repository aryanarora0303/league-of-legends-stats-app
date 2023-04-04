// Imports
const LeagueJS = require('leaguejs');

// Create LeagueJS client
const leagueJs = new LeagueJS('RGAPI-7a708be1-fbe1-4c64-bf13-a526a858e012', { PLATFORM_ID: 'na'});

// Extracts and Formats match detials
async function getMatchDetails() {}

// Main Entry Point
// Lambda Handler
exports.handler = async (event) => {

    console.log("Event", event);
    let method = event?.requestContext?.http?.method;
    let path = event?.requestContext?.http?.path;

    if (method == "GET" && path == "/matchHistoryDetails") {
        console.log("Requesting: ", method, path);
        return { statusCode: 200, body: JSON.stringify('Hello from Lambda!') }
    }
    // else if { method == "" && path == "" }
    else {
        return { statusCode: 404, body: "404 Not Found" }
    }
}