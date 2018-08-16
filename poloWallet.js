require('events').EventEmitter.defaultMaxListeners = 0
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var _ = require('lodash');
var vo = require('vo');
var fs = require('fs');
var http = require('http');
var url = require("url");
//var server = require("./server")

/*
var poloWalletS = {};
var pairKeys = [];

var server = http.createServer(function (req, res) {
  

fs.readFile('poloW.json', function(err, data) {
  res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    
  })


}).listen(8080);
*/

getTickerPoloniexG();
function getTickerPoloniexG() {
    
var requestG = new XMLHttpRequest();
requestG.open('GET', 'https://poloniex.com/public?command=returnTicker')
//request.setRequestHeader( 'Content-Type', 'application/json' );
requestG.onload = function() { 
    
     polotickerG = JSON.parse(requestG.responseText);
     setNamePoloG()

};
requestG.send();
setInterval(function() {
  getTickerPoloniexG();
}, 1800000);
}

function setNamePoloG(){
  
polotick2G = polotickerG
polotickArrG = [];

polosymbols1G = Reflect.ownKeys(polotickerG);
//console.log(polosymbols1);

polovalueG = _.values(polotickerG);//retourne les values dans un ordres différent que la request API polo (avec les symbols)
polovalue2G = polovalueG;
polotickLengthG = _.size(polotickerG);
polosymbols2G = [];
polosymbols3G = [];
polosymbols4G = [];
polosymbols5G = [];

for(var x = 0; x < polotickLengthG; x++) {
polosymbols2G =polosymbols2G.concat([polosymbols1G[x].replace('XMR_', '')]);
polosymbols3G =polosymbols3G.concat([polosymbols2G[x].replace('USDT_', '')]);
polosymbols4G =polosymbols4G.concat([polosymbols3G[x].replace('ETH_', '')]);
polosymbols5G =polosymbols5G.concat([polosymbols4G[x].toLowerCase()])
}
polosymbolsFG = polosymbols5G.filter(word => word.length > 5);
//polosymbolsFG= ['btc_eth', 'btc_sbd']
//console.log(polosymbols5);
//console.log(polosymbolsF)
//console.log(pulledArr)
check(polosymbolsFG);
}

function check(polosymbolsFG){
var run = function * () {
  var urls = 'https://poloniex.com/exchange/#'
  var walletStat = [];
  var walletStatF = [];
  for (var i = 0; i < polosymbolsFG.length; i++) {
    var poloMes = yield nightmare.goto(urls + polosymbolsFG[i])
      .wait("div#marketAlert[style]")
      .wait(3000)
      .evaluate(() => {
    return document.querySelector("div#marketAlert > div.content > div.message").innerHTML
    })
      //.end()
      if(poloMes && poloMes.includes('maintenance')==true){
        walletStat.push('down');
      }else{
        walletStat.push('ok')
      }
      
    }
      for(var t=0; t<polosymbolsFG.length; t++){
        var walletObj = {pair: '',
        status: ''}
        if(walletStat[t] == undefined){
          walletObj.pair = polosymbolsFG[t].replace('_', '/').toUpperCase()
          walletObj.status = "unknown"
          walletStatF = walletStatF.concat([walletObj])
        }else{
          walletObj.pair = polosymbolsFG[t].replace('_', '/').toUpperCase()
          walletObj.status = walletStat[t]
          walletStatF = walletStatF.concat([walletObj])
        }
      }
      //return walletStatF
      console.log(walletStatF)
      //createServ(walletStatF)
      write(walletStatF);
  }


vo(run)(function(err, walletStat) {
});
}


function write(walletStatF){
fs.writeFile("localJSON/poloW.json", JSON.stringify(walletStatF, null, 4), (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("poloW.json has been created");
    
});
}
