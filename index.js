const request = require("request");
const cheerio = require("cheerio");

class YellowPagesService {
  constructor() {
    this.schema = null;
  }

  async getYellowPagesData(phoneNumber) {
    return new Promise(async (resolve, reject) => {
      const results = {};
      const number = phoneNumber;
      const url = `https://www.yellowpages.ca/search/re/1/${number.replace(/\D/g, "")}`;

      try {
        const body = await this.getHTML(url);
        const structuredData = await this.getStructuredData(body);

        this.schema = structuredData.schemas.find((item) => {
          return item.itemType === "http://schema.org/LocalBusiness" || item.itemType === "http://schema.org/Organization" || item.itemType === "http://schema.org/Restaurant";
        });

        if (!this.schema) {
          results.number = number;
          results.success = false;
          results.error = "No results found";
        } else {
          for (const key in structuredData) {
            if (key !== "schemas") {
              this.schema[key] = structuredData[key];
            }
          }
          this.cleanUpSchema();
          results.number = number;
          results.success = true;
          results.data = this.schema;
        }
      } catch (error) {
        console.log(error);
        results.number = number;
        results.success = false;
        results.error = "No results found";
      }

      resolve(results);
    });
  }

  async getHTML(url) {
    return new Promise((resolve, reject) => {
      request({ url, followAllRedirects: true }, async (error, response, body) => {
        //get url and return html
        var url = response.request.uri.href;
        if (url.includes("https://www.yellowpages.ca/search/re/")) {
          //find the first link that starts with "https://www.yellowpages.ca/bus/" and navigate to it
          const $ = cheerio.load(body);
          const links = $("a")
            .map((i, el) => $(el).attr("href"))
            .get();
          const link = links.find((link) => link.startsWith("/bus/"));
          if (link) {
            url = `https://www.yellowpages.ca${link}`;
            request({ url, followAllRedirects: true }, async (error, response, body) => {
              if (error) {
                reject(error);
              } else {
                resolve(body);
              }
            });
          }
        } else {
          resolve(body);
        }
      });
    });
  }

  async getStructuredData(html) {
    return new Promise((resolve, reject) => {
      try {
        const $ = cheerio.load(html);
        const data = {
          schemas: [],
        };
        //get all items with itemscope attribute
        $("[itemscope]").each((i, scope) => {
          const item = { itemType: $(scope).attr("itemtype") };
          const reviews = [];

          $("[itemprop]", scope).each((j, prop) => {
            const key = $(prop).attr("itemprop");
            const value = $(prop).attr("content") || $(prop).text();
            if (!value || value.match(/^[\n\t\s]*$/) || item[key]) {
              return;
            }
            if (key === "review") {
              const review = {};
              $("[itemprop]", prop).each((k, subprop) => {
                const subkey = $(subprop).attr("itemprop");
                const subvalue = $(subprop).attr("content") || $(subprop).text();
                if (!subvalue || subvalue.match(/^[\n\t\s]*$/) || review[subkey]) {
                  return;
                }
                review[subkey] = subvalue;
              });
              if (Object.keys(review).length > 0) {
                reviews.push(review);
              }
            } else {
              item[key] = value;
            }
          });

          if (reviews.length > 0) {
            item.reviews = reviews;
          }

          data.schemas.push(item);
        });

        //get all other items (website, social media, etc)

        //Website - find all a elements with a href that starts with "/gourl/" and get the href value and add it to an array
        data.website = [];
        $("a[href^='/gourl/']").each((i, el) => {
          data.website.push(decodeURIComponent($(el).attr("href").split("?redirect=")[1]));
        });

        data.website = data.website.filter((item, index, self) => self.indexOf(item) === index); //filter out all that are the duplicate domain
        data.website = data.website.filter((item) => item.startsWith("https://")); //filter out all non https links

        //Separate social media links into their own keys
        data.socialMedia = {};
        data.socialMedia.facebook = data.website.filter((item) => item.includes("facebook.com"))[0] || ""; //Facebook
        data.socialMedia.twitter = data.website.filter((item) => item.includes("twitter.com"))[0] || ""; //Twitter
        data.socialMedia.instagram = data.website.filter((item) => item.includes("instagram.com"))[0] || ""; //Instagram
        data.socialMedia.linkedin = data.website.filter((item) => item.includes("linkedin.com"))[0] || ""; //LinkedIn
        data.socialMedia.youtube = data.website.filter((item) => item.includes("youtube.com"))[0] || ""; //YouTube
        data.socialMedia.pinterest = data.website.filter((item) => item.includes("pinterest.com"))[0] || ""; //YouTube

        //remove social media links from website array
        const socialMediaDomains = /(facebook|twitter|linkedin|instagram|youtube|pinterest)\.com/i;
        data.website = data.website.filter((item) => !item.match(socialMediaDomains));
        data.website = data.website[0] || ""; //Website

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  cleanUpSchema() {
    if (this.schema.aggregateRating) {
      this.schema.aggregateRating = this.schema.aggregateRating.replace(/\n/g, "");
    }

    if (this.schema.reviewBody) {
      delete this.schema.reviewBody;
    }

    if (this.schema.datePublished) {
      delete this.schema.datePublished;
    }

    if (this.schema.reviews) {
      delete this.schema.author;
    }

    if (this.schema.address) {
      this.schema.address = this.schema.address.replace("\nGet directions »\n\n", "");
      this.schema.address = this.schema.address.replace("\n", "");
    }

    if (this.schema.description) {
      this.schema.description = this.schema.description.replace("\nmore...\nSee more text\n", "...");
      this.schema.description = this.schema.description.replace("\n", "");
    }

    if (this.schema.itemType) {
      this.schema.itemType = this.schema.itemType.replace("http://schema.org/", "");
    }
  }
}

module.exports = { YellowPagesService };
