const express = require('express');
var favicon = require('serve-favicon');
const querystring = require('querystring');
const fs = require('fs');

const { parseMiRDBData, getMiRDBResult } = require('./get_miRDB');
const { getKEGGData, getKEGGDataOffline } = require('./get_KEGG');
const { makeRequest, readLines, sleep } = require('./helper');

const app = express();
const port = process.env.PORT || 3000;
app.use(favicon("assets/img/favicon.png"));
app.use(express.static(__dirname + '/assets/'));

async function readResultFile(resId){
    let fileName = "./results/"+resId;
    console.log("checking file:",fileName);
    let promise = new Promise((resolve, reject) => {
        // Check if the file exists in the current directory.
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err){
                console.log(fileName,"not existing");
                resolve(null);
            }
            resolve(true);
        });
    });
    const check = await promise;
    if (check){
        //Ensure that file is written
        await sleep(1000);
        promise = new Promise((resolve, reject) => {
            // Read content in file.
            fs.readFile(fileName,(err, data) => {
                if (err) resolve(null);
                resolve(data);
            })
        });
        let content = await promise;
        // console.log("content:", content);      
        return content;
    } else {       
        return null;
    }
}
function sequenceToResultId(seq){
    return seq;
}

async function getResultFromSequences (seq) {
    seq = seq.toUpperCase();
    let obj = {
        sequence: seq,
    };
    const checkRes = await readResultFile(sequenceToResultId(seq));
    if (checkRes != null){
        console.log(checkRes);
        obj.path=seq;
        return;
    }
    console.log("got sequence: ", seq);
    //make request to miRDB
    const postData = querystring.stringify({
        'searchSpecies': 'hsa',
        'subChoice': 'miRNA',
        'miRsample': 'on',
        'customSub': seq,
        '.submit': 'Go',
    });      
    const en = (chunk) => {
        console.log(`END BODY: ${chunk}`);
    };

    const options = {
        hostname: 'mirdb.org',
        port: 80,
        path: '/cgi-bin/custom.cgi',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        },
        postData: postData,
    };

    makeRequest(options,(chunk) => {
        console.log("chunk",chunk);
        getMiRDBResult(chunk,seq,getKEGGDataOffline);
    },en,true);
}

// --- INITIALIZATION PROCESS



// const mimat = readLines("MIMAT_strip.txt").map((val) => {return val.split("\t");});
const allDataLines = readLines("sequence_only.txt");

async function main (){
    for (let i = 0; i < allDataLines.length; i++) {
        const element = allDataLines[i];
        getResultFromSequences(element);
        await sleep(20000);
    }
}

main();