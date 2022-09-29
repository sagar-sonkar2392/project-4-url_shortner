const shortid = require("shortid");
const validator = require("validator");
const UrlModel=require('../Models/UrlModel')



let Shorturl=async (req,res)=>{

    let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,msg:'body shoulnot be empty'})

    if(!data.urlCode) return res.status(400).send({status:false,msg:'urlCode is required'})
    if(!data.longUrl) return res.status(400).send({status:false,msg:'longUrl is required'})
    if(!validator.isURL(data.longUrl)) return res.status(400).send({status:false,msg:'Url is not valid'})
    // if(!data.shortUrl) return res.status(400).send({status:false,msg:'shortUrl is required'})
    let uniqueUrl= await UrlModel.findOne({longUrl:data.longUrl})
    if(uniqueUrl) return res.status(400).send({status:false,msg:'Url already exists'})
let baseUrl="http://localhost:3000"
let shortUrl=baseUrl+'/'+shortid.generate().toLowerCase()
data.baseUrl=baseUrl;
data.shortUrl=shortUrl
await UrlModel.create(data)
    let responseData = await UrlModel.findOne({baseUrl:baseUrl}).select({_id:0, __v:0, createdAt:0, updatedAt:0})

    res.status(201).send({status:true, message:"URL create successfully", data:responseData})    



}


module.exports.Shorturl=Shorturl;


