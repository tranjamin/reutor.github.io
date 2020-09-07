$ = ele => {return document.getElementById(ele)}

$('signup_button').addEventListener('click', e => {
    auth.signOut().then(() => location.assign('index.html'));
})


auth.onAuthStateChanged(user => {
    console.log("Auth state change")
    if(user){
        $("userTittle").innerHTML = 'Account: '+user.email.slice(0, user.email.lastIndexOf('@'))
    }
})

// $('account_table').addEventListener('click', e => {
//     if (e.target.tagName == "TH") {
//         ([]).forEach.call(e.target.parentElement.getElementsByTagName('th'), index => {index.style['background-color'] = 'rgb(192,220,236)'})
//         e.target.style['background-color'] = 'rgb(225, 215, 255)';
//         ([]).forEach.call(document.getElementsByClassName('account_data'), ele => {ele.style['display'] = 'none'})
//         var browse_id;
//         switch (e.target.innerHTML) {
//             case 'My Questions': browse_id = 'my_questions'; break;
//             case 'Saved Questions': browse_id = 'saved_questions'; break;
//             default: browse_id = 'my questions'; break;
//         }
//         document.getElementById(browse_id).style.display = "block";
//     }
// })