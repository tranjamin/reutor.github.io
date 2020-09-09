//NOTE: if using snapshot.ref.path, this will be different. It will include the path id, but useQB won't

$ = ele => {return document.getElementById(ele)}

document.getElementsByClassName('account_data')[0].style.display = "unset";

$('signup_button').addEventListener('click', e => {
    auth.signOut().then(() => location.assign('index.html'));
})


auth.onAuthStateChanged(user => {
    console.log("Auth state change")
    if(user){
        $("userTittle").innerHTML = 'Account: '+user.email.slice(0, user.email.lastIndexOf('@'))
    }

    db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
        doc.data().bookmarks.forEach(ref => {
            console.log(ref);
            display_question(ref, $('saved_questions'), 'SAVED');
        })
    })
    db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
        doc.data().removals.forEach(ref => {
            console.log(ref);
            display_question(ref, $('removed_questions'), 'REMOVED');
        })
    })
})

$('account_table').addEventListener('click', e => {
    if (e.target.tagName == "TH") {
        ([]).forEach.call(e.target.parentElement.getElementsByTagName('th'), index => {index.style['background-color'] = 'rgb(192,220,236)'})
        e.target.style['background-color'] = 'rgb(225, 215, 255)';
        ([]).forEach.call(document.getElementsByClassName('account_data'), ele => {ele.style['display'] = 'none'})
        var browse_id;
        switch (e.target.innerHTML) {
            case 'Saved Questions': browse_id = 'saved_questions'; break;
            case 'Removed Questions': browse_id = 'removed_questions'; break;
            default: browse_id = 'Saved Questions'; break;
        }
        document.getElementById(browse_id).style.display = "block";
    }
})




function display_question(path, questionZone, sector) {
    database.ref(path).once('value', snapshot => {
        var question = [snapshot.val(), snapshot.key];

        var LINE = document.createElement("hr")
            
        var nQstnInfo = document.createElement("div")
        nQstnInfo.className = "QstnInfo";

        var nQstnDiff = document.createElement("span")
        nQstnDiff.innerHTML = question[0]["difficulty"]+ ' | '
        nQstnInfo.appendChild(nQstnDiff)

        var nQstnTech = document.createElement("span")
        nQstnTech.innerHTML = question[0]["tech"]+ ' | '
        nQstnInfo.appendChild(nQstnTech)

        var nQstnCont = document.createElement("span")
        nQstnCont.innerHTML = question[0]["contributer"]+ ' | '
        nQstnInfo.appendChild(nQstnCont)

        var nQstnId = document.createElement("span")
        nQstnId.innerHTML = "ID: "+ question[1]
        nQstnInfo.appendChild(nQstnId)

        var nQstnEl = document.createElement("li")
        nQstnEl.innerHTML = question[0]["question"];
        nQstnEl.className = "question";  

        var nQstnAnsButt = document.createElement("span")
        nQstnAnsButt.innerHTML = "Reveal Answer";
        nQstnAnsButt.setAttribute('class', 'QstnAnswerButt')
        var nQstnAns = document.createElement("span")
        nQstnAns.setAttribute('class',"QstnAnswer");
        nQstnAns.style.display = "none";
        nQstnAns.innerHTML = "<br>"+question[0]["answer"]

        var nQstnOptions = document.createElement('span');
        nQstnOptions.innerHTML = "<span>&#9734</span><span>&#9998</span>";
        nQstnOptions.setAttribute('class', 'options')

        var nQstnOptions2 = document.createElement('span');
        nQstnOptions2.innerHTML = "<span>&#9872</span><span>&#128465</span>";
        nQstnOptions2.setAttribute('class', 'options2')

        //<---------event listeners--------->
        nQstnOptions.getElementsByTagName('span')[0].addEventListener('click', e => {
            if (e.target.innerHTML == "☆") {
            e.target.innerHTML = "★";
            db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                var new_bookmarks = doc.data().bookmarks.push ? doc.data().bookmarks : [];
                console.log(new_bookmarks)
                new_bookmarks.push(snapshot.ref.path.toString())
                db.collection("users").doc(auth.currentUser.uid).update({
                    bookmarks: new_bookmarks
                })
            })
        }
            else {
                e.target.innerHTML = "☆";
                db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                    var new_bookmarks = doc.data().bookmarks;
                    console.log(new_bookmarks)
                    if (new_bookmarks.indexOf(snapshot.ref.path.toString()) != -1) {
                    new_bookmarks.splice(new_bookmarks.indexOf(snapshot.ref.path.toString()), 1);
                    db.collection("users").doc(auth.currentUser.uid).update({
                        bookmarks: new_bookmarks
                    })
                }
                })
            }
// <-------------------------------------PUT-CODE-TO-TOGGLE-BOOKMARK-HERE---------------------------------------------> //
        })
        nQstnOptions2.getElementsByTagName('span')[0].addEventListener('click', e => {
            if (e.target.innerHTML == "⚐") {
                e.target.innerHTML = "⚑";
            }
            else {
                e.target.innerHTML = "⚐";
            }


// <-------------------------------------PUT-CODE-TO-TOGGLE-FLAG-FOR-SPAM-(NOTIFIES-ADMIN)-HERE---------------------------------------------> //
        })
        nQstnOptions2.getElementsByTagName('span')[1].addEventListener('click', e => {
            if (e.target.style['font-weight'] != "900") {
                e.target.style['font-weight'] = '900';
                var parent = e.target.parentElement.parentElement.parentElement;
                parent.style.overflow = "hidden";
                var interval = setInterval(() => {
                    parent.style.height = parseFloat(getComputedStyle(parent).height) - 3 + "px";
                    if (parseFloat(getComputedStyle(parent).height) < e.target.getBoundingClientRect().bottom - e.target.parentElement.parentElement.parentElement.getBoundingClientRect().top + 3) {
                        e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[0].style.display = "none";
                        e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[1].style.display = "none";
                        e.target.parentElement.parentElement.getElementsByClassName('options2')[0].getElementsByTagName('span')[0].style.display = "none";
                        e.target.parentElement.parentElement.parentElement.getElementsByClassName('question')[0].style.visibility = "hidden";
                        clearInterval(interval)
// <-----------------------------PUT-CODE-TO-REMOVE-QUESTION-FROM-FEED-HERE----------------------------------------> //
                        db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                            var removals = doc.data().removals.push ? doc.data().removals : [];
                            removals.push(snapshot.ref.path.toString())
                            db.collection("users").doc(auth.currentUser.uid).update({
                                removals: removals
                            })
                        })
                    
                    }
                }, 1)
            }
            else {
                e.target.style['font-weight'] = '400';
                e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[0].style.display = "initial";
                e.target.parentElement.parentElement.getElementsByClassName('options')[0].getElementsByTagName('span')[1].style.display = "initial";
                e.target.parentElement.parentElement.getElementsByClassName('options2')[0].getElementsByTagName('span')[0].style.display = "initial";                          
                e.target.parentElement.parentElement.parentElement.getElementsByClassName('question')[0].style.visibility = "visible";
                var parent = e.target.parentElement.parentElement.parentElement;
                var prev_height = getComputedStyle(parent).height;
                parent.style.height = "initial";
                var final_height = getComputedStyle(parent).height;
                parent.style.height = prev_height;
                var interval = setInterval(() => {
                    parent.style.height = parseFloat(getComputedStyle(parent).height) + 3 + "px";
                    if (parseFloat(getComputedStyle(parent).height) > parseFloat(final_height)) {
                        parent.style.overflow = "visible"; parent.style.height = final_height; parent.style.height = "unset"; clearInterval(interval)}
                

                    }, 1)

                // <-----------------------------PUT-CODE-TO-RE-ADD-QUESTION-FROM-FEED-HERE----------------------------------------> //
                db.collection("users").doc(auth.currentUser.uid).get().then(doc => {
                    var removals = doc.data().removals;
                    console.log(removals, snapshot.ref.path.toString());
                    if (removals.indexOf(snapshot.ref.path.toString()) != -1) {
                        removals.splice(removals.indexOf(snapshot.ref.path.toString()), 1);
                        db.collection("users").doc(auth.currentUser.uid).update({
                            removals: removals
                        })
                    }
                })

            }
        })

        nQstnAnsButt.addEventListener('click', e => {
            e.target.nextElementSibling.style.display = getComputedStyle(e.target.nextElementSibling).display != "none" ? "none" : "block";
            e.target.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
            e.target.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
            e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
            e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = e.target.nextElementSibling.style.display == "none" ? "none" : "inline-block";
            e.target.innerHTML = getComputedStyle(e.target.nextElementSibling).display != "none" ? "Hide Answer" : "Reveal Answer";
        })
        
        nQstnAnsCompleted = document.createElement("span");
        nQstnAnsCompleted.innerHTML = "Mark as Completed";
        nQstnAnsCompleted.setAttribute('class', 'QstnAnswerButt2')

        nQstnAnsStudy = document.createElement("span");
        nQstnAnsStudy.innerHTML = "Keep Practicing";
        nQstnAnsStudy.setAttribute('class', 'QstnAnswerButt2')
        
        nQstnAnsAlternate = document.createElement("span");
        nQstnAnsAlternate.innerHTML = "Suggest Alternate Answer";
        nQstnAnsAlternate.setAttribute('class', 'QstnAnswerButt2')
        
        nQstnAnsTopic = document.createElement("span");
        nQstnAnsTopic.innerHTML = "Suggest Alternate Unit/Topic";
        nQstnAnsTopic.setAttribute('class', 'QstnAnswerButt2')


        nQstnAnsCompleted.style.display = "none";
        nQstnAnsStudy.style.display = "none";
        nQstnAnsAlternate.style.display = "none";
        nQstnAnsTopic.style.display = "none";

        nQstnAnsCompleted.addEventListener('click', e => {
            //mark as completed
        })
        nQstnAnsStudy.addEventListener('click', e => {
            //mark as for practice
        })
        nQstnAnsAlternate.addEventListener('click', e => {
            //send off alternate answer
        })
        nQstnAnsTopic.addEventListener('click', e => {
            //send off alternate topic
        })



        nQstnAnsCompleted = document.createElement("span");
        nQstnAnsCompleted.innerHTML = "Mark as Completed";
        nQstnAnsCompleted.setAttribute('class', 'QstnAnswerButt2')

        nQstnAnsStudy = document.createElement("span");
        nQstnAnsStudy.innerHTML = "Keep Practicing";
        nQstnAnsStudy.setAttribute('class', 'QstnAnswerButt2')
        
        nQstnAnsAlternate = document.createElement("span");
        nQstnAnsAlternate.innerHTML = "Suggest Alternate Answer";
        nQstnAnsAlternate.setAttribute('class', 'QstnAnswerButt2')
        
        nQstnAnsTopic = document.createElement("span");
        nQstnAnsTopic.innerHTML = "Suggest Alternate Unit/Topic";
        nQstnAnsTopic.setAttribute('class', 'QstnAnswerButt2')


        nQstnAnsCompleted.style.display = "none";
        nQstnAnsStudy.style.display = "none";
        nQstnAnsAlternate.style.display = "none";
        nQstnAnsTopic.style.display = "none";

        var individual_question = document.createElement("DIV")
        individual_question.setAttribute('class', 'individual_question')

        nQstnInfo.appendChild(nQstnOptions)
        nQstnInfo.appendChild(nQstnOptions2)
        individual_question.appendChild(nQstnInfo)
        individual_question.appendChild(nQstnEl)
        individual_question.appendChild(nQstnAnsButt)
        individual_question.appendChild(nQstnAns)
        individual_question.appendChild(nQstnAnsCompleted);
        individual_question.appendChild(nQstnAnsStudy);
        individual_question.appendChild(nQstnAnsAlternate);
        individual_question.appendChild(nQstnAnsTopic);

        // questionZone.appendChild(nQstnSaveButt)
        // questionZone.appendChild(nQstnSaveDiv)
        questionZone.appendChild(individual_question);
        questionZone.appendChild(LINE)

        if (sector == "SAVED") {nQstnOptions.getElementsByTagName('span')[0].innerHTML = "★"}
        else if (sector == "REMOVED") {
            individual_question.style.height = "40px";
            individual_question.style.overflow = "hidden";
            nQstnOptions.getElementsByTagName('span')[0].style.display = "none";
            nQstnOptions.getElementsByTagName('span')[1].style.display = "none";
            nQstnOptions2.getElementsByTagName('span')[0].style.display = "none";
            nQstnEl.style.visibility = "hidden";
            nQstnOptions2.childNodes[1].style['font-weight'] = '900';
           
        }

    })
}