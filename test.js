var { YellowPagesService } = require("./index.js");

(async () => {
  var yps = await new YellowPagesService();
  // All of these formats are valid
  console.log(await yps.getYellowPagesDataFromUrl("https://www.yellowpages.ca/bus/Ontario/Belleville/Sexual-Assault-Domestic-Violence-Program-Of-Hast-ings/102517483.html"));
})();
