
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer(function(req,res){
    let reqUrl = req.url;
    if(reqUrl == '/'){
      reqUrl = '/index.html';
    }

    let pathName = url.parse(reqUrl).pathname;
   //let pathName = decodeURI(pathName);
    let mime = {
        "css" : "text/css",
        "html": "text/html",
        "gif" : "image/gif",
        "jpg" : "image/jpeg",
        "png" : "image/png",
        "svg" : "image/svg+xml",
        "tiff": "image/tiff",
        "txt" : "text/plain",
        "htc" : "text/x-component",
        "js"  : "text/javascript",
        "json": "application/json"
    };

    let ext = path.extname(pathName);
    ext = ext ? ext.slice(1) : "txt";
    let contentType = mime[ext];
    let filePath = path.resolve(__dirname +'/src'+ pathName);

    fs.readFile(filePath,function(err,data){
	    if(err){
    		res.writeHead(404,{'content-type':'text/html;charset="utf-8"'});
    		res.write('<h1>404</h1><p>NOT FOUND</p>');
    		res.end();
	    } else {
    		res.writeHead(200,{ 'content-type': contentType });
    		res.write(data);
    		res.end();
      }
	});
});

server.listen(9000,()=>{
    console.log('server is listening in 9000');
});
