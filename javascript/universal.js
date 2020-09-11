console.log("Reutor's universal javascript file linked")

const $ = ele => {return document.getElementById(ele)}

auth.onAuthStateChanged(user => {
    if(user){
        db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
            userData = doc.data()
            if(userData.isDarkMode == true){
                document.querySelector("html").classList.add("darkMode");
            }
        })

    }
})