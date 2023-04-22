// running on port 8000
const PORT = 8000;

// initialise express, axios & cheerio saved as const.
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

// calling express saved as const app
const app = express();

// array of newspapers to scrape

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: ''
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk'
  },
  {
    name: 'nytimes',
    address: 'https://www.nytimes.com/international/section/climate',
    base: 'https://www.nytimes.com'
  },

]

// array to save article objects
const articles = [];

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a:contains("climate")', html).each(function () {
      const title = $(this).text().replace(/\s+/g, ' ').trim();
      const url = $(this).attr('href');

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name
      })
    });
  });
});

// set routing for home path
app.get('/', (req, res) => {
  res.json("Welcome to my Climate Change News API");
});

// set /news route to guardian website to scrape climate change news using axios and cheerio
app.get('/news', (req, res) => {
  res.json(articles);
});

// get information from one news article
app.get('/news/:newspaperId', async (req, res) => {
  const newspaperId = req.params.newspaperId;

  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base



  axios.get(newspaperAddress)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text().replace(/\s+/g, ' ').trim();
        const url = $(this).attr('href');
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId
        })
      })
      res.json(specificArticles);
    }).catch(err => console.log(err));
});

// express (app) listen for PORT 8000 with a backend callback
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
