//Object methods, "this"+++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Method examples+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Here we’ve just used a Function Expression to create the function and
//assign it to the property user.sayHi of the object.

//A function that is the property of an object is called its method.

let user = {
  name: "John",
  age: 30
};
user.sayHi = function() {
  console.log("Hello!");
};
user.sayHi(); // Hello!

let user1 = {
  age:30
};
//pre-declared function as a method
//we’ve got a method sayHi of the object user.
function sayHi1() {
  console.log("Hello!");
};
// then add as a method
user1.sayHi1 = sayHi1;
user1.sayHi1(); // Hello!

//using objects to represent entities, that’s called object-oriented programming, in short: “OOP”.

//Method shorthand++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//shorter syntax for methods in an object literal:
// these objects do the same
let user2 = {
  sayHi: function() {
    console.log("Hello");
  }
};
user2.sayHi();

// method shorthand looks better, right?
let user3 = {
  sayHi() { // same as "sayHi: function()"
    console.log("Hello");
  }
};
user3.sayHi();

//“this” in methods+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//It’s common that an object method needs to access the information stored in the object to do its job

//To access the object, a method can use the this keyword.
//The value of this is the object “before dot”, the one used to call the method.
let user4 = {
  name: "John",
  age: 30,
  sayHi() {
    // "this" is the "current object"
    console.log(this.name);
  }
};
user4.sayHi(); // John

//execution of user.sayHi(), the value of this will be user.
//Technically, it’s also possible to access the object without this,
//by referencing it via the outer variable, But such code is unreliable.

// If we decide to copy user to another variable, e.g.
//admin = user and overwrite user with something else, then it will access the wrong object.
let user5 = {
  name: "John",
  age: 30,
  sayHi() { // // "user" instead of "this"
    console.log("user5 " + user.name ); // leads to an error
  }
};
let admin = user5;
user5 = null; // overwrite to make things obvious
admin.sayHi(); // Whoops! inside sayHi(), the old name is used! error!
//If we used this.name instead of user.name inside the alert, then the code would work.

//“this” is not bound+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//this behaves unlike most other programming languages. It can be used in any function.

function sayHi() {
  console.log( this.name ); //no syntax error
}

//The value of this is evaluated during the run-time, depending on the context.
//For instance, here the same function is assigned to two different objects and
//has different “this” in the calls:

let user6 = { name: "John" };
let admin6 = { name: "Admin" };
function sayHi2() {
  console.log( this.name );
}
// use the same function in two objects
user6.f = sayHi2;
admin6.f = sayHi2;

// these calls have different this
// "this" inside the function is the object "before the dot"
user6.f(); // John  (this == user)
admin6.f(); // Admin  (this == admin)
admin6['f'](); // Admin (dot or square brackets access the method – doesn't matter)
// if obj.f() is called, then this is obj during the call of f

//Calling without an object: this == undefined
function sayHi7() {
  console.log(this);
}
sayHi7(); // undefined
//this is undefined in strict mode. If we try to access this.name, there will be an error.
//In non-strict mode the value of this in such case will be the global object
//such call is a programming error.
//If there’s this inside a function, it expects to be called in an object context.

//Arrow functions have no “this”++++++++++++++++++++++++++++++++++++++++++++++++++
//Arrow functions are special: they don’t have their “own” this.
//If we reference this from such a function, it’s taken from the outer “normal” function.

let user8 = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => console.log(this.firstName);
    arrow();
  }
};
user8.sayHi(); // Ilya
//That’s a special feature of arrow functions,
//it’s useful when we actually do not want to have a separate this,
//but rather to take it from the outer context.
