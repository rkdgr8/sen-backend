const College = require('../models/colleges');
const Admin = require('../models/administrators');
const Faculty = require('../models/faculty');

exports.addCollege = function(req, res) {
  Admin.create(req.body.admin)
    .then(admin => {
      College.create({
        name: req.body.college.name,
        location: {
          country: req.body.college.location.country,
          city: req.body.college.location.city
        },
        administrator: admin._id
      })
        .then(college => {
          Admin.findByIdAndUpdate(admin._id, {
            college: { name: college.name, id: college._id }
          })
            .then(() => {
              res
                .status(200)
                .send('Successfully added college & college admin.');
            })
            .catch(err => {
              console.log(err);
              res.status(500).send('Something went wrong.');
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send('Something went wrong.');
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Something went wrong.');
    });
};

exports.updateCollege = (req, res) => {
  College.findOneAndUpdate({ _id: req.body.id }, req.body.college)
    .then(college => {
      Faculty.updateMany(
        { college: { id: college._id } },
        {
          college: { name: college.name, id: college._id }
        }
      )
        .then(() => {
          Admin.findOneAndUpdate({ _id: college.administrator }, req.body.admin)
            .then(() => {
              res.status(200).send('Successfully updated college.');
            })
            .catch(err => {
              console.log(err);
              res.status(500).send('Something went wrong.');
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).send('Something went wrong.');
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Something went wrong.');
    });
};

exports.searchCollege = (req, res) => {
  var searchString = req.params.query;
  College.find({ $text: { $search: searchString } })
    .then(cllg => {
      res.send(cllg);
    })
    .catch(err => {
      res.status(500).send('Search failed');
    });
};

exports.getCollege = (req, res) => {
  const _id = req.params.collegeId;
  College.findById(_id)
    .then(college => {
      if (!college) {
        return res.status(404).send();
      }
      res.send(college);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Something went wrong');
    });
};

exports.deleteCollege = (req, res) => {
  const _id = req.params.collegeId;
  College.findByIdAndDelete(_id)
    .then(college => {
      Admin.deleteOne({ _id: college.administrator }).catch(err => {
        console.log(err);
        res.status(500).send('Something went wrong.');
      });
      for (let i = 0; i < college.faculty.length; i++) {
        Faculty.deleteOne({ _id: college.faculty[i].id }).catch(err => {
          console.log(err);
          res.status(500).send('Something went wrong.');
        });
      }
    })
    .then(() => {
      res.status(200).send('Successfully deleted college.');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Something went wrong.');
    });
};

exports.getAllColleges = (req, res) => {
  College.find()
    .exec()
    .then(colleges => {
      res.status(200).send({
        message: 'Successfully fetched all colleges.',
        data: colleges
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ message: 'Something went wrong.' });
    });
};
