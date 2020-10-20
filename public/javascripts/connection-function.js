//-----------------------------------------------------Function Refresh de la page

$(window).on('load',function(){
    $(".hide-form").toggleClass('un-hide-form');
    $(".apply-bg").toggleClass('apply-bg-on2');
    //$("#inscription").toggleClass('tab-off');
})

var mode = true;

function insc(){
    $(".apply-connec").toggleClass('apply-connec-off');
    $(".apply-insc").toggleClass('apply-insc-on');
    $("#connection").toggleClass('tab-off');
    $("#inscription").toggleClass('tab-off');
    mode = !mode;
  }
  
function btn_co(){
    if(mode == false){
        insc();
    }
}
function btn_in(){
    if(mode == true){
        insc();
    }
}

function alert_mdp(){
    $(".alert-mdp").toggleClass("alert-mdp-on");
}
//-----------------------------------------------------Function Retour Page Principal
$(window).on('load',function(){
    $(".title3").click(function(){
      window.location.href = "/";
  });
  })

//-----------------------------------------------------Function Réseaux Sociaux

function fb(){
    window.open("https://facebook.com");
}
function tw(){
    window.open("https://twitter.com");
}
function insta(){
    window.open("https://instagram.com");
}

//-----------------------------------------------------Function Day-Night
var day = true;
function switch_(){
    if(day){
        $(".day-night-toggle").toggleClass("day-night-toggle-off");
        $("html").toggleClass("theme-dark");
        day = !day;
        const meta = {
            'theme': 1
          };
          const header = new Headers(meta);
        fetch('/changeTheme', {method: 'POST', headers: header})
        .then(function (response) {
          console.log(response);
        })
    }
    else{
        $(".day-night-toggle").toggleClass("day-night-toggle-off");
        $("html").toggleClass("theme-dark");
        day = !day;
        const meta = {
            'theme': 0
          };
          const header = new Headers(meta);
        fetch('/changeTheme', {method: 'POST', headers: header})
        .then(function (response) {
          console.log(response);
        })
    }
}