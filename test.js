const fs = require("fs");

const connectLines = fs.readFileSync("./open_proxy.txt", "utf-8").split("\n").map((val) => { return val.split("\r")[0];});

var request = require('request');

var headers = {
    'authority': 'api.myip.com',
    'cache-control': 'max-age=0',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'accept-language': 'en-US,en;q=0.9',
    'cookie': '__cfduid=d19f014aec50c2f7102771df622aa4be91594230823; sc_is_visitor_unique=rx11414134.1594230824.FB57A4D1D8B74FCF826A1F62D531D961.1.1.1.1.1.1.1.1.1; __cf_bm=8e0fedfbd05fe7f488da57b610f101418810e186-1594230824-1800-ATmAtHEKS74wZbKe03TxpO/26bwb6JMABaprle4noCgt3ZdP+J05aUDIvfF4zPwVvF6R4NjVe/cRc0GXb5LWsKR+rvqkv14Z+Z9/bjl06IzPfBaXMZRi9x/MJvbsoXw70qZMUx3+WEHMZj5N5z/e4PhuoaB88VsjChEJvYvNnbqx9U4u6uB59Zyz+PkTrTKYiw=='
};

for (let i = 0; i < connectLines.length; i++) {
    var options = {
        proxy: 'http://'+connectLines[i],
        url: 'https://api.myip.com/',
        headers: headers
    };
    
    let callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(connectLines[i], "->", body);
            fs.appendFileSync('./good_open_proxy.txt',connectLines[i]);
        }
        console.log(error);
    }
    
    request(options, callback);   
    
}

console.log('done');

