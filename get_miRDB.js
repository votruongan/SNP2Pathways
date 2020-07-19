const fs = require("fs");
const jsdom = require("jsdom");
const { CONNREFUSED } = require("dns");

async function parseMiRDBData(html,sequence,elementCallback){
    const {JSDOM} = jsdom;
    const dom = new JSDOM(html);
    // console.log(html)
    console.log("parsing result for sequence",sequence,"- element's callback:",elementCallback);
    const $ = (require('jquery'))(dom.window);
    let arr = [];
    // extracting with jquery
    var items = $("tr td");
    for(var i = 0; i < items.length; i++){
        let raw = $(items[i]).html();
        let rank,score,gene,gId,gLink;
        if (raw == '<p align="center"><font size="2"><input type="submit" name=".submit" value="Details"></font></p>'){
            rank = items[i+1].children[0].innerHTML;
            score = items[i+2].children[0].children[0].innerHTML;
            gene = items[i+4].children[0].children[0].innerHTML;
            gId = items[i+4].children[0].children[0].getAttribute("href");
            gId = gId.split("=");
            gId = gId[gId.length - 1];
            gLink = "https://www.genome.jp/dbget-bin/www_bget?hsa:"+ gId;
        }
        if (parseInt(score) < 90)
            break;
        if (rank == undefined || rank == null)
            continue;
        let diseases = [];
        if (elementCallback != null){
            diseases = await elementCallback(gId);
            // console.log("diseases", diseases);
        }
        let obj = {rank,score,gene,geneId:gId,gLink, diseases};
        arr.push(obj);
        // console.log(obj); 
    }
    console.log("writing result for sequence",sequence);
    fs.writeFileSync("./results/"+sequence, JSON.stringify(arr));
    return arr;
}

module.exports = {parseMiRDBData}