// Import required modules
const fs = require("fs");

// Define a class for the Yellow Pages service
class YellowPagesService {
  constructor(puppeteerService) {
    if (puppeteerService) {
      this.puppeteerService = puppeteerService;
    } else {
      const puppeteer = require("puppeteer");
      (async () => {
        this.puppeteerService = await puppeteer.launch({ headless: "new" });
      })();
    }
  }

  // Define a method to get Yellow Pages data for a given phone number
  async getYellowPagesData(phoneNumbers, callback) {
    while (!this.puppeteerService) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (typeof phoneNumbers == "string") {
      phoneNumbers = [phoneNumbers];
    }

    var results = [];
    for (let index = 0; index < phoneNumbers.length; index++) {
      const number = phoneNumbers[index];
      const url = `https://www.yellowpages.ca/search/re/1/${number.replace(/\D/g, "")}`; // Remove all non-numeric characters from the phone number
      const page = await this.puppeteerService.newPage(); // Create a new page using Puppeteer
      await page.goto(url); // Navigate to the Yellow Pages URL
      if (page.url().includes("https://www.yellowpages.ca/fs/")) {
        results.push({
          number: number,
          success: false,
          error: "No results found",
        });
        continue;
      }
      const yellowPagesData = await page.evaluate(() => {
        // Initialize an empty object to store the extracted data
        var data = {};

        // Find all elements with class "newMessage" with inner text of "Website" and grab parents parent href
        const websiteElement = document.querySelectorAll(".newMessage");
        if (websiteElement.length === 0) {
          data["website"] = "";
        } else {
          for (const element of websiteElement) {
            if (element.innerText === "Website") {
              var foundWebsite = decodeURIComponent(
                element.parentElement.parentElement.getAttribute("href").split("?redirect=")[1]
              );
              // Check if website is a social media link
              if (
                foundWebsite.includes("facebook.com") ||
                foundWebsite.includes("instagram.com") ||
                foundWebsite.includes("twitter.com") ||
                foundWebsite.includes("linkedin.com") ||
                foundWebsite.includes("youtube.com") ||
                foundWebsite.includes("pinterest.com")
              ) {
                foundWebsite = "";
              }
              data["website"] = foundWebsite;
            }
          }
        }

        // Find img with alt that contains " - Logo" and grab src
        const logoElement = document.querySelectorAll("img");
        for (const element of logoElement) {
          if (element.getAttribute("alt")) {
            if (element.getAttribute("alt").includes(" - Logo")) {
              data["logo"] = element.getAttribute("src");
            }
          }
        }

        // Collect all hrefs that start with "/gourl/"
        var links = [];
        const aElements = document.querySelectorAll("a");
        for (const element of aElements) {
          // Check if URL starts with "/gourl/"
          if (element.getAttribute("href")) {
            if (element.getAttribute("href").startsWith("/gourl/")) {
              // Grab "?redirect=" parameter and format back to string
              const redirect = element.getAttribute("href").split("?redirect=")[1];
              const redirectString = decodeURIComponent(redirect);
              links.push(redirectString);
            }
          }
        }

        // Find all elements with an "itemprop" attribute and add their values to the data object
        const infoElements = document.querySelectorAll("[itemprop]");
        for (const element of infoElements) {
          // Check if value already exists
          if (!data[element.getAttribute("itemprop")]) {
            if (element.getAttribute("itemprop") === "description") {
              const spanElement = element.querySelector("span");
              if (spanElement && spanElement.innerText) {
                data.description = element.innerText.replace("more...", spanElement.innerText);
              }
            } else {
              const innerText = element.innerText;
              if (innerText) {
                data[element.getAttribute("itemprop")] = innerText;
              }
            }
          }
        }

        // Return the extracted data
        return {
          success: true,
          data: data,
          links: [...new Set(links)],
        };
      });

      if (yellowPagesData.success) {
        results.push({
          number: number,
          success: true,
          yellowpage: page.url(),
          logo: yellowPagesData.data.logo || "",
          business_name: yellowPagesData.data.name || "",
          description: yellowPagesData.data.description || "",
          street_address: yellowPagesData.data.streetAddress || "",
          city: yellowPagesData.data.addressLocality || "",
          province: yellowPagesData.data.addressRegion || "",
          postal_code: yellowPagesData.data.postalCode || "",
          phone_number: number,
          website: yellowPagesData.data.website || "",
          facebook_page: yellowPagesData.links.filter((link) => link.includes("facebook.com"))[0] || "",
          instagram_page: yellowPagesData.links.filter((link) => link.includes("instagram.com"))[0] || "",
          twitter_page: yellowPagesData.links.filter((link) => link.includes("twitter.com"))[0] || "",
          linkedin_page: yellowPagesData.links.filter((link) => link.includes("linkedin.com"))[0] || "",
          youtube_page: yellowPagesData.links.filter((link) => link.includes("youtube.com"))[0] || "",
          pinterest: yellowPagesData.links.filter((link) => link.includes("pinterest.com"))[0] || "",
        });
      } else {
        results.push({
          number: number,
          success: false,
          error: yellowPagesData.error,
        });
        await page.close();
      }
    }
    if (results.length === 1) {
      callback(results[0]);
    } else {
      callback(results);
    }
  }

  //close the browser and delete the instance
  async close() {
    if (this.browser && this.browser.isConnected()) {
      const pages = await this.browser.pages();
      await Promise.all(pages.map((page) => page.close()));
      await this.browser.close();
    }
  }
}

module.exports = { YellowPagesService };
