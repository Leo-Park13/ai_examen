var express = require('express');
var router = express.Router();
var OpenAI = require("openai")
var openai = new OpenAI()
var puppeteer = require("puppeteer")

var fs = require("fs")
var path = require("path")
var uuid = require("uuid")
var axios = require("axios")
var staticPath = path.join(__dirname, "../static")

var uploadFolder = path.join(__dirname, "../static/upload")
var multer = require("multer")
var upload = multer({ dest: uploadFolder })


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/image/generate", async (req, res) => {
  console.log(req.body)

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: req.body.prompt,
    n: 1,
    size: "1024x1024",
  });
  var image_url = response.data[0].url;
  console.log(image_url)
  var imageId = uuid.v4()
  var streamResponse = await axios.get(image_url, {
    responseType: 'stream'
  })
  var filePath = path.join(staticPath, imageId)
  var fileStream = fs.createWriteStream(filePath)
  streamResponse.data.pipe(fileStream)
  streamResponse.data.on("end", () => {
    res.json({
      result: "success",
      imageUrl: "/api/image/" + imageId
    })
  })


})

router.get("/image/:id", async (req, res) => {
  var id = req.params.id
  var filePath = path.join(staticPath, id)
  console.log(filePath)
  var fileStream = fs.createReadStream(filePath)
  fileStream.pipe(res)
})
router.post("/summary", async (req, res) => {
  var url = req.body.url
  var json = await summary(url)

  res.json(json)
})
router.get("/sound", async (req, res) => {
  var text = req.query.text
  console.log(text)
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });
  const buffer = Buffer.from(await mp3.arrayBuffer());
  res.end(buffer)
})
router.post("/comidafoto", upload.single("file"), async (req, res) => {
  console.log(req.file)

  var file = fs.readFileSync(req.file.path)
  var base64 = file.toString("base64")

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `음식사진을 보고 음식사진의 칼로리와 운동을 추천 해주는 서비스 한국어로 답해줘 
        response json format={ food_name:'string', calories: 'number',  nutrient: 'string',exercise:'string' }`
      },
      {
        role: "user",
        content: [

          {
            type: "image_url",
            image_url: {
              "url": `data:${req.file.mimetype};base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  var message = response.choices[0].message
  var json = JSON.parse(message.content)
  res.json(json)

})
/*
router.post("/api/efoto",upload.single("file"),async (req, res) =>{
  console.log(req.file)

  var file = fs.readFileSync(req.file.path)
  var base64 = file.toString("base64")
 
  const response = await openai.chat.completions.create({
    model:"gpt-4o-mini",
    response_format:{type:"json_object"},
    messages:[
      {
        role: "system",
        content:`사진을 보고 이 운동의 이름과 운동후 섭취 해야 하는 영양제를 알려주는 서비스 한국어로 답해줘 
        response json format={ exercise_name:'string', Tonic: 'string'}`
      },
      {
        role: "user",
        content: [
        
          {
            type: "image_url",
            image_url: {
              "url": `data:${req.file.mimetype};base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  const message = response.data.choices[0].message.content; 
  console.log("OpenAI 응답:", message);
  // var message = response.choices[0].message
  var json = JSON.parse(message.content)
  console.log(response.choices[0]);
  res.json(json)
})
*/
// 운동 사진 요약
router.post("/efoto", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.error("파일이 업로드되지 않았습니다.");
      return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
    }

    console.log("업로드된 파일 정보:", req.file);
    var file = fs.readFileSync(req.file.path);
    var base64 = file.toString("base64");

    // OpenAI API 호출
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `사진을 보고 운동의 이름과 운동 후 섭취해야 하는 영양제를 알려주는 서비스입니다. 한국어로 답변해 주세요. 응답은 다음 JSON 형식이어야 합니다: {"exercise_name": "string", "tonic": "string"}`,
        },
        {
          role: "user",
          content: `다음은 운동 사진의 데이터입니다: data:${req.file.mimetype};base64,${base64}`,
        },
      ],
    });

    // 응답 데이터 처리
    const message = response.data.choices[0].message.content;
    console.log("OpenAI 응답:", message);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(message); // 응답을 JSON 형식으로 파싱 시도
    } catch (parseError) {
      console.error("응답 파싱 중 오류 발생:", parseError);
      return res.status(500).json({ error: "응답 파싱 중 오류가 발생했습니다." });
    }

    // JSON 형태로 클라이언트에 응답
    res.json(parsedResponse);
  } catch (error) {
    console.error("OpenAI API 호출 오류:", error);
    res.status(500).json({ error: "OpenAI 호출 중 오류가 발생했습니다." });
  }
});


async function summary(url) {
  var browser = await puppeteer.launch({ headless: false })
  var page = await browser.newPage()
  await page.goto(url)
  await page.waitForSelector("body")
  //document.querySelector("body").innerHTML 가져오기
  var bodyHTML = await page.evaluate(() => document.body.innerHTML)


  //script,style 태그 제거하기
  var regex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var regex2 = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
  bodyHTML = bodyHTML.replace(regex, "")
  bodyHTML = bodyHTML.replace(regex2, "")

  //태그 안의 내용만 추출
  const regex3 = /<[^>]*>/g;
  bodyHTML = bodyHTML.replace(regex3, '');

  //공백, &nbsp; 탭 제거
  const regex4 = /&nbsp;|\t|\n/g;
  bodyHTML = bodyHTML.replace(regex4, '');
  console.log(bodyHTML)

  await page.close()
  await browser.close()
/*
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        "role": "system", "content": `뉴스기사를 요약해주는 시스템 사용자가
                  뉴스기사를 입력하면 세줄요약을 하고 적당한 제목도 만들어준다
                  json_format={"title":"string","summary":"string"} `},
      { "role": "user", "content": bodyHTML }
    ]
  });
  var resultContent = completion.choices[0].message
  console.log(resultContent)
  var json = JSON.parse(resultContent.content)
  console.log(json)
  return json
  */
}


module.exports = router;
