var todos = [
  {
    complete: false,
    title: 'Sample 1',
    todoid: 1,
  }, {
    complete: false,
    title: 'Sample 2',
    todoid: 2,
  }, {
    complete: false,
    title: 'Sample 3',
    todoid: 3,
  }, {
    complete: false,
    title: 'Sample 4',
    todoid: 4,
  },
];

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const todoItemWrapper = '.section';
const $todoList = $('#todo-list');
const itemTmpl = Handlebars.compile($('#item-template').html());
const editTmpl = Handlebars.compile($('#edit-item-template').html());

//some handlebar helpers
Handlebars.registerHelper('checked', function(c) {
  var out = c ? 'check_box' : 'check_box_outline_blank';
  return new Handlebars.SafeString(out);
});

//creates a guid for todoid
var createGuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

var render = function(data) {
  //data is optional - could be a filtered list.
  //todos should come from local storage
  var d = data || todos;
  $todoList.html(itemTmpl(d));
};

var getTodos = function() {
  //only run once to retrieve from server
  //set to local storage?
  return todos;
};

//get todo ui wrapper element
var getTodoEl = function(el) {
  return $(el).closest(todoItemWrapper);
};

//get the todo array postition
var getTodoId = function(el) {
  var $el = getTodoEl(el);
  return $el.data('todoid');
};

var getArrayIndex = function(todoid) {
  return todos.map(function(e) { return e.todoid; }).indexOf(todoid);
};

//get the todo array postition
var getTodoIndexByEl = function(el) {
  var $el = getTodoEl(el);
  var todoid = getTodoId($el);
  return getArrayIndex(todoid);
};

//switch to edit mode
var startEditMode = function(e) {
  e.preventDefault();
  getTodoEl(e.target).replaceWith(editTmpl(todos[getTodoIndexByEl(e.target)]));
  $('input.updateTodo').focus();
};

//handle all clicks
var _clickHandler = function(e) {
  e.preventDefault();
  switch (e.data) {
    //delete button clicked
    case 'delete':
      _delete({ todoid: getTodoId(e.target) });
      break;

    //toggle completed
    case 'update':
      var complete = $(e.currentTarget).data('complete');
      _update({ todoid: getTodoId(e.target), complete: !complete });
      break;

    default:

  }
};

//handle all key press
var _keyHandler = function(e) {
  //e.preventDefault();
  switch (e.which) {
    // escaping edit/create mode
    case ESCAPE_KEY:
      render();
      break;

    //confirming change
    case ENTER_KEY:
      if (e.data === 'update') {
        _update({ todoid: getTodoId(e.target), title: $(e.currentTarget).val() });
      }

      if (e.data === 'create') {
        _create({ todoid: createGuid(), title: $(e.currentTarget).val(), complete: false });
      }

      break;
    default:

  }
};

//add new todo to the array
var _create = function(data) {
  var index = getArrayIndex(data.todoid);
  if (index != 0) {
    todos.push(data);
  }
  console.log(todos);
  render();
};

//update existing todo
var _update = function(data) {
  var index = getArrayIndex(data.todoid);

  if (data.hasOwnProperty('complete')) {
    todos[index].complete = data.complete;
  }

  if (data.hasOwnProperty('title')) {
    todos[index].title = data.title;
  }

  render();
};

//delete todo from array
var _delete = function(data) {
  var index = getArrayIndex(data.todoid);

  if (index > -1) {
    todos.splice(index, 1);
  }

  render();
};

$(document).ready(function() {

  //bind functions to ui

  $todoList.on('dblclick', '.editTodo', startEditMode.bind(this));
  $todoList.on('click', '.deleteTodo', 'delete', _clickHandler.bind(this));
  $todoList.on('click', '.toggleTodo', 'update', _clickHandler.bind(this));
  $todoList.on('keyup', '.updateTodo', 'update', _keyHandler.bind(this));
  $todoList.on('keyup', '.createTodo', 'create', _keyHandler.bind(this));

  // this.$newTodo.on('keyup', this.create.bind(this));
  // this.$toggleAll.on('change', this.toggleAll.bind(this));
  // this.$footer.on('click', '#clear-completed', this.destroyCompleted.bind(this));
  // list.on('change', '.toggle', this.toggle.bind(this));
  // list.on('dblclick', 'label', this.edit.bind(this));
  // list.on('keyup', '.edit', this.editKeyup.bind(this));
  // list.on('focusout', '.edit', this.update.bind(this));
  // list.on('click', '.destroy', this.destroy.bind(this));

  //render todo list
  render(getTodos());

});
