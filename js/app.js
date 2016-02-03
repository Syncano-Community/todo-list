var todos = [
  {
    "complete": false,
    "title": "Sample 1",
    "id": 1,
  }, {
    "complete": false,
    "title": "Sample 2",
    "id": 2,
  }, {
    "complete": false,
    "title": "Sample 3",
    "id": 3,
  }, {
    "complete": false,
    "title": "Sample 4",
    "id": 4,
  }
];

var ENTER_KEY = 13;
var ESCAPE_KEY = 27;

Handlebars.registerHelper("checked", function(c) {
  var out = c ? "check_box" : "check_box_outline_blank"
  return new Handlebars.SafeString(out);
});

var $todoList = $("#todo-list");
var itemTmpl = Handlebars.compile($("#item-template").html());
var editTmpl = Handlebars.compile($("#edit-item-template").html());

var render = function(data) {
  $todoList.html(itemTmpl(data));
}

//cache items
var getTodos = function() {
  return todos;
}

var getTodoById = function(id) {
  return todos.map(function(e) { return e.id; }).indexOf(id);
};

var getIdfromEl = function(el) {
  var id = $(el).closest(".section").data("id");
  return id;
}

var createTodo = function() {

}

var editTodo = function(e) {
  e.preventDefault();
  var id = getIdfromEl(e.target);
  var index = getTodoById(id);
  var item = $(e.target).closest(".section");
  item.replaceWith(editTmpl(todos[index]));
  $("input.updateTodo").focus();
}

var updateTodo = function(e) {
  if (e.which === ENTER_KEY) {
    //find the item and update the title
		console.log("save");
	}

	if (e.which === ESCAPE_KEY) {
		render(getTodos());
	}
}

var toggleTodo = function(e) {
  e.preventDefault();

  var id = getIdfromEl(e.target);
  var index = getTodoById(id);

  todos[index].complete = !todos[index].complete;

  render(getTodos());

}

var deleteTodo = function(e) {
  e.preventDefault();

  var id = getIdfromEl(e.target);
  var index = getTodoById(id);

  if (index > -1) {
    todos.splice(index, 1);
  }

  render(getTodos());

}



$(document).ready(function(){

  //bind functions to ui
  $todoList.on("dblclick", ".editTodo", editTodo.bind(this));
  $todoList.on("click", ".toggleTodo", toggleTodo.bind(this));
  $todoList.on("click", ".deleteTodo", deleteTodo.bind(this));
  $todoList.on("keyup", ".updateTodo", updateTodo.bind(this));

  //render todo list
  render(getTodos());

});
