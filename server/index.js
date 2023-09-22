const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const cheerio = require('cheerio');
const { exec } = require('child_process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

let tryCount = 0;

function delay(time) {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      console.log('Delay')
      resolve(true);
    }, time);
  });
}

const getTitle = ($) => {
  const titleClass = 'h1 a[href*="/w"]';
  const titleText = $(titleClass)
  const searchString = '<!---->';
  const newString = titleText.html().substring(searchString.length);
  return newString
}

const getStarCount = ($) => {
  const starClass = 'a[href*="/member/star"]';

  const starHTML = $(starClass).html()
  const cutIndex = starHTML.indexOf('</span>');
  const star = starHTML.substring(cutIndex + '</span>'.length).trim()

  const starCount = Number(star);
  return starCount
}

function openBrowser(url) {
  let command;
  if (!url || url === '') return;
  switch (process.platform) {
    case 'darwin':
      command = `open ${url}`;
      break;
    case 'win32':
      command = `start ${url}`;
      break;
    case 'linux':
      command = `xdg-open ${url}`;
      break;
    default:
      console.error('Unsupported platform:', process.platform);
      return;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Failed to open browser: ${error}`);
    }
  });
}

app.get('/developer', (req, res) => {
  openBrowser('https://github.com/KAWAN426');
  res.json({ success: true });
})

app.get('/one', async (req, res) => {
  const data = req.query;
  tryCount = 0;

  let taskDone = false;

  const namuwiki_random_data = async (info) => {
    if (taskDone) return;
    try {
      const star = Number(info.star)
      const subDocument = info.subDocument === "true"
      const textLength = Number(info.textLength)
      const includeText = info.includeText
      tryCount += 1;
      const url = 'https://namu.wiki/random';

      const result = await axios.get(url);
      const html = await result.data;

      const $ = cheerio.load(html);

      const title = getTitle($);
      const isSubDocument = title.includes('/');
      const starCount = getStarCount($);

      let htmlLength = 0;
      const filteredElements = $('#app *').not('script, style');
      filteredElements
        .each((_, element) => {
          const words = $(element).text().trim().split(/\s+/);
          htmlLength += words.length;
        })


      const canonicalLink = $('head link[rel="canonical"]');
      const randomURL = canonicalLink.attr('href');

      const isIncludeText = includeText !== "" ? html.includes(includeText) : true;

      const star_Length_include = starCount >= star && htmlLength >= textLength && isIncludeText;
      // * 하위 문서 불허
      const condition1 = !subDocument && !isSubDocument && star_Length_include;
      // * 하위 문서 허용
      const condition2 = subDocument && star_Length_include;
      if (!condition1 && !condition2) {
        if (tryCount >= 50) {
          return { result: null }
        }
        const result = await namuwiki_random_data(info);
        return result;
      } else {
        return { result: randomURL };
      }
    } catch (error) {
      return { error: '"로봇이 아닙니다."를 통과해 주세요.' };
    }
  }

  namuwiki_random_data(data).then((result) => {
    if (!taskDone) {
      openBrowser(result.result)
      res.send(result);
    }
    taskDone = true;
  })
  namuwiki_random_data(data).then((result) => {
    if (!taskDone) {
      openBrowser(result.result)
      res.send(result);
    }
    taskDone = true;
  })
  namuwiki_random_data(data).then((result) => {
    if (!taskDone) {
      openBrowser(result.result)
      res.send(result);
    }
    taskDone = true;
  })
});

// app.get('/many/:count', async (req, res) => {
//   const params = req.params;
//   const data = req.query
//   const resultArray = []
//   const count = Number(params.count) > 10 ? 0 : Number(params.count);
//   for (let i = 0; i < count; i++) {
//     const result = await namuwiki_random_data(data)
//     resultArray.push(result)
//   }
//   res.send(resultArray);
// });


app.listen(12999);
