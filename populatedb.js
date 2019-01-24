console.log('This script populates some test products, users and bids to our database. Specified database as argument - e.g.: populatedb mongodb://mufaddalkamri4:asdfzxcv1234@ds253468.mlab.com:53468/online-auction-system');

var async = require('async');
var fs = require('fs');
var Product = require('./models/product');
var User = require('./models/user');
var Image = require('./models/image');
var Bid = require('./models/bid');


var mongoose = require('mongoose');
var mongoDB = 'mongodb://murtaza:mm8106@ds057862.mlab.com:57862/auctionware';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = [];
var images = [];
var products = [];
var bids = [];

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

function imageCreate(image_path, cb) {
    var imagedetail = {
        data: fs.readFileSync(image_path),
        contentType: 'image/jpg'
    }
    var image = new Image(imagedetail);
    image.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Image: ' + image_path);
        images.push(image);
        cb(null, image);
    });
}

function productCreate(name, initial_bid, highest_bid, image, owner, category, detail, cb) {
  var productdetail = {
    name: name,
    initial_bid: initial_bid,
    highest_bid: highest_bid,
    images: image,
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
      userCreate('Murtaza', 'Mehmudji', 'murtaza@gmail.com', 8109861206, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Shiv', 'Pratap', 'shiv@gmail.com', 9926907454, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Rajnish', 'Pratap', 'rajnish@gmail.com', 8359808247, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Nilesh', 'Prajapat', 'nilesh@gmail.com', 8982116764, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Rajnish', 'Pratap', 'rajnish@gmail.com', 8359808247, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Sakshi', 'Jain', 'sakshi@gmail.com', 7000959354, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Chandra', 'Pratap', 'chandra@gmail.com', 9644069108, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Rasika', 'Joshi', 'rasika@gmail.com', 9827853743, 'abcd1234', callback);
    },
    function (callback) {
      userCreate('Ruchita', 'Kapse', 'ruchita@gmail.com', 7987666557, 'abcd1234', callback);
    }
  ],
    // optional callback
    cb);
}

function createImages(cb) {
    async.series([
        function (callback) {
            imageCreate('images/aircraft1.jpg', callback);
        },
        function (callback) {
            imageCreate('images/aircraft2.jpg', callback);
        },
        function (callback) {
            imageCreate('images/aircraft3.jpg', callback);
        },
        function (callback) {
            imageCreate('images/car1.jpg', callback);
        },
        function (callback) {
            imageCreate('images/car2.jpg', callback);
        },
        function (callback) {
            imageCreate('images/car3.jpg', callback);
        },
        function (callback) {
            imageCreate('images/car4.jpg', callback);
        },
        function (callback) {
            imageCreate('images/house1.jpg', callback);
        },
        function (callback) {
            imageCreate('images/house2.jpg', callback);
        },
        function (callback) {
            imageCreate('images/house3.jpg', callback);
        },
        function (callback) {
            imageCreate('images/house4.jpg', callback);
        },
        function (callback) {
            imageCreate('images/jewelry1.jpg', callback);
        },
        function (callback) {
            imageCreate('images/jewelry2.jpg', callback);
        },
        function (callback) {
            imageCreate('images/jewelry3.jpg', callback);
        },
        function (callback) {
            imageCreate('images/painting1.jpg', callback);
        },
        function (callback) {
            imageCreate('images/painting2.jpg', callback);
        },
        function (callback) {
            imageCreate('images/painting3.jpg', callback);
        },
        function (callback) {
            imageCreate('images/painting4.jpg', callback);
        },
        function (callback) {
            imageCreate('images/car3.jpg', callback);
        },
    ], cb);
}

function createProducts(cb) {
  async.series([
    function (callback) {
      productCreate('Aircraft 1', 60000000, 60050000, images[0], users[6], 'aircrafts', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Aircraft 2', 70000000, 70005000, images[1], users[7], 'aircrafts', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Aircraft 3', 150000000, 150005000, images[2], users[8], 'aircrafts', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Car 1', 600000, 605000, images[3], users[0], 'cars', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Car 2', 700000, 705000, images[4], users[1], 'cars', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Car 3', 1000000, 1050000, images[5], users[2], 'cars', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Car 4', 1100000, 1150000, images[6], users[3], 'cars', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('House 1', 2000000, 2050000, images[7], users[4], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('House 2', 3000000, 3007000, images[8], users[5], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('House 3', 1500000, 1508000, images[9], users[6], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('House 4', 1000000, 1006000, images[10], users[7], 'realestate', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Jewelry 1', 1250000, 1350000, images[11], users[8], 'goldreserves', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Jewelry 2', 2000000, 2010000, images[12], users[0], 'goldreserves', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Jewelry 3', 3000000, 3020000, images[13], users[1], 'goldreserves', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Painting 1', 150000, 156000, images[14], users[2], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Painting 2', 200000, 200500, images[15], users[3], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Painting 3', 400000, 400900, images[16], users[4], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
    function (callback) {
      productCreate('Painting 4', 350000, 353000, images[17], users[5], 'paintings', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut eum eos sint aliquam adipisci consequuntur aspernatur error ipsum saepe laboriosam blanditiis, sed repudiandae perspiciatis doloremque repellendus a? Fugiat, voluptates eaque.' , callback);
    },
  ],
    // optional callback
    cb);
}


function createBids(cb) {
  async.series([
    function (callback) {
      bidCreate(60050000, products[0], users[0], callback);
    },
    function (callback) {
      bidCreate(70000000, products[1], users[1], callback);
    },
    function (callback) {
      bidCreate(150005000, products[2], users[2], callback);
    },
    function (callback) {
      bidCreate(605000, products[3], users[3], callback);
    },
    function (callback) {
      bidCreate(705000, products[4], users[4], callback);
    },
    function (callback) {
      bidCreate(1050000, products[5], users[5], callback);
    },
    function (callback) {
      bidCreate(1150000, products[6], users[6], callback);
    },
    function (callback) {
      bidCreate(2050000, products[7], users[7], callback);
    },
    function (callback) {
      bidCreate(3007000, products[8], users[8], callback);
    },
    function (callback) {
      bidCreate(1508000, products[9], users[0], callback);
    },
    function (callback) {
      bidCreate(1006000, products[10], users[1], callback);
    },
    function (callback) {
      bidCreate(1350000, products[11], users[2], callback);
    },
    function (callback) {
      bidCreate(2010000, products[12], users[3], callback);
    },
    function (callback) {
      bidCreate(3020000, products[13], users[4], callback);
    },
    function (callback) {
      bidCreate(156000, products[14], users[5], callback);
    },
    function (callback) {
      bidCreate(200500, products[15], users[6], callback);
    },
    function (callback) {
      bidCreate(400900, products[16], users[7], callback);
    },
    function (callback) {
      bidCreate(353000, products[17], users[8], callback);
    }
  ],
    // Optional callback
    cb);
}



async.series([
  createUsers,
  createImages,
  createProducts,
  createBids
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('Success Populating (results dumped from logging)');
    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
