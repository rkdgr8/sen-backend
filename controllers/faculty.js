
const Faculty = require("../models/faculty");
const College = require("../models/colleges")
const { smtpTransport } = require("../mail.js")
const Subscriber = require("../models/subscribers.js")
const Token = require("../models/tokens.js")
const crypto = require('crypto')

exports.addSubscriber = (req, res) => {
  //console.log('hello')
  Subscriber.create(req.body).then((subs) => {
    //console.log('hello')
    const passstring = subs._id.toString()
   // console.log(passstring)
    const randomstring = crypto.randomBytes(16).toString('hex')
    
  
    //console.log(randomstring)
    Token.create({ _subscriberid: passstring,_facultyid:subs.fac, token:randomstring}).then((token) => {
     // console.log('hello again')
      smtpTransport.sendMail({
        from: '201601150@daiict.ac.in',
        to: subs.email ,
        subject: 'Confirmation mail for subscription of faculty ',
        text: 'Please verify your account by clicking on the following link  ' + ' localhost:5000/api/faculty/verify/' + token.token
      })
    }).catch((err) => {
      res.status(500).send('Something went wrong later')
    })
  }).catch((error) => {
    res.status(500).send('something went wrong earlier')
  })
}

exports.verify = (req,res) => {

  const receivedtoken = req.params.token
  console.log(receivedtoken)
  console.log(typeof(receivedtoken))
  Token.findOne({token:receivedtoken}).then( (token)=> {
   // console.log(token)
      const subid = token._subscriberid
      const facid = token._facultyid

      Subscriber.findOneAndUpdate({_id:subid,fac:facid} , {$set:{isVerified:true}}).then( (sub)=> {
        res.send(sub)

        Token.deleteOne({_id:token._id}).catch((err) => {
          res.status(500).send("Token couldn't be deleted")
        })

      }).catch( (err) => {
        res.status(500).send('something went wrong later')
      })
    }).catch( (err)=> {
        res.status(500).send('something went wrong earlier')
      })


}



exports.getFaculty = (req, res) => {
  const _id = req.params.facultyId;
  Faculty.findById({ _id })
    .then(fac => {
      if (!fac) {
        res.status(404).send();
      }
      console.log(fac._id);
      res.send(fac);
    })
    .catch(err => {
      res.status(500).send('Something went wrong');
    });
};

exports.searchFaculty = (req, res) => {
  var searchString = req.params.query;
  Faculty.find({ $text: { $search: searchString } })
    .then(fac => {
      res.send(fac);
    })
    .catch(err => {
      res.status(500).send('Search failed');
    });
};

exports.addFaculty = (req, res) => {
  Faculty.create(req.body)
    .then(fac => {
      const match = fac._id.toString();
      const addthis = {
        name: fac.name,
        id: match
      };
      College.findOneAndUpdate(
        { _id: fac.college.id },
        { $push: { faculty: addthis } }
      )
        .then(done => {
          res.status(200).send('Successfully added faculty.');
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

exports.updateFaculty = (req, res) => {
 Faculty.findByIdAndUpdate(req.body.id, req.body.faculty)
    .then(faculty => {
      College.update(
        { _id: faculty.college.id, 'faculty.id': faculty._id },
        {
          $set: { 'faculty.$.name': faculty.name }
        }
      ).then(() => {
        Subscriber.find( {}).then( (subs) => {
          var len = subs.length
          for(var i=0;i<len;i++)
            {
              if(subs[i].isVerified)
                {
                  smtpTransport.sendMail({
                    from: '201601150@daiict.ac.in',
                    to: subs[i].email ,
                    subject: 'Update of faculty ',
                    text: 'New update'
                  })
                }
              }
        }).catch( (err) => {
          res.send(500).status("Faculty updates mail not send to receipients ")
        })
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Something went wrong.');
    });

};

exports.deleteFaculty = (req, res) => {
  const id = req.params.facultyId;
  Faculty.findOneAndDelete({ _id: id })
    .exec()
    .then(faculty => {
      College.findByIdAndUpdate(faculty.college.id, {
        $pull: { faculty: { id: id } }
      })
        .then(() => {
          res.status(200).send('Successfully deleted faculty.');
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
