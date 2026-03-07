
// login 
document.getElementById("login-btn").addEventListener("click", ()=>{
    const username = document.getElementById("username-input").value;
    const password = document.getElementById("password-input").value;

    if(username == 'admin' && password == 'admin123'){
        display();
        alert("Login successful");
        window.location.replace('home.html');
    } else {
        alert("Invalid entry");
        return;
    }
});


const display = () =>{
    console.log("works")
}