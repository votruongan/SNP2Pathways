const fs = require("fs");

function getValue(str){
    const lastIndex = str.indexOf('"  />');
    const startIndex = str.indexOf('value=')+7;
    return str.substr(startIndex, lastIndex - startIndex);
}

async function parseMirdbNew(data, sequence,elementCallback=null){
    const allLines = data.split("\n");
    // fs.writeFileSync("zData.txt" + Date.now(),data);
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
        arr.push(obj);
    }
    console.log("writing result for sequence",sequence);
    if (sequence == "") return arr;
    fs.writeFileSync(sequence, JSON.stringify(arr));
    return arr;
}

const data = fs.readFileSync('zData1620526460970.html', {encoding:'utf-8'});

parseMirdbNew(data,'UUGGGAUAUACUUAUGCUAAA');