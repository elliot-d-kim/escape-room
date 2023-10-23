const createAccountForm = document.getElementById("create-account-form");
const createAccountButton = document.getElementById("create-account-form-submit");
// const loginErrorMsg = document.getElementById("login-error-msg");

createAccountButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = createAccountForm.username.value;
    const password = createAccountForm.password.value;

    // if (username === "user" && password === "web_dev") {
    //     alert("You have successfully logged in.");
    //     location.reload();
    // } else {
    //     alert("Wrong credentials!");
    //     // loginErrorMsg.style.opacity = 1;
    // }
})