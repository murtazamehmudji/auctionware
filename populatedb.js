/*
console.log('This script populates some test products, users and bids to our database. Specified database as argument - e.g.: populatedb mongodb://mufaddalkamri4:asdfzxcv1234@ds253468.mlab.com:53468/online-auction-system');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}
*/

var async = require('async')
var Product = require('./models/product')
var User = require('./models/user')
var Bid = require('./models/bid')


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/online-auction-system';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var products = []
var bids = []

function userCreate(first_name, last_name, email, mobile, password, cb) {
  var userdetail = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    mobile: mobile,
    password: password
  }

  var user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  });
}

function productCreate(name, initial_bid, highest_bid, image_url, owner, category, detail, cb) {
  var productdetail = {
    name: name,
    initial_bid: initial_bid,
    highest_bid: highest_bid,
    image_url: image_url,
    owner: owner,
    detail: detail
  }
  if (category != false) productdetail.category = category;

  var product = new Product(productdetail);
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Product: ' + product);
    products.push(product)
    cb(null, product)
  });
}


function bidCreate(amount, product, user, cb) {
  var biddetail = {
    amount: amount,
    product: product,
    user: user
  }

  var bid = new Bid(biddetail);
  bid.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Bid: ' + bid);
      cb(err, null)
      return
    }
    console.log('New Bid: ' + bid);
    bids.push(bid)
    cb(null, product)
  });
}


function createUsers(cb) {
  async.series([
    function (callback) {
      userCreate('Murtaza', 'Mehmudji', 'murtaza@gmail.com', 8109861206, 'abcd@1324', callback);
    },
    function (callback) {
      userCreate('Shiv', 'Pratap', 'shiv@gmail.com', 9926907454, 'abcd@1324', callback);
    },
    function (callback) {
      userCreate('Rajnish', 'Pratap', 'rajnish@gmail.com', 8359808247, 'abcd@1324', callback);
    },
    function (callback) {
      userCreate('Nilesh', 'Prajapat', 'nilesh@gmail.com', 8982116764, 'abcd@1324', callback);
    },
    function (callback) {
      userCreate('Chandra', 'Pratap', 'chandra@gmail.com', 9644069108, 'abcd@1324', callback);
    }
  ],
    // optional callback
    cb);
}


function createProducts(cb) {
  async.series([
    function (callback) {
      productCreate('Lil Villas Type 3 | Light Finish | Sharjah', 69000000, 71000000, 'https://cdn.pixabay.com/photo/2013/10/09/02/27/boat-house-192990_960_720.jpg', users[0], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Independent 4BR Villa | Nakheel Villas | Qatar', 56600000, 58000000, 'https://cdn.pixabay.com/photo/2013/10/09/02/27/boat-house-192990_960_720.jpg', users[1], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.', callback);
    },
    function (callback) {
      productCreate('Panthére en Marche by MAURICE PROST (1894-1967)', 1802628, 2000000, 'https://cdn.pixabay.com/photo/2018/02/24/20/39/clock-3179167_960_720.jpg', users[2], 'antiques', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.', callback);
    },
    function (callback) {
      productCreate('French Bronze Statue, Pax et Labor, 18th Century', 336512, 500000, 'https://cdn.pixabay.com/photo/2018/02/24/20/39/clock-3179167_960_720.jpg', users[3], 'antiques', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.', callback);
    },
    function (callback) {
      productCreate('H. Landeman late 19th century German OIL PAINTING', 68900, 90000, 'https://cdn.pixabay.com/photo/2018/09/28/21/10/st-petersburg-3710243_960_720.jpg', users[4], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.', callback);
    },
    function (callback) {
      productCreate('Roger Bradbury 19th Century Italian Portrait Travelling Musician', 75600, 100000, 'https://cdn.pixabay.com/photo/2018/09/28/21/10/st-petersburg-3710243_960_720.jpg', users[0], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.', callback);
    }
  ],
    // optional callback
    cb);
}


function createBids(cb) {
  async.series([
    function (callback) {
      bidCreate(70000000, products[0], users[1], callback);
    },
    function (callback) {
      bidCreate(71000000, products[0], users[2], callback);
    },
    function (callback) {
      bidCreate(57000000, products[1], users[0], callback);
    },
    function (callback) {
      bidCreate(57500000, products[1], users[2], callback);
    },
    function (callback) {
      bidCreate(58000000, products[1], users[3], callback);
    },
    function (callback) {
      bidCreate(1902628, products[2], users[0], callback);
    },
    function (callback) {
      bidCreate(2000000, products[2], users[1], callback);
    },
    function (callback) {
      bidCreate(400000, products[3], users[0], callback);
    },
    function (callback) {
      bidCreate(500000, products[3], users[4], callback);
    },
    function (callback) {
      bidCreate(80000, products[4], users[1], callback);
    },
    function (callback) {
      bidCreate(90000, products[4], users[3], callback);
    },
    function (callback) {
      bidCreate(80000, products[5], users[1], callback);
    },
    function (callback) {
      bidCreate(100000, products[5], users[4], callback);
    }
  ],
    // Optional callback
    cb);
}



async.series([
  createUsers,
  createProducts,
  createBids
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Bids: ' + bids);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
