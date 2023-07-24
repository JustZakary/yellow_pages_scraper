var { YellowPagesService } = require("./index.js");

(async () => {
  var yps = await new YellowPagesService();
  // All of these formats are valid
  console.log(await yps.getYellowPagesData("+1-905-399-2842"));
})();
