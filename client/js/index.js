if(!localStorage.getItem('token')){
  $('#loginForm').hide()
  $('#registerForm').show()
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
    
    localStorage.setItem('token', response)
  })
  .fail((jqXHR, textStatus)=>{
    console.log(`request failed ${textStatus}`)
  })

  //   .fail((err, textStatus) => {
  //     let errors = err.responseJSON.message
  //     swal({
  //       text: errors,
  //       icon: "warning",
  //       button: "Awwttss",
  //     });
  //     console.log(`request failed ${textStatus}`)
  //   })                     
}

function registerForm() {
  event.preventDefault()
  $('#registerForm').show()
  $('#loginForm').hide()
}

function register() {
  console.log("MASUK");
  
  $.ajax({
    method: "POST",
    url: `http://localhost:3000/api/users/`,
    data: {
      // name: 
    }
  })
  .done(response => {    
    $('#show-login').show()
    $('#show-register').hide()
    $('#name').val('')
    $('#email').val('')
    $('#password').val('')
  })
  .fail((jqXHR, textStatus) => {
    console.log(`request failed ${textStatus}`)
  })
}


function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    localStorage.removeItem('token')
    console.log('User signed out.');
  });
}

function detailTodo(id){
  $('#detail-todo').empty()
  $.ajax({
    url: `http://localhost:3000/api/todo/${id}`,
    method: 'GET'
  })
  .done(function(todo){
      let info = null
      let status = todo.status
      let due_date = new Date(todo.due_date)
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
      }

      $('#detail-todo').append(`<div class="card ${info}">
                        <h5 class="card-header">Detail Todo</h5>
                        <div class="card-body">
                            <h5 class="card-title"> Name : ${todo.name}</h5>
                            <p class="card-text">Description : ${todo.description}</p>
                            <p class="card-text">Due Date : ${year}-${month}-${date}</p>
                            <p class="card-text">Status : ${status}
                            <button type="button" class="btn btn-secondary btn-sm" onclick="changeStatus('${todo._id}')">Change Status</button>
                              </p>
                            <a class="btn btn-primary" onclick='detailTodo("${todo._id}")'>Edit</a>
                        </div>
                    </div>
      `)
    

  })
  .fail(function(err){
    console.log(err);
    
  })
}

function listTodo(){
  $.ajax({
    url: 'http://localhost:3000/api/todo',
    method: 'GET'
  })
  .done(function(response){
    
    for(todo of response){
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

function addTodo(tes){
  console.log(tes);
  
  let name = $('#name').val()
  let description = $('#description').val()
  let due_date = $('#due_date').val()
  console.log(name, description, due_date);
  
  
  $.ajax({
    url:"http://localhost:3000/api/todo",
    method: 'POST',
    data: {
      // name, description, due_date, userId
    }
  })
  .done((response)=>{
    console.log(response);
  })
  .fail((jqXHR, textStatus)=>{
    // console.log(`request failed ${textStatus}`)
    console.log(`gagal`)
  })
}

$(document).ready(function(){
  $('#form-login').submit(login)
  listTodo()
})