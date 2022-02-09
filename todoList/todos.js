const fs = require('fs');

let fetchTodos = () => {
  try {
    let todoString = fs.readFileSync('todo-data.json');
    return JSON.parse(todoString);
  } catch(err) {
    return [];
  }
};

let saveTodo = (todos) => {
  fs.writeFileSync('todo-data.json', JSON.stringify(todos));
}

let addTodo = (title) => {
  let todos = fetchTodos();
  let todo = {
    title
  };

  let duplicateTodo = todos.filter((todo) => {todo.title === title});

  if (duplicateTodo.length === 0) {
    todos.push(todo);
    saveTodo(todos);
  }
};

let deleteTodo = (title) => {
  let todos = fetchTodos();
  let filteredTodo = todos.filter((todo) => todo.title !== title);
  saveTodo(filteredTodo);

  return todos.length !== filteredTodo.length;
};

let readTodo = (title) => {
  let todos = fetchTodos();
  let filteredTodo = todos.filter((todo) => todo.title === title);
  return filteredTodo[0];
};

let logTodo = (todo) => {
  console.log('------');
  console.log(`It's title is: ${todo.title}`)
};

let listTodos = () => {
  return fetchTodos();
}

module.exports = {
  addTodo,
  deleteTodo,
  readTodo,
  logTodo,
  listTodos
};