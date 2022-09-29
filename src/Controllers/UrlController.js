const shortid = require("shortid");
const validator = require("validator");
const UrlModel=require('../Models/UrlModel')



let Shorturl=async (req,res)=>{
try {
    let data=req.body
    
    if(Object.keys(data).length==0) return res.status(400).send({status:false,msg:'body shoulnot be empty'})
    
    if(!data.longUrl) return res.status(400).send({status:false,msg:'longUrl is required'})
    if(!validator.isURL(data.longUrl)) return res.status(400).send({status:false,msg:'Url is not valid'})
     
    let checkUrl = await UrlModel.findOne({ longUrl: data.longUrl }).select({_id:0, __v:0, createdAt:0, updatedAt:0});
    if(checkUrl) {
      return res.status(200).send({status:true, message:"Success", data: checkUrl})
    }
    urlCode=shortid.generate().toLowerCase()

let baseUrl="http://localhost:3000"

let shortUrl=baseUrl+'/'+urlCode

data.shortUrl=shortUrl
data.urlCode=urlCode
let newData=await UrlModel.create(data)
let responseData = await UrlModel.findOne({urlCode:urlCode}).select({_id:0, __v:0, createdAt:0, updatedAt:0})    
res.status(201).send({status:true, message:"URL create successfully", data:data})    

} catch (error) {
    res.send(error.message)
}
}
 

let Geturl= async (req,res)=>{
  try {
    data=req.params.urlCode
    let shortUrl=await UrlModel.findOne({data})
    res.redirect(shortUrl.longUrl)
  } catch (error) {
    res.send(error.message)
  }

}


module.exports.Shorturl=Shorturl;
module.exports.Geturl=Geturl;


