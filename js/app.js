const ENTER_KEY = 13;
const ESCAPE_KEY = 27;
const todoItemWrapper = '.section';
const $todoList = $('#todo-list');
const itemTmpl = Handlebars.compile($('#item-template').html());
const editTmpl = Handlebars.compile($('#edit-item-template').html());

const utils = {
  store: function(namespace, data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  },

  retrieve: function(namespace) {
    if (!localStorage.getItem(namespace)) {
      localStorage.setItem(namespace, JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem(namespace));
  },

  createGuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      var v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
};

//some handlebar helpers
Handlebars.registerHelper('checked', function(c) {
  var out = c ? 'check_box' : 'check_box_outline_blank';
  return new Handlebars.SafeString(out);
});

var todos;
var filter;

var render = function() {
  $todoList.html(itemTmpl(getFilteredTodos()));
  $('nav li.active').removeClass('active');
  $('nav a[href="'+ location.hash +'"]').parent('li').addClass('active');
  $('input.createTodo').focus();
  utils.store('todos', this.todos);
};

//returns proper list of filtered todos
var getFilteredTodos = function() {
    if (filter === 'active') {
      console.log(getActiveTodos());
      return getActiveTodos();
    }

    if (filter === 'completed') {
      console.log(getCompletedTodos());
      return getCompletedTodos();
    }

    return todos;
  };

//returns list of active todos
var getActiveTodos = function() {
  return todos.filter(function(todo) {
    return !todo.complete;
  });
};

//returns list of completd todos
var getCompletedTodos = function() {
  return todos.filter(function(todo) {
    return todo.complete;
  });
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

//gets the array index of the todo item
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
  var todoid = getTodoId(e.target);
  switch (e.data) {
    //delete button clicked
    case 'delete':
      _delete({ todoid: todoid });
      break;

    //toggle completed
    case 'toggle':
      var complete = $(e.currentTarget).data('complete');
      _update({ todoid: todoid, complete: !complete });
      break;
    case 'update':
      if (e.data === 'update' && $(e.currentTarget).val() != '') {
        _update({ todoid: todoid, title: $(e.currentTarget).val() });
      } else {
        render();
      }

      break;
    default:

  }
};

//handle all key press
var _keyHandler = function(e) {
  var title = $(e.currentTarget).val();

  switch (e.which) {
    // escaping edit/create mode
    case ESCAPE_KEY:
      render();
      break;

    //confirming change
    case ENTER_KEY:
      if (e.data === 'update' && title != '') {
        _update({ todoid: getTodoId(e.target), title: title });
      } else if (e.data === 'create' && title != '') {
        _create({ todoid: utils.createGuid(), title: title, complete: false });
        $(e.currentTarget).val('');
      }  else {
        render();
      }

      break;
    default:

  }
};

//add new todo
var _create = function(data) {
  var index = getArrayIndex(data.todoid);
  if (index != 0) {
    todos.push(data);
  }

  render();
};

//update  todo
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

//delete todo
var _delete = function(data) {
  var index = getArrayIndex(data.todoid);

  if (index > -1) {
    todos.splice(index, 1);
  }

  render();
};

$(document).ready(function() {

  //bind functions to ui
  todos = utils.retrieve('todos');

  $('.createTodo').bind('keyup', 'create', _keyHandler);
  $todoList.on('dblclick', '.editTodo', startEditMode.bind(this));
  $todoList.on('click', '.deleteTodo', 'delete', _clickHandler.bind(this));
  $todoList.on('click', '.toggleTodo', 'toggle', _clickHandler.bind(this));
  $todoList.on('keyup', '.updateTodo', 'update', _keyHandler.bind(this));
  $todoList.on('focusout', '.updateTodo', 'update', _clickHandler.bind(this));

  // this.$toggleAll.on('change', this.toggleAll.bind(this));
  // this.$footer.on('click', '#clear-completed', this.destroyCompleted.bind(this));

  //render todo list
  new Router({
    '/:filter': function(f) {
      filter = f,
      render();
    },
  }).init('#/all');


  //$('a[href^="' + location.hash + '"]').addClass('active');


});
