import './style.css'


const toggler_container = document.querySelector('.toggler-container')
const todos = document.getElementById('todos')
const todo_add = document.getElementById('add-todo')
const todos_num = document.getElementById('todos-num')
const all_todos = document.getElementById('all')
const active_todos = document.getElementById('active')
const completed_todos = document.getElementById('completed')
const clear_completed_todos = document.getElementById('clear')


set_todos()

set_num_todos()
toggler_container.addEventListener('click', ()=> {
    toggler_container.classList.toggle('active');
    document.body.classList.toggle('light')
})


todo_add.addEventListener('submit',(e)=>{
    e.preventDefault()
    let todo_text =e.target.querySelector('input[type="text"]')
    let todo_checked= e.target.querySelector('input[type="checkbox"]')
    if (todo_text.value == '') return
    create_todo(todo_text.value , todo_checked.checked)
    set_num_todos()
    let old_todos = JSON.parse(localStorage.getItem('todos')) || []
    let new_todos = [...old_todos , {text:todo_text.value , checked: todo_checked.checked}]
    localStorage.setItem('todos' , JSON.stringify(new_todos))
    todo_text.value= ""
    todo_checked.checked = false
})


all_todos.addEventListener('click' , ()=>{
    removeActive()
    all_todos.classList.add('active')
    get_all_todos().forEach(todo => todo.classList.remove('hide'))
})



active_todos.addEventListener('click' ,()=>{
    removeActive()
    active_todos.classList.add('active')
    get_active_todos().forEach(todo => todo.classList.remove('hide'))
    get_Completed_todos().forEach(todo => todo.classList.add('hide'))
    
})
completed_todos.addEventListener('click' ,()=>{
    removeActive()
    completed_todos.classList.add('active')
    get_Completed_todos().forEach(todo => todo.classList.remove('hide'))
    get_active_todos().forEach(todo => todo.classList.add('hide'))
})



clear_completed_todos.addEventListener('click', ()=>{
    
    get_Completed_todos().forEach(todo => {
       removeTodo(todo);
    
    })
    set_num_todos()

})
function removeTodo(todo) {
        let todo_text = todo.querySelector('.todo-text').innerText
        let todo_checked = todo.querySelector('input[type="checkbox"]').checked
        let old_todos = JSON.parse(localStorage.getItem('todos')) || []
        let new_todos = old_todos.filter((t)=> (todo_text!==t.text && t.checked!== todo_checked))
        localStorage.setItem('todos' , JSON.stringify(new_todos))
        todo.remove()
}

function create_todo(text='', checked=false) {
    let todo = document.createElement('li')
    todo.classList.add('todo')
    todo.setAttribute('draggable', true)
    todo.innerHTML = `
    <input ${checked===true? 'checked':''} type="checkbox">
    <p class="todo-text">${text}</p>
    <svg class="cross" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="#494C6B" fill-rule="evenodd" d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"/></svg>

`

    todo.addEventListener('click', (e)=>{
        let check = todo.querySelector('input[type="checkbox"]')
        
        check.checked===true ? check.checked= false :check.checked= true ;
        
    })
    todo.querySelector('input[type="checkbox"]').addEventListener('click',(e)=>{
        e.stopPropagation()
        
    })
    
    todo.querySelector('.cross').addEventListener('click',(e)=>{
        let t = e.target.closest('.todo')
        removeTodo(t)
        set_num_todos()
    })
    setDragEvents(todo)
    todos.appendChild(todo);
}

function removeActive() {
    document.querySelectorAll('.filters-group .btn').forEach(btn => btn.classList.remove('active'))
}
function get_all_todos() {
    return [...document.querySelectorAll('.todo')]
}
function get_active_todos(){
    let todos = [...document.querySelectorAll('.todo input[type="checkbox"]:not(:checked)')]
    let completed_todos = todos.map((t)=> t.closest('.todo'))
    return completed_todos
}
function get_Completed_todos(){
    let todos = [...document.querySelectorAll('.todo input[type="checkbox"]:checked')]
    let completed_todos = todos.map((t)=> t.closest('.todo'))
    return completed_todos
}
function set_num_todos(params) {
    todos_num.innerText = get_all_todos().length
}
function set_todos() {
    let todos = JSON.parse(localStorage.getItem('todos'))||[]
    todos.forEach((todo)=>{
        create_todo(todo.text , todo.checked)
    })
}

function setDragEvents(t){
    const todos_container = document.getElementById('todos')
    t.addEventListener('dragstart',(e)=>{
        e.target.classList.add("dragged")
    })
    t.addEventListener('dragend',(e)=>{
        e.target.classList.remove("dragged")
    })
    
    t.addEventListener('dragover',(e)=>{
        e.preventDefault()
        if (!e.target.classList.contains('dragged')) {
            e.target.classList.add('target')
            
        }
    })
    
    t.addEventListener('dragleave',(e)=>{
        if (!e.target.classList.contains('dragged')) {
            e.target.classList.remove('target')
        }
    })
    t.addEventListener('drop',(e)=>{
       let target = todos_container.querySelector('.target');
       target.classList.remove('target')
       let dragged = todos_container.querySelector('.dragged');
       dragged.classList.remove('dragged')
       target.insertAdjacentElement('beforebegin',dragged)
       updateLocalStorage()
    })


}
function updateLocalStorage() {
    let ordered_todos = [...document.querySelectorAll('.todo')]
    
    localStorage.removeItem('todos')
    ordered_todos.forEach(todo => {
        let todo_text = todo.querySelector('.todo-text').innerText
        let todo_checked = todo.querySelector('input[type="checkbox"]').checked
        let old_todos = JSON.parse(localStorage.getItem('todos'))||[]
        let new_todos = [...old_todos , {text:todo_text , checked: todo_checked}]
        localStorage.setItem('todos' , JSON.stringify(new_todos))
    })
}