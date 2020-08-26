
function toggleRnaHybridPanel(panelId,state,isHalfScreen=false){
    if(state){
        if (isHalfScreen){
             grandParent(panelId).classList.remove("col-12");
        }
        else {
            grandParent(panelId).classList.remove("col-6");
            grandParent(panelId).classList.add("col-12");
        }
        grandParent(panelId).classList.remove("d-none");
        return;
    }
    // reset to unshow state with ["col-6","p-0","pr-1"]
    grandParent(panelId).classList.add("col-6");
    grandParent(panelId).classList.remove("col-12");
    grandParent(panelId).classList.add("d-none");
}

async function makeRequestRnaHybrid(gene,mimat,resultPanelId){
    if (gene == null || mimat ==null){
        return;
    }
    resultPanelId.parentNode.children[0].innerText = "Sequence: " + mimat;
    resultPanelId.parentNode.children[1].innerText = "Target gene: " + gene;
    makeXHR("rna_hybrid",`${gene}/${mimat}/${refSeqId}`, function (){
        const r = this.responseText;
        resultPanelId.src = 'rnaHybrid/html/' + r.substring(0,r.length-3)+"html";
    });
    // console.log("sent rnahybrid reqeuest");
}


function showRnaHybrid(){
    const panelId = grandParent(this).id;
    const pIdPrefix = panelId.substring(0,panelId.length - 6);
    const gene = this.parentNode.children[2].innerText;
    let alen1 = null, alen2 = null;
    if (panelId == "common_result_display"){        
        alen1 = mimatCode;      
        alen2 = altSeqId;
        toggleRnaHybridPanel(refRnaHybrid,true,true);
        toggleRnaHybridPanel(altRnaHybrid,true,true);
    }
    else{
        toggleRnaHybridPanel(refRnaHybrid,true);
        toggleRnaHybridPanel(altRnaHybrid,false);
        console.log(panelId, pIdPrefix)
        alen1 = (pIdPrefix == "alenC_")?(refSeqId):(altSeqId)
    }
    console.log(gene,alen1,alen2);
    rnaHybridResult.classList.add("focus");
    makeRequestRnaHybrid(gene,alen1,refRnaHybrid);
    makeRequestRnaHybrid(gene,alen2,altRnaHybrid);
}

function unshowRnaHybrid(){
    rnaHybridResult.classList.remove("focus");
    toggleRnaHybridPanel(refRnaHybrid,false);
    toggleRnaHybridPanel(altRnaHybrid,false);
    refRnaHybrid.src = "rnaHybrid/loading.html"
    altRnaHybrid.src = "rnaHybrid/loading.html"
}

closeRnaHybrid.addEventListener("click",unshowRnaHybrid);