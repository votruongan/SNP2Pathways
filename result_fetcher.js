const express = require('express');
var favicon = require('serve-favicon');
const querystring = require('querystring');
const fs = require('fs');

const { resultFileName, parseMiRDBData, getMiRDBResult } = require('./get_miRDB');
const { getKEGGData, getKEGGDataOffline } = require('./get_KEGG');
const { SiteWarningError,makeRequest, readLines, sleep } = require('./helper');

const requestInterval = 5 * 1000;
const needFilter = false;

async function readResultFile(resId,notExistingCallback=null){
    const fileName = resultFileName(resId);
    console.log("checking file:",fileName);
    let promise = new Promise((resolve, reject) => {
        // Check if the file exists in the current directory.
        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err){
                console.log(fileName,"not existing");
                if (notExistingCallback)
                    notExistingCallback(fileName);
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
    console.log(seq,checkRes);
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
        sequence: seq,
    };
    try{
        makeRequest(options,(chunk) => {
            console.log("chunk",chunk);
            getMiRDBResult(chunk,seq,null);
        },en,true);
    } catch (e) {
        if (err instanceof SiteWarningError) console.log(e);
        await sleep(120*1000);
        getResultFromSequences(seq);
    }
}

// --- INITIALIZATION PROCESS



// const mimat = readLines("MIMAT_strip.txt").map((val) => {return val.split("\t");});
const allDataLines = readLines("sequence_only.txt");

async function checkSeq(seq){
    const fileName = resultFileName(seq);
    const append = ()=>{
        fs.appendFile("sequence_only_done.txt",seq+"\n",()=>{});
    }
    let r = await readResultFile(seq,append);
}

async function filterAllDataLines(){
    let i = 0;
    for (let i = 0; i < 10000; i++) {
        checkSeq(allDataLines[i])
        await sleep(1);
    }
    // fs.writeFile("sequence_only_new.txt",allDataLines.join("\n"),()=>{});
}

async function main (){
    const oldLen = allDataLines.length;
    console.log(oldLen, allDataLines.length);
    getResultFromSequences(allDataLines[0]);
    await sleep(requestInterval);
    for (let i = 1; i < allDataLines.length; i++) {
        const element = allDataLines[i];
        getResultFromSequences(element);
        if (i % 7 == 0){
            console.log(">>> BLOCK DONE - RELAXING")
            await sleep(2 * 60 * 1000);
        }
        await sleep(requestInterval);
    }
}

if (needFilter)
    filterAllDataLines()
else
    main();

process.on('uncaughtException', function(err) {
    if(err instanceof SiteWarningError){
        console.log("warning sequence:",err.message);
        getResultFromSequences(err.message);
    }
});  