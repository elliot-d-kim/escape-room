const screen = document.getElementById("gamescreen");
const button = document.getElementById("changeSize");
let isitsmoll = true;

const actualGame = document.getElementById("actualGame");

button.addEventListener('click', changeIt);

document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 13) {
        nextPage("mode.html");
        alert("Enter");
    }
};

function nextPage(source) {
    alert("We in boys");
    var page=document.getElementById("whatpage");
    var clone=page.cloneNode(true);
    clone.setAttribute('src',source);
    page.parentNode.replaceChild(clone,page);
}



function changeIt(){
    if (isitsmoll == true){
        button.innerHTML = "Make Me Smoll!";
        isitsmoll = false;
        screen.style.paddingTop = '5vh';
        goFullScreen();
    }
    else{
        button.innerHTML = "Make Me Big!";
        isitsmoll = true;
        screen.style.paddingTop = '0vh';
        exitFullScreen();
    }
}

//function clickedamongus() {
//    console.log("it is transparent bitches");
//}

// functions for the fullscreen

function goFullScreen(){
    if(screen.requestFullscreen){
        screen.requestFullscreen();
    }
    else if(screen.mozRequestFullScreen){
        screen.mozRequestFullScreen();
    }
    else if(screen.webkitRequestFullscreen){
        screen.webkitRequestFullscreen();
    }
    else if(screen.msRequestFullscreen){
        screen.msRequestFullscreen();
    }
}

function exitFullScreen(){
    if(document.exitFullscreen){
        document.exitFullscreen();
    }
    else if(document.mozCancelFullScreen){
        document.mozCancelFullScreen();
    }
    else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
    }
    else if(document.msExitFullscreen){
        document.msExitFullscreen();
    }
}

