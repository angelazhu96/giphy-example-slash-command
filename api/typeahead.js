var key = require('../utils/key');
var request = require('request');
var _ = require('underscore');


// The Type Ahead API.
module.exports = function(req, res) {
  var term = req.query.text.trim();
  if (!term) {
    res.json([{
      title: '<i>(enter a search term)</i>',
      text: ''
    }]);
    return;
  }

  request({
    url: 'http://www.reddit.com/search/.json',
    qs: {
      limit: 15,
      count: 0,
      type: "link",
      q: term
    },
    gzip: true,
    json: true,
    timeout: 10 * 1000
  }, function(err, response) {
    if (err || response.statusCode !== 200 || !response.body || !response.body.data) {
      res.status(500).send('Error');
      return;
    }

    var results = _.chain(response.body.data.children)
      //.reject(function(image) {
       // return !image || !image.images || !image.images.fixed_height_small;
      //})
      .map(function(ret) {
          var send = { url: ret.data.url,
                      title: ret.data.title}
        return {
          title: '<a href="' + ret.data.url + '">' + ret.data.title +'</a>',// '<img style="height:75px" src="' + image.images.fixed_height_small.url + '">',
          
          text: JSON.stringify(send)
        };
      })
      .value();

    if (results.length === 0) {
      res.json([{
        title: '<i>(no results)</i>',
        text: ''
      }]);
    } else {
      res.json(results);
    }
  });
};
