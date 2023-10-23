// Extract objects from HTML
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
// const loginErrorMsg = document.getElementById("login-error-msg");

// When user clicks 'Login' button...
loginButton.addEventListener("click", (e) => {
    e.preventDefault();     // Prevent the default behavior, ie submitting user's credentials (to be revised once server-side user auth is set up)

    // Extract username and password from input
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // Demo validation within JavaScript
    if (username === "user" && password === "web_dev") {
        alert("You have successfully logged in.");
        location.reload();
    } else {
        alert("Wrong credentials!");
        // loginErrorMsg.style.opacity = 1;
    }
})