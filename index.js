
const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function(req, res){
    res.sendFile(__dirname+ "/index.html");
})


app.get('/video', function(req, res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("Requires Range header");
    }
    const videoPath = "./videos/a.mp4";
    const videoSize = fs.statSync(videoPath).size;
    // console.log("size of video is:", videoSize);
    const CHUNK_SIZE = 10**6; //1 MB
    const start = Number(range.replace(/\D/g, "")); 
    const end = Math.min(start + CHUNK_SIZE , videoSize-1);
    const contentLength = end-start+1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": 'bytes',
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }
    // parsel data send with status code 206 set keya
    // pipe read to write state me send kearta hey
    res.writeHead(206,headers);
    // start or end ka matlab hey keh kaha se data read kerna hey or end kaha pe kearna hey
    const videoStream = fs.createReadStream(videoPath,{start, end});
    // pipe write streame ki status ko bhi change karey ga
    videoStream.pipe(res);

})

app.listen(3000, function(){
    console.log("Server is running on port:", 3000);
})
