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
                        toshow = `<body>
                        <header class="darknav">
                            <div class="container-fluid">
                                <nav class="navbar navbar-expand-lg navbar-dark justify-content-between">
                                    <a class="navbar-brand" href="#" title="BelanjaOne">BelanjaOne</a>
                                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                        <span class="navbar-toggler-icon"></span>
                                    </button>
                    
                                    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                        <div class="navbar-nav mr-auto mt-2 mt-lg-0 .pull-right">
                                            <a class="nav-item nav-link" href="index.html" title="BelanjaOne">BelanjaONE</a>
                                            <a class="nav-item nav-link" href="#" title="About Us">Food Stalls</a>
                                            <a class="nav-item nav-link" href="#" title="Contact Us">Contact Us</a>
                                            <button type="button" class="btn btn-outline-light">Log In</button>
                                            <button type="button" class="btn btn-light">Sign Up</button>
                                        </div>
                                    </div>
                                </nav>
                            </div>
                        </header>
                    
                        <section class="confirmation">
                            <div class="confirmationpage">
                                <div class="confirm">
                                    <h1 class="confirmationhead"><mark>Confirmation Page</mark></h1>
                                    <hr class="confirmationrule">
                                    <p> Are you sure you want to donate to ` + post.foodstalls  + `?</p>  <form method="POST" action="confirmation">
                                    <input type="Submit" name="confirmation" value="Yes" class="btn btn-dark">
                                    <input type="Submit" name="confirmation" value="No" class="btn btn-dark">
                                    <input type="hidden" value="` + post.foodstalls + `" name="foodstalls">
                                </form>
                                <small>*$` + post.donationAmount + ` will be deducted from your account</small>
                                <div class="quote">
                                    <div class="col-sm-12 quotebox1">
                                        <h1 class="confirmationhead">
                                            Giving is not just about making a donation, it is about making a difference.
                                        </h1>
                                        <h1 class="confirmationhead">
                                            -Kathy Calvin-
                                        </h1>
                                    </div>
                                </div>
                            </div>
                
                        </div>
                    </section>`;
                        break;
                    case '/confirmation':
                        console.log(post);
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
                            toshow = `<body>
                            <header class="darknav">
                                <div class="container-fluid">
                                    <nav class="navbar navbar-expand-lg navbar-dark justify-content-between">
                                        <a class="navbar-brand" href="#" title="BelanjaOne">BelanjaOne</a>
                                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                                            aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                            <span class="navbar-toggler-icon"></span>
                                        </button>
                        
                                        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                            <div class="navbar-nav mr-auto mt-2 mt-lg-0 .pull-right">
                                                <a class="nav-item nav-link" href="index.html" title="BelanjaOne">BelanjaONE</a>
                                                <a class="nav-item nav-link" href="#" title="About Us">Food Stalls</a>
                                                <a class="nav-item nav-link" href="#" title="Contact Us">Contact Us</a>
                                                <button type="button" class="btn btn-outline-light">Log In</button>
                                                <button type="button" class="btn btn-light">Sign Up</button>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </header>
                        
                            <section class="confirmation">
                                <div class="confirmationpage">
                                    <div class="confirm">
                                        <h1 class="confirmationhead1"> Your donation is successful!</h1>
                                        <h1 class="confirmationhead"> Thank you for your donation!</h1>
                                        <p class="backtostall">Click <a href="/">here</a> to return.</p>
                                        <div class="quote">
                                            <div class="col-sm-12 quotebox1">
                                                <h1 class="confirmationhead">
                                                    Giving is not just about making a donation, it is about making a difference.
                                                </h1>
                                                <h1 class="confirmationhead">
                                                    -Kathy Calvin-
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                        
                                </div>
                            </section>`;
                        }else if (post.confirmation == "No"){
                            toshow = `<body>
                            <header class="darknav">
                                <div class="container-fluid">
                                    <nav class="navbar navbar-expand-lg navbar-dark justify-content-between">
                                        <a class="navbar-brand" href="#" title="BelanjaOne">BelanjaOne</a>
                                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                                            aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                            <span class="navbar-toggler-icon"></span>
                                        </button>
                        
                                        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                            <div class="navbar-nav mr-auto mt-2 mt-lg-0 .pull-right">
                                                <a class="nav-item nav-link" href="index.html" title="BelanjaOne">BelanjaONE</a>
                                                <a class="nav-item nav-link" href="#" title="About Us">Food Stalls</a>
                                                <a class="nav-item nav-link" href="#" title="Contact Us">Contact Us</a>
                                                <button type="button" class="btn btn-outline-light">Log In</button>
                                                <button type="button" class="btn btn-light">Sign Up</button>
                                            </div>
                                        </div>
                                    </nav>
                                </div>
                            </header>
                        
                            <section class="confirmation">
                                <div class="confirmationpage">
                                    <div class="confirm">
                                        <h1 class="confirmationhead1"> Your have cancelled your donation!</h1>
                                        <p class="backtostall">Click <a href="/">here</a> to return.</p>
                                        <div class="quote">
                                            <div class="col-sm-12 quotebox1">
                                                <h1 class="confirmationhead">
                                                    Giving is not just about making a donation, it is about making a difference.
                                                </h1>
                                                <h1 class="confirmationhead">
                                                    -Kathy Calvin-
                                                </h1>
                                            </div>
                                        </div>
                                    </div>
                        
                                </div>
                            </section>`;
                        }
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