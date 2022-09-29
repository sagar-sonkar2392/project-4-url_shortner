const mongoose= require('mongoose')
const shortid = require('shortid');


const bookSchema= new mongoose.Schema({
     urlCode: { type:String,required:true, unique:true, lowercase:true, trim:true },
      longUrl: { type:String,required:true},
       shortUrl: { type:String,default:shortid.generate, unique:true} 


},{timestamps:true}
)
module.exports = mongoose.model('UrlShortner',bookSchema)
