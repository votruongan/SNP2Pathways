
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

// When true, moving the mouse draws on the canvas
let isDrawing = false;
let x = 0;
let y = 0;

// event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

// Add the event listeners for mousedown, mousemove, and mouseup
change_height_drag.addEventListener('mousedown', e => {
  x = e.offsetX;
  y = e.offsetY;
  isDrawing = true;
});

change_height_drag.addEventListener('mousemove', e => {
  if (isDrawing === true) {
    drawLine(x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    // drawLine(x, y, e.offsetX, e.offsetY);
    // x = 0;
    // y = 0;
    isDrawing = false;
  }
});

function takeGrandParentHeightPx(ele){
    let raw = ele.parentNode.parentNode.style.height;
    raw.substring(0,raw.length-3);
    return parseInt(raw);
}

function drawLine(x1, y1, x2, y2) {
    const dy = (y2 - y1)*20;
    console.log(dy);
    setGrandParentHeight(common_result_display,(takeGrandParentHeightPx(common_result_display) + dy) + "px");
    setGrandParentHeight(alenC_result,(takeGrandParentHeightPx(alenC_result) - dy) + "px");
    setGrandParentHeight(alenG_result,(takeGrandParentHeightPx(alenG_result) - dy) + "px");
}
