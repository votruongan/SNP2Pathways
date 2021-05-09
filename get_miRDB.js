const fs = require("fs");
const jsdom = require("jsdom");
const querystring = require('querystring');
const { makeRequest, readLines } = require('./helper');

function resultFileName(resId){
    return "./results/"+resId.substr(0,2)+"/"+resId;
}

function getValue(str){
    const lastIndex = str.indexOf('"  />');
    const startIndex = str.indexOf('value=')+7;
    return str.substr(startIndex, lastIndex - startIndex);
}

async function parseMirdbNew(data, sequence,elementCallback=null){
    const allLines = data.split("\n");
    console.log("parsing result for sequence",sequence,"- element's callback:",elementCallback);
    let ranking  = 1;
    const arr = [];
    for (let i = 0; i < allLines.length; i++) {
        const ele = allLines[i];
        const obj = {};
        if (ele.includes('action="/cgi-bin/custom_predict/customDetail.cgi"')){
            const shorts = allLines[i].split('input type="hidden"');
            obj.rank = ranking++;
            obj.score = getValue(shorts[1]);
            obj.gId = getValue(shorts[3]);
            obj.gene = getValue(shorts[4]);
            obj.nmFile = getValue(shorts[5]);
            // obj.gLink = "https://www.genome.jp/dbget-bin/www_bget?hsa:"+ obj.gId;
        }
        if (parseInt(obj.score) < 50)
            break;
        if (obj.rank == undefined || obj.rank == null)
            continue;
        // -- no disease needed to store.
        // if (elementCallback != null){
        //     obj.diseases = await elementCallback(gId);
        //     // console.log("diseases", diseases);
        // }
        // let obj = {rank,score,gene,geneId:gId,gLink, diseases};
        arr.push(obj);
    }
    console.log("writing result for sequence",sequence);
    if (sequence == "") return arr;
    fs.writeFileSync(resultFileName(sequence), JSON.stringify(arr));
    return arr;
}


// async function parseMiRDBData(html,sequence,elementCallback){
//     const {JSDOM} = jsdom;
//     const dom = new JSDOM(html);
//     // console.log(html)
//     console.log("parsing result for sequence",sequence,"- element's callback:",elementCallback);
//     const $ = (require('jquery'))(dom.window);
//     let arr = [];
//     // extracting with jquery
//     var items = $("tr td");
//     for(var i = 0; i < items.length; i++){
//         let raw = $(items[i]).html();
//         let rank,score,gene,gId,gLink;
//         if (raw == '<p align="center"><font size="2"><input type="submit" name=".submit" value="Details"/></font></p>'){
//             rank = items[i+1].children[0].innerHTML;
//             score = items[i+2].children[0].children[0].innerHTML;
//             gene = items[i+4].children[0].children[0].innerHTML;
//             gId = items[i+4].children[0].children[0].getAttribute("href");
//             gId = gId.split("=");
//             gId = gId[gId.length - 1];
//             gLink = "https://www.genome.jp/dbget-bin/www_bget?hsa:"+ gId;
//         }
//         if (parseInt(score) < 50)
//             break;
//         if (rank == undefined || rank == null)
//             continue;
//         let diseases = [];
//         if (elementCallback != null){
//             diseases = await elementCallback(gId);
//             // console.log("diseases", diseases);
//         }
//         let obj = {rank,score,gene,geneId:gId,gLink, diseases};
//         arr.push(obj);
//         // console.log(obj); 
//     }
//     console.log("writing result for sequence",sequence);
//     if (sequence == "") return arr;
//     fs.writeFileSync(resultFileName(sequence), JSON.stringify(arr));
//     return arr;
// }


function getMiRDBResult(content,sequence){
    //resolve from content
    let pos = content.indexOf("fileName");
    if (pos == -1)
        return;
    let fName = content.substring(pos+17,content.indexOf("/>",pos+17));
    fName = fName.split('"')[0];
    console.log("fileName: ",fName);
    
    const postData = querystring.stringify({
        'fileName': fName,
        '.submit': 'Retrieve Prediction Result',
    });
    let fullBody = "";
    const dat = (chunk) => {
        // console.log("got chunk");
        fullBody += chunk;
    };
    const en = (chunk) => {
        //process fullBody   
        // console.log("got end");
        parseMirdbNew(fullBody,sequence);
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
    makeRequest(options,dat,en);
}

async function main (){
    const a = fs.readFileSync("mirdb_example.html",{encoding:"utf-8"});
    const b = await parseMirdbNew(a);
    console.log(a.length);
    return console.log(b);
    console.log(Object.keys(b));
}

// main();

module.exports = {resultFileName, getMiRDBResult, parseMirdbNew}