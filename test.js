var { YellowPagesService } = require("./index.js");

(async () => {
  var yps = await new YellowPagesService();
  // All of these formats are valid
  console.log(await yps.getYellowPagesData("705-476-3373"));
  console.log(await yps.getYellowPagesData("705 476 3373"));
  console.log(await yps.getYellowPagesData("+1705476 3373"));
  console.log(await yps.getYellowPagesData("1-705-476-3373"));
})();
