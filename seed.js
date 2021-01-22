const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const data = [
    {
        name: 'Turkey Mountains',
        image: '',
        description: 'Turkey'
    },
    {
        name: 'Germany Mountains',
        image: '',
        description: 'Germany'
    },
    {
        name: 'Egypt Mountains',
        image: '',
        description: 'Egypt Cold Mountains'
    }
]

function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('removed campgrounds')
    });
    Comment.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('comment removed');

        /* data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('added a campground');
                    Comment.create({
                        text: 'This place is great, but i wish there was internet',
                        author: 'Abdullah'
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created a comment");
                        }
                    })
                }
            })
        }); */
    });
    User.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('users removed');
    });
}

module.exports = seedDB;