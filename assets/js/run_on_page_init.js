
//clear all click id param received from sharing links then reload page
let qIndex = window.location.href.indexOf("?")
console.log(window.location.href,qIndex)
if (qIndex > 0){
    window.location.href = "/";
}