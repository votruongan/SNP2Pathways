const request = require("request");

var headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Language': 'en-US,en;q=0.9'
};

// const request = async function(options){
//     return new Promise((resolve)=>{
//         console.log(options)
//         rq(options, (res)=>{ console.log(res); resolve(res) })
//     })
// }

const fs = require("fs");
const { sleep } = require("./helper");
const allProxys = fs.readFileSync("./open_proxy.txt", {encoding:"utf-8"}).split("\n").map(line => line.replace(/\|/g,':'));
async function test (){
    for (let i = 0; i < allProxys.length; i++){
        // const proxy = "http://" + allProxys[i]
        const proxy = "http://141.226.18.206:8080"
        request({
            proxy,
            url: "https://api.myip.com",
            timeout: 5000,
        }, (e,r,b)=>{
            if (e) return console.log(" - - ", proxy)
            console.log(proxy, r.statusCode);
        });
        console.log("send",proxy)
        await sleep(2000)
    }
}

test()