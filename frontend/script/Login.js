// English Comment: Connects directly to your active local backend port instead of dead cloud URLs
let baseUrl = `http://localhost:5000`;

let loginForm = document.querySelector('.login-wrap');
let signupForm = document.querySelector('.signup-wrap');
let title = document.querySelector('title');

let signupToggleBtn = document.querySelector('#toggle-signup');
let loginToggleBtn = document.querySelector('#toggle-login');
let signupBtn = document.querySelector(".signup-btn");
let loginBtn = document.querySelector(".login-btn");

// English Comment: Track currently selected roles from the HTML toggle buttons (defaults to admin)
// These variables are updated by the inline setRole() function in Login.html
if (typeof currentLoginRole === 'undefined') window.currentLoginRole = 'admin';
if (typeof currentSignupRole === 'undefined') window.currentSignupRole = 'admin';

signupToggleBtn.onclick = () => {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    title.textContent = 'Signup form';
}

loginToggleBtn.onclick = () => {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    title.textContent = 'Login form';
}

// ==========================================
// SIGNUP / REGISTER PROCESS
// ==========================================
signupBtn.addEventListener("click", (e) => {
    e.preventDefault();
    
    // English Comment: Capturing all the new form inputs introduced from the Figma design layout
    let name = document.querySelector(".signup-wrap form #name").value;
    let phone = document.querySelector(".signup-wrap form #phone").value;
    let roleId = document.querySelector(".signup-wrap form #role-id").value;
    let email = document.querySelector(".signup-wrap form #signup-email").value;
    let password = document.querySelector(".signup-wrap form #signup-password").value;
    let role = window.currentSignupRole; // English Comment: Grabs 'admin' or 'user' from toggle state

    if (!name || !phone || !roleId || !email || !password) {
        return alert("Please fill all the details!")
    }

    let obj = {
        name,
        phone,
        roleId,
        email,
        password,
        role
    }
    
    registerNewUser(obj);
})

async function registerNewUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        let out = await res.json();
        
        if (out.msg == "You are already registerd!") {
            alert("You are already registered !!")
        } else if (out.msg == "Signup Successfully" || out.msg == "Signup Successfull") {
            alert("You registered Successfully!")
            // English Comment: Auto-switch back to the login tab layout view upon successful registration
            loginToggleBtn.click();
        } else {
            alert(out.msg || "Something went wrong!!");
        }
    } catch (error) {
        console.log("err", error)
        alert("Something went wrong!!!!")
    }
}

// ==========================================
// LOGIN PROCESS
// ==========================================
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let email = document.querySelector(".login-wrap form #email").value;
    let password = document.querySelector(".login-wrap form #password").value;
    let role = window.currentLoginRole; // English Comment: Grabs 'admin' or 'user' to send to the backend

    if (email == "" || password == "") {
        return alert("Please fill all the details!")
    } else {
        let obj = {
            email,
            password,
            role
        }
        loginUser(obj);
    }
})

async function loginUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
        let out = await res.json();
        
        if (out.msg == "Wrong Credentials") {
            alert("Wrong Credentials")
        } else if (out.msg == "login Successfull" || out.msg == "Login Successful") {
            // English Comment: Secure authentication data payload into current session storage state
            sessionStorage.setItem("token", out.token);
            sessionStorage.setItem("name", out.name);
            sessionStorage.setItem("role", obj.role); // English Comment: Save role state locally
            
            alert("You logged in Successfully")
            
            // English Comment: Redirect flow depending on role authorization type
            if (obj.role === 'admin') {
                window.location.href = "./adminpage.html"
            } else {
                window.location.href = "./index.html"
            }
        } else {
            alert(out.msg || "Something went wrong!!");
        }
    } catch (error) {
        console.log("err", error)
        alert("Something went wrong!!!!")
    }
}