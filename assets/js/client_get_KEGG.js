

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