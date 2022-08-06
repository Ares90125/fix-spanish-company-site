const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mysql = require('mysql')

const User = require('../models/User')
const Doc = require('../models/Doc')
const Activity = require('../models/Activity')
var nodemailer = require('nodemailer')

users.use(cors())

const con = mysql.createPool({
  connectionLimit: 10000,
  host: "localhost",
  user: "root",
  password: "",
  database: "web",
  debug: false
});

process.env.SECRET_KEY = 'secret'

let alert_new_user = [];
let alert_new_doc = [{}];
const confirmMail = (toAdd) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'codebeast0420@gmail.com',
      pass: 'codebeast0420!@#',
      clientId: '285817227208-submk3onndptffg48ginmqvlsev80on8.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04Bm_2KBmxquVCgYIARAAGAQSNwF-L9IrNVN_ffYeesuNkRldmYNvHG4ixabEL0K7c-ehioL0tKLnXSCxMD6qcxs6EwxV5ePDiOM'
    }
  });
  let mailOptions = {
    from: '"From Project-2022-01" <codebeast0420@gmail.com>',
    to: toAdd,
    subject: 'Nodemailer Project',
    text: 'You Register Success'
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    surname: req.body.surname,
    second_surname: req.body.second_surname,
    actividad: req.body.actividad,
    telephone: req.body.telephone,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    buildingnumber: req.body.buildingnum,
    zip: req.body.zip,
    billingname: req.body.billingname,
    billingaddress: req.body.billingadd,
    vat: req.body.vat,
    othertax: req.body.otherTax,
    role: 0,
    // bankaccount: req.body.bankaccount,
    category: 0,
    createdAt: today
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                // expiresIn: 14400
              })
              res.json({ token: token });

              alert_new_user = [...alert_new_user, req.body.email];
              console.log("alert", alert_new_user);
              // confirmMail(req.body.email);
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })

      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/register-com', (req, res) => {
  const today = new Date()
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    surname: req.body.surname,
    second_surname: req.body.second_surname,
    position: req.body.position,
    actividad: req.body.actividad,
    telephone: req.body.telephone,
    companyName: req.body.companyName,
    website: req.body.companysite,
    employees: req.body.employeeNum,
    products: req.body.products,
    subsidary: req.body.subsidiary,
    country: req.body.country,
    city: req.body.city,
    street: req.body.street,
    buildingnumber: req.body.buildingnumber,
    zip: req.body.zip,
    billingname: req.body.billingname,
    billingaddress: req.body.billingadd,
    vat: req.body.vat,
    role: 0,
    othertax: req.body.otherTax,
    // bankaccount: req.body.bankaccount,
    category: 1,
    createdAt: today
  }

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                // expiresIn: 14400
              })
              res.json({ token: token });
              alert_new_user = [...alert_new_user, req.body.email];
              console.log("alert", alert_new_user);
              // confirmMail(req.body.email);
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })

      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})
users.post('/read-doc', (req, res) => {
  let qry = "SELECT * FROM docs WHERE userId=" + req.body.sendId;
  console.log(req.body.sendId);
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})
users.post('/login', (req, res) => {
  if (!req.body.email) {
    throw Error("Something went wrong!")
  }
  
  let qry="SELECT * FROM users WHERE email='" + req.body.email+"'";
  console.log(qry);
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    if(result[0]){
      
      // bcrypt.hash(req.body.password, 10, (err, hash) => {
      //   console.log("__________"+hash);
      // });
      if (bcrypt.compareSync(req.body.password, result[0].password)) {
          const token = jwt.sign({
            id:result[0].id,
            email:result[0].email
          }, process.env.SECRET_KEY, {
            // expiresIn: '2h'
          });
          res.json({ token: token });
          // alert_new_user = [...alert_new_user, req.body.email];
          // console.log("alert", alert_new_user);
        } else {
          res.json({ error: 'Wrong Password!' });
        }
    }
    else{
      res.json({ error: 'User does not exist' });
    }
  });
  // User.findOne({
  //   where: {
  //     email: req.body.email
  //   }
  // })
  //   .then(user => {
  //     if (user) {
  //       if (bcrypt.compareSync(req.body.password, user.password)) {
  //       let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
  //         // expiresIn: 14400
  //       })
  //       res.json({ token: token });
  //         // alert_new_user = [...alert_new_user, req.body.email];
  //         // console.log("alert", alert_new_user);
  //       } else {
  //         res.json({ error: 'Wrong Password!' });
  //       }
  //     } else {
  //       res.json({ error: 'User does not exist' });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(400).json({ error: err })
  //   })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
  User.findOne({
    where: {
      id: decoded.id,
      email: decoded.email
    }
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('user does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})



users.put('/password', function (req, res, next) {
  if (req.headers['authorization']) {
    if (!req.body.email && !req.body.password && !req.body.new_password && !req.body.confirm_password) {
      res.status(400)
      res.json({
        error: 'Bad Data'
      })
    } else {

      User.findOne({
        where: {
          email: req.body.email
        }
      })
        .then(user => {
          if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
              bcrypt.hash(req.body.new_password, 10, (err, hash) => {
                User.update(
                  { password: hash },
                  { where: { email: req.body.email } }
                )
                  .then(() => {
                    res.json({ status: 'success', message: 'Password Updated !' })
                  })
                  .error(err => handleError(err))
              })
            } else {
              res.json({
                status: 'failed',
                message: 'Old password not matched'
              });
            }
          }
        })
    }
  }
  else {
    res.json({ status: 'failed', message: 'Token not passed !' })
  }
})

users.get('/acitivity', (req, res) => {
  Activity.findAll()
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        console.log("no")
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/get-all-users', (req, res) => {
  User.findAll()
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        console.log("no")
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/upload', async (req, res) => {
  if (!req.files) {
    throw Error("FILE_MISSING")
  }
  // const newpath = "frontend/public/files/";
  const newpath = "files/";
  console.log("path", newpath);
  const file = req.files.file;
  const filename = req.body.fileName;
  await file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      res.status(500).send({ message: err, code: 200 });
    }
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});

users.post('/save-doc', (req, res) => {
  const today = new Date()
  const docData = {
    docname: req.body.docname,
    userId: req.body.userId,
    author: req.body.author,
    createdAt: today,
    creation_date: req.body.creation_date,
    affects: req.body.affects,
    dockeyword: req.body.dockeyword,
    description: req.body.description,
    information: req.body.information,
    status: req.body.status,
    priority: req.body.priority,
    inspected: req.body.inspected,
    urgent: req.body.urgent,
    inprocess: 1,
    category: req.body.category
  }

  Doc.findOne({
    where: {
      docname: req.body.docname
    }
  })
    .then(doc => {
      if (!doc) {
        Doc.create(docData)
          .then(doc => {
            res.json({ success: "success" });
            let qry = "SELECT name FROM users WHERE id='" + req.body.userId + "'";
            con.query(qry, function (err, result, fields) {
              if (err) throw err;
              console.log(result);
              alert_new_doc = [...alert_new_doc, { 'name': result, 'docname': req.body.docname }]
            });
            console.log("doc", alert_new_doc);
          })
          .catch(err => {
            res.send('error: ' + err)
          })
      } else {
        res.json({ error: 'Document already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
});

users.post('/read-doc', (req, res) => {
  let qry = "SELECT * FROM docs WHERE userId=" + req.body.sendId;
  console.log(req.body.sendId);
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

users.post('/search-name', (req, res) => {
  let qry = "SELECT * FROM users WHERE name='" + req.body.name + "'";
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
})

users.post('/search-detail', (req, res) => {
  let qry = "SELECT * FROM users WHERE name LIKE '%"
    + req.body.detail + "%' OR email LIKE '%"
    + req.body.detail + "%' OR country LIKE '%"
    + req.body.detail + "%' OR city LIKE '%"
    + req.body.detail + "%' OR street LIKE '%"
    + req.body.detail + "%' OR buildingnumber LIKE '%"
    + req.body.detail + "%' OR telephone LIKE '%"
    + req.body.detail + "%' OR zip LIKE '%"
    + req.body.detail + "%' OR billingname LIKE '%"
    + req.body.detail + "%' OR billingaddress LIKE '%"
    + req.body.detail + "%' OR vat LIKE '%"
    + req.body.detail + "%' OR othertax LIKE '%"
    + req.body.detail + "%' OR createdAt LIKE '%"
    + req.body.detail + "%' OR bankaccount LIKE '%"
    + req.body.detail + "%'";
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

users.post('/modify-detail', (req, res) => {
  let qry;
  console.log(req.body.content);
  if(req.body.category === 1)
    qry = "UPDATE users SET name='" + req.body.content.name
      + "', street='" + req.body.content.street
      + "', email='" + req.body.content.email
      + "', buildingnumber='" + req.body.content.buildingnumber
      + "', zip='" + req.body.content.zip
      + "', billingname='" + req.body.content.billingname
      + "', billingaddress='" + req.body.content.billingaddress
      + "', vat='" + req.body.content.vat
      + "', surname='" + req.body.content.surname
      + "', second_surname='" + req.body.content.second_surname
      + "', actividad='" + req.body.content.actividad
      + "', telephone='" + req.body.phone
      + "', country='" + req.body.content.country
      + "', city='" + req.body.content.city
      + "', buildingnumber='" + req.body.content.buildingnumber
      + "', position='" + req.body.content.position
      + "', website='" + req.body.content.website
      + "', products='" + req.body.content.products
      + "', subsidary='" + req.body.content.subsidary
      + "', employees='" + req.body.content.employees
      + "' WHERE id=" + req.body.sendId;
  else
    qry = "UPDATE users SET name='" + req.body.content.name
      + "', street='" + req.body.content.street
      + "', buildingnumber='" + req.body.content.buildingnumber
      + "', zip='" + req.body.content.zip
      + "', email='" + req.body.content.email
      + "', billingname='" + req.body.content.billingname
      + "', billingaddress='" + req.body.content.billingaddress
      + "', vat='" + req.body.content.vat
      + "', surname='" + req.body.content.surname
      + "', second_surname='" + req.body.content.second_surname
      + "', actividad='" + req.body.content.actividad
      + "', telephone='" + req.body.phone
      + "', country='" + req.body.content.country
      + "', city='" + req.body.content.city
      + "', buildingnumber='" + req.body.content.buildingnumber
      + "' WHERE id=" + req.body.sendId;
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    res.send("success");
  });
})

users.post('/send-mail', async (req, res) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'codebeast0420@gmail.com',
      pass: 'codebeast0420!@#',
      clientId: '285817227208-submk3onndptffg48ginmqvlsev80on8.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04Bm_2KBmxquVCgYIARAAGAQSNwF-L9IrNVN_ffYeesuNkRldmYNvHG4ixabEL0K7c-ehioL0tKLnXSCxMD6qcxs6EwxV5ePDiOM'
    }
  });
  let mailOptions = {
    from: 'codebeast0420@gmail.com',
    to: 'codebeast0420@gmail.com',
    subject: 'Nodemailer Project',
    text: 'Hi from your nodemailer project'
  };

  await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
  let qry = "UPDATE docs SET inprocess='" + req.body.inprocess
    + "' WHERE id=" + req.body.sendId;
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    res.send("success");
  });
});

users.post('/get-docs', (req, res) => {
  let qry = "SELECT * FROM docs WHERE userId=(SELECT id FROM users WHERE email='" + req.body.email + "')";
  con.query(qry, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
})

users.get('/get-all-docs', (req, res) => {
  Doc.findAll()
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        console.log("no")
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/notification', (req, res) => {
  res.json({
    'user': alert_new_user,
    'doc': alert_new_doc
  });
})

users.get('/reset-doc-alert', (req, res) => {
  alert_new_doc = [{}];
  console.log("alert_new_doc", alert_new_doc);
  res.send("ok");
})

users.get('/reset-user-alert', (req, res) => {
  alert_new_user = [];
  console.log("alert_new_user", alert_new_user);
  res.send("ok");
})

module.exports = users;