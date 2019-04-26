if(!localStorage.getItem('token')){
  $('#loginForm').show()
  $('#registerForm').hide()
  $('#content').hide()
}else{
  $('#loginForm').hide()
  $('#registerForm').hide()  
  $('#content').show()
}

function onSignIn(googleUser) {
  let id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "POST",
    url: `http://localhost:3000/api/users/googleLogin`,
    data: {
      token: id_token
    }
  })
  .done(response => {
    localStorage.setItem('token', response) //response token hasil jwt
    $('#loginForm').hide()
    $('#content').show()
  })
  .fail((jqXHR, textStatus) => {
    console.log(`request failed ${textStatus}`)
  })
}

function login(event) {
  event.preventDefault()
  if($('#email').val()!='' && $('#password').val()!=''){
    let email = $('#email').val()
    let password = $('#password').val()
    
    $.ajax({
      url:"http://localhost:3000/api/users/login",
      method: "POST",
      data: {
        email, password
      }
    })
    .done((response)=>{
      $('#email').val('')
      $('#password').val('')
      $('#loginForm').hide()
      $('#content').show()
      localStorage.setItem('token', response)
    })
    .fail((jqXHR, textStatus)=>{
      console.log(`request failed ${textStatus}`)
    })           
  }
}

function registerForm(event) {
  event.preventDefault()
  $('#registerForm').show()
  $('#loginForm').hide()
  $('#name').val('')
    $('#emaill').val('')
    $('#password').val('')
}

function register(event) {
  event.preventDefault()
  let name = $('#name').val()
  let email = $('#email').val()
  let password = $('#password').val()
  
  $.ajax({
    url: `http://localhost:3000/api/users`,
    method: "POST",
    data: {
      name, email, password
    }
  })
  .done(response => {    
    $('#name').val('')
    $('#email').val('')
    $('#password').val('')
    $('#loginForm').show()
    $('#registerForm').hide()
  })
  .fail((jqXHR, textStatus) => {
    console.log(`request failed ${textStatus}`)
  })
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    $('#loginForm').show()
    $('#content').hide()
    console.log('User signed out.');
  });
}


$(document).ready(function(){
  $('#email').val('')
    $('#password').val('')
  $('#form-login').submit(login)
  $('#form-addTodo').submit(addTodo)
  $('#registerForm').submit(register)

  listTodo()
  $('#addTodo').hide()
  $('#editTodo').hide()
})