var express = require('express');
const connection = require('../bdd/connection');
const bcrypt = require('bcrypt');
var mv = require('mv');
var fs = require('fs');
var rimraf = require("rimraf");
var async = require('async');
var multiparty = require('multiparty');
const { CallTracker } = require('assert');
const { route } = require('.');
var router = express.Router();

var idPrec=undefined;
 
router.get('/', function(req, res, next) {
    if (req.session.name!=undefined) {
        connection.query("SELECT * FROM PEOPLE WHERE id_people="+req.session.idUser, function (err, rows) {
            if (err) {
                console.log(err);
            }else{
                rows[0].lname = rows[0].name.split(" ")[1];
                rows[0].fname = rows[0].name.split(" ")[0];
                connection.query('SELECT *, DATE_FORMAT(ad.date_publication, "%d/%m/%Y") as date2 FROM Favoris fav INNER JOIN ADVERTISEMENT ad ON ad.id=fav.advertisement_id INNER JOIN COMPAGNIES comp ON comp.id_comp=ad.compagnie_Id WHERE fav.people_id='+req.session.idUser, function (err2, rows2) {
                    if (err2) {
                        res.send(err2);
                    }else{
                        connection.query('SELECT *, DATE_FORMAT(ad.date_publication, "%d/%m/%Y") as date2  FROM INFORMATION inf INNER JOIN ADVERTISEMENT ad ON ad.id=inf.advertisement_id INNER JOIN COMPAGNIES comp ON comp.id_comp=ad.compagnie_Id WHERE inf.people_id='+req.session.idUser, function (err3, rows3) {
                            if (err3) {
                                res.send(err3);
                            }else{
                                for (let index = 0; index < rows3.length; index++) {
                                    for (let j = 0; j < rows2.length; j++) {
                                        if (rows3[index].advertisement_id==rows2[j].id) {
                                            rows2[j].a_postuler='1';
                                            rows3[index].favori='1';
                                        }
                                    }   
                                }
                                console.log("idPrec : "+idPrec);
                                res.render('account', {data:rows, data2:rows2, data3:rows3, idPrec: idPrec});
                                idPrec=undefined;
                            }
                        })
                    }
                })
            }
        })
    }else{
        res.send("Error Access Denied");
    }
    
});

router.post('/saveInfo', function (req, res, next) {
    var name = req.headers.fname + " " + req.headers.lname;
    connection.query('UPDATE PEOPLE SET name="'+name+'", age="'+req.headers.age+'", ville="'+req.headers.ville+'", codePostal="'+req.headers.codepostal+'", num_Tel="'+req.headers.tel+'", pays_Tel="'+req.headers.pays+'" WHERE id_people='+req.session.idUser, function (err, rows) {
        console.log(err);
        res.json(err);
    })
})

router.post('/saveInfoConnection', function (req, res, next) {
    bcrypt.hash(req.headers.pwd, 10, function (err, hash) {
        connection.query('UPDATE PEOPLE SET password="'+hash+'", email="'+req.headers.email+'" WHERE id_people='+req.session.idUser, function (err, rows) {
            if (err) {
              res.json(err);
            }
        })
      });
})

router.post('/saveInfoPro', function (req, res, next) {
    if (req.session.name!=undefined) {
        var portfolio = req.headers.portfolio;
        var categ = req.headers.categ;
        var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            if (files.cv!=undefined) {
                fs.mkdir('/opt/lampp/htdocs/test/Web-Project/files_cv/'+req.session.name, function(err) { 
                    if (err) console.log(err);
                    var oldpath = files.cv[0].path;
                    var newpath = '/opt/lampp/htdocs/test/Web-Project/files_cv/'+req.session.name+'/' + files.cv[0].originalFilename;
                    mv(oldpath, newpath, function (err) {
                      if (err) console.log(err);
                      console.log("OK");
                      var cv = newpath;
                        connection.query('UPDATE PEOPLE SET cv="'+cv+'", portfolio="'+portfolio+'", categorie_Emploi="'+categ+'" WHERE id_people='+req.session.idUser, function (err, rows) {
                            if (err) {
                                req.flash('error', err);
                                console.log(err);
                                res.redirect('/account');
                            }else{
                                req.flash('People added successfully');
                                res.redirect('/account');
                            }
                        })
                    });
                });
            }else{
                console.log("ICI");
                connection.query('UPDATE PEOPLE SET portfolio="'+portfolio+'", categorie_Emploi="'+categ+'" WHERE id_people='+req.session.idUser, function (err, rows) {
                    if (err) {
                        req.flash('error', err);
                        console.log(err);
                        res.redirect('/account');
                    }else{
                        req.flash('People added successfully');
                        res.redirect('/account');
                    }
                })
            }
            
        });

        /*
        var portfolio = req.headers.portfolio;
        var categ = req.headers.categ;
        console.log(portfolio);
        console.log(categ);
        connection.query('UPDATE PEOPLE SET portfolio="'+portfolio+'", categorie_Emploi="'+categ+'" WHERE id_people='+req.session.idUser, function (err, rows) {
            console.log(err);
            console.log(rows);
            res.send(err);
        })*/
    }else{
        res.send("Error Access Denied");
    }
})

router.post('/deleteFav', function (req, res, next) {
    if (req.session.name!=undefined) {
        var id_fav = req.headers.idfav;
        idPrec = req.headers.id1;
        console.log(id_fav);
        connection.query('DELETE FROM Favoris WHERE id_fav='+id_fav, function (err, rows) {
            res.send(err);
        })
    }else{
        res.send("Error Access Denied");
    }
})

router.post('/deleteFavFromPos', function (req, res, next) {
    if (req.session.name!=undefined) {
        idPrec = req.headers.id2;
        var id_ad = req.headers.idad;
        var id_people = req.headers.idpeople;
        connection.query('SELECT * FROM Favoris WHERE advertisement_id='+id_ad+' AND people_id='+id_people, function (err, rows) {
            if (err) {
                res.send(err);
            }else{
                if (rows.length) {
                    connection.query('DELETE FROM Favoris WHERE id_fav='+rows[0].id_fav, function (err2, rows2) {
                        res.send(err2);
                    })
                }
            }
        })
    }else{
        res.send("Error Access Denied");
    }
})

router.post('/addFavFromPos', function (req, res, next) {
    if (req.session.name!=undefined) {
        idPrec = req.headers.id2;
        var id_ad = req.headers.idad;
        var id_people = req.headers.idpeople;
        connection.query('INSERT INTO Favoris (advertisement_id, people_id) VALUES ('+id_ad+','+id_people+')', function (err, rows) {
            res.send(err);
        })
    }else{
        res.send("Error Access Denied");
    }
})

router.post('/deleteCompte', function (req, res, next) {
    if (req.session.name!=undefined) {
        connection.query('DELETE FROM PEOPLE WHERE id_people='+req.session.idUser, function (err, rows) {
            res.redirect('/logout');
        })
    }else{
        res.send("Error Access Denied");
    }
})


module.exports = router;