
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


function toggleHandler(ch,seq){
    let index = (ch == "C")?(0):(1);
    if(alenResHandler[index] == null){
        alenResHandler[index] = setInterval(()=>{
            let sxhr = makeXHR("result",seq);
            // console.log(">>>",ch,xhr);
            if (ch == "C")
                sxhr.addEventListener("load",function(){setAlenC(this.responseText,true)});
            else
                sxhr.addEventListener("load",function(){setAlenG(this.responseText,true)});
            sxhr.send();
        },2000);
        let xhr = makeXHR("seq",seq);
        xhr.send();
    }
}

function makeALink(){

}

function makeElement(type, data, link=null, style=null,keepRawData=false){
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

function makeResultRow(data){
    var mainNode = document.createElement("tr");
    mainNode.appendChild(makeElement("td",data.score));
    mainNode.appendChild(makeElement("td",data.gene, data.gLink));
    mainNode.appendChild(makeElement("td",data.diseases.map(val=>val.name).join("\n"),null,"text-align: left;",true));
    return mainNode;
}

function setGrandParentHeight(target,value){
    target.parentNode.parentNode.style.height = value;
}

function tableDisplayResult(tableId,arr){
    if (arr.length == 0){
        setGrandParentHeight(tableId,"100px");
        tableId.innerHTML = "<tr><td></td><td>No result found</td></tr>";
        return;
    }
    console.log(arr);
    arr = filterDiseasesInArray(arr);
    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        var r = makeResultRow(arr[i]);
        tableId.appendChild(r);                
    }
}

function filterDiseasesInArray(objArray){
    let data = objArray;
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        let j = 0;
        if (data.diseases == undefined)
            continue;
        while(j < data.diseases.length){
            const dele = data.diseases[j++];
            if (pathway_filter.includes(dele.name)){
                data.diseases.splice(j,1);
                j--;
            }
        }         
    }
    return data;
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

function setAlenResult(content,resultDisplayer,currentIndex,parseDiseases){
    const oppositeIndex = (currentIndex == 1)?(0):(1);
    clearInterval(alenResHandler[currentIndex]);
    alenResHandler[currentIndex]= null;
    resultDisplayer.innerHTML = "No result found";
    if (content == "null" || content == null || content == "")
        return;
    let data = JSON.parse(content);
    console.log(data);
    if (parseDiseases)
        data = parseDiseasesInAll(data);
    raw_result[currentIndex] = JSON.parse(JSON.stringify(data));
    console.log(raw_result[currentIndex]);
    if (data.length > 0)
        resultDisplayer.innerText = "";
    if (result_array[oppositeIndex].length <= 0){
        result_array[currentIndex] = data;
        return;
    }
    let i = 0;
    common_result = [];
    while(i < data.length){
        const dele = data[i++];
        for (let j = 0; j < result_array[oppositeIndex].length; j++) {
            const rele = result_array[oppositeIndex][j];
            if (dele.gene == rele.gene){
                common_result.push(dele);
                result_array[oppositeIndex].splice(j,1);
                data.splice(--i,1);
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
    if (common_result[0].length == 0){
        setGrandParentHeight(alenG_result,"450px");
        setGrandParentHeight(alenC_result,"450px");
    }
}

function setAlenC(data,isbegin=false){
    setAlenResult(data,alenG_result,0,parseDiseases=isbegin);
}
function setAlenG(data,isbegin=false){
    setAlenResult(data,alenG_result,1,parseDiseases=isbegin);
}

function rsReturnProcessor(){
    let obj = JSON.parse(this.responseText);
    alenC_display.innerHTML = obj.alenC;
    alenG_display.innerHTML = obj.alenG;
    alenC_result.textContent = '';
    alenG_result.textContent = '';
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
    setObjectActive(rsid,true);
    return console.log(rsSuggest);
}

//suggest alt. type from rsid
function suggestAlternateFromRs(){
    console.log('suggestAlternateFromRs');
    console.log(rsid.value);
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

function resetResultDisplay(){
    result_array[0] = []; //ref
    result_array[1] = []; //alternate
    common_result = [];
}

async function sendRS(){
    let rscode = rsid.value;
    resetResultDisplay();
    // return console.log(mircode);
    const path = `rsidToInfo/${rscode}/mimat/${mimatCode}/alterType/${alterType.value}`;
    // console.log(path);
    let xhr = makeXHR(path);
    xhr.addEventListener("load", rsReturnProcessor);
    xhr.send();
    console.log("sent rs request", path);
}

function applyPathwayFilter(){
    pathway_filter = [];
    for (let i = 0; i < all_pathway_filter.length; i++) {
        const res = getEle("path_select_"+i).checked;
        if (res == false || res == null){
            pathway_filter.push(all_pathway_filter[i]); 
        }
    }
    if (raw_result[0].length > 0)
        setAlenC(JSON.stringify(raw_result[0]));
    if (raw_result[1].length > 0)
        setAlenG(JSON.stringify(raw_result[1]));
}

function makePathwayCheck(pName,index){
    const temp = `<td><input type="checkbox" id="path_select_${index}" checked></input></td><td>${pName}</td>`;
    return makeElement('tr',temp);
}

function fillPathwayFilter(){
    const obj = JSON.parse(this.responseText);
    all_pathway_filter = obj.pathwayFilter;
    pathway_filter_box.innerText = '';
    all_pathway_filter.forEach((val,index)=>{
        const line = makePathwayCheck(val,index);
        pathway_filter_box.appendChild(line);
    })
}

function setObjectActive(obj, value){
    if (value) obj.removeAttribute("disabled")
    else obj.setAttribute("disabled","true")
}

function init(){
    setObjectActive(rsid,false);
    setObjectActive(alterType,false);
    let xhr = makeXHR('pathway_filter');
    xhr.addEventListener("load", fillPathwayFilter);
    xhr.send();
}

init();

function toggleAllPathwayFilter(val){
    if (val){
        for (let i = 0; i < all_pathway_filter.length; i++) {
            getEle("path_select_"+i).setAttribute("checked","");
        }
        return;
    }
    for (let i = 0; i < all_pathway_filter.length; i++) {
        getEle("path_select_"+i).removeAttribute("checked");
    }
}


rsid.addEventListener("focusout",suggestAlternateFromRs);
miRNA.addEventListener("change",sendMIR);
processButton.addEventListener("click",sendRS);
deselectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(false)});
selectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(true)});
apply_pathway_filter.addEventListener("click",applyPathwayFilter);