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
    console.log(user)
    
    if (user) {
        $('welcomeMessage').innerHTML = `Welcome, ${user.email.slice(0, user.email.lastIndexOf('@'))}`  
        $('signup_button').innerHTML = `<br><p class="navButton">Logout</p><br><p class="navButton">Account</p>`
        $('signup_button').className = ""
    }
})

document.addEventListener('click', e => {
    if ($('signup_form').style.display == "block" && $('signup_form') != e.target && $('signup_button') != e.target && !$('signup_form').contains(e.target)) {
        $('signup_form').style.display = "none";
    }
})

$('signup_button').addEventListener('click', e => {
    if (e.target.innerHTML == "LOGIN/SIGNUP") {
    $('signup_form').style.display = $('signup_form').style.display == "block" ? "none" : "block";}
    else if (e.target.innerHTML == "Logout") {
        auth.signOut().then(() => location.reload());
    }
    else {
        location.assign('account.html')
    }
})
$('signup_form').getElementsByTagName('form')[0].addEventListener('submit', e => {
    e.preventDefault();
    ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
    auth.signInWithEmailAndPassword(e.target.usernameLI.value + "@rutor.com", e.target.passwordLI.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
})
$('signup_form').getElementsByTagName('form')[1].addEventListener('submit', e => {
    e.preventDefault();
    ([]).forEach.call(document.getElementsByClassName('error'), ele => {ele.innerHTML = "";})
    if (e.target.passwordSU.value == e.target.confirmSU.value) {
    auth.createUserWithEmailAndPassword(e.target.usernameSU.value + "@rutor.com", e.target.passwordSU.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
    }
    else {
        e.target.nextElementSibling.innerHTML = "Passwords do not match";
    }
})