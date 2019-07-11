const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

extensions = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "application/javascript",
	".png" : "image/png",
	".gif" : "image/gif",
    ".jpg" : "image/jpeg",
    ".mp4" : "video/mp4",
    ".ico" : "image/ico"
};

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp.responseText);
    }
    fs.open(theUrl);

}

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => { 
    var fileName = path.basename(req.url) || 'index.html';
    var ext = path.extname(fileName);
    console.log(ext);
    var fileDir = path.dirname(req.url);
    var content = __dirname + fileDir + '/'+  fileName;
    var donor = '';
    if(req.method === 'POST'){
        var body = '';
        req.on('data',(data)=>{
            body += data;
        });
        req.on('end', ()=>{
            var post = querystring.parse(body);
            var tempFile = __dirname + fileDir + '/' + 'temp.html';
            fs.unlink(tempFile, function (err) {
                if (err) throw err;
                console.log('temp.html deleted!');
              });
            fs.readFile(__dirname + fileDir + '/header.html', (err, data)=>{
                fs.appendFileSync(tempFile, data);
                switch(req.url){
                    case '/donate':
                        donor = '/donor.html';
                        break;
                    default:
                        break;
                }
                fs.readFile(__dirname + fileDir + donor, (err, body)=>{
                    fs.appendFileSync(tempFile, body);
                    fs.readFile(__dirname + fileDir + '/footer.html', (err, footer)=>{
                        fs.appendFileSync(tempFile, footer);
                        var total = fs.statSync(tempFile).size;
                        res.writeHead(200, {'Content-Length': total, 'Content-Type': extensions['.html']});
                        fs.createReadStream(tempFile).pipe(res);
                        
                        
                    });
                });
            });
            
        });
        
    }
    else {
        var total = fs.statSync(content).size;
        res.writeHead(200, {'Content-Length': total, 'Content-Type': extensions[ext]});
        console.log(content +'\n');
        fs.createReadStream(content).pipe(res);
    }
    
});

// Start the server on port 3000
app.listen(5000, '127.0.0.1');  
console.log('Node server running on port 5000');  