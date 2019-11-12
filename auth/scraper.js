const IndeedService = require("scrape-indeed")();
const scrape = options => {
  // Get initial Indeed data using IndeedService.query()
  return IndeedService.query(options)
    .then(function(data) {
      return data.jobList;
    })
    .catch(function(err) {
      console.log("Error: " + err);
    });
};

module.exports = scrape;
