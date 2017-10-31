//let request = require('request')
let sqlite3 = require('sqlite3').verbose()
let urlencode = require('urlencode')
var encoding = require("encoding");
var iconv = require('iconv-lite');
var db = new sqlite3.Database('./database.db');
const cheerio = require('cheerio')

db.run(`CREATE TABLE IF NOT EXISTS weibo (
    id TEXT PRIMARY_KEY UNIQUE,	
    city TEXT，
    text TEXT,		    			
    send_time DATETIME,
    collect_time DATETIME		   
    )`,(err)=>{
        if(err){
            console.log('create database table weibo fail:'+err)
        }    
})
db.run(`CREATE TABLE IF NOT EXISTS flow (  			
    time DATETIME,
    city TEXT,
    number INT,
    weibo_id TEXT	   
    )`,(err)=>{
        if(err){
            console.log('create database table flow fail:'+err)
        }    
})


let setting = [
    {city:'北京',weibo:[{uid:'bjsubway',regexp:''},{uid:'bjmtr',regexp:''}]},
    {city:'上海',weibo:[{uid:'shmetro',regexp:''}]},
    {city:'广州',weibo:[{uid:'gzmtr',regexp:''}]},
    {city:'武汉',weibo:[{uid:'u/3186945861',keyword:'【昨日客流】',regexp:''}]}    
]

// request({
//     url:`https://weibo.cn/3186945861/profile?keyword=${urlencode('【昨日客流】')}&hasori=0&haspic=0&endtime=&advancedfilter=1`,
//     encoding:'utf8'
// }, function (error, response, body) {
//     if(error){
//         console.log(err)
//     }
//     else{
//         var resultBuffer = encoding.convert(body, 'utf8', 'GB2312').toString();
//     }
// });

const charset = require('superagent-charset');
const request = require('superagent');
charset(request);

request
  .get(`https://weibo.cn/3186945861/profile?keyword=${urlencode('【昨日客流】')}&hasori=0&haspic=0&endtime=&advancedfilter=1`)
  .set('Cookie', '_T_WM=c5ed4c43a025b1edace83bd6af8b7292; SCF=AhuujuU5RXe5ikLYA6JGDisHlBiV_ai484P6sNrVCqEvMUsCs68ZCN2F9bA-nObT2T4iSpf2K8PuKdakLAj5RHk.; H5:PWA:UID=1; SUB=_2A250_D6cDeRhGedN61cZ9CjFyDmIHXVUH0LUrDV6PUJbkdBeLRT4kW0rB6pBj5pWH-zfJu5jmDdEHQIVQw..; SUHB=05i78P-xg5r11b; SSOLoginState=1509445324')  
  //.charset('gbk')
  .end((err, res) => {
    console.log('--------------->', res.text);
    //const $ = cheerio.load(res.text)
    var myRe = new RegExp("<div class=\"c\" id=\"(.+?)\"><div><span class=\"ctt\">【昨日客流】(.+?)\（周.+?为(.+?)万乘次.+?span class=\"ct\">(.+?)&nbsp;", "g");
    var myArray = myRe.exec(res.text);
  });