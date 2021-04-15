var count = 0;
var menu = document.getElementById("menu-icon");
var dropDown = document.getElementById("Menu");



menu.onclick = function () {
    dropDown.style.background = "#3D3C3C";
    if (count === 0) {
        dropDown.style.display = "block";
        count = 1;
    }
    else {
        dropDown.style.display = "none";
        count = 0;
    }
};

window.onresize = function(){
    if(window.innerWidth > 767){
        dropDown.style.display = "block";
    }
    else{
        dropDown.style.display = "none";
        count = 0;
    }
};