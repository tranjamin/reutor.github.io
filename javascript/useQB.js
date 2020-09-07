const $ = ele => {return document.getElementById(ele)}

auth.onAuthStateChanged(user => {
    console.log("auth state change triggered")
    if (user) {
        $('welcomeMessage').innerHTML = `Welcome, ${user.email.slice(0, user.email.lastIndexOf('@'))}`  
        $('signup_button').innerHTML = `<br><p class="navButton">Logout</p><br><p class="navButton">Account</p>`
        $('signup_button').className = ""
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
    if (e.target.password.value == e.target.confirm.value) {
    auth.createUserWithEmailAndPassword(e.target.usernameSU.value + "@rutor.com", e.target.passwordSU.value).then(() => {window.location.reload()}).catch(error => {e.target.nextElementSibling.innerHTML = error.message});
    }
    else {
        e.target.nextElementSibling.innerHTML = "Passwords do not match";
    }
})

console.log('useQB.js is running on current html document')


generateButton = document.querySelector('#generateButton')
questionZone = document.querySelector('#questionZone')
questionForm = document.querySelector('#findQstnForm')
topicDiv = document.querySelector('#topicDiv')

qSnapshotList = []
questionList = []


//console.log(firebase.database.ref('users/test/email').val())





updateTopicDiv = function(){
    database.ref('topics/'+questionForm["subject"].value+"/"+questionForm["unit"].value).once("value", function(snapshot1){
        while(topicDiv.hasChildNodes()){
            topicDiv.removeChild(topicDiv.firstChild)
        }
        topicArr = []
        snapshot1.forEach(function(child){
            nTopic = child.val()['name']
            topicArr.push(nTopic)
    
            nTopicLable = document.createElement("label")
            nTopicLable.innerHTML = nTopic
            nTopicLable.setAttribute("for", nTopic)
    
            nTopicInput = document.createElement("input")
            nTopicInput.setAttribute("type", "checkbox")
            nTopicInput.setAttribute("checked", true)
            nTopicInput.setAttribute("name", nTopic)
    
            brElement = document.createElement("br")
    
            topicDiv.appendChild(nTopicInput)
            topicDiv.appendChild(nTopicLable)
            topicDiv.appendChild(brElement)
        })
        questionForm.addEventListener('submit', function(e){
            e.preventDefault()
            questionList = []
            while(questionZone.hasChildNodes()){
                questionZone.removeChild(questionZone.firstChild)
            }
        
            database.ref('questions/'+questionForm['subject'].value+'/'+questionForm['unit'].value).once("value", function(snapshot){
                questionList = []
                while(questionZone.hasChildNodes()){
                    questionZone.removeChild(questionZone.firstChild)
                }
                snapshot.forEach(function(childSnapshot){
                    //qSnapshotList.append([childSnapshot.val(), childSnapshot.key])
                    childSnapshotData = childSnapshot.val()
        
        
        
                    if((questionForm["SF"].checked == false) && (childSnapshotData["difficulty"] == "Simple Familiar")){
                        console.log("SF Question Excluded")
                    }else if((questionForm["CF"].checked == false) && (childSnapshotData["difficulty"] == "Complex Familiar")){
                        console.log("SF Question Excluded")
                    }else if((questionForm["CU"].checked == false) && (childSnapshotData["difficulty"] == "Complex Unfamiliar")){
                        console.log("CU Question Excluded")
                    }else if((questionForm["techFree"].checked == false) && (childSnapshotData["tech"] == "Tech Free")){
                        console.log("Tech Free Question Excluded")
                    }else if((questionForm["techActive"].checked == false) && (childSnapshotData["tech"] == "Tech Active")){
                        console.log("Tech Active Question Excluded")
                    }else if((questionForm["dunno"].checked == false) && (childSnapshotData["tech"] == "Dunno")){
                        console.log("Dunno Question Excluded")
                    }else{
                        console.log("Question "+ childSnapshot.key+ " not excluded... yet")
                        questionList.push([childSnapshotData, childSnapshot.key])
                    }
        
                })
                
                qstnsToRemove = []
                questionList.forEach(function(question){
                    topicArr.forEach(function(topic){
                        if((questionForm[topic].checked == false) && (topic == question[0]["topic"])){
                            qstnsToRemove.push(question)
                        }
                    })
                })
                qstnsToRemove.forEach(function(removedQuestion){
                    index = questionList.indexOf(removedQuestion)
                    questionList.splice(index, 1)
                    console.log("Excluded question "+removedQuestion[1])
                })

                shuffle(questionList);
                questionList.forEach(function(question){
                    console.log(question[1])
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
                    nQstnId.innerHTML = "ID: "+question[1]
                    nQstnInfo.appendChild(nQstnId)
            
                    var nQstnEl = document.createElement("li")
                    nQstnEl.innerHTML = question[0]["question"];
                    nQstnEl.className = "question";  
            
                    var nQstnAnsButt = document.createElement("button")
                    nQstnAnsButt.innerHTML = "REVEAL ANSWER"
                    var nQstnAns = document.createElement("span")
                    nQstnAns.className = "QstnAnswer"
                    nQstnAns.style.display = "none";
                    nQstnAns.innerHTML = "<br>"+question[0]["answer"]

                    nQstnAnsButt.addEventListener("click", function(event){
                        if(nQstnAnsButt.innerHTML == "UN-REVEAL ANSWER"){
                            nQstnAns.style.display = "none"
                            nQstnAnsButt.innerHTML = "REVEAL ANSWER"
                        } else{
                            nQstnAns.style.display = "block"
                            nQstnAnsButt.innerHTML = "UN-REVEAL ANSWER"
                        }
                    })
                    
                    nQstnSaveButt = document.createElement("button")
                    nQstnSaveButt.innerHTML = "SAVE"
                    nQstnSaveDiv = document.createElement("div")
                    nQstnSaveDiv.style.display = "none"

                    nQstnSaveToCorrect = document.createElement("input"); nQstnSaveToCorrect.type = "checkbox"
                    nQstnSaveToCorrectL = document.createElement("lable"); nQstnSaveToCorrectL.innerHTML = "Correct"
                    nQstnSaveToIncorrect = document.createElement("input"); nQstnSaveToIncorrect.type = "checkbox"
                    nQstnSaveToIncorrectL = document.createElement("lable"); nQstnSaveToIncorrectL.innerHTML = "Incorrect"
                    nQstnSaveToDone = document.createElement("input"); nQstnSaveToDone.type = "checkbox"
                    nQstnSaveToDoneL = document.createElement("lable"); nQstnSaveToDoneL.innerHTML = "Done"
                    nQstnSaveDiv.appendChild(nQstnSaveToCorrect); nQstnSaveDiv.appendChild(nQstnSaveToCorrectL); nQstnSaveDiv.appendChild(nQstnSaveToIncorrect); nQstnSaveDiv.appendChild(nQstnSaveToIncorrectL); nQstnSaveDiv.appendChild(nQstnSaveToDone); nQstnSaveDiv.appendChild(nQstnSaveToDoneL);



                    nQstnSaveButt.addEventListener("click", function(event){
                        if(event.target.innerHTML == "-SAVE-"){
                            event.target.nextElementSibling.style.display = "none"
                            event.target.innerHTML = "SAVE"
                            console.log(nQstnSaveButt.innerHTML)
                        } else{
                            event.target.innerHTML = "-SAVE-"
                            event.target.nextElementSibling.style.display = "block"
                            console.log(nQstnSaveButt.innerHTML)
                        }
                    })

            
            
            
            
                    questionZone.appendChild(nQstnInfo)
                    questionZone.appendChild(nQstnEl)
                    questionZone.appendChild(nQstnAnsButt)
                    questionZone.appendChild(nQstnAns)
                    questionZone.appendChild(nQstnSaveButt)
                    questionZone.appendChild(nQstnSaveDiv)
                    questionZone.appendChild(LINE)
                })

                if(questionList.length==0){
                    message = document.createElement("p")
                    message.innerHTML = "Sorry, we don't seem to have any "+questionForm["subject"].value+ " " + questionForm["unit"].value+ " questions in our database (that fit your descriptors)."
                    message.setAttribute("class", "errorMessages")
                    questionZone.appendChild(message)
                }
                
            })
            
            
             
        })
    })
}

if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
    updateTopicDiv()
}


questionForm["subject"].addEventListener("change", function(){
    if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
        updateTopicDiv()
    }
})
questionForm["unit"].addEventListener("change", function(){
    if ((questionForm['subject'].value != "") && (questionForm['unit'].value != "")){
        updateTopicDiv()
    }
})

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
  
      // swap elements array[i] and array[j]
      // we use "destructuring assignment" syntax to achieve that
      // you'll find more details about that syntax in later chapters
      // same can be written as:
      // let t = array[i]; array[i] = array[j]; array[j] = t
      [array[i], array[j]] = [array[j], array[i]];
    }
  }