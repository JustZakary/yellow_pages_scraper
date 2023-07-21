# yellow_pages_scraper

`yellow_pages_scraper` is a web scraper that takes a phone number and returns the data from yellowpages.ca.

## Notes

- If there is multiple results for the phone number it will only return the first result.

## Getting Started

```
npm install yellow_pages_scraper
```

## Usage

Heres an example of how to use the module:

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var yps = await new YellowPagesService();
  console.log(await yps.getYellowPagesData("+1705476 3373"));
})();
```

## Phone Number Formatting

`yellow_pages_scraper` will automatically format the phone number to the correct format for yellowpages.ca. You can pass the phone number in any format and it will be converted to the correct format.

```js
var { YellowPagesService } = require("yellow_pages_scraper");

(async () => {
  var yps = await new YellowPagesService();
  // All of these formats are valid
  console.log(await yps.getYellowPagesData("705-476-3373"));
  console.log(await yps.getYellowPagesData("705 476 3373"));
  console.log(await yps.getYellowPagesData("+1705476 3373"));
  console.log(await yps.getYellowPagesData("1-705-476-3373"));
})();
```

## Output

Heres an example of the output you can expect from the module:

```json
{
  "number": "+1705476 3373",
  "success": true,
  "data": {
    "itemType": "Restaurant",
    "image": "https://cdn.ci.yp.ca/t/1550/83/15508336aa_t.gif",
    "url": "https://www.yellowpages.ca/bus/Ontario/North-Bay/Casey-s-Bar-Grill/317738.html",
    "name": "Casey's Bar & Grill",
    "address": "20 Maplewood Ave, North Bay, ON P1B 5H2",
    "streetAddress": "20 Maplewood Ave",
    "addressLocality": "North Bay",
    "addressRegion": "ON",
    "postalCode": "P1B 5H2",
    "telephone": "705-476-3373",
    "description": "You'll feel right at home at Casey's Bar & Grill in Ontario. Our menu is filled with all your favorites and our staff is known for making you feel like a beloved guest in our home. Come in and dine with us. We can serve up a variety of foods for fans of any type, from tacos and quesadillas to pasta, burgers, and more. Come in and relax while our staff welcomes you and treats you to our famous friendly attitude. We build a friendly environment that’s good for the whole family. We have locations all over, in North Bay, Kenora, London, L’Acadie, and many other places in Ontario and Quebec, so you can enjoy our tasty menu wherever you are. Book a reservation or come in and enjoy a great meal today....",
    "servesCuisine": "Fusion Cuisine,",
    "openingHours": "11:00 am - 1:00 am",
    "aggregateRating": "11 ratings & 11 reviews",
    "ratingValue": "3.6",
    "ratingCount": "11",
    "reviews": [
      {
        "ratingValue": "3",
        "author": "Restaurantica12",
        "datePublished": "January 4, 2009",
        "name": "Good food, however if they put you at the bar to...",
        "reviewBody": "Good food, however if they put you at the bar to eat good luck in getting any quality service.  It appears the bartenders are the servers and they don't seem the least bit interested to serve people food, nobody sticks to one table.  This is not the first time this has happened.  Next time I'll maybe wait the extra 30 minutes to get a dining room seat."
      },
      ...
    ],
    "website": "https://www.caseysnorthbay.com/",
    "socialMedia": {
      "facebook": "https://www.facebook.com/northbaycaseys/",
      "twitter": "",
      "instagram": "",
      "linkedin": "",
      "youtube": "",
      "pinterest": ""
    }
  }
}
```

If the page is not found the `success` field will be set to `false` and it output something like this:

```json
{ "number": "604-484-6010", "success": false, "error": "No results found" }
```

## Creator

- [Zakary Loney](https://github.com/JustZakary)
