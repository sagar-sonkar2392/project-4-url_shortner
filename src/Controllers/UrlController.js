const shortid = require("shortid");
const validator = require("validator");
const UrlModel=require('../Models/UrlModel')



let Shorturl=async (req,res)=>{

    let data=req.body
    if(Object.keys(data).length==0) return res.status(400).send({status:false,msg:'body shoulnot be empty'})

    if(!data.urlCode) return res.status(400).send({status:false,msg:'urlCode is required'})
    if(!data.longUrl) return res.status(400).send({status:false,msg:'longUrl is required'})
    if(!validator.isURL(data.longUrl)) return res.status(400).send({status:false,msg:'Url is not valid'})
    if(!data.shortUrl) return res.status(400).send({status:false,msg:'shortUrl is required'})

    

}


module.exports.Shorturl=Shorturl;


