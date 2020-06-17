//Constructor, operator "new"++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The regular {...} syntax allows to create one object.

//but often we need to create many similar objects, like multiple users or menu items and so on
//can be done using constructor functions and the "new" operator.

//Constructor function+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Constructor functions technically are regular functions. There are two conventions though:
//  They are named with capital letter first.
//  They should be executed only with "new" operator.

function User(name) {
  // this = {};  (implicitly) empty obh created assigned to this

  // add properties to this
  this.name = name;
  this.isAdmin = false;
  // return this;  (implicitly) value of this is returned
}
let user = new User("Jack");  //capital U, && "new"

//When a function is executed with "new", it does the following steps:
//  A new empty object is created and assigned to this.
//  The function body executes. Usually it modifies this, adds new properties to it.
//  The value of this is returned.

console.log(user.name); // Jack
console.log(user.isAdmin); // false

//if we want to create other users, we can call new User("Ann"), new User("Alice") and so on.
// Much shorter than using literals every time, and also easy to read.

let user1 = new User("Ann");
console.log(user1.name);

//That’s the main purpose of constructors – to implement reusable object creation code.

//If we have many lines of code all about creation of a single complex object,
//we can wrap them in constructor function, like this:
let user3 = new function() { //constructor from functions
  this.name = "John";
  this.isAdmin = false;

  // ...other code for user creation
  // maybe complex logic and statements
  // local variables etc
};
//The constructor can’t be called again, because it is not saved anywhere, just created and called.
//So this trick aims to encapsulate the code that constructs the single object, without future reuse.

//Constructor mode test: new.target++++++++++++++++++++++++++++++++++++++++++++++++
//Inside a function, we can check whether it was called with new or without it,
//using a special new.target property.

//It is empty for regular calls and equals the function if called with new:
function User4() {
  console.log(new.target);
}

// without "new":
User4(); // undefined

// with "new":
new User4(); // function User { ... }

//That can be used inside the function to know whether it was called with new,
//“in constructor mode”, or without it, “in regular mode”.

//We can also make both new and regular calls to do the same, like this:
function User5(name) {
  if (!new.target) { // if you run me without new
    return new User(name); // ...I will add new for you
  }
  this.name = name;
}
let john = User5("John"); // redirects call to new User
console.log(john.name); // John

//This approach is sometimes used in libraries to make the syntax more flexible.
//So that people may call the function with or without new, and it still works.

//Probably not a good thing to use everywhere though, because omitting new makes
//it a bit less obvious what’s going on. With new we all know that the new object is being created.

//Return from constructors+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//constructors do not have a return statement.
//Their task is to write all necessary stuff into this, and it automatically becomes the result.

//But if there is a return statement, then the rule is simple:

//If return is called with an object, then the object is returned instead of this.
//If return is called with a primitive, it’s ignored.

//return with an object returns that object, in all other cases this is returned.
//here return overrides this by returning an object:
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" };  // <-- returns this object
}
console.log( new BigUser().name );  // Godzilla, got that object

//for an empty return (or we could place a primitive after it, doesn’t matter):
function SmallUser() {
  this.name = "John";
  return; // <-- returns this
}
console.log( new SmallUser().name );  // John

//constructors don’t have a return statement.
//Here we mention the special behavior with returning objects mainly for the sake of completeness.

//By the way, we can omit parentheses after new, if it has no arguments:
let user6 = new User; // <-- no parentheses
// same as
let user7 = new User();

//Methods in constructor+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Using constructor functions to create objects gives a great deal of flexibility.
//The constructor function may have parameters that define how to construct the object,
//and what to put in it.

function User8(name) {
  this.name = name;
  this.sayHi = function() {
    console.log( "My name is: " + this.name );
  };
}
let john1 = new User8("John");
john1.sayHi(); // My name is: John
/*
john = {
   name: "John",
   sayHi: function() { ... }
}
*/
//to create complex objects, there’s a more advanced syntax, classes, that we’ll cover later.
