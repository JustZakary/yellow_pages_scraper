var { YellowPagesService } = require("./index2.js");
var fs = require("fs");

(async () => {
  var yps = await new YellowPagesService();
  yps.getYellowPagesData("+1705476 3373", (err, body) => {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
      fs.writeFileSync("test.json", JSON.stringify(body, null, 2));
    }
  });
})();
