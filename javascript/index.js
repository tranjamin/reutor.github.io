//syntax
//auth.currentUser -----> gets current user
//auth.currentUser .uid .email .profile ----> gets user info
//auth.currentUser .updateEmail(email) .updatePassword(password) .updateProfile(profile) ----> updates
//auth.signOut() ----> signs current user out
//auth.signInWithEmailAndPassword ----> sign in format that we're using
//auth.onAuthStateChanged(user => function), auth.onIdTokenChanged(user => function) ----> on data change
//<------IF YOU WANT TO UPDATE INFO, YOU MUST RENEW YOUR AUTH TOKEN FIRST------->


const $ = ele => {return document.getElementById(ele)}

auth.onAuthStateChanged(user => {
    if (user) {$('signup_button').innerHTML = `Welcome, ${user.email.slice(0, user.email.lastIndexOf('@'))}<br>Logout`}
})

$('signup_button').addEventListener('click', e => {
    if (e.target.innerHTML == "Login/Signup") {
    $('signup_form').style.display = $('signup_form').style.display == "block" ? "none" : "block";}
    else {
        auth.signOut().then(() => location.reload());
    }
})
$('signup_form').getElementsByTagName('form')[0].addEventListener('submit', e => {
    e.preventDefault();
    ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
    auth.signInWithEmailAndPassword(e.target.username.value + "@rutor.com", e.target.password.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
})
$('signup_form').getElementsByTagName('form')[1].addEventListener('submit', e => {
    e.preventDefault();
    ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
    if (e.target.password.value == e.target.confirm.value) {
    auth.createUserWithEmailAndPassword(e.target.username.value + "@rutor.com", e.target.password.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
    }
    else {
        e.target.nextElementSibling.innerHTML = "Passwords do not match";
    }
})