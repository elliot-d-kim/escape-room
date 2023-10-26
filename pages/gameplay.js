const screen = document.getElementById("gamescreen");
const button = document.getElementById("changeSize");
let isitsmoll = true;

button.addEventListener("click", changeIt);

function changeIt(){
    if (isitsmoll == true){
        button.innerHTML = "Make Me Smoll!";
        goFullScreen();
        isitsmoll = false;
    }
    else{
        button.innerHTML = "Make Me Big!";
        exitFullScreen();
        isitsmoll = true;
    }
}

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