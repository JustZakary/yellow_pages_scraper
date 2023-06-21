var { YellowPagesService } = require("./index.js");

(async () => {
  var yps = await new YellowPagesService();
  yps.getYellowPagesData(["705-472-7510"], (data) => {
    console.log(data);
  });
})();
