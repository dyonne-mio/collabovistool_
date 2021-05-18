$('#login-btn').click(function() {
    var username = $('#username').val();
    var password = $('#password').val();

    console.log(username);
    console.log(password);

    if (username == "admin" && password == "p@ssword") {
        localStorage.setItem("login", 1);
        checkIfLoggedIn();
    } else {
        $('#login-error').show();
        $('#username').val("");
        $('#password').val("");
    }
});

$('#show-password-btn').on('click', function() {
    $(this).find('i').toggleClass('fa fa-eye').toggleClass('fa fa-eye-slash');
    if($('#password').attr('type') == 'text'){
        $('#password').attr('type', 'password');
    }else{
        $('#password').attr('type', 'text');
    }
});

function checkIfLoggedIn() {
    var loginStatus = localStorage.getItem('login');
    if (loginStatus == 1) {
        if (!window.location.href.includes("dashboard.html")) {
            window.location.href = "dashboard.html";
        }
    } else {
        if (!window.location.href.includes("index.html")) {
            window.location.href = "index.html";
        }
    }
}

checkIfLoggedIn();

var audio = document.getElementById("player");
if (audio) {
    audio.volume = 0.02;
}

