const $ = ele => {return document.getElementById(ele)}

$('signup_button').addEventListener('click', e => {
    auth.signOut().then(() => location.assign('index.html'));
})