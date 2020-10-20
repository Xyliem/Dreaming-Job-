//-----------------------------------------------------Function Learn more
var btn_old;

//fonction du click Learn More
function lm(btn_id){
  var job = $('.anim-job-big:eq('+btn_id+')');
  
//si on reclick sur le meme bouton
  if(btn_id == btn_old || btn_old === undefined){
    lm_show(job);

    btn_old = btn_id;
  }
//si on click sur un nouveau bouton
  else{
    var job_old = $('.anim-job-big:eq('+btn_old+')');
    //si l'ancien job n'est pas fermé
    if (job_old.hasClass("job-h-big")){
      lm_show(job_old);
    }
    lm_show(job);
    btn_old = btn_id;
  }
}

//fonction qui ouvre/ferme un job
function lm_show(job){
  job.toggleClass('job-h-big');
  job.children().toggleClass('w-big');
  job.find(".to-hide").toggleClass('un-hide');
  job.find(".btn-txt").toggleClass('btn-txt2');
  job.find(".job_pp").toggleClass('job_pp_open');
}

/*$(window).on('load',function(){
  $(".main-screen").click(function(){
    var test = $('.anim-job-big').hasClass('job-h-big');
    if(test){
      alert("h");
      //lm_show(job);
    }
    
});
})*/
//-----------------------------------------------------Function Apply
var apply_ = false;
var true_ =0;


$(window).on('load',function(){
  $(".main-screen").click(function(){
    var test = $("footer").hasClass('un-hide-form');
    if(test == true){
      true_++;
    }
    else{
      apply_= true;
    }
    if(true_>1){
      apply();
      apply_=false;
      true_ =0;
    }
   
});
})
function apply(btn_id, admin){
  if(admin==0){
    var j = document.getElementById('idConnection');
    var i = document.getElementById('idApply');
    i.value = btn_id;
    j.value = btn_id;
    }
  $(".main-screen").toggleClass('blur');
  $(".apply-bg").toggleClass('apply-bg-on');
  $("footer").toggleClass('un-hide-form');
}

//-----------------------------------------------------Function Connection/Inscription

function insc(){
  $(".apply-connec").toggleClass('apply-connec-off');
  $(".apply-insc").toggleClass('apply-insc-on');
}

//-----------------------------------------------------Function Open Menu

function openmenu() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.icon')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
/*
var connect = true;

$(window).on('load',function(){
  if(connect){
    $("#connection").remove();
  }
  else{
    $("#account").remove();
    $("#disconnection").remove();
  }
})*/

//-----------------------------------------------------Function Refresh de la page
$(window).on('load',function(){
  $(".title").click(function(){
    window.location.href = "/";
});
})


//------------------------------------------------------Account Manager Functions

function mdp_show(){
  $(".ad-us-mdp").toggleClass("ad-us-mdp-show");
}
//------------------------------------------------------Account Functions

function menu_on(){
  $(".us-menu").toggleClass("us-menu-on");
  $(".us-infos").toggleClass("us-infos-on");
  $(".us-menu-icon").toggleClass("us-menu-icon-on");
}

var mode = 0;
var tran = 0;
function slider2(){
  mode = document.getElementById('idPrec');
  tran = mode*-100;
  slide(tran);
}
function slider(id){
  mode = id;
  tran = mode*-100;
  slide(tran);
}
function slide(){
  $("[mode='0']").css('transform',"translateX("+ tran +"%)");
  $("[mode='1']").css('transform',"translateX("+ (tran+100) +"%)");
  $("[mode='2']").css('transform',"translateX("+ (tran+200) +"%)");
  $("[mode='3']").css('transform',"translateX("+ (tran+300) +"%)");
  $("[mode='4']").css('transform',"translateX("+ (tran+400) +"%)");
}
$(window).on('load', function(){
  slide()
})

function saveInfo() {
  var lname = document.getElementById("lname").value;
  var fname = document.getElementById("fname").value;
  var age = document.getElementById("age").value;
  var ville = document.getElementById("ville").value;
  var codePostal = document.getElementById("codePostal").value;
  var tel = document.getElementById("tel").value;
  var pays = $('#pays_Tel').find(":selected").text();
  const meta = {
    'lname': lname,
    'fname': fname,
    'age': age,
    'ville': ville,
    'codepostal': codePostal,
    'tel': tel,
    'pays': pays
  };
  const header = new Headers(meta);
  fetch('/account/saveInfo', {method: 'POST', headers: header})
    .then(function (response) {
      console.log(response);
    })
}

function saveInfoConnection() {
var email = document.getElementById("email").value;
var pwd = document.getElementById("pwd").value;
document.getElementById("email").value = "";
document.getElementById("pwd").value = "";
const meta = {
  'email': email,
  'pwd': pwd
};
const header = new Headers(meta);
fetch('/account/saveInfoConnection', {method: 'POST', headers: header})
  .then(function (response) {
    console.log("test");
    console.log(response);
    
  })
}

function saveInfoPro() {
  var portfolio = document.getElementById("portfolio").value;
  var categ = $('#categ').find(":selected").text();
  const fileInput = document.querySelector('#cv') ;
  const formData = new FormData();
  formData.append('cv', fileInput.files[0]);
  console.log(cv)
  const meta = {
    'portfolio': portfolio,
    "categ": categ,
  };
  const header = new Headers(meta);
  fetch('/account/saveInfoPro', {method: 'POST', headers: header, body: formData})
  .then(function (response) {
    console.log("test");
    console.log(response);
  })
}

var is_modifying =false;

function account_modify(id){
  var tab = $("[mode='"+id+"']");
  if (is_modifying){
    if (id==0) {
      saveInfo();
    }else if (id==1) {
      saveInfoConnection();
    }else if (id==2){
      console.log("SAVE INFO PRO");
      saveInfoPro();
    }
    tab.find("button#"+id+":eq(0)").text("Modifier");
    tab.find("button#"+id+":eq(1)").toggleClass("un-hide");
    tab.find("input").prop("readonly", true);
    tab.find("select").prop("disabled", true);
    tab.find("[type='file']").prop("disabled", true);
    $(".us-menu-icon").prop("disabled", false);
    $(".us-menu").attr({"onmouseover":"menu_on()", "onmouseout":"menu_on()"});
    $(".us-menu-icon").toggleClass("us-menu-icon-hover");
    $("[name='btn-fav']").prop("disabled", true);
    //$("[name='btn-pos']").prop("disabled", true);
    is_modifying = !is_modifying;
  }
  else{
    tab.find("button#"+id+":eq(0)").text("Enregistrer");
    tab.find("button#"+id+":eq(1)").toggleClass("un-hide");
    tab.find("input").prop("readonly", false);
    tab.find("select").prop("disabled", false);
    tab.find("[type='file']").prop("disabled", false);
    $(".us-menu-icon").prop("disabled", true);
    $(".us-menu").removeAttr("onmouseover onmouseout");
    $(".us-menu-icon").toggleClass("us-menu-icon-hover");
    $("[name='btn-fav']").prop("disabled", false);
    //$("[name='btn-pos']").prop("disabled", false);
    is_modifying = !is_modifying;
  }
}

function account_cancel_notif(id){
  var tab = $("[mode='"+id+"']");
  tab.find("button#"+id+":eq(0)").text("Modifier");
  tab.find("button#"+id+":eq(1)").toggleClass("un-hide");
  tab.find("input").prop("readonly", true);
  tab.find("select").prop("disabled", true);
  tab.find("[type='file']").prop("disabled", true);
  $(".us-menu-icon").prop("disabled", false);
  $(".us-menu").attr({"onmouseover":"menu_on()", "onmouseout":"menu_on()"});
  $(".us-menu-icon").toggleClass("us-menu-icon-hover");
  $("[name='btn-fav']").prop("disabled", true);
  //$("[name='btn-pos']").prop("disabled", true);
  is_modifying = !is_modifying;
}
function account_delete_notif(){
  $(".n2").toggleClass("notif1-on");
  $(".us-bg").toggleClass("blur2");
}
function account_job_notif(id){
  if (id!=-1) {
    document.getElementsByClassName("notif2-title")[0].innerText=document.getElementById("fav-title"+id).innerText;
    document.getElementsByClassName("us-job-ent")[0].innerText=document.getElementById("fav-nom"+id).innerText;
    document.getElementsByClassName("us-job-descri")[0].innerText=document.getElementById("fav-description"+id).innerText;
    document.getElementsByClassName("us-job-profile")[0].innerText=document.getElementById("fav-profile"+id).innerText;
    document.getElementsByClassName("us-job-logo")[0].src=document.getElementById("fav-logo"+id).innerText;
    document.getElementsByClassName("us-job-contrat")[0].innerText=document.getElementById("fav-type"+id).innerText;
    document.getElementsByClassName("us-job-date")[0].innerText=document.getElementById("fav-date"+id).innerText;
    document.getElementsByClassName("us-job-infos")[0].innerText=document.getElementById("fav-info"+id).innerText;
    document.getElementsByClassName("us-job-fournir")[0].innerText=document.getElementById("fav-a_fournir"+id).innerText;
    document.getElementsByClassName("us-job-place")[0].innerText=document.getElementById("fav-ville"+id).innerText;
  }
  $(".n3").toggleClass("notif2-on");
  $(".us-bg").toggleClass("blur2");
}

function account_job_notif2(id){
  if (id!=-1) {
    document.getElementsByClassName("notif2-title")[0].innerText=document.getElementById("pos-title"+id).innerText;
    document.getElementsByClassName("us-job-ent")[0].innerText=document.getElementById("pos-nom"+id).innerText;
    document.getElementsByClassName("us-job-descri")[0].innerText=document.getElementById("pos-description"+id).innerText;
    document.getElementsByClassName("us-job-profile")[0].innerText=document.getElementById("pos-profile"+id).innerText;
    document.getElementsByClassName("us-job-logo")[0].src=document.getElementById("pos-logo"+id).innerText;
    document.getElementsByClassName("us-job-contrat")[0].innerText=document.getElementById("pos-type"+id).innerText;
    document.getElementsByClassName("us-job-date")[0].innerText=document.getElementById("pos-date"+id).innerText;
    document.getElementsByClassName("us-job-infos")[0].innerText=document.getElementById("pos-info"+id).innerText;
    document.getElementsByClassName("us-job-fournir")[0].innerText=document.getElementById("pos-a_fournir"+id).innerText;
    document.getElementsByClassName("us-job-place")[0].innerText=document.getElementById("pos-ville"+id).innerText;
  }
  $(".n3").toggleClass("notif2-on");
  $(".us-bg").toggleClass("blur2");
}

var tab = 0;
var tab_old = 0;
function tab_job(id){
  if(id == "favo"){tab = 0;}
  if(id == "post"){tab = 1;}

  if(tab_old !== tab){
    $(".list1").toggleClass("list1-switch");
    $(".list2").toggleClass("list2-switch");
  }

  if(tab == 0){
    $("#favo").addClass("us-tab-on");
    $("#post").removeClass("us-tab-on");
    tab_old = tab;
  }
  if(tab == 1){
    $("#post").addClass("us-tab-on");
    $("#favo").removeClass("us-tab-on");
    tab_old = tab;
  }
  
}

function job_fav(id){
    var idfav = document.getElementById("fav-idFav"+id).innerText;
    $("[name='btn-fav']:eq("+id+")").toggleClass("check-fav-off");
    const meta = {
      'id1':id,
      'idfav': idfav
    };
    const header = new Headers(meta);
    fetch('/account/deleteFav', {method: 'POST', headers: header})
      .then(function (response) {
      window.location.href = "/account";
    })
}

function job_fav2(id, suppr) {
  $("[name='btn-fav']:eq("+id+")").toggleClass("check-fav-off");
  if (suppr==1) {
    var id_ad = document.getElementById("pos-advertisement_id"+id).innerText;
    var id_people = document.getElementById("pos-people_id"+id).innerText;
    const meta = {
      'id2':id,
      'idad': id_ad,
      'idpeople':id_people
    };
    const header = new Headers(meta);
    fetch('/account/deleteFavFromPos', {method: 'POST', headers: header})
      .then(function (response) {
      window.location.href = "/account";
    })
  }else{
    var id_ad = document.getElementById("pos-advertisement_id"+id).innerText;
    var id_people = document.getElementById("pos-people_id"+id).innerText;
    const meta = {
      'id2':id,
      'idad': id_ad,
      'idpeople':id_people
    };
    const header = new Headers(meta);
    fetch('/account/addFavFromPos', {method: 'POST', headers: header})
      .then(function (response) {
      window.location.href = "/account";
    })
  }
}
function job_pos(id, idEntreprise){
  $("[name='btn-pos']:eq("+id+")").toggleClass("check-pos-off");
  $("[name='btn-pos']:eq("+id+")").disabled = true;
}
//------------------------------------------------------Admin Functions

/*
var admin = false;

$(window).on('load',function(){
  if ( admin == true){
    $("[for*='user']").remove();
  }
  else{
    $("[for*='admin']").remove();
  }
})
*/

function admin_(btn_ad_id){
  var job_ad = $('.anim-job-big:eq('+btn_ad_id+')');
  modify(job_ad);
  //console.log("admin");
}

function admin_user(btn_ad_id){
  var job_ad = $('.anim-job-big:eq('+btn_ad_id+')');
  modify_user(job_ad);
  //console.log("admin");
}
function modify(job_ad){
  //copie colle les infos du job
  document.getElementById("admin-title").innerHTML = job_ad.find(".job-title").text();
  document.getElementById("admin-ent").innerHTML = job_ad.find(".job-ent").text();
  document.getElementById("admin-contrat").innerHTML = job_ad.find(".job-contrat").text();
  document.getElementById("admin-descri").innerHTML = job_ad.find(".job-descri").text();
  document.getElementById("admin-profile").innerHTML = job_ad.find(".job-profile").text();
  document.getElementById("admin-infos").innerHTML = job_ad.find(".job-infos").text();
  document.getElementById("admin-CV").innerHTML = job_ad.find(".job-fournir").text();
  document.getElementById("admin-id").innerHTML = job_ad.find(".job-id").text();
  document.getElementById("admin-compteur").innerHTML = job_ad.find(".job-compteur").text();
}

function modify_user(user_id){
  //copie colle les infos de l'utilisateur
  document.getElementById("user-lname").innerHTML = user_id.find(".ad-us-lname").text();
  document.getElementById("user-fname").innerHTML = user_id.find(".ad-us-fname").text();
  document.getElementById("user-mail").innerHTML = user_id.find(".ad-us-mail").text();
  document.getElementById("user-tel").innerHTML = user_id.find(".ad-us-tel").text();
  document.getElementById("user-pays").innerHTML = user_id.find(".ad-us-pays").text();
  document.getElementById("user-id").innerHTML = user_id.find(".ad-us-id").text();
  document.getElementById("user-compteur").innerHTML = user_id.find(".ad-us-compteur").text();
}

function save(){
  var id = document.getElementById("admin-id").innerHTML;
  var title = document.getElementById("admin-title").innerHTML;
  var desc = document.getElementById("admin-descri").innerHTML;
  var type = document.getElementById("admin-contrat").innerHTML;
  var profile = document.getElementById("admin-profile").innerHTML;
  var info_sup = document.getElementById("admin-infos").innerHTML;
  var a_fournir = document.getElementById("admin-CV").innerHTML;
  var ent = document.getElementById("admin-ent").innerText;
  const meta = {
    'id': id,
    'title': title,
    'desc': desc,
    'type': type,
    'profile': profile,
    'info_sup': info_sup,
    'a_fournir': a_fournir,
    'ent':ent
  };
  const header = new Headers(meta);
  fetch('saveAd', {method: 'POST', headers: header})
    .then(function (response) {
    window.location.href = "/";
  })
}

function save_user(){
  var id = document.getElementById("user-id").innerHTML;
  var lname = document.getElementById("user-lname").innerHTML;
  var fname = document.getElementById("user-fname").innerHTML;
  var email = document.getElementById("user-mail").innerHTML;
  var num_Tel = document.getElementById("user-tel").innerHTML;
  var pays_Tel = document.getElementById("user-pays").innerHTML;
  var password = document.getElementById("user-mdp").innerHTML;
  console.log("Tel : "+ num_Tel + " " + pays_Tel);
  const meta = {
    'id' : id,
    'lname': lname,
    'fname': fname,
    'email': email,
    'num': num_Tel,
    'pays': pays_Tel,
    'password': password
  };
  const header = new Headers(meta);
  fetch('/peoples/edit', {method: 'POST', headers: header})
    .then(function (response) {
      console.log(response);
    window.location.href = "/peoples";
  })

}

function delete_(){
  var id = document.getElementById("admin-id").innerHTML;
  console.log(id);
  const meta = {
    'id': id,
  };
  const header = new Headers(meta);
  fetch('/deleteAd', {method: 'POST', headers: header})
    .then(function(response) {
      window.location.href = "/";
    })
    .catch(function(error) {
      console.log(error);
    });
}

function delete_user(){
  var id = document.getElementById("user-id").innerHTML;
  console.log(id);
  
  const meta = {
    'idus': id,
  };
  const header = new Headers(meta);
  fetch('/peoples/deleteUser', {method: 'POST', headers: header})
    .then(function(response) {
      console.log("Rep : " + response);
      window.location.href = "/peoples";
    })
}

function create(){
  var id = document.getElementById("admin-id").innerHTML;
  var title = document.getElementById("admin-title").innerHTML;
  var desc = document.getElementById("admin-descri").innerHTML;
  var type = document.getElementById("admin-contrat").innerHTML;
  var profile = document.getElementById("admin-profile").innerHTML;
  var info_sup = document.getElementById("admin-infos").innerHTML;
  var a_fournir = document.getElementById("admin-CV").innerHTML;
  var ent = document.getElementById("admin-ent").innerText;
  const meta = {
    'id': id,
    'title': title,
    'desc': desc,
    'type': type,
    'profile': profile,
    'info_sup': info_sup,
    'a_fournir': a_fournir,
    'ent':ent
  };
  const header = new Headers(meta);
  fetch('/createAd', {method: 'POST', headers: header})
    .then(function (response) {
    window.location.href = "/";
  })
}

function create_(){
  document.getElementById("admin-title").innerHTML = "";
  document.getElementById("admin-ent").innerHTML = "";
  document.getElementById("admin-contrat").innerHTML = "";
  document.getElementById("admin-descri").innerHTML = "";
  document.getElementById("admin-profile").innerHTML = "";
  document.getElementById("admin-infos").innerHTML = "";
  document.getElementById("admin-CV").innerHTML = "";
  document.getElementById("admin-id").innerHTML = "";
}