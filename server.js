const http = require('http');
const fs = require('fs');
const path = require('path');

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

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => { 
    var fileName = path.basename(req.url) || 'index.html';
    var ext = path.extname(fileName);
    console.log(ext);
    var fileDir = path.dirname(req.url);
    var content = __dirname + fileDir + '/'+  fileName;
    if (ext == ".mp4"){
        var total = fs.statSync(content).size;
        res.writeHead(200, {'Content-Length': total, 'Content-Type': extensions[ext],
    });
    }
    else{
        res.writeHead(200, {'Content-Type': extensions[ext]});
    }
    
    console.log(content +'\n');
    fs.createReadStream(content).pipe(res);
    
});

// Start the server on port 3000
app.listen(5000, '127.0.0.1');  
console.log('Node server running on port 5000');  