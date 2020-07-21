
const pathway_link_prefix = "https://www.kegg.jp/kegg-bin/show_pathway?";

let raw_result = [[],[]]; // 0: ref, 1: alt
let result_array = [[],[]]; // 0: ref, 1: alt
let common_result = [];

function makeXHR(toSend,param=null){
    url = window.location.href+ toSend;
    if (param != null)
        url = url + "/" + param.toString();
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    return xhr;
}

function getEle(id){
    return document.getElementById(id);
}

