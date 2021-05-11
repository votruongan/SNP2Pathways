let mimatCode="",allRsSuggest=[];function usingMiRNA(){isUsingRS=!1}let alenResHandler=[null,null],all_pathway_filter=[],pathway_filter=[],isResolveForMIMAT=!1,rsProccessTimestamp=null;function toggleHandler(e,t){let l="C"==e?0:1;if(null==alenResHandler[l]){alenResHandler[l]=setInterval(()=>{let l=makeXHR("result",t);console.log(">>>",e,n),"C"==e?l.addEventListener("load",function(){setAlenC(this.responseText,!0)}):l.addEventListener("load",function(){setAlenG(this.responseText,!0)}),l.send()},5e3);let n=makeXHR("seq",t);n.send()}}function makeElement(e,t,l=null){const n=l&&l.link,s=l&&l.style;var i=document.createElement(e);return l&&l.onclick&&(i.onclick=l.onclick),null!=n?(a=document.createElement("a"),a.innerText=t,a.href="https://www.ncbi.nlm.nih.gov/gene/"+n,a.target="_blank",i.appendChild(a)):i.innerHTML=t,l&&null!=l.type&&i.setAttribute("type",l.type),null!=s&&i.classList.add(s),i}function makeDiseaseDisplay(e){return e.name+` <a target="_blank" href="${pathway_link_prefix}${e.id}">[${e.id}]</a>`}function makeResultRow(e){var t=document.createElement("tr");t.appendChild(makeElement("td",e.score,{onclick:showRnaHybrid})),t.appendChild(makeElement("td",e.gene,{link:e.gId,onclick:function(e){e.stopPropagation()}})),t.appendChild(makeElement("input",e.nmFile,{type:"hidden"}));const l=e.diseases.map(e=>makeDiseaseDisplay(e)).join("\n");return t.appendChild(makeElement("td",l,{style:"text-left"})),t}function setGrandParentHeight(e,t){e.parentNode.parentNode.style.height=t}function tableDisplayResult(e,t){if(e.textContent="",grandParent(e).parentNode.children[0].children[0].children[0].innerHTML=`(${t.length})`,0==t.length)return setGrandParentHeight(e,"100px"),void(e.innerHTML="<th><td></td><td>No result</td></th>");setGrandParentHeight(e,"290px"),t=filterDiseasesInArray(t);for(let n=0;n<t.length;n++){var l=makeResultRow(t[n]);e.appendChild(l)}}function filterDiseasesInArray(e){let t=e;for(let e=0;e<t.length;e++){const l=t[e];if(null==l.diseases)continue;let n=0;for(;n<l.diseases.length;){const e=l.diseases[n++];pathway_filter.includes(e.name)||l.diseases.splice(--n,1)}}return t}function dataObjectToString(e){let t="",l="";for(let t=0;t<e.diseases.length;t++){const n=e.diseases[t];l+=`[${n.id}]${n.name}`,t<e.diseases.length-1&&(l+=",")}return t=`${e.rank}\t${e.score}\t${e.gId}\t${e.gene}\t${e.nmFile}\t${l}`}function dataArrayToTsvString(e){let t=[];for(let l=0;l<e.length;l++){const n=e[l];t.push(dataObjectToString(n))}return t.join("\n")}function exportDataToTSV(e,t){const l=dataArrayToTsvString(e),n=document.createElement("a");n.href="data:text/plain;charset=utf-8,"+encodeURIComponent(l),n.setAttribute("download",t),n.click(),n.parentNode.removeChild(n)}function parseDiseaseString(e){const t=e.indexOf("["),l=e.indexOf("]");let n={};return n.id=e.substring(0,t),n.name=e.substring(t+1,l),n}function parseDiseasesInAll(e){for(let t=0;t<e.length;t++)e[t].diseases=e[t].diseases.map(e=>parseDiseaseString(e));return e}function setAlenTableHeight(e){setGrandParentHeight(alenG_result,e),setGrandParentHeight(alenC_result,e)}function setAlenResult(e,t,l,n,s=!1){const a=1==l?0:1;if(clearInterval(alenResHandler[l]),alenResHandler[l]=null,t.innerHTML="<th><td></td><td>No result</td></th>","null"==e||null==e||""==e)return;let i=JSON.parse(e);if(console.log(i),n&&(i=parseDiseasesInAll(i),raw_result[l]=JSON.parse(JSON.stringify(i)),console.log(raw_result[l])),i.length>0&&(t.textContent=""),isResolveForMIMAT)return console.log("isResolveForMIMAT"),result_array[l]=i,tableDisplayResult(alenC_result,i),clearTimeout(notiTimeHandle),setObjectVisiblity(loadingPanel,!1,"d-flex"),setGrandParentHeight(common_result_display,"100px"),setAlenTableHeight("450px"),void setObjectVisiblity(delay15Seconds,!1);if(result_array[a].length<=0)return void(result_array[l]=i);setObjectVisiblity(btnToggleRemove,!0);let r=0;for(common_result=[];r<i.length;){const e=i[r++];for(let t=0;t<result_array[a].length;t++){const l=result_array[a][t];if(e.gene==l.gene){common_result.push(e),s&&(result_array[a].splice(t,1),i.splice(--r,1));break}}}result_array[l]=i,tableDisplayResult(alenC_result,result_array[0]),tableDisplayResult(alenG_result,result_array[1]),tableDisplayResult(common_result_display,common_result),result_array[0].length+result_array[1].length==0&&setGrandParentHeight(common_result_display,"450px"),0==common_result.length&&setAlenTableHeight("450px"),notiTimeHandle&&(clearTimeout(notiTimeHandle),notiTimeHandle=null),setObjectVisiblity(delay15Seconds,!1),setObjectVisiblity(loadingPanel,!1,"d-flex")}function setAlenC(e,t=!1,l=!1){null!=e&&""!=e?setAlenResult(e,alenG_result,0,parseDiseases=t,l):console.log("data is null - alenResHandler:",alenResHandler)}function setAlenG(e,t=!1,l=!1){null!=e&&""!=e?setAlenResult(e,alenG_result,1,parseDiseases=t,l):console.log("data is null - alenResHandler:",alenResHandler)}setObjectVisiblity(btnToggleRemove,!1),currentC_array=[],currentG_array=[],currentCommon_array=[];let isRemoveSimilar=!1;function toggleRemoveSimilarGene(){isRemoveSimilar=!isRemoveSimilar,setObjectVisiblity(loadingPanel,!0,"d-flex"),btnToggleRemove.innerText=isRemoveSimilar?"Keep same target genes":"Remove same target genes",resetResultDisplay(),raw_result[0].length>0&&setAlenC(JSON.stringify(raw_result[0]),!1,isRemoveSimilar),raw_result[1].length>0&&setAlenG(JSON.stringify(raw_result[1]),!1,isRemoveSimilar)}let notiTimeHandle=null;function rsReturnProcessor(){let e=JSON.parse(this.responseText),t=JSON.parse(this.responseText);if(console.log(e),notiTimeHandle=setTimeout(()=>{setObjectVisiblity(loadingPanel,!1,"d-flex"),setObjectVisiblity(notificationPanel,!0,"focus")},3e5),alenC_display.innerText=t.alenC,alenC_result.textContent="",alenG_result.textContent="",common_result_display.textContent="",alenResHandler.forEach(e=>e&&clearInterval(e)),alenResHandler=[null,null],applyPathwayFilter(!1),toggleHandler("C",e.alenC),e.alenG){for(let l=0;l<e.alenC.length;l++)e.alenC[l]!=e.alenG[l]&&(console.log("different in index ",l),t.alenC=e.alenC.slice(0,l-1<0?0:l-1)+`<b style="font-size: 1.3rem">${e.alenC[l]}</b>`+e.alenC.slice(l+1),t.alenG=e.alenG.slice(0,l-1<0?0:l-1)+`<b style="font-size: 1.3rem">${e.alenG[l]}</b>`+e.alenG.slice(l+1));alenC_display.innerHTML=t.alenC,alenG_display.innerHTML=t.alenG,toggleHandler("G",e.alenG)}}function mirReturnProcessor(){let e=JSON.parse(this.responseText);if(e&&(allRsSuggest=e.rsidSuggest,rsSuggest=allRsSuggest.map(e=>e.rsId),rsSuggest&&0!=rsSuggest.length))return mimatCode=e.MIMAT,setObjectActive(rsid,!0),console.log(rsSuggest)}function suggestAlternateFromRs(){setObjectActive(alterType,!0);const e=rsid.value;let t=null;allRsSuggest.forEach(l=>{l.rsId==e&&(t=l.alternateTypes)}),null==t&&setTimeout(suggestAlternateFromRs,150),makeAlternateSuggestions(t)}async function sendMIR(){let e=miRNAHeader.value+getEle("miRNA").value;const t=miRNAHeader.value;rsid.value="",alterType.value="",setObjectActive(rsid,!1),setObjectActive(alterType,!1);const l="MIMAT"==t?"suggestFromMIMAT":"suggestFromHSA";console.log(l,e);let n=makeXHR(l,e);n.addEventListener("load",mirReturnProcessor),n.send()}function resetResultDisplay(){result_array[0]=[],result_array[1]=[],common_result=[]}async function sendRS(){let e=rsid.value,t=alterType.value;resetResultDisplay(),isResolveForMIMAT=!1,null!=e&&0!=e.length||(t="CG",e="null",isResolveForMIMAT=!0),alenG_display.innerText="",setTimeout(()=>{setObjectVisiblity(delay15Seconds,!0)},15e3);const l=`rsidToInfo/${e}/mimat/${mimatCode}/alterType/${t}`;let n=makeXHR(l);setObjectVisiblity(btnToggleRemove,!1,"d-flex"),setObjectVisiblity(loadingPanel,!0,"d-flex"),refSeqId=mimatCode,altSeqId=isResolveForMIMAT?mimatCode:e,n.addEventListener("load",rsReturnProcessor),n.send(),console.log("sent rs request",l)}function applyPathwayFilter(e=!0){pathway_filter=[],setObjectVisiblity(loadingPanel,!0,"d-flex");for(let e=0;e<all_pathway_filter.length;e++){1==getEle("path_select_"+e).checked&&pathway_filter.push(all_pathway_filter[e])}0!=e&&(raw_result[0].length>0&&setAlenC(JSON.stringify(raw_result[0])),raw_result[1].length>0&&setAlenG(JSON.stringify(raw_result[1])))}function filterPathwayFilter(){const e=filter_pathway_filter.value;for(let t=0;t<all_pathway_filter.length;t++){const l=getEle("path_select_"+t).parentNode.parentNode;l.childNodes[1].textContent.toLowerCase().includes(e.toLowerCase())?setObjectVisiblity(l,!0):setObjectVisiblity(l,!1)}}function makePathwayCheck(e,t){return makeElement("tr",`<td class="px-3"><input type="checkbox" id="path_select_${t}" checked></input></td><td class="col-11 pl-2 pr-0">${e}</td>`)}function initPathwayFilter(){const e=JSON.parse(this.responseText);all_pathway_filter=e.pathwayFilter,pathway_filter_box.textContent="",all_pathway_filter.forEach((e,t)=>{const l=makePathwayCheck(e,t);pathway_filter_box.appendChild(l)})}function init(){setObjectActive(rsid,!1),setObjectActive(alterType,!1);let e=makeXHR("pathway_filter");e.addEventListener("load",initPathwayFilter),e.send()}function toggleAllPathwayFilter(e){if(e)for(let e=0;e<all_pathway_filter.length;e++){const t=getEle("path_select_"+e);t.parentNode.parentNode.classList.contains("d-none")||(t.checked||t.click())}else for(let e=0;e<all_pathway_filter.length;e++){const t=getEle("path_select_"+e);t.parentNode.parentNode.classList.contains("d-none")||t.checked&&t.click()}}function makeCellLineTable(e){cellLineBody.innerText="",e!==allCellLines?e.forEach(e=>{let t=allCellLines.indexOf(e);console.log(t,allCellLines[t],e),cellLineBody.appendChild(makeCellLineRow(t+1,e[0],e[1]))}):e.forEach((e,t)=>{cellLineBody.appendChild(makeCellLineRow(t+1,e[0],e[1]))})}function filterCellLine(){const e=filter_cellLine.value;makeCellLineTable(e&&""!=e?allCellLines.filter(t=>t[0].toLowerCase().includes(e.toLowerCase())&&filter_cellLine_name.checked||t[1].toLowerCase().includes(e.toLowerCase())&&filter_cellLine_source.checked):allCellLines)}function makeCellLineRow(e,t,l){for(let t=0;t<skips.length&&skips[t]<=e;t++)e++;return makeElement("tr",`<td><a href="javascript:targetExpression('${getEle("miRNA").value}',${e}, '${t}');">${t}</a>\n    </td><td>${l}</td>`)}async function targetExpression(e,t,l){const n=`/expression/${e}/${t}`;setObjectVisiblity(loadingPanel,!0,"d-flex");let s=await(await fetch(n)).text();expressResultCellLineName.innerText="Choosed cell line: "+s.split("with expression level >=1 in cell line ")[1].split(".")[0],(s=s.split("</table>")).splice(0,2),s=s=s.join(""),expressResultTable.innerHTML=s,$('td[width="52"]').remove(),$('td[width="100"]').each(function(e){if(e%2==0||e<2)return;let t=$(this).text();try{t=parseInt(t)}catch(e){return}let l="";l=t>20?"HIGH":t>5?"medium":"low",$(this).text(`${l} (${t})`)}),setObjectVisiblity(cellLinePanel,!1,"d-block"),setObjectVisiblity(expressResultPanel,!0,"d-block"),setObjectVisiblity(loadingPanel,!1,"d-flex")}async function gotoTargetExpression(){rsid.disabled||(setObjectVisiblity(expressionPanel,!0),allCellLines||await fetch("/data/cellLine.tsv").then(e=>e.text()).then(e=>{let t=e.split("\n");t=t.map(e=>e.split("\t")),console.log(t.length),allCellLines=t,makeCellLineTable(allCellLines)}),setObjectVisiblity(cellLinePanel,!0,"d-block"),setObjectVisiblity(expressResultPanel,!1,"d-block"))}init(),allCellLines=null,skips=[459,485,496,637,892,943],rsid.addEventListener("focusout",suggestAlternateFromRs),document.getElementById("miRNA").addEventListener("input",sendMIR),filter_pathway_filter.addEventListener("input",filterPathwayFilter),filter_cellLine.addEventListener("input",filterCellLine),filter_cellLine_name.addEventListener("change",filterCellLine),filter_cellLine_source.addEventListener("change",filterCellLine),processButton.addEventListener("click",sendRS),deselectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(!1)}),selectAll_pathway.addEventListener("click",()=>{toggleAllPathwayFilter(!0)}),apply_pathway_filter.addEventListener("click",applyPathwayFilter);