const express = require('express');
var favicon = require('serve-favicon');
const querystring = require('querystring');
const fs = require('fs');

const { parseMiRDBData, getMiRDBResult,resultFileName } = require('./get_miRDB');
const { getKEGGData, getKEGGDataOffline } = require('./get_KEGG');
const { makeRequest, readLines, sleep } = require('./helper');

const app = express();
const port = process.env.PORT || 3000;
app.use(favicon("assets/img/favicon.png"));
app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

function sequenceToResultId(seq){
    return seq;
}

app.get('/seq/:sequence', async (req, res) => {
    let seq = req.params.sequence.toUpperCase();
    let obj = {
        sequence: seq,
    };
    const checkRes = await readResultFile(sequenceToResultId(seq));
    if (checkRes != null){
        console.log(checkRes);
        obj.path=seq;
        res.send(obj);
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
        console.log("CHUNK:",chunk);
        getMiRDBResult(chunk,seq,null);
    },en,true);
    //send the result back to client
    res.send(obj);
})

// --- INITIALIZATION PROCESS


// const mimat = readLines("MIMAT_strip.txt").map((val) => {return val.split("\t");});
const allDataLines = readLines("rs_only.tsv").map((val) => {return val.split("\t");});
const pathwayFilter = readLines("pathway_filter.txt");

function uniqueMimatNamePos(allLines){
    curMimat = "";
    let res = [];
    for (let i = 0; i < allLines.length; i++) {
        const ele = allLines[i];
        if (ele[10] == curMimat)
            continue;
        curMimat = ele[10];
        let obj = {mimat:ele[10],position:i,hsa:ele[11]};
        res.push(obj);
    }
    return res;
}

const mimatPos = uniqueMimatNamePos(allDataLines);

console.log("LOADED ",allDataLines.length," data line");
const recommendMIR = mimatPos.map((a)=>{return a.mimat});
const recommendHSA = mimatPos.map((a)=>{return a.hsa});
const mimatSequences = readLines("MIMAT_strip.txt").map((val) => {return val.split("\t");});
console.log("RecommendMIR length:",recommendMIR.length,"- RecommendHSA length:",recommendHSA.length);


// app.get('/miRNA/:mirna', (req, res) => {
//     let i = 0;
//     let mirna = req.params.mirna;
//     for (i = 0; i < mimatPos.length; i++) {
//         if (mimatPos[i].mimat == mirna || mimat[i][1] == mirna)
//             break;
//     }
//     if (i >= mimat.length){
//         return;
//     }
//     let alenC = mimat[i][2].toUpperCase();
//     let alenG = mimat[i][2].toUpperCase();   
//     let obj = {
//         alenC: alenC,
//         alenG: alenG
//     };
//     console.log("got mirna: ", req.params.mirna);
//     //send back the id of the result
//     res.send(obj);
// })
  
async function readResultFile(resId){
    let fileName = resultFileName(resId);
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

app.get('/result/:resid', async (req, res) => {
    let fileName = resultFileName(req.params.resid);
    // Check if the file is readable.
    // console.log("checking file:", fileName);
    const checkRes = await readResultFile(req.params.resid);
    const resObj = JSON.parse(checkRes);
    if (resObj && checkRes.length > 0){
        for (let i = 0; i < resObj.length; i++) {
            resObj[i].diseases = await getKEGGDataOffline(resObj[i].geneId);
        }
    }
    res.send(resObj);
})

function getFocusInMIRFile(mirId){
    const fName = `./mirnadata/${mirId}/${mirId}.tsv`;
    const check = fs.existsSync(fName);
    if (check == false)
        return null
    let res = [];
    const r = readLines(fName).map((val) => {return val.split("\t");});
    r.splice(0,1);
    r.forEach((val)=>{
        if (val[2]!=".")
            res.push(val);
    })
    return res;
}

app.get('/rsidToInfo/:rsId/mimat/:mimat/alterType/:altType', (req, res) => {
    let rsId = req.params.rsId;
    let mId = req.params.mimat;
    let alterType = req.params.altType;
    const path = `rsidToInfo/${rsId}/mimat/${mId}/alterType/${alterType}`;
    console.log(path);
    //resolve for mimat only input
    if (rsId == null || rsId == '' || rsId == 'null' || rsId == 'undefined'){
        for (let i = 0; i < mimatSequences.length; i++) {
            const element = mimatSequences[i];
            if (element[0] != mId)
                continue;
            res.send ({alenC:element[2].toUpperCase()});
            return;
        }
        res.send('null');
        return;
    }

    // resolve for specified ref. SNP and its alternate type
    let start = mimatPosInfo(mId); const end = start.endPosition;
    start = start.basePosition;
    let ind = -1;
    for (let i = start; i < end; i++) {
        const ele = allDataLines[i]
        if (ele[2] == rsId && ele[3] == alterType[0] && ele[4] == alterType[1]){
            ind = i; break
        }
    }
    let obj = null;
    if (ind != -1){
        let alenC = allDataLines[ind][12].toUpperCase();
        let alenG = allDataLines[ind][13].toUpperCase();
        obj = {
            alenC: alenC,
            alenG: alenG
        };
    }
    res.send(obj);
})

function mimatPosInfo(mimat){
    let mIdPos = -1;
    let arrayPos = -1;
    //find the base pos of the mimat type
    for (let i = 0; i < mimatPos.length; i++) {
        const ele = mimatPos[i];
        if (ele.mimat == mimat){
            mIdPos = ele.position;
            arrayPos = i;
        }
    }
    const endPos = mimatPos[arrayPos+1].position;
    return {basePosition: mIdPos,endPosition:endPos};
}

function suggestRsFromMIMAT(mimat){
    // let rawRs = getFocusInMIRFile(mimat);
    let result = [];
    let mIdPos = mimatPosInfo(mimat);
    const endPos = mIdPos.endPosition;
    mIdPos = mIdPos.basePosition;
    // console.log("MID:",mimat,"mIdPost",mIdPos,"end",endPos);
    if (mIdPos == -1)
        return result;
    for (let i = mIdPos; i < endPos; i++) {
        const ele = allDataLines[i];
        isTaking = true
        let rObj = {rsId:ele[2]};
        let altTypes = [];
        altTypes.push({from:ele[3],to:ele[4]});
        for (let j = i+1; j < endPos; j++) {
            const ele2 = allDataLines[j];
            if (ele[2] != ele2[2])
                continue;
            altTypes.push({from:ele2[3],to:ele2[4]});
            i = j;
        }
        rObj.alternateTypes = altTypes;
        // console.log(rObj);
        result.push(rObj);
    }
    return result;
}

app.get('/suggestFromMIMAT/:mirID', (req, res) => {
    let mId = req.params.mirID;
    //check if mirseq exist
    const rsidSuggest = suggestRsFromMIMAT(mId)
    res.send({MIMAT: mId,rsidSuggest});
    //return rs ids in mirseq
})

app.get('/suggestFromHSA/:mirID', (req, res) => {
    let mId = req.params.mirID;
    for (let i = 0; i < recommendHSA.length; i++) {
        if (recommendHSA[i] == mId)
            mId = recommendMIR[i];
    }
    if (mId == req.params.mirId){
        res.send({rsidSuggest: null});
        return;
    }
    const rsidSuggest = suggestRsFromMIMAT(mId);
    res.send({MIMAT: mId,rsidSuggest});
})

app.get('/pathway_filter', (req, res) => {
    res.send({pathwayFilter});
})

app.get('/recommendMIR/:mir', (req, res) => {
    res.send({recommendMIR});
})

app.get('/recommendHSA', (req, res) => {
    res.send({recommendHSA});
})

app.listen(port, () => console.log(`SNP2Pathway app is listening at http://localhost:${port}`))

process.on('uncaughtException', function(err) {
    if(err instanceof SiteWarningError){
        console.log("warning sequence:",err.message);
        getResultFromSequences(err.message);
    }
});  