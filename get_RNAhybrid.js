const util = require('util');
const rp = util.promisify(require('request'));
const fs = require('fs');
const {sleep} =require('./helper');



const testTarget = '>FZD4-201 utr3:protein_coding\nGGCTAGTCAGCCTCCATGCTTTCTTCATTTTGAAGGGGGGAATGCCAGCATTTTGGAGGAAATTCTACTAAAAGTTTTATGCAGTGAATCTCAGTTTGAACAAACTAGCAACAATTAAGTGACCCCCGTCAACCCACTGCCTCCCACCCCGACCCCAGCATCAAAAAACCAATGATTTTGCTGCAGACTTTGGAATGATCCAAAATGGAAAAGCCAGTTAGAGGCTTTCAAAGCTGTGAAAAATCAAAACGTTGATCACTTTAGCAGGTTGCAGCTTGGAGCGTGGAGGTCCTGCCTAGATTCCAGGAAGTCCAGGGCGATACTGTTTTCCCCTGCAGGGTGGGATTTGAGCTGTGAGTTGGTAACTAGCAGGGAGAAATATTAACTTTTTTAACCCTTTACCATTTTAAATACTAACTGGGTCTTTCAGATAGCAAAGCAATCTATAAACACTGGAAACGCTGGGTTCAGAAAAGTGTTACAAGAGTTTTATAGTTTGGCTGATGTAACATAAACATCTTCTGTGGTGCGCTGTCTGCTGTTTAGAACTTTGTGGACTGCACTCCCAAGAAGTGGTGTTAGAATCTTTCAGTGCCTTTGTCATAAAACAGTTATTTGAACAAACAAAAGTACTGTACTCACACACATAAGGTATCCAGTGGATTTTTCTTCTCTGTCTTCCTCTCTTAAATTTCAACATCTCTCTTCTTGGCTGCTGCTGTTTTCTTCATTTTATGTTAATGACTCAAAAAAGGTATTTTTATAGAATTTTTGTACTGCAGCATGCTTAAAGAGGGGAAAAGGAAGGGTGATTCACTTTCTGACAATCACTTAATTCAGAGGAAAATGAGATTTACTAAGTTGACTTACCTGACGGACCCCAGAGACCTATTGCATTGAGCAGTGGGGACTTAATATATTTTACTTGTGTGATTGCATCTATGCAGACGCCAGTCTGGAAGAGCTGAAATGTTAAGTTTCTTGGCAACTTTGCATTCACACAGATTAGCTGTGTAATTTTTGTGTGTCAATTACAATTAAAAGCACATTGTTGGACCATGACATAGTATACTCAACTGACTTTAAAACTATGGTCAACTTCAACTTGCATTCTCAGAATGATAGTGCCTTTAAAAATTTTTTTATTTTTTAAAGCATAAGAATGTTATCAGAATCTGGTCTACTTAGGACAATGGAGACTTTTTCAGTTTTATAAAGGGAACTGAGGACAGCTAATCCAACTACTTGGTGCGTAATTGTTTCCTAGTAATTGGCAAAGGCTCCTTGTAAGATTTCACTGGAGGCAGTGTGGCCTGGAGTATTTATATGGTGCTTAATGAATCTCCAGAATGCCAGCCAGAAGCCTGATTGGTTAGTAGGGAATAAAGTGTAGACCATATGAAATGAACTGCAAACTCTAATAGCCCAGGTCTTAATTGCCTTTAGCAGAGGTATCCAAAGCTTTTAAAATTTATGCATACGTTCTTCACAAGGGGGTACCCCCAGCAGCCTCTCGAAAATTGCACTTCTCTTAAAACTGTAACTGGCCTTTCTCTTACCTTGCCTTAGGCGTTCTAATCATGAGATCTTGGGGACAAATTGACTATGTCACAGGTTGCTCTCCTTGTAACTCATACCTGTCTGCTTCAGCAACTGCTTTGCAATGACATTTATTTATTAATTCATGCCTTAAAAAAATAGGAAGGGAAGCTTTTTTTTTTCTTTTTTTTTTTTTCAATCACACTTTGTGGAAAAACATTTCCAGGGACTCAAAATTCCAAAAAGGTGGTCAAATTCTGGAAGTAAGCATTTCCTCTTTTTTAAAAATTTGGTTTGAGCCTTATGCCCATAGTTTGACATTTCCCTTTCTTCTTTCCTTTTTGTTTTTGTGTGGTTCTTGAGCTCTCTGACATCAAGATGCATGTAAAGTCGATTGTATGTTTTGGAAGGCAAAGTCTTGGCTTTTGAGACTGAAGTTAAGTGGGCACAGGTGGCCCCTGCTGCTGTGCCCAGTCTGAGTACCTTGGCTAGACTCTAGGTCAGGCTCCAGGAGCATGAGAATTGATCCCCAGAAGAACCATTTTAACTCCATCTGATACTCCATTGCCTATGAAATGTAAAATGTGAACTCCCTGTGCTGCTTGTAGACAGTTCCCATAACTGTCCACGGCCCTGGAGCACGCACCCAGGGGCAGAGCCTGCCCTTACTCACGCTCTGCTCTGGTGTCTTGGGAGTTGTGCAGGGACTCTGGCCCAGGCAGGGGAAGGAAGACCAGGCGGTAGGGGACTGGTCTTGCTGTTAGAGTATAGAGGTTTGTAATGCAGTTTTCTTCATAATGTGTCAGTGATTGTGTGACCAAGGCAGCATCTAGCAGAAAGCCAGGCATGGAGTAGGTGATCGATACTTGTCAATGACTAAATAATAACAATAAAAGAGCACTTGGGTGAATCTGGGCACCTGATTTCTGAGTTTTGAGTTCTGGAGCTAGTGTTTTGACAATGCTTTGGGTTTTGACATGCCTTTTCCACAAATCTCTTGCCTTTTCAGGGCAAAGTGTATTTGATCAGAAGTGGCCATTTGGATTAGTAGCCTTAGCAATGCTACAGGGTTATAGGCCTCTCCTTTCACATTCCAGACAATGGAGAGTGTTTATGGTTTCAGGAAAAGAACTTTGTGGCTGAGGGGTCAGTTACCAGTGACCTTCAATCAACTCCATCACTTCTTAAATCGGTATTTGTTAAAAAAATCAGTTATTTTATTTATTGAGTGCCGACTGTAGTAAAGCCCTGAAATAGATAATCTCTGTTCTTCTAACTGATCTAGGATGGGGACGCACCCAGGTCTGCTGAACTTTACTGTTCCTCTGGGAAAGGAGCAGGGACCTCTGGAATTCCCATCTGTTTCACTGTCTCCATTCCATAAATCTCTTCCTGTGTGAGCCACCACACCCAGCCTGGGTCTCTCTACTTTTAACACATCTCTCATCCCTTTCCCAGGATTCCTTCCAAGTCAGTTACAGGTGGTTTTAACAGAAAGCATCAGCTCTGCTTCGTGACAGTCTCTGGAGAAATCCCTTAGGAAGACTATGAGAGTAGGCCACAAGGACATGGGCCCACACATCTGCTTTGGCTTTGCCGGCAATTCAGGGCTTGGGGTATTCCATGTGACTTGTATAGGTATATTTGAGGACAGCATCTTGCTAGAGAAAAGGTGAGGGTTGTTTTTCTTTCTCTGAAACCTACAGTAAATGGGTATGATTGTAGCTTCCTCAGAAATCCCTTGGCCTCCAGAGATTAAACATGGTGCAATGGCACCTCTGTCCAACCTCCTTTCTGGTAGATTCCTTTCTCCTGCTTCATATAGGCCAAACCTCAGGGCAAGGGAACATGGGGGTAGAGTGGTGCTGGCCAGAACCATCTGCTTGAGCTACTTGGTTGATTCATATCCTCTTTCCTTTATGGAGACCCATTTCCTGATCTCTGAGACTGTTGCTGAACTGGCAACTTACTTGGGCCTGAAACTGGAGAAGGGGTGACATTTTTTTAATTTCAGAGATGCTTTCTGATTTTCCTCTCCCAGGTCACTGTCTCACCTGCACTCTCCAAACTCAGGTTCCGGGAAGCTTGTGTGTCTAGATACTGAATTGAGATTCTGTTCAGCACCTTTTAGCTCTATACTCTCTGGCTCCCCTCATCCTCATGGTCACTGAATTAAATGCTTATTGTATTGAGAACCAAGATGGGACCTGAGGACACAAAGATGAGCTCAACAGTCTCAGCCCTAGAGGAATAGACTCAGGGATTTCACCAGGTCGGTGCAGTATTTGATTTCTGGTGAGGTGACCACAGCTGCAGTTAGGGAAGGGAGCCATTGAGCACAGACTTTGGAAGGAACCTTTTTTTTGTTGTTTGTTTGTTTGTTTGTTTGTTTGTTTGTTTGAGACAGGGTCTTGCTCTGTCACCCAGGCTGGGGCGCAATGGCACGATCTTGGCTCACTGCAACCTCTGCCTCCTGGGTTCAAGTGATTCTCCTGCCACAGCCTCCTGAGGAGCTGGGACTACAGGTGCGTGCTACCACGCCCAGCTACTTCTGTATTTTTAGTAGAGACGGGGTTTCACTGTGTTGGCCAGGCTGGTCTCGAACTCCTGACCTCATGATCTGCCCGCCTCAGCCTCCCAAAGTGCTGGGATTACAAGTGTGAGCCACCACACCTGGCCTGGAAGGAACCTCTTAAAATCAGTTTACGTCTTGTATTTTGTTCTGTGATGGAGGACACTGGAGAGAGTTGCTATTCCAGTCAATCATGTCGAGTCACTGGACTCTGAAAATCCTATTGGTTCCTTTATTTTATTTGAGTTTAGAGTTCCCTTCTGGGTTTGTATTATGTCTGGCAAATGACCTGGGTTATCACTTTTCCTCCAGGGTTAGATCATAGATCTTGGAAACTCCTTAGAGAGCATTTTGCTCCTACCAAGGATCAGATACTGGAGCCCCACATAATAGATTTCATTTCACTCTAGCCTACATAGAGCTTTCTGTTGCTGTCTCTTGCCATGCACTTGTGCGGTGATTACACACTTGACAGTACCAGGAGACAAATGACTTACAGATCCCCCGACATGCCTCTTCCCCTTGGCAAGCTCAGTTGCCCTGATAGTAGCATGTTTCTGTTTCTGATGTACCTTTTTTCTCTTCTTCTTTGCATCAGCCAATTCCCAGAATTTCCCCAGGCAATTTGTAGAGGACCTTTTTGGGGTCCTATATGAGCCATGTCCTCAAAGCTTTTAAACCTCCTTGCTCTCCTACAATATTCAGTACATGACCACTGTCATCCTAGAAGGCTTCTGAAAAGAGGGGCAAGAGCCACTCTGCGCCACAAAGGTTGGGTCCATCTTCTCTCCGAGGTTGTGAAAGTTTTCAAATTGTACTAATAGGCTGGGGCCCTGACTTGGCTGTGGGCTTTGGGAGGGGTAAGCTGCTTTCTAGATCTCTCCCAGTGAGGCATGGAGGTGTTTCTGAATTTTGTCTACCTCACAGGGATGTTGTGAGGCTTGAAAAGGTCAAAAAATGATGGCCCCTTGAGCTCTTTGTAAGAAAGGTAGATGAAATATCGGATGTAATCTGAAAAAAAGATAAAATGTGACTTCCCCTGCTCTGTGCAGCAGTCGGGCTGGATGCTCTGTGGCCTTTCTTGGGTCCTCATGCCACCCCACAGCTCCAGGAACCTTGAAGCCAATCTGGGGGACTTTCAGATGTTTGACAAAGAGGTACCAGGCAAACTTCCTGCTACACATGCCCTGAATGAATTGCTAAATTTCAAAGGAAATGGACCCTGCTTTTAAGGATGTACAAAAGTATGTCTGCATCGATGTCTGTACTGTAAATTTCTAATTTATCACTGTACAAAGAAAACCCCTTGCTATTTAATTTTGTATTAAAGGAAAATAAAGTTTTGTTTGTTA';

const testMirna = ">MIMAT0004608\nCCUGUGAAAUUCAGUUCUUCAG"



function firstSplitter(str){
    let ind = str.indexOf(' ');
    ind = (ind < 0)?(str.length):(ind);
    if (str.indexOf('\n') < ind){
        ind = str.indexOf('\n');
    }
    ind = (ind < 0)?(str.length):(ind);
    return ind;
}


function makeImgName(targetHeader,mirnaHeader,position,needTrimHeader=false){
    if (needTrimHeader){
        targetHeader = targetHeader.substr(1,firstSplitter(targetHeader) - 1);
        mirnaHeader = mirnaHeader.substr(1,firstSplitter(mirnaHeader) - 1);
    }
    position = position.toString();
    return `${targetHeader}_${mirnaHeader}_${position}.png`;
}

async function getImage(jobId,targetHeader,mirnaHeader,position,needTrimHeader=false){
    const fName = makeImgName(targetHeader,mirnaHeader,position,needTrimHeader);
    const headers = {
        'Connection': 'keep-alive',
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
    };
    const opt = {
        url: `https://bibiserv.cebitec.uni-bielefeld.de/spool?id=${jobId}&name=${fName}&tool=rnahybrid&contenttype=image/png`,
        headers: headers,
        encoding: null
    };
    const res = await rp(opt);
    // console.log(res.body);
    return res.body;
}

const headers = {
    'Content-Type': 'application/json'
};

const idUrl = 'rest/rnahybrid/rnahybrid_function_rnahybrid/request';
const statusUrl = 'rest/rnahybrid/rnahybrid_function_rnahybrid/statuscode';
const resultUrl = 'https://bibiserv.cebitec.uni-bielefeld.de/rest/rnahybrid/rnahybrid_function_rnahybrid/response';

const options = {
    url: 'https://bibiserv.cebitec.uni-bielefeld.de/',
    method: 'POST',
    headers: headers
};

function insertString(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function splitLongRNAToFasta(rna){
    const header = rna.substr(0,rna.indexOf('\n'));
    let workingArea = rna.substr(rna.indexOf('\n')+1);
    let i = 1
    for (i = 1; i < workingArea.length; i++) {
        if (i*80 > workingArea.length){
            break;
        }
        workingArea = insertString(workingArea,i*80+i-1,'\n');
    }
    if (workingArea[workingArea.length-1] != '\n'){
        workingArea = insertString(workingArea,workingArea.length,'\n');
    }
    return header +'\n' + workingArea;
}
async function getResultId(target,mirna) {
    console.log("getResultId");
    const opt = JSON.parse(JSON.stringify(options));
    opt.url += idUrl;
    const reqObject = {
        "rnahybrid_input_target_rna_sequences_":splitLongRNAToFasta(target),
        "rnahybrid_input_mirna_sequences" : splitLongRNAToFasta(mirna),
        "paramset":{
            "rnahybrid_parameter_approximate_pvalue":"human",
            "rnahybrid_parameter_generate_graphics":"true"
        }
    };
    opt.body = JSON.stringify(reqObject);
    // console.log(opt.body)
    const res = await rp(opt);
    console.log("getResultId");
    // console.log(res.body);
    return res.body;
}

async function getResult(jobId){
    console.log("getResult");
    const opt = JSON.parse(JSON.stringify(options));
    opt.url += statusUrl;
    opt.headers['Content-Type'] = 'text/plain';
    opt.body = jobId;
    let res = await rp(opt);
    console.log("rnaHybrid code:", res.body);
    while (res.body.toString() != '600'){
        if (parseInt(res.body.toString()) >= 700){
            return null;
        }
        await sleep(2000);
        res = await rp(opt);
        console.log(jobId,"- rnaHybrid code:", res.body);
    }
    opt.url = resultUrl;
    const finalRes = await rp(opt);
    return finalRes.body;
}

async function get_rnaHybrid(target,mirna){
    const jobId = await getResultId(target,mirna);
    if (jobId == null || jobId.length < 1) return null;
    const rstring = await getResult(jobId);
    if (rstring == null) return null;
    console.log(rstring);
    //calculate the position rnahybrid returned
    const spos = rstring.indexOf('position ')+10;
    const len = rstring.indexOf('\n',spos)-spos;
    const position = rstring.substr(spos,len);
    // console.log("rnahybrid position:",spos,len,position)
    const img = await getImage(jobId,target,mirna,position,true);
    const buf = new Buffer(img);
    const fName = makeImgName(target,mirna,position,true);
    write_rnaHybrid_html(rstring,fName);
    fs.writeFile('./assets/rnaHybrid/img/'+fName,buf,()=>{});
    return fName;
}
async function write_rnaHybrid_html(result,fName){
    //make html
    const t1 = "!!! result !!!";
    const t2 = "!!! image !!!"
    let htmlStr = fs.readFileSync("./assets/rnaHybrid/template.html",{encoding:'utf-8'});
    htmlStr = htmlStr.replace(t1,result);
    htmlStr = htmlStr.replace(t2,'../img/'+fName);
    fs.writeFile('./assets/rnaHybrid/html/'+fName.substr(0,fName.length-3)+"html",htmlStr,()=>{});
}


const gs = require('ghostscript4js');

async function convertPsToPDF(fileName){
    const inpFile = `./rnaHybrid/${fileName}.ps`
    fs.exists(inpFile,()=>{
        try {
            // Take decision based on Ghostscript version
            const version = gs.version()
            // redo the bounding box
            const content = fs.readFileSync(inpFile,{encoding:'utf-8'}).split('\n');
            const toReplace = content.indexOf('%%BoundingBox: (atend)');
            if (toReplace){
                content[toReplace] = content[content.length-3];
            }
            fs.writeFileSync(inpFile,content.join('\n'));
            gs.executeSync(`-sDEVICE=pngalpha -o ./assets/img/rnaHybrid/${fileName}.png -sDEVICE=pngalpha -r144 -dEPSCrop ${inpFile}`);
        } catch (err) {
            // Handle error
            throw err
        }    
    })
}

module.exports = {get_rnaHybrid, convertPsToPDF,splitLongRNAToFasta, testTarget, testMirna}

// convertPsToPDF("F13D11.2.1-F13D11.2.1_cel-let-7_1");

// getRNAHybrid()