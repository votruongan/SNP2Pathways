
// let isUsing = true;
let mimatCode = "";
let allRsSuggest = [];
function usingMiRNA(){
    //enable miRNA panel and disable rs panel
    isUsingRS = false;
}
let alenResHandler = [null,null];
let all_pathway_filter = [];
let pathway_filter = [];
let isResolveForMIMAT = false;

let rsProccessTimestamp = null;

setObjectVisiblity(btnToggleRemove,false);

function toggleHandler(ch,seq){
    let index = (ch == "C")?(0):(1);
    if(alenResHandler[index] == null){
        alenResHandler[index] = setInterval(()=>{
            let sxhr = makeXHR("result",seq);
            console.log(">>>",ch,xhr);
            if (ch == "C")
                sxhr.addEventListener("load",function(){setAlenC(this.responseText,true)});
            else
                sxhr.addEventListener("load",function(){setAlenG(this.responseText,true)});
            sxhr.send();
        },5000);
        let xhr = makeXHR("seq",seq);
        xhr.send();
    }
}

function makeElement(type, data, options=null){
    const link = options&& options.link;
    const style = options&&options.style;
    var r = document.createElement(type);
    // data.replace("\n","<br/>");
    // var a = document.createTextNode(data);
    if (options && options.onclick){
        r.onclick = options.onclick
    }
    if (link != null){
        a = document.createElement('a');
        a.innerText = data;
        a.href = 'https://www.ncbi.nlm.nih.gov/gene/' + link;
        a.target = "_blank";
        r.appendChild(a);
    } else {
        r.innerHTML = data;
    }
    if (options && options.type !=null){
        r.setAttribute("type", options.type);
    }
    if (style != null){
        // console.log("Making class for ",type,style)
        r.classList.add(style);
    }
    return r;
}

function makeDiseaseDisplay(val){
    return val.name+` <a target="_blank" href="${pathway_link_prefix}${val.id}">[${val.id}]</a>`;
}

function makeResultRow(data){
    var mainNode = document.createElement("tr");
    mainNode.appendChild(makeElement("td",data.score,{onclick:showRnaHybrid}));
    mainNode.appendChild(makeElement("td",data.gene,{link:data.gId, onclick:function(ev){ev.stopPropagation();}}));
    mainNode.appendChild(makeElement("input",data.nmFile,{type:"hidden"}));
    const ds = data.diseases.map(val=>makeDiseaseDisplay(val)).join("\n");
    mainNode.appendChild(makeElement("td",ds,{style:"text-left"}));
    // mainNode.onclick = showRnaHybrid; 
    return mainNode;
}

function setGrandParentHeight(target,value){
    target.parentNode.parentNode.style.height = value;
}

currentC_array = []
currentG_array = []
currentCommon_array = []

function tableDisplayResult(tableId,arr){
    tableId.textContent="";
    grandParent(tableId).parentNode.children[0].children[0].children[0].innerHTML = `(${arr.length})`
    if (arr.length == 0){
        setGrandParentHeight(tableId,"100px");
        tableId.innerHTML = "<th><td></td><td>No result</td></th>";
        return;
    }
    setGrandParentHeight(tableId,"290px");
    arr = filterDiseasesInArray(arr);
    for (let i = 0; i < arr.length; i++) {
        var r = makeResultRow(arr[i]);
        tableId.appendChild(r);                
    }
}

function filterDiseasesInArray(objArray){
    let data = objArray;
    for (let i = 0; i < data.length; i++) {
        const ele = data[i];
        if (ele.diseases == undefined)
            continue;
        let j = 0;
        while(j < ele.diseases.length){
            const dele = ele.diseases[j++];
            if (!pathway_filter.includes(dele.name)){
                // console.log(dele.name)
                ele.diseases.splice(--j,1);
                // console.log(ele.diseases)
            }
        }    
    }
    return data;
}

function dataObjectToString(arrObj){
    let s = "", p = "";
    for (let i = 0; i < arrObj.diseases.length; i++) {
        const ele = arrObj.diseases[i];
        p += `[${ele.id}]${ele.name}`;
        if (i < arrObj.diseases.length - 1)
            p += ',';
    }
    s = `${arrObj.rank}\t${arrObj.score}\t${arrObj.gId}\t${arrObj.gene}\t${arrObj.nmFile}\t${p}`;
    return s;
}

function dataArrayToTsvString(arr){
    let b =[];
    for (let i = 0; i < arr.length; i++) {
        const ele = arr[i];
        b.push(dataObjectToString(ele));
    }
    return b.join('\n');
}

function exportDataToTSV(arr,fileName){
    const d = dataArrayToTsvString(arr);
    const dLink = document.createElement("a");
    dLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(d);
    dLink.setAttribute('download', fileName);
    dLink.click();
    dLink.parentNode.removeChild(dLink);
}

function parseDiseaseString(str){
    const beginName = str.indexOf("[");
    const endName = str.indexOf("]");
    let dis = {};
    dis.id = str.substring(0,beginName);
    dis.name = str.substring(beginName+1,endName);
    return dis;
}

function parseDiseasesInAll(arr){
    for (let i = 0; i < arr.length; i++) {
        arr[i].diseases = arr[i].diseases.map(val => parseDiseaseString(val));
    }
    return arr;
}

function setAlenTableHeight(height){
    setGrandParentHeight(alenG_result,height);
    setGrandParentHeight(alenC_result,height);
}

function setAlenResult(content,resultDisplayer,currentIndex,parseDiseases,removeSimilar=false){
    const oppositeIndex = (currentIndex == 1)?(0):(1);
    clearInterval(alenResHandler[currentIndex]);
    alenResHandler[currentIndex]= null;
    resultDisplayer.innerHTML = "<th><td></td><td>No result</td></th>";
    if (content == "null" || content == null || content == "")
        return;
    let data = JSON.parse(content);
    console.log(data);
    if (parseDiseases){
        data = parseDiseasesInAll(data);
        raw_result[currentIndex] = JSON.parse(JSON.stringify(data));
        console.log(raw_result[currentIndex]);
    }
    if (data.length > 0)
        resultDisplayer.textContent = "";
    if (isResolveForMIMAT){
        console.log('isResolveForMIMAT')
        result_array[currentIndex] = data;
        tableDisplayResult(alenC_result,data);
        clearTimeout(notiTimeHandle);
        setObjectVisiblity(loadingPanel, false, "d-flex");
        setGrandParentHeight(common_result_display,"100px");
        setAlenTableHeight('450px');
        setObjectVisiblity(delay15Seconds,false);
        return;
    }
    if (result_array[oppositeIndex].length <= 0){
        result_array[currentIndex] = data;
        return;
    }
    setObjectVisiblity(btnToggleRemove,true);
    let i = 0;
    common_result = [];
    while(i < data.length){
        const dele = data[i++];
        for (let j = 0; j < result_array[oppositeIndex].length; j++) {
            const rele = result_array[oppositeIndex][j];
            if (dele.gene == rele.gene){
                common_result.push(dele);
                if (removeSimilar){
                    result_array[oppositeIndex].splice(j,1);
                    data.splice(--i,1);
                }
                break;
            }
        }           
    }
    result_array[currentIndex] = data;
    tableDisplayResult(alenC_result,result_array[0]);
    tableDisplayResult(alenG_result,result_array[1]);
    tableDisplayResult(common_result_display,common_result);
    if (result_array[0].length + result_array[1].length == 0){
        setGrandParentHeight(common_result_display,"450px");
    }
    if (common_result.length == 0){
        setAlenTableHeight('450px');
    }
    if (notiTimeHandle){
        clearTimeout(notiTimeHandle);
        notiTimeHandle = null;
    }
    setObjectVisiblity(delay15Seconds,false);
    setObjectVisiblity(loadingPanel, false, "d-flex");
}

function setAlenC(data,isbegin=false, removeSimilar=false){
    if (data==null || data==""){
        console.log("data is null - alenResHandler:",alenResHandler);
        return;
    }
    setAlenResult(data,alenG_result,0,parseDiseases=isbegin, removeSimilar);
}
function setAlenG(data,isbegin=false, removeSimilar=false){
    if (data==null || data==""){
        console.log("data is null - alenResHandler:",alenResHandler);
        return;
    }
    setAlenResult(data,alenG_result,1,parseDiseases=isbegin,removeSimilar);
}

let isRemoveSimilar = false;
function toggleRemoveSimilarGene(){
    isRemoveSimilar = !isRemoveSimilar;
    setObjectVisiblity(loadingPanel,true,"d-flex");
    btnToggleRemove.innerText = (isRemoveSimilar)?("Keep same target genes"):("Remove same target genes");
    resetResultDisplay();
    if (raw_result[0].length > 0)
        setAlenC(JSON.stringify(raw_result[0]),false,isRemoveSimilar);
    if (raw_result[1].length > 0)
        setAlenG(JSON.stringify(raw_result[1]),false,isRemoveSimilar);
}

let notiTimeHandle = null;

function rsReturnProcessor(){
    let obj = JSON.parse(this.responseText);
    let realObj = JSON.parse(this.responseText);
    console.log(obj);
    notiTimeHandle = setTimeout(()=>{
        setObjectVisiblity(loadingPanel,false,"d-flex");
        setObjectVisiblity(notificationPanel,true,"focus");
    },5*60*1000);
    alenC_display.innerText = realObj.alenC;
    alenC_result.textContent = '';
    alenG_result.textContent = '';
    common_result_display.textContent = '';
    alenResHandler.forEach(ele => ele && clearInterval(ele));
    alenResHandler = [null,null];
    applyPathwayFilter(false);
    toggleHandler("C", obj.alenC);
    if (!obj.alenG) return;
    for (let i = 0; i < obj.alenC.length; i++) {
        if (obj.alenC[i] != obj.alenG[i]){
            console.log("different in index ",i);
            realObj.alenC = obj.alenC.slice(0,(i-1 < 0)?(0):(i-1))
            + `<b style="font-size: 1.3rem">${obj.alenC[i]}</b>` + obj.alenC.slice(i+1);
            realObj.alenG = obj.alenG.slice(0,(i-1 < 0)?(0):(i-1)) 
            + `<b style="font-size: 1.3rem">${obj.alenG[i]}</b>` + obj.alenG.slice(i+1);
        }
    }
    alenC_display.innerHTML = realObj.alenC;
    alenG_display.innerHTML = realObj.alenG;
    toggleHandler("G", obj.alenG);
}

//rs ids returned from the mir
function mirReturnProcessor(){
    let obj = JSON.parse(this.responseText);
    if (!obj) return;
    allRsSuggest = obj.rsidSuggest;
    rsSuggest = allRsSuggest.map((val)=>{return val.rsId});
    if (!rsSuggest || rsSuggest.length == 0) return;
    mimatCode = obj.MIMAT;
    setObjectActive(rsid,true);
    return console.log(rsSuggest);
}

//suggest alt. type from rsid
function suggestAlternateFromRs(){
    // console.log('suggestAlternateFromRs');
    // console.log(rsid.value);
    setObjectActive(alterType,true);
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
    // return console.log( altTypes);
}


async function sendMIR(){
    let mircode = miRNAHeader.value + getEle("miRNA").value;
    const m = miRNAHeader.value;
    rsid.value = '';
    alterType.value = '';
    setObjectActive(rsid,false);
    setObjectActive(alterType,false);
    // return console.log(mircode);
    const reqPath = (m == "MIMAT")?("suggestFromMIMAT"):("suggestFromHSA");
    console.log(reqPath,mircode);
    let xhr = makeXHR(reqPath,mircode);
    xhr.addEventListener("load", mirReturnProcessor);
    xhr.send();
}

function resetResultDisplay(){
    result_array[0] = []; //ref
    result_array[1] = []; //alternate
    common_result = [];
}

async function sendRS(){
    let rsCode = rsid.value;
    let alter = alterType.value;
    resetResultDisplay();
    // return console.log(mircode);
    isResolveForMIMAT = false;
    if (rsCode == null || rsCode.length == 0) {
        alter = 'CG';
        rsCode = 'null';
        isResolveForMIMAT = true;
    }
    alenG_display.innerText = "";
    setTimeout(()=>{
        setObjectVisiblity(delay15Seconds,true);
    },15*1000)
    const path = `rsidToInfo/${rsCode}/mimat/${mimatCode}/alterType/${alter}`;
    // console.log(path);
    let xhr = makeXHR(path);
    setObjectVisiblity(btnToggleRemove, false, "d-flex");
    setObjectVisiblity(loadingPanel, true, "d-flex");
    refSeqId = mimatCode;
    altSeqId = (isResolveForMIMAT)?(mimatCode):(rsCode);
    xhr.addEventListener("load", rsReturnProcessor);
    xhr.send();
    console.log("sent rs request", path);
}

function applyPathwayFilter(display=true){
    pathway_filter = [];
    setObjectVisiblity(loadingPanel, true, "d-flex");
    for (let i = 0; i < all_pathway_filter.length; i++) {
        const res = getEle("path_select_"+i).checked;
        if (res == true){//(res == false || res == null){
            pathway_filter.push(all_pathway_filter[i]); 
        }
    }
    if (display == false){
        return;
    }
    if (raw_result[0].length > 0)
        setAlenC(JSON.stringify(raw_result[0]));
    if (raw_result[1].length > 0)
        setAlenG(JSON.stringify(raw_result[1]));
}



function filterPathwayFilter(){
    const filterVal = filter_pathway_filter.value;
    for (let i = 0; i < all_pathway_filter.length; i++) {
        const ele = getEle("path_select_"+i).parentNode.parentNode;
        if (ele.childNodes[1].textContent.toLowerCase().includes(filterVal.toLowerCase())){
            setObjectVisiblity(ele,true);
            continue;
        }
        setObjectVisiblity(ele,false);
    }
}

//DELETABLE
// function RNAHybridProcessor(resultPanelId){
//     const r = this.responseText;
//     resultPanelId.src = 'rnaHybrid/html/' + r.substring(0,r.length-3)+"html";
// }

function makePathwayCheck(pName,index){
    const temp = `<td class="px-3"><input type="checkbox" id="path_select_${index}" checked></input></td><td class="col-11 pl-2 pr-0">${pName}</td>`;
    return makeElement('tr',temp);
}

function initPathwayFilter(){
    const obj = JSON.parse(this.responseText);
    all_pathway_filter = obj.pathwayFilter;
    pathway_filter_box.textContent = '';
    all_pathway_filter.forEach((val,index)=>{
        const line = makePathwayCheck(val,index);
        pathway_filter_box.appendChild(line);
    })
}

function init(){
    setObjectActive(rsid,false);
    setObjectActive(alterType,false);
    let xhr = makeXHR('pathway_filter');
    xhr.addEventListener("load", initPathwayFilter);
    xhr.send();
}

init();

function toggleAllPathwayFilter(val){
    if (val){
        for (let i = 0; i < all_pathway_filter.length; i++) {
            const ele = getEle("path_select_"+i);
            if(ele.parentNode.parentNode.classList.contains("d-none"))
                continue;
            if (ele.checked)
                continue;
            ele.click();
        }
        return;
    }
    for (let i = 0; i < all_pathway_filter.length; i++) {
        const ele = getEle("path_select_"+i);
        if(ele.parentNode.parentNode.classList.contains("d-none"))
            continue;
        if (ele.checked)
            ele.click();
    }
}

async function gotoTargetExpression(){
    // if (rsid.disabled) return;
    // setObjectVisiblity(expressionPanel, true);
    // await fetch("/data/cellLine.tsv").then(res=> res.text()).then(dat =>{
    //     const lines = dat.split("\n");
    //     lines.map(val => val.split("\t"))
    //     lines.forEach(ele => {
            
    //     });
    // })
    // expressionIframe.contentWindow.document.getElementsByName("searchBox")[0].value = miRNA.value;
    window.open("http://mirdb.org/expression.html","_blank")
}

rsid.addEventListener("focusout",suggestAlternateFromRs);
document.getElementById("miRNA").addEventListener("input",sendMIR);
filter_pathway_filter.addEventListener("input",filterPathwayFilter);
processButton.addEventListener("click",sendRS);
deselectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(false)});
selectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(true)});
apply_pathway_filter.addEventListener("click",applyPathwayFilter);
