const http = require('http');
const fs = require('fs');
const _ = require('lodash');

let dirtyProxyCount = 0; 

function readLines(path){
    return fs.readFileSync(path, "utf-8").split("\n").map((val) => { return val.split("\r")[0];});
}

const connectLines = readLines("./open_proxy.txt");

function makeRequest(customOptions,dataCallback,endCallback,shouldUseProxy=false){
    console.log(customOptions);
    const hostName = customOptions.hostname ||"mirdb.org";
    const pathName = customOptions.path ||"/cgi-bin/custom.cgi";
    let prox = [hostName,"80"];
    let fullPath = pathName;
    if (shouldUseProxy){
        prox = connectLines[dirtyProxyCount++].split("|");
        dirtyProxyCount = dirtyProxyCount % connectLines.length;
        fullPath = "http://" + hostName + pathName;
    }
    console.log("proxy:", prox[0], parseInt(prox[1]));
    console.log(fullPath);
    const options = {
        hostname: prox[0],
        port: parseInt(prox[1]),
        path: fullPath,
        method: customOptions.method || 'POST',
        headers: {
          Host: hostName,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(customOptions.postData)
        }
    };
      
    const myReq = http.request(options, (res) => {
        console.log(`IP: ${prox[0]}STATUS: ${res.statusCode}`);
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk)=>{
            if (chunk.includes("Warning:")){
                console.error(`Warning from site detected`);
                throw new SiteWarningError(customOptions.sequence);
            }
            dataCallback(chunk);
        });
        res.on('end', endCallback);
    });

    myReq.on('error', (e) => {
        makeRequest(customOptions,dataCallback,endCallback,shouldUseProxy);
        console.error(`problem with request: ${e.message}`);
    });

    myReq.write(customOptions.postData);
    myReq.end();
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class SiteWarningError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = "SiteWarningError"; // (2)
    }
}
  

module.exports = {SiteWarningError,makeRequest,readLines,sleep }

  