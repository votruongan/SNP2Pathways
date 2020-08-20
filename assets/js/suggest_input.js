var rsSuggest = [
  "drawLine",
  "drawCircle",
  "drawCircleMore",
  "fillLine",
  "fillCircle",
  "fillCircleMore"
];

function popupClearAndHide() {
  rsid_suggestions.innerHTML = "";
  rsid_suggestions.style.display = "none";
}

function updPopup() {
  if(!rsid.value) {
    popupClearAndHide();
    return;
  }
  var a = new RegExp("^" + rsid.value, "i");
  for(var x = 0, b = document.createDocumentFragment(), c = false; x < rsSuggest.length; x++) {
    if(a.test(rsSuggest[x])) {
      c = true;
      var d = document.createElement("p");
      d.innerText = rsSuggest[x];
      d.setAttribute("onclick", "rsid.value=this.innerText;rsid_suggestions.innerHTML='';rsid_suggestions.style.display='none';");
      b.appendChild(d);
    }
  }
  if(c == true) {
    rsid_suggestions.innerHTML = "";
    rsid_suggestions.style.display = "block";
    rsid_suggestions.appendChild(b);
    return;
  }
  popupClearAndHide();
}

function makeAltSuggestOption(obj){
  const f = obj.from; const t = obj.to;
  return `<option value="${f}${t}">${f} -> ${t}</option>`;
}


function makeAlternateSuggestions(altArray){
  let str = "";
  if (altArray == null) return setObjectActive(alterType,false);
  for (let i = 0; i < altArray.length; i++) {
    const element = altArray[i];
    str = str + makeAltSuggestOption(element);
  }
  alterType.innerHTML = str;
}

rsid.addEventListener("keyup", updPopup);
rsid.addEventListener("change", updPopup);
rsid.addEventListener("focus", updPopup);