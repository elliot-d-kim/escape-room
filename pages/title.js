document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 13) {
        nextPage("mode.html");
        alert("Enter");
    }
};

