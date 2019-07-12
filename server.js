const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
let file = require('/home/spdpnd98/gitRepos/schoolCollabs/GigaByte/stalls.json');
const request = require('request');

extensions = {
	".html" : "text/html",
	".css" : "text/css",
	".js" : "application/javascript",
	".png" : "image/png",
	".gif" : "image/gif",
    ".jpg" : "image/jpeg",
    ".mp4" : "video/mp4",
    ".ico" : "image/ico",
    ".json": "text/json"
};

// Create an instance of the http server to handle HTTP requests
let app = http.createServer((req, res) => { 
    var fileName = path.basename(req.url) || 'index.html';
    var ext = path.extname(fileName);
    console.log(ext);
    var fileDir = path.dirname(req.url);
    var content = __dirname + fileDir + '/'+  fileName;
    var header = __dirname + fileDir + 'header.html';
    var toshow = '';
    if(req.method === 'POST'){
        var body = '';
        req.on('data',(data)=>{
            body += data;
        });
        req.on('end', ()=>{
            var post = querystring.parse(body);
            console.log(post);
            var tempFile = __dirname + fileDir + '/' + 'temp.html';
            console.log(header);
            fs.readFile(header, (err, data)=>{
                fs.unlinkSync(tempFile);
                console.log('temp.html deleted!');
                fs.appendFileSync(tempFile, data);
                console.log('added header');
                switch(req.url){
                    case '/donate':
                        toshow = '<p> Are you sure you want to donate to ' + post.foodstalls + '?</p>';
                        toshow += '<form method="POST" action="confirmation"><input type="Submit" name ="confirmation" value="Yes"/><input type="Submit" name="confirmation" value="No"/> <input type="hidden" value = "' + post.foodstalls +'" name="foodstalls"/></form>';
                        break;
                    case '/confirmation':
                        //var records = [];
                        console.log(post.confirmation);
                        if (post.confirmation == "Yes"){
                            for (var obj of file ){
                                if (obj["Name"] == post.foodstalls){
                                    obj["Count"] = obj["Count"] + 1; 
                                    fs.writeFile('/home/spdpnd98/gitRepos/schoolCollabs/GigaByte/stalls.json', JSON.stringify(file), function (err) {
                                    if (err) return console.log(err);
                                    console.log(JSON.stringify(file));
                                    console.log('writing to stalls.json');
                                    
                                });
                                
                            }
                        }                         
                            toshow = '<p> Your donation is successful!</p>';
                        }else if (post.confirmation == "No"){
                            toshow = '<p> You have cancelled your donation.</p>';
                        }
                        toshow += '<p>Click <a href="/">here</a> to return.</p>';
                        break;
                    case '/eat':
                        // pass in a foodstall name to delete it
                            for (var obj of file ){
                                if (obj["Name"] == post.foodstalls){
                                    obj["Count"] = obj["Count"] - 1;
                                    fs.writeFile('/home/spdpnd98/gitRepos/schoolCollabs/GigaByte/stalls.json', JSON.stringify(file), function (err) {
                                    if (err) return console.log(err);
                                    console.log('Hi I reached here');
                                    console.log('writing to stalls.json');
                                    toshow += "<p>Consumed from " + post.foodstalls + ".</p>";
                                });
                            }
                        }
                        break;
                    case '/userdashboard':
                        toshow =fs.readFileSync(__dirname + fileDir + 'userDash.html');
                        break;
                    default:
                        console.log('something happened, here\'s what you are seeing: ' + body);
                        break;
                } 
                fs.writeFile(tempFile, toshow, { flag: 'a+' }, (err)=>{
                    console.log('added body');
                    fs.readFile(__dirname + fileDir + 'footer.html', (err, footer)=>{
                        console.log('added footer');
                        fs.appendFileSync(tempFile, footer);
                        var total = fs.statSync(tempFile).size;
                        res.writeHead(200, {'Content-Length': total, 'Content-Type': extensions['.html']});
                        fs.createReadStream(tempFile).pipe(res);
                        
                        
                    });
                });
            });
            
        });
        
    }else if (req.method === 'GET'){
        switch(req.url){
            /*case '/userDash.html':
                    request.post('http://localhost:5000/userdashboard', {
                        json: {
                          ai: 'Buy the ai'
                        }
                      }, (error, res, body) => {
                        if (error) {
                          console.error(error);
                          return;
                        }
                        console.log(`statusCode: ${res.statusCode}`);
                        console.log(body);
                      });
            break;*/
            default:
                    var total = fs.statSync(content).size;
                    res.writeHead(200, {'Content-Length': total, 'Content-Type': extensions[ext]});
                    console.log(content +'\n');
                    fs.createReadStream(content).pipe(res);
                break;
        }
    }
    
});

// Start the server on port 3000
app.listen(5000, '127.0.0.1');  
console.log('Node server running on port 5000');  