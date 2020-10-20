var express = require('express');
const connection = require('../bdd/connection');
const bcrypt = require('bcrypt');
var formidable = require('formidable');
var mv = require('mv');
var fs = require('fs');
const e = require('express');
var rimraf = require("rimraf");
var async = require('async');
var router = express.Router();
 
router.get('/', function(req, res, next) {
    if (req.session.name!=undefined && req.session.admin=='1') {
        connection.query('SELECT * FROM PEOPLE',function(err,rows){
            rows.forEach(async (element) => {
                connection.query("SELECT COUNT(*) AS compteur FROM INFORMATION WHERE people_id="+element.id_people, function (err4, rows4) {
                  if (err4) {
                    res.send(err4);
                  }else{
                    element.compteur = rows4[0].compteur;
                  }
                });
              });
            for (let i = 0; i < rows.length; i++) {
                console.log(rows[i].cv);
                rows[i].lname = rows[i].name.split(' ')[1];
                rows[i].fname = rows[i].name.split(' ')[0];
                if (rows[i].cv!=null) {
                    var tab = rows[i].cv.split('/');
                    console.log(tab);
                    rows[i].cv_name = tab[tab.length-1];
                }
            }
            if(err) {
                req.flash('error', err);
                res.render('account_manager',{data:'', admin: req.session.admin});   
            } else {
                res.render('account_manager',{data:rows, admin: req.session.admin});
            }
        });
    }else{
        res.send("Error Access Denied");
    }
});

router.get('/dl/(:id)', function (req, res, next) {
    var id = req.params.id;
    connection.query('SELECT * FROM PEOPLE WHERE id_people='+id , function (err, rows) {
        console.log(rows[0].cv);
        res.download(rows[0].cv);
    })
})

router.post('/edit', function (req, res, next) {
    if (req.session.admin=='1') {
        var id = req.headers.id;
        var name = req.headers.fname+" "+req.headers.lname;
        var email = req.headers.email;
        var num_Tel = req.headers.num;
        var pays_Tel = req.headers.pays;
        var password = req.headers.password;
        if (password == null || password == '' || password == undefined || password == null) {
            connection.query('UPDATE PEOPLE SET name="'+name+'", email="'+email+'", num_Tel="'+num_Tel+'", pays_Tel="'+pays_Tel+'" WHERE id_people='+id, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.redirect('/peoples');
                  }else{
                    res.redirect('/peoples');
                  }
            })
        }else{
            bcrypt.hash(password, 10, function (err, hash) {
                connection.query('UPDATE PEOPLE SET name="'+name+'", email="'+email+'", num_Tel="'+num_Tel+'", pays_Tel="'+pays_Tel+'", password="'+hash+'" WHERE id_people='+id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.redirect('/peoples');
                      }else{
                        res.redirect('/peoples');
                      }
                })
            });
        }
    }else{
        res.send("Error Access Denied");
    }
})

router.post('/deleteUser', function (req, res, next) {
    if (req.session.name!=undefined && req.session.admin=='1') {
        var id = req.headers.idus;

        connection.query('SELECT * FROM PEOPLE WHERE id_people='+id , function (err, rows) {
            if (err) {
                console.log(err);
                res.json(err);
            }
            if (rows[0].cv==null) {
                connection.query('DELETE FROM PEOPLE WHERE id_people='+id , function (err, rows) {
                    if(err) {
                        req.flash('People not exist', err);
                        console.log(err);
                        res.json(err);
                    } else {
                        res.json("OK");
                    }
                }) 
            }else{
                rimraf(rows[0].cv, function () { 
                    connection.query('DELETE FROM PEOPLE WHERE id_people='+id , function (err, rows) {
                        if(err) {
                            console.log(err);
                            req.flash('People not exist', err);
                            res.json(err);
                        }else{
                            res.json("OK");
                        }
                    })
                });
            }
        })
    }else{
        res.send("Error Access Denied");
    }
})


module.exports = router;