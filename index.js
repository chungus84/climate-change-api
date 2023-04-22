// running on port 8000
const PORT = 8000;

// initialise express, axios & cheerio saved as const.
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

// calling express saved as const app
const app = express();

// express (app) listen for PORT 8000 with a backend callback
app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`));
