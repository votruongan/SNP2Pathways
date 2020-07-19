
// let isUsing = true;

let mimatCode = "";
let allRsSuggest = [];
function usingMiRNA(){
    //enable miRNA panel and disable rs panel
    isUsingRS = false;
}
let alenResHandler = [null,null];

function toggleHandler(ch,seq){
    let index = (ch == "C")?(0):(1);
    if(alenResHandler[index] == null){
        alenResHandler[index] = setInterval(()=>{
            let sxhr = makeXHR("result",seq);
            console.log(">>>",ch,xhr);
            if (ch == "C")
                sxhr.addEventListener("load",setAlenC);
            else
                sxhr.addEventListener("load",setAlenG);
            sxhr.send();
        },2000);
        let xhr = makeXHR("seq",seq);
        xhr.send();
    }
}

function makeALink(){

}

function makeElement(type, data, link=null, style=null){
    var r = document.createElement(type);
    // data.replace("\n","<br/>");
    // var a = document.createTextNode(data);
    if (link != null){
        a = document.createElement('a');
        a.innerText = data;
        a.href = link;
        a.target = "_blank";
        r.appendChild(a);
    } else {
        r.innerHTML = data;
    }
    if (style != null){
        r.style = style;
    }
    return r;
}

function makeRow(data){
    var mainNode = document.createElement("tr");
    mainNode.appendChild(makeElement("td",data.score));
    mainNode.appendChild(makeElement("td",data.gene, data.gLink));
    mainNode.appendChild(makeElement("td",data.diseases.join("\n"),null,"text-align: left;"));
    return mainNode;
}

function makePathwayCheck(pathName){
    var a = [];
}

function setAlenC(){
    let content = this.responseText;
    if (content == "null" || content == "")
        return;
    clearInterval(alenResHandler[0]);
    let data = JSON.parse(content);
    for (let i = 0; i < data.length; i++) {
        // if (data[i].diseases == null || data[i].diseases.length == 0)
        //     continue;
        var r = makeRow(data[i]);
        alenC_result.appendChild(r);                
    }
    alenResHandler[0]= null;
    // loadingPanel.classList.remove("d-block");
    // loadingPanel.classList.add("d-none");
}
function setAlenG(){
    let content = this.responseText;
    if (content == "null" || content == "")
        return;
    clearInterval(alenResHandler[1]);
    let data = JSON.parse(content);
    for (let i = 0; i < data.length; i++) {
        var r = makeRow(data[i]);
        alenG_result.appendChild(r);                
    }
    alenResHandler[1]= null;
    // loadingPanel.classList.remove("d-block");
    // loadingPanel.classList.add("d-none");
}

function rsReturnProcessor(){
    let obj = JSON.parse(this.responseText);
    alenC_display.innerHTML = obj.alenC;
    alenG_display.innerHTML = obj.alenG;
    alenC_result.textContent = '';
    alenG_result.textContent = '';
    // loadingPanel.classList.remove("d-none");
    // loadingPanel.classList.add("d-block");
    alenResHandler.forEach(ele => ele && clearInterval(ele));
    alenResHandler = [null,null];
    toggleHandler("C", obj.alenC);
    toggleHandler("G", obj.alenG);
}

//rs ids returned from the mir
function mirReturnProcessor(){
    let obj = JSON.parse(this.responseText);
    allRsSuggest = obj.rsidSuggest;
    rsSuggest = allRsSuggest.map((val)=>{return val.rsId});
    mimatCode = obj.MIMAT;
    return console.log(rsSuggest);
}

//suggest alt. type from rsid
function suggestAlternateFromRs(){
    console.log('suggestAlternateFromRs');
    console.log(rsid.value);
    const rsVal = rsid.value;
    // loop through rsSuggest
    let altTypes = null;
    allRsSuggest.forEach(element => {
        if (element.rsId == rsVal){
            altTypes = element.alternateTypes;
        }
    });
    if (altTypes == null)
        setTimeout(suggestAlternateFromRs,150);
    makeAlternateSuggestions(altTypes);
    return console.log( altTypes);
}


async function sendMIR(){
    let mircode = miRNAHeader.value + getEle("miRNA").value;
    const m = miRNAHeader.value;
    // return console.log(mircode);
    const reqPath = (m == "MIMAT")?("suggestFromMIMAT"):("suggestFromHSA");
    console.log(reqPath,mircode);
    let xhr = makeXHR(reqPath,mircode);
    xhr.addEventListener("load", mirReturnProcessor);
    xhr.send();
}

async function sendRS(){
    let rscode = rsid.value;
    // return console.log(mircode);
    const path = `rsidToInfo/${rscode}/mimat/${mimatCode}/alterType/${alterType.value}`;
    // console.log(path);
    let xhr = makeXHR(path);
    xhr.addEventListener("load", rsReturnProcessor);
    xhr.send();
    console.log("sent rs request", path);
}


rsid.addEventListener("focusout",suggestAlternateFromRs);
miRNA.addEventListener("focusout",sendMIR);
processButton.addEventListener("click",sendRS);

