console.log("contributeQB.js is running on current html document")

contributeForm = document.querySelector("#newQstnForm")


autoArr = []
updateAutoArr = function(){
  arr = []
  database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).once("value", function(snapshot){
    snapshot.forEach(function(child){
      arr.push(child.val()["name"])
    })
    autoArr = arr
    autocomplete(contributeForm["topic"], autoArr)
    console.log(autoArr)
  })
}


contributeForm["topic"].addEventListener("focus", (e)=>{
  updateAutoArr()
})




contributeForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  //change if you want to allow anonymous contributions
  if (auth.currentUser == null) {e.target.nextElementSibling.innerHTML = "You must be signed in to contribute"}
  
  else if (auth.currentUser.email.slice(0, auth.currentUser.email.lastIndexOf('@'))) {
    e.target.nextElementSibling.innerHTML = "Your contributor name must be the same as your username";
  }
  else {
  console.log("Form_Submitted")
  console.log("Form submitted by "+contributeForm['contributer'].value)
  database.ref(`questions/${contributeForm['subject'].value}/${contributeForm['unit'].value}/${Math.round(Math.random()*100000000)}`).set({
    difficulty: contributeForm['difficulty'].value,
    contributer: contributeForm['contributer'].value,
    question: contributeForm['questionInput'].value.replaceAll("\n", "</br>"),
    answer: contributeForm['answerInput'].value.replaceAll("\n", "</br>"),
    //workingOut: contributeForm['workingOutInput'].value.replaceAll().replaceAll("\n", "</br>"),
    tech: contributeForm['tech'].value,
    topic: contributeForm["topic"].value
  });
  database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).once("value", function(snapshot){
    pushTopic = true
    snapshot.forEach(function(child){
      if(child.val()["name"] == contributeForm["topic"].value){
        pushTopic = false
      }
    })
    if(pushTopic){
      database.ref("topics/"+contributeForm["subject"].value+"/"+contributeForm["unit"].value).push().set({
        name: contributeForm["topic"].value
      })
    }
  })

  window.setTimeout(function(){
    window.location.href = "./index.html"
  }, 500)
}
})
//console.log(database.ref('Questions/question1').val())



function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  
  startingSuggestions = function(e){
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    inp.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*create a DIV element for each matching element:*/
      b = document.createElement("DIV");
      /*make the matching letters bold:*/
      b.innerHTML = arr[i]
      /*insert a input field that will hold the current array item's value:*/
      b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
      /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
    }
  }
  startingSuggestions()
  
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
} 