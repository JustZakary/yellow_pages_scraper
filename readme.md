# yellow_pages_scraper

`yellow_pages_scraper` is a web scraper that uses [Puppeteer](https://www.npmjs.com/package/puppeteer) to gather information from yellowpages.ca by phone number.

## Notes

- If there is multiple results for the phone number it will only return the first result.

## Getting Started

```
npm install yellow_pages_scraper
```

## Usage

If you are already using Puppeteer in your project, it is recommended to pass your existing Puppeteer browser instance to the `yellow_pages_scraper` module. This approach optimizes memory management and avoids unnecessary resource duplication.

Here's an example of how to use the module **with** an existing Puppeteer browser instance:

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var puppeteer = require("puppeteer");

  var yps = await new YellowPagesService(await puppeteer.launch({ headless: "new" }));
  yps.getYellowPagesData("604-484-6018", (data) => {
    console.log(data);
  });
})();
```

Alternatively if you aren't already using Puppeteer in your project you can just have the `yellow_pages_scraper` generate a browser for you.

Heres an example of how to use the module **without** an existing Puppeteer browser instance:

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var yps = await new YellowPagesService();
  yps.getYellowPagesData("604-484-6018", (data) => {
    console.log(data);
  });
})();
```

## Searching Multiple Phone Numbers

`yellow_pages_scraper` also supports passing an array of phone numbers to gather them all at the same time. Keep in mind this creates multiple pages in the browser at the same time so it may use more memory and take longer. Heres an example of how to use the module to gather multiple phone numbers at the same time:

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var yps = await new YellowPagesService();
  yps.getYellowPagesData(["604-484-6018", "705-472-7510", "705-476-3373"], (data) => {
    console.log(data);
  });
})();
```

## Phone Number Formatting

`yellow_pages_scraper` will automatically format the phone number to the correct format for yellowpages.ca. You can pass the phone number in any format and it will be converted to the correct format.

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var yps = await new YellowPagesService();
  // All of these formats are valid
  yps.getYellowPagesData(["+1 (604) 484-6018", "7054727510", "+1705476 3373"], (data) => {
    console.log(data);
  });
})();
```

## Output

Heres an example of the output you can expect from the module:

```json
{
  "number": "",
  "success": true,
  "yellowpage": "",
  "business_name": "",
  "description": "",
  "street_address": "",
  "city": "",
  "province": "",
  "postal_code": "",
  "phone_number": "",
  "website": "",
  "facebook_page": "",
  "instagram_page": "",
  "twitter_page": "",
  "linkedin_page": "",
  "youtube_page": "",
  "pinterest": ""
}
```

If the page is not found the `success` field will be set to `false` and it output something like this:

```json
{ "number": "604-484-6010", "success": false, "error": "No results found" }
```

## Creator

- [Zakary Loney](https://github.com/JustZakary)
