(function () {
    var age = 23;
    console.log(age);
    age = "TEST";
    console.log(age);
    var signInForm = document.querySelector("form");
    console.log(signInForm);
    var inputs = signInForm.querySelectorAll("input");
    console.log(inputs);
    var inputBtn = signInForm.querySelector("button");
    console.log(inputBtn);
    inputBtn.addEventListener('click',function () {
        var credentials = {login: inputs[0].value, pwd: inputs[1].value};
        console.log(credentials);
    });
    window.onload = function () {
        console.log("Test");
    }
})();