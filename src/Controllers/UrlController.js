const shortid = require("shortid");
const validator = require("validator");
const UrlModel = require('../Models/UrlModel')



let Shorturl = async (req, res) => {
  try {
    let data = req.body

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: 'body shoulnot be empty' })

    if (!data.longUrl) return res.status(400).send({ status: false, msg: 'longUrl is required' })
    if (!validator.isURL(data.longUrl)) return res.status(400).send({ status: false, msg: 'Url is not valid' })

    let checkUrl = await UrlModel.findOne({ longUrl: data.longUrl }).select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 });
    if (checkUrl) {
      return res.status(200).send({ status: true, message: "Success", data: checkUrl })
    }
    urlCode = shortid.generate().toLowerCase()

    let baseUrl = "http://localhost:3000/"

    let shortUrl = baseUrl + urlCode

    let saveData = {
      urlCode: urlCode,
      longUrl: data.longUrl,
      shortUrl: shortUrl

    }
  
    await UrlModel.create(saveData)
    res.status(201).send({ status: true, message: "URL create successfully", data: saveData })

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
}


let Geturl = async (req, res) => {
  try {
    const code = req.params.urlCode

    //find urlCode
    const url = await UrlModel.findOne({ urlCode: code });
    

    if (!url) {
      return res.status(404).send({ message: "No url found" });
    }
    // return res.send(url)

    console.log("Long url found for short url. Redirecting...");
    return res.status(302).redirect(url.longUrl);

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }

}


module.exports.Shorturl = Shorturl;
module.exports.Geturl = Geturl;


