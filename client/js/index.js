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
  let email = $('#email').val()
  let password = $('#password').val()
  console.log(email, password);
  
  $.ajax({
    url:"http://localhost:3000/api/users/login",
    method: "POST",
    data: {
      email, password
    }
  })
  .done((response)=>{
    console.log(response);
    $('#loginForm').hide()
    $('#content').show()
    localStorage.setItem('token', response)
  })
  .fail((jqXHR, textStatus)=>{
    console.log(`request failed ${textStatus}`)
  })           
}

function registerForm(event) {
  event.preventDefault()
  $('#registerForm').show()
  $('#loginForm').hide()
}

function register() {
  // event.preventDefault()
  console.log("MASUK1");
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
  console.log("MASUK2");
    $('#show-login').show()
    $('#show-register').hide()
    $('#name').val('')
    $('#email').val('')
    $('#password').val('')
  })
  .fail((jqXHR, textStatus) => {
  console.log("MASUK3");

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

function detailTodo(id){
  $('#addTodo').hide()
  $('#detail-todo').empty()
  $.ajax({
    url: `http://localhost:3000/api/todo/${id}`,
    method: 'GET',
    headers: {
      authorization : localStorage.token
    }
  })
  .done(function({data}){
      let todo = data
    
      let info = null
      let status = todo.status
      let buttonStatus = ''
      let due_date = new Date(data.due_date)
      let date = due_date.getDate()
      let month = due_date.getMonth()+1
      let year = due_date.getFullYear()

      let difference = Math.ceil((new Date(todo.due_date)-new Date())/(24*60*60*1000))

      if(todo.status==true){
        info = "list-group-item-success border-success"
      }else if(difference<0 && todo.status==false){
        info = "list-group-item-danger border-danger"
      }else if((difference==1 || difference==0 )&& todo.status==false){
        info = "list-group-item-warning border-warning"
      }

      if(date<10){
        date = `0${date}`
      }
      if(month<10){
        month = `0${month}`
      }
      
      if(status){
        status = "Done"
      }else{
        status = "Not yet"
        buttonStatus = `<button type="button" class="btn btn-secondary btn-sm" onclick="changeStatus('${todo._id}')">Change Status</button>`
      }

      $('#detail-todo').append(`<div class="card ${info}">
                        <h5 class="card-header">Detail Todo</h5>
                        <div class="card-body">
                            <h5 class="card-title"> Name : ${todo.name}</h5>
                            <p class="card-text">Description : ${todo.description}</p>
                            <p class="card-text">Due Date : ${year}-${month}-${date}</p>
                            <p class="card-text">Status : ${status}
                            ${buttonStatus}
                              </p>
                            
                              <a class="btn btn-primary" onclick='editTodo("${todo._id}")'>Edit</a>
                        </div>
                    </div>
      `)

  })
  .fail(function(err){
    console.log(err);
  })
}

function changeStatus(id){  
  $.ajax({
    url: `http://localhost:3000/api/todo/${id}`,
    method: 'PATCH'
  })
  .done(function(response){
    console.log("status sukses");
    listTodo()    
    console.log(response);
  })
  .fail(err=>{
    console.log(err);    
  })
}

function listTodo(){  
  $('#list-todo').empty()

  $.ajax({
    url: 'http://localhost:3000/api/todo',
    method: 'GET',
    headers: {token: localStorage.token}
  })
  .done(function(response){    
    for(todo of response.data){
      let info = null
      let difference = Math.ceil((new Date(todo.due_date)-new Date())/(24*60*60*1000))
      if(todo.status==true){
        info = "list-group-item-success"
      }else if(difference<0 && todo.status==false){
        info = "list-group-item-danger"
      }else if((difference==1 || difference==0 ) && todo.status==false){
        info = "list-group-item-warning"
      }
    
      $('#list-todo').append(`<li class="list-group-item list-group-item-action ${info}" onclick='detailTodo("${todo._id}")'>${todo.name}</li>`)
    }

  })
}

function addTodo(event){  
  event.preventDefault()
  
  let name = $('#nama').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()
  let status = false
  
  $.ajax({
    url:"http://localhost:3000/api/todo",
    method: 'POST',
    data: {
      name, description, due_date, userId, status
    }
  })
  .done((response)=>{
    $('#nama').val('')
    $('#description').val('')
    $('#due_date').val('')
    listTodo()
    console.log(response);
  })
  .fail((jqXHR, textStatus)=>{
    // console.log(`request failed ${textStatus}`)
    console.log(`gagal`)
  })
}

function createTodo(){
  $('#detail-todo').empty()
  $('#addTodo').show()
}

$(document).ready(function(){
  $('#form-login').submit(login)
  $('#form-addTodo').submit(addTodo)
  $('#registerForm').submit(register)

  listTodo()
  $('#addTodo').hide()
  $('#editTodo').hide()
})