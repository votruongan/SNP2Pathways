var request = require('request');
const {readLines} = require('./helper');
const { has } = require('lodash');
const allOfflineKEGG = readLines('./gene_pathways.tsv').map((val) => {return val.split("\t");});
let hashedMap = {};

function hashTheGeneId(geneId){
    if(geneId == undefined || geneId == "undefined")
        return undefined;
    let sum = 0;
    for (let i = 0; i < geneId.length; i++) {
        sum += geneId.charCodeAt(i);
    }
    return sum;
    // return geneId.toString().length;
}
function hashTheGene(gene){
    if(gene == undefined)
        return undefined;
    if (!hashedMap.hasOwnProperty(gene[0])){
        return undefined;
    }
    return gene[0];
}
// put all offline data to hashed
allOfflineKEGG.forEach((val)=>{
    if (val == "undefined" || val == undefined)
        return;
    const h = hashTheGeneId(val[0]);
    if (hashedMap[h] == null)
        hashedMap[h] = []
    hashedMap[h].push(val);
});

console.log("LOADED",allOfflineKEGG.length,"offline KEGG -",allOfflineKEGG[0].length,"data colum");


var headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9'
};

async function getKEGGData(geneId){
    var options = {
        url: 'http://rest.kegg.jp/get/hsa:'+geneId,
        headers: headers
    };
    return new Promise((resolve,reject)=>{
        request(options, (er,resp,body)=>{
            if (er || body.includes("PATHWAY") == false){
                // console.log(er,resp.statusCode,body);
            }
            let all = body.split("\n");
            let diseases = [];
            let takeFlag = false;
            for (let i = 0; i < all.length; i++) {
                const ele = all[i];
                if (takeFlag){
                    if(ele[0] != " "){
                        break;
                    }
                    diseases.push(ele.substr(12));
                }
                if (!takeFlag && ele.includes("PATHWAY")){
                    diseases.push(ele.substr(12));
                    takeFlag = true;
                }
            }
            resolve(diseases);
        });
    });   
}

async function getKEGGDataOffline(geneId){
    return new Promise((resolve,reject)=>{
        let res = [];
        console.log("getKEGGDataOffline", geneId);
        const h = hashTheGeneId(geneId);
        if (h == undefined || hashedMap[h] == undefined)
            resolve(res);
        console.log("KEGG Offline:",geneId,h);
        for (let i = 0; i < hashedMap[h].length; i++) {
            const ele = hashedMap[h][i];
            if (ele[0] == geneId){
                console.log(ele);
                res = ele[5].split('&');
                break;
            }
        }
        resolve(res);
    });   
}

module.exports = {getKEGGData, getKEGGDataOffline}