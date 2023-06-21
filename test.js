var { YellowPagesService } = require("./index.js");

(async () => {
  var yps = await new YellowPagesService();
  yps.getYellowPagesData(["514-722-7733"], (data) => {
    console.log(data);
  });
})();
