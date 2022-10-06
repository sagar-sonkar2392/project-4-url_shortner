const shortid = require("shortid");
const UrlModel = require('../Models/UrlModel')
const { isValidUrl, isValid } = require('../Utils/validation')
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  13190,
  "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const Shorturl = async function (req, res) {
  try {
    let { longUrl } = req.body;

    if (!Object.keys(req.body).length > 0) {
      return res
        .status(400)
        .send({
          status: false,
          message: "Please enter recommended data in body",
        });
    }

    if (req.body.urlCode || req.body.shortUrl) {
      return res
        .status(400)
        .send({ status: false, messsage: "you have to enter only longUrl" });
    }

    if (!isValid(longUrl)) {
      return res.status(400).send({ status: false, message: "longUrl is required" });
    }

    if (!isValidUrl(longUrl)) {
      return res.status(400).send({ status: false, message: "invalid url" });
    }


    let cache = await GET_ASYNC(`${longUrl}`);
    if (cache) {
      cache = JSON.parse(cache);

      return res.status(400).send({ status: false, message: "Data from Cache", data: cache });

    }

    let checkExistUrl = await UrlModel.findOne({ longUrl: longUrl }).select({ longUrl: 1, shortUrl: 1, urlCode: 1, _id: 0 });

    if (checkExistUrl) {
      await SET_ASYNC(`${longUrl}`, JSON.stringify(checkExistUrl), "EX", 60);

      return res.status(400).send({ status: true, message: "url already present", data: checkExistUrl });
    }

    const urlCode = shortid.generate().toLowerCase();

    const baseUrl = "http://localhost:3000";

    const obj = {
      longUrl: longUrl,
      shortUrl: baseUrl + "/" + urlCode,
      urlCode: urlCode,
    };
    const createUrl = await UrlModel.create(obj);
    return res
      .status(201)
      .send({ status: true, message: "shortUrl created", data: obj });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "server error", error: err.message });
  }
};

// =================================get url====================================================

let Geturl = async (req, res) => {
  try {
    const code = req.params.urlCode;


    let cahcedProfileData = await GET_ASYNC(`${code}`);
    cahcedProfileData = JSON.parse(cahcedProfileData)

    if (cahcedProfileData) {
      console.log("Long url found for short url. Redirecting...");
      return res.status(302).redirect(cahcedProfileData.longUrl);
    }
    //find urlCode
    const url = await UrlModel.findOne({ urlCode: code });
    if (!url) {
      return res.status(404).send({ message: "No url found" });
    }
    
    await SET_ASYNC(`${code}`, JSON.stringify(url));
   
    return res.status(302).redirect(url.longUrl);

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


module.exports.Shorturl = Shorturl;
module.exports.Geturl = Geturl;


