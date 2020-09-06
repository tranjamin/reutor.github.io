$ = ele => {return document.getElementById(ele)}

auth.onAuthStateChanged(user => {
  if (user) {$('signup_button').innerHTML = `Welcome, ${user.email.slice(0, user.email.lastIndexOf('@'))}<br><p>Logout</p><br><p>Account</p>`}
})


$('signup_button').addEventListener('click', e => {
  if (e.target.innerHTML == "Login/Signup") {
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


var prev_key = "";
$('questionInput').addEventListener('keydown', e => {
  if (!$('newQstnForm')['edit_version'].checked) {
      console.log(e.key)
      var original_node = document.getSelection().focusNode;
      var original_string = original_node.data;
      var caret_pos = getCaretPosition(e.target);
      if (original_string) {
      var inserted_html = original_string.split('');
    
      if (e.key == "-" && inserted_html[inserted_html.length - 1] == "-" && inserted_html[inserted_html.length - 2] == "<") {
        e.preventDefault();
        inserted_html.pop();
        inserted_html[inserted_html.length - 1] = "←";
        caret_pos -= 1;
        inserted_html = inserted_html.join('');
        original_node.data = inserted_html;
      setCaret(original_node, caret_pos)
      }
      else if (e.key == ">" && inserted_html[inserted_html.length - 1] == "-" && inserted_html[inserted_html.length - 2] == "-") {
        e.preventDefault();
        inserted_html.pop();
        inserted_html[inserted_html.length - 1] = "→";
        caret_pos -= 1;
        inserted_html = inserted_html.join('');
        original_node.data = inserted_html;
      setCaret(original_node, caret_pos)
      }
      else if (e.key == ">" && inserted_html[inserted_html.length - 1] == "←") {
        e.preventDefault();
        inserted_html[inserted_html.length - 1] = "⇌";
        inserted_html = inserted_html.join('');
        original_node.data = inserted_html;
      setCaret(original_node, caret_pos)
      }

    }
      if (e.key == "^") {
        console.log(1);
        e.preventDefault();
        document.execCommand('superscript', false, null)
        prev_key = "^";
      }
      else if (e.key == "_") {
        console.log(1);
        e.preventDefault();
        document.execCommand('subscript', false, null)
        prev_key = "_";
      }
      else if (e.key == "ArrowRight") {
        console.log(2);
        prev_key = "";
        if (document.queryCommandState('superscript')) {document.execCommand('superscript', false, null)}
        if (document.queryCommandState('subscript')) {document.execCommand('subscript', false, null)}
      }
      else if (e.key == "Escape" && prev_key) {
        e.target.innerHTML = e.target.innerHTML.split('').splice(getCaretPosition(e.target),0,prev_key).join('')
        prev_key = "";
      }
      else {
        prev_key = "";
      }
  }
})
$('questionInput').addEventListener('keypress', e => {
  if ($('newQstnForm')['edit_version'].checked) {
    prev_key = "";
    e.preventDefault();
    var original_node = document.getSelection().focusNode;
    var original_string = original_node.data;
    var caret_pos = getCaretPosition(e.target);
    if (original_string) {
    var inserted_html = original_string.split('');
    inserted_html.splice(caret_pos, 0, e.key == "Enter" ? ' ' : e.key);
  
    if (inserted_html[inserted_html.length - 1] == "-" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "<") {
      inserted_html.pop();
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "←";
      caret_pos -= 2;
    }
    else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "-") {
      inserted_html.pop();
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "→";
      caret_pos -= 2;
    }
    else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "←") {
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "⇌"
      caret_pos -= 1;
    }
    inserted_html = inserted_html.join('');
    original_node.data = inserted_html;
  
    if ((/[\s*=]/).test(e.key)) {
      var last_word = inserted_html.slice(0,inserted_html.length - 1).split(/[\s*=]/);
      last_word = last_word[last_word.length - 1]
      var last_word_index = inserted_html.lastIndexOf(last_word);
      
      if (last_word.includes('^') && (last_word.slice(0,getCaretPosition(e.target)).match(/\(/g) || []).length ==  (last_word.slice(0,getCaretPosition(e.target)).match(/\)/g) || []).length) {
      var slice_portion = last_word_index + last_word.lastIndexOf('^', last_word.length);
      console.log(slice_portion);
      var new_string = inserted_html.split('')
      new_string.splice(slice_portion, caret_pos + 1 - slice_portion, `<sup>${last_word.substr(last_word.lastIndexOf('^') + 1,last_word.length - 1)}</sup> `)
      inserted_html = new_string.join('').split(/<\/?sup>/);
      console.log(inserted_html);
      original_node.parentElement.insertBefore(document.createTextNode(inserted_html[0]), original_node)
      original_node.parentElement.insertBefore(document.createElement("SUP"), original_node).innerHTML = inserted_html[1];
      var new_caret = original_node.parentElement.insertBefore(document.createTextNode(inserted_html[2]), original_node)
      original_node.parentElement.removeChild(original_node);
      setCaret(new_caret, new_caret.data.length);
    }
    else if (last_word.includes('_') && (last_word.slice(0,getCaretPosition(e.target)).match(/\(/g) || []).length ==  (last_word.slice(0,getCaretPosition(e.target)).match(/\)/g) || []).length) {
      var slice_portion = last_word_index + last_word.lastIndexOf('_', last_word.length);
      console.log(slice_portion);
      var new_string = inserted_html.split('')
      new_string.splice(slice_portion, caret_pos + 1 - slice_portion, `<sub>${last_word.substr(last_word.lastIndexOf('_') + 1,last_word.length - 1)}</sub> `)
      inserted_html = new_string.join('').split(/<\/?sub>/);
      console.log(inserted_html);
      original_node.parentElement.insertBefore(document.createTextNode(inserted_html[0]), original_node)
      original_node.parentElement.insertBefore(document.createElement("SUB"), original_node).innerHTML = inserted_html[1];
      var new_caret = original_node.parentElement.insertBefore(document.createTextNode(inserted_html[2]), original_node)
      original_node.parentElement.removeChild(original_node);
      setCaret(new_caret, new_caret.data.length);
    }
  
    else {
      setCaret(original_node, caret_pos + 1);
      }
  
    }
    else {
    setCaret(original_node, caret_pos + 1);
    }
  
  
    }
    else {
      e.target.appendChild(document.createTextNode(e.key))
      setCaret(e.target.childNodes[0], 1);
    }
  
  }
})

var prev_key2 = "";
$('answerInput').addEventListener('keydown', e => {
  if (!$('newQstnForm')['edit_version'].checked) {
      console.log(e.key)
      var original_node = document.getSelection().focusNode;
      var original_string = original_node.data;
      var caret_pos = getCaretPosition(e.target);
      if (original_string) {
      var inserted_html = original_string.split('');
    
      if (inserted_html[inserted_html.length - 1] == "-" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "<") {
        e.preventDefault();
        inserted_html.pop();
        inserted_html.pop();
        inserted_html[inserted_html.length - 1] = "←";
        caret_pos -= 2;
      }
      else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "-") {
        e.preventDefault();
        inserted_html.pop();
        inserted_html.pop();
        inserted_html[inserted_html.length - 1] = "→";
        caret_pos -= 2;
      }
      else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "←") {
        e.preventDefault();
        inserted_html.pop();
        inserted_html[inserted_html.length - 1] = "⇌"
        caret_pos -= 1;
      }
      inserted_html = inserted_html.join('');
      original_node.data = inserted_html;
    }
      if (e.key == "^") {
        e.preventDefault();
        document.execCommand('superscript', false, null)
        prev_key2 = "^";
      }
      else if (e.key == "_") {
        e.preventDefault();
        document.execCommand('subscript', false, null)
        prev_key2 = "_";
      }
      else if (e.key == "ArrowRight") {
        prev_key2 = "";
        if (document.queryCommandState('superscript')) {document.execCommand('superscript', false, null)}
        if (document.queryCommandState('subscript')) {document.execCommand('subscript', false, null)}
      }
      else if (e.key == "Escape" && prev_key) {
        e.target.innerHTML = e.target.innerHTML.split('').splice(getCaretPosition(e.target),0,prev_key).join('')
        prev_key2 = "";
      }
      else {
        prev_key2 = "";
      }
      setCaret(original_node, caret_pos)
  }
})
$('answerInput').addEventListener('keypress', e => {
  if ($('newQstnForm')['edit_version'].checked) {
    prev_key2 = "";
    e.preventDefault();
    var original_node = document.getSelection().focusNode;
    var original_string = original_node.data;
    var caret_pos = getCaretPosition(e.target);
    if (original_string) {
    var inserted_html = original_string.split('');
    inserted_html.splice(caret_pos, 0, e.key == "Enter" ? ' ' : e.key);
  
    if (inserted_html[inserted_html.length - 1] == "-" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "<") {
      inserted_html.pop();
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "←";
      caret_pos -= 2;
    }
    else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "-" && inserted_html[inserted_html.length - 3] == "-") {
      inserted_html.pop();
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "→";
      caret_pos -= 2;
    }
    else if (inserted_html[inserted_html.length - 1] == ">" && inserted_html[inserted_html.length - 2] == "←") {
      inserted_html.pop();
      inserted_html[inserted_html.length - 1] = "⇌"
      caret_pos -= 1;
    }
    inserted_html = inserted_html.join('');
    original_node.data = inserted_html;
  
    if ((/[\s*=]/).test(e.key)) {
      var last_word = inserted_html.slice(0,inserted_html.length - 1).split(/[\s*=]/);
      last_word = last_word[last_word.length - 1]
      var last_word_index = inserted_html.lastIndexOf(last_word);
      
      if (last_word.includes('^') && (last_word.slice(0,getCaretPosition(e.target)).match(/\(/g) || []).length ==  (last_word.slice(0,getCaretPosition(e.target)).match(/\)/g) || []).length) {
      var slice_portion = last_word_index + last_word.lastIndexOf('^', last_word.length);
      console.log(slice_portion);
      var new_string = inserted_html.split('')
      new_string.splice(slice_portion, caret_pos + 1 - slice_portion, `<sup>${last_word.substr(last_word.lastIndexOf('^') + 1,last_word.length - 1)}</sup> `)
      inserted_html = new_string.join('').split(/<\/?sup>/);
      console.log(inserted_html);
      original_node.parentElement.insertBefore(document.createTextNode(inserted_html[0]), original_node)
      original_node.parentElement.insertBefore(document.createElement("SUP"), original_node).innerHTML = inserted_html[1];
      var new_caret = original_node.parentElement.insertBefore(document.createTextNode(inserted_html[2]), original_node)
      original_node.parentElement.removeChild(original_node);
      setCaret(new_caret, new_caret.data.length);
    }
    else if (last_word.includes('_') && (last_word.slice(0,getCaretPosition(e.target)).match(/\(/g) || []).length ==  (last_word.slice(0,getCaretPosition(e.target)).match(/\)/g) || []).length) {
      var slice_portion = last_word_index + last_word.lastIndexOf('_', last_word.length);
      console.log(slice_portion);
      var new_string = inserted_html.split('')
      new_string.splice(slice_portion, caret_pos + 1 - slice_portion, `<sub>${last_word.substr(last_word.lastIndexOf('_') + 1,last_word.length - 1)}</sub> `)
      inserted_html = new_string.join('').split(/<\/?sub>/);
      console.log(inserted_html);
      original_node.parentElement.insertBefore(document.createTextNode(inserted_html[0]), original_node)
      original_node.parentElement.insertBefore(document.createElement("SUB"), original_node).innerHTML = inserted_html[1];
      var new_caret = original_node.parentElement.insertBefore(document.createTextNode(inserted_html[2]), original_node)
      original_node.parentElement.removeChild(original_node);
      setCaret(new_caret, new_caret.data.length);
    }
  
    else {
      setCaret(original_node, caret_pos + 1);
      }
  
    }
    else {
    setCaret(original_node, caret_pos + 1);
    }
  
  
    }
    else {
      e.target.appendChild(document.createTextNode(e.key))
      setCaret(e.target.childNodes[0], 1);
    }
  
  }
})


contributeForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  //change if you want to allow anonymous contributions
  if (auth.currentUser == null && false) {e.target.nextElementSibling.innerHTML = "You must be signed in to contribute"}
  
  // else if (auth.currentUser.email.slice(0, auth.currentUser.email.lastIndexOf('@'))) {
  //   e.target.nextElementSibling.innerHTML = "Your contributor name must be the same as your username";
  // }
  else {
  $('contributeButton').style.display = "none";
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
  }).catch(error => {e.target.nextElementSibling.innerHTML = error.message; 
    $('contributeButton').style.display = "initial";});
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
  }).then(ref => window.location.href="./index.html").catch(error => {e.target.nextElementSibling.innerHTML = error.message; 
    $('contributeButton').style.display = "initial";})

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

function doGetCaretPosition (oField) {

  // Initialize
  var iCaretPos = 0;

  // IE Support
  if (document.selection) {

    // Set focus on the element
    oField.focus();

    // To get cursor position, get empty selection range
    var oSel = document.selection.createRange();

    // Move selection start to 0 position
    oSel.moveStart('character', -oField.innerHTML.length);

    // The caret position is selection length
    iCaretPos = oSel.text.length;
  }

  // Firefox support
  else if (oField.selectionStart || oField.selectionStart == '0')
    iCaretPos = oField.selectionDirection=='backward' ? oField.selectionStart : oField.selectionEnd;

  // Return results
  return iCaretPos;
}

$('answerInput').addEventListener('click', e => {
  getCaretPosition(e.target)})

function getCaretPosition(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}

// Credits: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  
  // IE8 and below
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

copy_arr = (arr) => {
  var int = [];
  arr.forEach(ele => {int.push(ele)})
  return int;
}

calculate_total_carets = (focussed_element, master_parent) => {
  var reached_node = false;
  var total = 0;
  if (focussed_element == master_parent || ([]).indexOf.call(master_parent.childNodes, focussed_element) != -1) {
    ([]).forEach.call(master_parent.childNodes, (child) => {
      if (!reached_node) {
      if (child == focussed_element) {
        var chopped_html = child.data;
        console.log(chopped_html);
        chopped_html = chopped_html.replaceAll(/[\,\.\/\;\'\[\]]/g,'1').replaceAll(/&#\d{4}/g, ',').replaceAll(/&#\d{5}/g, ';')
        .replaceAll(/&#\d{6}/g, '\'').replaceAll('&nbsp', '[')
        .replaceAll('&lt;', '.').replaceAll('&gt;', '.').replaceAll('\\\\','\\').replaceAll('&amp','.')
        chopped_html = chopped_html.slice(0, getCaretPosition(focussed_element.parentElement) + 1).replaceAll(',','666666').replaceAll(';','7777777')
        .replaceAll('\'', '88888888').replaceAll('[', '55555').replaceAll('.','4444').replaceAll('\\', '22')
        total += chopped_html.length; reached_node = true;
      }
      else {
        if (child.nodeName == "#text") {total += child.data.length}
        else {total += (child.innerHTML + child.outerHTML).length}
    }
  }
    })
  }
  else {
  }
  return total;
}

// document.addEventListener('keypress', e => {
//   console.log(calculate_total_carets(document.getSelection().focusNode, $('answerInput')));
// })

function setCaret(child, num, ele=null) {
  var el = document.getElementById(ele ? ele : child.parentElement)
  var range = document.createRange()
  var sel = window.getSelection()
  
  range.setStart(child, num)
  range.collapse(true)
  
  sel.removeAllRanges()
  sel.addRange(range)
}