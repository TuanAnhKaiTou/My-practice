const _ = require('lodash');
const yargs = require('yargs');
const todos = require('./todos.js');

const argv = yargs.argv;
let cmd = argv._[0];
let title = argv.title;

console.log('Running Command:', cmd);

switch(cmd) {
  case "addTodo":
    todos.addTodo(title);
    break;

  case "deleteTodo":
    let deletedTodo = todos.deleteTodo(title);
    let msg = deletedTodo ? "Todo was deleted" : "Todo not found";
    console.log(msg);
    break;

  case "readTodo":
    let todo = todos.readTodo(title);
    if (todo) {
      console.log('Great! The todo was found.')
      todos.logTodo(todo);
    } else {
      console.log('Whoops! The todo was not found.');
    }
    break;

  case "listTodos":
    let allTodos = todos.listTodos();
    console.log(`Printing ${allTodos.length} todo(s).`);
    allTodos.forEach(todo => todos.logTodo(todo));
    break;

  default:
    console.log('Invalid command');
}