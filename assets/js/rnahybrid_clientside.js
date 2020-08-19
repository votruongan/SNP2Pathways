const { timers } = require("jquery");

function toggleRnaHybridPanel(panelId,state,isHalfScreen=false){
    if(state){
        if (isHalfScreen){
             grandParent(refRnaHybrid).classList.remove("col-12");
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
        gene = "null"; mimat = Date.now();
    }
    makeXHR("rna_hybrid",`${gene}/${mimat}`, function (){
        const r = this.responseText;
        resultPanelId.src = 'rnaHybrid/html/' + r.substring(0,r.length-3)+"html";
    });
    console.log("sent rnahybrid reqeuest");
}

function showRnaHybrid(gene=null,alen1=null,alen2=null){
    if (alen1 == null && alen2 == null ){
        toggleRnaHybridPanel(refRnaHybrid,true);
    }
    else{
        toggleRnaHybridPanel(refRnaHybrid,alen1!=null,alen2!=null);
        toggleRnaHybridPanel(altRnaHybrid,alen2!=null,alen1!=null);
    }
    rnaHybridResult.classList.add("focus");
    makeRequestRnaHybrid(gene,alen1,refRnaHybrid);
    makeRequestRnaHybrid(gene,alen2,altRnaHybrid);
}

function unshowRnaHybrid(){
    refRnaHybrid.src = "rnaHybrid/loading.html"
    altRnaHybrid.src = "rnaHybrid/loading.html"
    rnaHybridResult.classList.remove("focus");
    toggleRnaHybridPanel(refRnaHybrid,false);
    toggleRnaHybridPanel(altRnaHybrid,false);
}

closeRnaHybrid.addEventListener("click",unshowRnaHybrid);