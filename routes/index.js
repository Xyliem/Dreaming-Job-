var express = require('express');
var router = express.Router();
const connection = require('../bdd/connection');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var async = require('async');
var test = undefined;
var emailConnection = undefined;


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.admin);
  if (req.session.theme==undefined) {
    req.session.theme=0;
  }
  var i =0
  connection.query("SELECT * FROM ADVERTISEMENT INNER JOIN COMPAGNIES ON COMPAGNIES.id_comp = ADVERTISEMENT.compagnie_Id", function (err, rows) {
    rows.forEach(async (element) => {
      connection.query("SELECT COUNT(*) AS compteur FROM INFORMATION WHERE  advertisement_id="+element.id, function (err4, rows4) {
        if (err4) {
          res.send(err4);
        }else{
          element.compteur = rows4[0].compteur;
        }
        i++;
      });
    });
    j=0
    while (j<100000) {
      j++;
    }
      if(err) {
        req.flash('error', err);
        res.render('index',{data:'', data2: '', name:'', admin: req.session.admin, data3:'', isOpen: test, theme:req.session.theme}); 
      }else if (req.session.name!=undefined) {
      connection.query("SELECT * FROM PEOPLE WHERE id_people="+req.session.idUser, function (err2, rows2) {
        if (err2) {
          res.send(err2);
        }else{
          var name = rows2[0].name.split(" ");
          connection.query('SELECT advertisement_id FROM INFORMATION WHERE people_id='+req.session.idUser, function (err3, rows3) {
            if (err3) {
              res.send(err3);
            }else{
                if (req.session.admin==1) {
                  test = undefined;
                  res.render('index',{data:rows, data2:rows2, name: name, admin: req.session.admin, data3:rows3, isOpen: test, theme:req.session.theme});
                }else if (rows3.length) {
                  if (rows3[0].advertisement_id==test) {
                    test = undefined;
                    res.render('index',{data:rows, data2:rows2, name: name, admin: req.session.admin, data3:rows3, isOpen: test, theme:req.session.theme});
                  }else{
                    res.render('index',{data:rows, data2:rows2, name: name, admin: req.session.admin, data3:rows3, isOpen: test, theme:req.session.theme});
                    test = undefined;
                  }
                }else{
                  res.render('index',{data:rows, data2:rows2, name: name, admin: req.session.admin, data3:rows3, isOpen: test, theme:req.session.theme});
                  test = undefined;
                }
            }
          })
        }
      })
    }else{
        res.render('index',{data:rows, data2:'', name:'', admin: req.session.admin, data3:'', isOpen: test, theme:req.session.theme});
    }
  })
});

router.get('/connection', function (req, res, next){
  if (req.session.theme==undefined) {
    req.session.theme=0;
  }
  res.render('login', {emailConnection: emailConnection, type:'connection', fname:'', lname:'', email:'', numTel:'', err:undefined, err2:undefined, theme:req.session.theme});
})

router.post('/addPeople', function (req, res, next) {
    var fname = req.body.fname; var lname = req.body.lname;
    var name = fname+" "+lname;
    var email = req.body.email;
    var num_Tel = req.body.num_Tel;
    console.log(req.body);
    var pays_Tel = req.body.pays_Tel;
    var admin = req.body.admin;
    var password = req.body.mdp;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var telformat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (fname=="" || lname=="" ||fname==undefined || lname==undefined ) {
      res.render('login', {emailConnection: emailConnection, type:'inscription', fname:'', lname:'', email:'', numTel:'', err:undefined, err2:'Name empty', theme:req.session.theme});
    }else if (email==undefined || !email.match(mailformat)) {
      res.render('login', {emailConnection: emailConnection, type:'inscription', fname:req.body.fname, lname:req.body.lname, email:'', numTel:'', err:undefined, err2:'E-mail ne correspond pas', theme:req.session.theme});
    }else if (password=="" || password==undefined) {
      res.render('login', {emailConnection: emailConnection, type:'inscription', fname:req.body.fname, lname:req.body.lname, email:req.body.email, numTel:'', err:undefined, err2:'Vous devez créer un mot de passe', theme:req.session.theme});
    }else if (num_Tel==undefined || !num_Tel.match(telformat)) {
      console.log("err2");
      res.render('login', {emailConnection: emailConnection, type:'inscription', fname:req.body.fname, lname:req.body.lname, email:req.body.email, numTel:'', err:undefined, err2:"Ce n'est pas un numéro valable", theme:req.session.theme});
    }else if (pays_Tel==undefined) {
      res.render('login', {emailConnection: emailConnection, type:'inscription', fname:req.body.fname, lname:req.body.lname, email:req.body.email, numTel:req.body.num_Tel, err:undefined, err2:"Vous devez choisir le pays de votre numéro", theme:req.session.theme});
    }else{
      connection.query('SELECT id_people FROM PEOPLE WHERE email="'+email+'"', function (err, rows){
        console.log("R : "+rows);
        console.log("E : "+err);
        if (rows.length) {
          console.log("Email already exist");
          res.render('login', {emailConnection: emailConnection, type:'inscription', fname:req.body.fname, lname:req.body.lname, email:'', numTel:req.body.num_Tel, err:undefined, err2:'E-mail already exist', theme:req.session.theme});
        }else{
          bcrypt.hash(password, 10, function (err, hash) {
            connection.query('INSERT INTO PEOPLE (name, email, num_Tel, pays_Tel, password, admin) VALUES ("'+name+'", "'+email+'", "'+num_Tel+'","'+pays_Tel+'", "'+hash+'", '+admin+')', function (err, rows) {
                if (err) {
                  res.send(err);
                }else{
                    req.flash('People added successfully');
                    res.render('login', {emailConnection: email, type:'connection', fname:'', lname:'', email:'', numTel:'', err:undefined, err2:undefined, theme:req.session.theme});
                }
            })
          });
        }
      })
    }
})


router.post('/login', function (req, res, next) {
  if (req.body.submit=='inscription') {
    res.render('login', {emailConnection: emailConnection, type:'inscription', fname:'', lname:'', email:'', numTel:'', err:undefined, err2:undefined, theme:req.session.theme});
  }else{
    var email = req.body.email_Connection;
    var password = req.body.password_Connection;
  
    connection.query('SELECT * FROM PEOPLE WHERE email="'+email+'"', function (err, rows) {
      if (rows.length) {
        bcrypt.compare(password, rows[0].password, function (err, result) {
          if (result) {
            console.log(rows[0].id_people);
            req.session.idUser = rows[0].id_people;
            req.session.name = rows[0].name;
            req.session.admin = rows[0].admin;
            console.log(req.session.id);
            test=req.body.idConnection;
            res.redirect("/");
          }else{
            res.render('login', {emailConnection: email, type:'connection', fname:'', lname:'', email:'', numTel:'', err:'Mot de passe ou E-mail incorrect', err2:undefined, theme:req.session.theme});
          }
        })
      }else{
        res.render('login', {emailConnection: email, type:'connection', fname:'', lname:'', email:'', numTel:'', err:'Mot de passe ou E-mail incorrect', err2:undefined, theme:req.session.theme});
      }
    })
  }
})

router.get('/logout', function(req, res, next){
  req.session.id = undefined;
  req.session.name = undefined;
  req.session.admin = undefined;
  res.redirect('/');
})

router.post('/apply', function (req, res, next) {
  if (req.session.name != undefined) {
    var id_ad = req.body.id;
    var id_people = req.session.idUser;
    var name = req.body.fname + " " + req.body.lname;
    var email = req.body.email;
    var num_Tel = req.body.tel;
    var message = req.body.message;
    var idInfo = -1;
    console.log('UPDATE PEOPLE SET name="'+name+'", email="'+email+'", num_Tel="'+num_Tel+'" WHERE id_people='+id_people);
    connection.query('UPDATE PEOPLE SET name="'+name+'", email="'+email+'", num_Tel="'+num_Tel+'" WHERE id_people='+id_people, function (err, rows) {
      if(err){
        res.send("Erreur 1" + err);
      }else{
        console.log('INSERT INTO INFORMATION (advertisement_id, people_id, message) VALUES ('+id_ad+','+id_people+',"'+message+'")');
        connection.query('INSERT INTO INFORMATION (advertisement_id, people_id, message) VALUES ('+id_ad+','+id_people+',"'+message+'")', function (err, rows2) {
          if (err) {
            res.send("Erreur 2" +err);
          }else{
            idInfo = rows2.insertId;
            console.log("IdInfo : "+idInfo);
            connection.query('SELECT * FROM INFORMATION inf INNER JOIN ADVERTISEMENT ad ON ad.id=inf.advertisement_id INNER JOIN COMPAGNIES comp ON comp.id_comp = ad.compagnie_Id INNER JOIN PEOPLE peo ON peo.id_people=ad.people_In_Charge WHERE id_info='+idInfo, function (err, rows3) {
                
              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: 'dreaming.job.project@gmail.com',
                    pass: 'blablibloblu'
                  }
                });
                transporter.sendMail({
                  from: "dreaming.job.project@gmail.com", // sender address
                  to: rows3[0].email, // list of receivers
                  subject: "New Apply for "+rows3[0].title+" of "+rows3[0].nom, // Subject line
                  html: '<p>'+name+' has apply for the job : '+rows3[0].title+' for the compagnie : '+rows3[0].nom+'</p><br><p>You can Go to the <a href="http://localhost:3000/">Site</a> for more information:</p>' // plain text body
                });
            })
            res.redirect('/');
          }
        })
      }
    })
  }else{
    res.redirect('/');
  }
})

router.post('/deleteAd', function(req, res, next){
  if (req.session.admin=='1') {
    var id = req.headers.id;
    connection.query('DELETE FROM ADVERTISEMENT WHERE id='+id , function (err, rows) {
      if(err) {
          req.flash('Advertisement not exist', err);
          res.redirect('/');
      }else{
        res.redirect('/');
      }
  })
  }else{
    res.send('Acces Denied');
  }
})

router.post('/saveAd', function(req, res, next){
  if (req.session.admin=='1') {
    var id = req.headers.id;
    var title = req.headers.title;
    var description = req.headers.desc;
    var compagnie_name = req.headers.ent;
    var type = req.headers.type;
    var profile = req.headers.profile;
    var info_sup = req.headers.info_sup;
    var a_fournir = req.headers.a_fournir;
    console.log(compagnie_name);
    console.log(title);
    console.log(type);
    console.log(description);
    connection.query('SELECT id_comp FROM COMPAGNIES WHERE nom="'+compagnie_name+'"', function (err, rows) {
      connection.query('UPDATE ADVERTISEMENT SET title="'+title+'", description="'+description+'", compagnie_Id='+rows[0].id_comp+', type="'+type+'", profile="'+profile+'", info_sup="'+info_sup+'", a_fournir="'+a_fournir+'" WHERE id='+id, function (err, rows) {
        if (err) {
          res.redirect('/');
        }else{
          res.redirect('/');
        }
      })
    })
  }else{
    res.send('Acces Denied');
  }
})

router.post('/createAd', function(req, res, next){
  if (req.session.admin=='1') {
    var title = req.headers.title;
    var description = req.headers.desc;
    var compagnie_name = req.headers.ent;
    var type = req.headers.type;
    var profile = req.headers.profile;
    var info_sup = req.headers.info_sup;
    var a_fournir = req.headers.a_fournir;
    console.log(compagnie_name);
    console.log(title);
    console.log(type);
    console.log(description);
    connection.query('SELECT id_comp FROM COMPAGNIES WHERE nom="'+compagnie_name+'"', function (err, rows) {
      console.log(err);
      connection.query('INSERT INTO ADVERTISEMENT (title,description,type,profile,info_sup,a_fournir,people_In_Charge,compagnie_Id) VALUES ("'+title+'", "'+description+'", "'+type+'", "'+profile+'", "'+info_sup+'", "'+a_fournir+'", '+req.session.idUser+', '+rows[0].id_comp+')', function (err, rows) {
        if (err) {
            req.flash('error', err);
            console.log(err);
            res.redirect('/');
        }else{
            req.flash('Advertisement added successfully');
            res.redirect('/');
        }
    });
    })
  }else{
    res.send('Acces Denied');
  }
})

router.post('/postAccountToApply', function (req, res, next) {
  if (req.session.name!=undefined) {
    var id_ad = req.body.idEntreprise;
    connection.query('SELECT ROW_NUMBER() OVER(ORDER BY id) AS Rank, id FROM ADVERTISEMENT', function (err, rows) {
      if (err) {
        res.send(err);
      }else{
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].id==id_ad) {
            test=rows[i].Rank;
            break;
          }
        }
        res.redirect('/');
      }
    })
  }else{
    res.send('Acces Blocked');
  }
})

router.post('/changeTheme', function (req, res, next) {
  req.session.theme = req.headers.theme;
  console.log("Change de theme"+req.session.theme);
  res.send('OK');
})
module.exports = router;
