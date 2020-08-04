//Native prototypes++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The "prototype" property is widely used by the core of JavaScript itself.
//All built-in constructor functions use it.

//First we’ll see at the details,
//and then how to use it for adding new capabilities to built-in objects.

//Object.prototype++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Let’s say we output an empty object:

let obj = {};
console.log( obj ); // "[object Object]" ? //got built-in toString method

//Where’s the code that generates the string "[object Object]"?
//That’s a built-in toString method, but where is it? The obj is empty!

//…But the short notation obj = {} is the same as obj = new Object(),

let obj2 = {}; // obj2 = new Object() where Object is a built-in object constructor function,
//with its own prototype referencing a huge object with toString and other methods.

//When new Object() is called (or a literal object {...} is created),
//the [[Prototype]] of it is set to Object.prototype according to the rule that
//we discussed in the previous chapter:

//Object {} -> <prototype> -> Object.prototype { constructor:Object toString:function }
let obj3 = {}; // obj3 = new Object() // obj3 = Object.prototype

//When new Object() is called (or a literal object {...} is created),
//the [[Prototype]] of it is set to Object.prototype according to the rule that
//we discussed in the previous chapter:

//Object {} -> <prototype> -> Object.prototype { constructor:Object toString:function } <- <[[prototype]]> <- obj = new Object()

//So then when obj.toString() is called the method is taken from Object.prototype.
let obj4 = {}; // obj4 = new Object() // obj4 = Object.prototype // obj4.toSTring() = Object.prototype.toString()

console.log(obj4.__proto__ === Object.prototype); // true

// obj4.toString === obj4.__proto__.toString == Object.prototype.toString

//So then when obj.toString() is called the method is taken from Object.prototype.
console.log(Object.prototype.__proto__); // null as Object.prototype  == nothing

//Other built-in prototypes++++++++++++++++++++++++++++++++++++++++++++++++++++

//Other built-in objects such as Array, Date, Function and others also keep methods in prototypes.

//For instance, when we create an array [1, 2, 3],
//the default new Array() constructor is used internally.
//So Array.prototype becomes its prototype and provides methods. That’s very memory-efficient.

//By specification, all of the built-in prototypes have Object.prototype on the top.
//That’s why some people say that “everything inherits from objects”.

//null <- [[prototype]] <- Object.prototype{ toString:function , other obj methods} <- contiinue

//         <- [[prototype]] <- Number.prototype { toFixed:function , other num functions } <- [[prototype]] <- 5
//continue <- [[prototype]] <- Function.prototype { call:function , others function } <- [[prototype]] <- function f(args) {}
//         <- [[prototype]] <- Array.prototype { slice:function , other array methods } <- [[prototype]] <- [1, 2, 3]

let arr = [1, 2, 3];
// it inherits from Array.prototype?
console.log( arr.__proto__ === Array.prototype ); // true
// then from Object.prototype?
console.log( arr.__proto__.__proto__ === Object.prototype ); // true
// and null on the top.
console.log( arr.__proto__.__proto__.__proto__ ); // null

//Some methods in prototypes may overlap,
//for instance, Array.prototype has its own toString that lists comma-delimited elements:

//Object.prototype{ toString:function } <- [[Prototype]] <- Array.prototype{ tostring: function} <- [[prototype]] <- [1,2,3]

//In-browser tools like Chrome developer console also show inheritance
//(console.dir may need to be used for built-in objects):
console.log([1,2,3]);

//Other built-in objects also work the same way. Even functions –
//they are objects of a built-in Function constructor,
//and their methods (call/apply and others) are taken from Function.prototype.
//Functions have their own toString too.

function f() {}

console.log(f.__proto__ == Function.prototype); // true
console.log(f.__proto__.__proto__ == Object.prototype); // true, inherit from objects

//Primitives+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The most intricate thing happens with strings, numbers and booleans.

//As we remember, they are not objects. But if we try to access their properties,
//temporary wrapper objects are created using built-in constructors String, Number and Boolean.
//They provide the methods and disappear.

//These objects are created invisibly to us and most engines optimize them out,
//but the specification describes it exactly this way.
//Methods of these objects also reside in prototypes,
//available as String.prototype, Number.prototype and Boolean.prototype.

//Values null and undefined have no object wrappers
//Special values null and undefined stand apart. They have no object wrappers,
//so methods and properties are not available for them.
//And there are no corresponding prototypes either.

//Changing native prototypes+++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Native prototypes can be modified.
//For instance, if we add a method to String.prototype, it becomes available to all strings:

String.prototype.show = function() {
  console.log(this);
};

"BOOM!".show(); // BOOM!

//During the process of development, we may have ideas for new built-in methods we’d like to have,
//and we may be tempted to add them to native prototypes. But that is generally a bad idea.

//Important:
//Prototypes are global, so it’s easy to get a conflict.
//If two libraries add a method String.prototype.show,
//then one of them will be overwriting the method of the other.

//So, generally, modifying a native prototype is considered a bad idea.

//n modern programming, there is only one case where modifying native prototypes is approved.
//That’s polyfilling.

//Polyfilling is a term for making a substitute for a method that exists
//in the JavaScript specification, but is not yet supported by a particular JavaScript engine.

//We may then implement it manually and populate the built-in prototype with it.

if (!String.prototype.repeat) { // if there's no such method
  // add it to the prototype

  String.prototype.repeat = function(n) {
    // repeat the string n times

    // actually, the code should be a little bit more complex than that
    // (the full algorithm is in the specification)
    // but even an imperfect polyfill is often considered good enough
    return new Array(n + 1).join(this);
  };
}

console.log( "La".repeat(3) ); // LaLaLa

//Borrowing from prototypes+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//In the chapter Decorators and forwarding, call/apply we talked about method borrowing.

//That’s when we take a method from one object and copy it into another.
//Some methods of native prototypes are often borrowed.

//For instance, if we’re making an array-like object, we may want to copy some Array methods to it.
let obj5 = {
  0: "Hello",
  1: "world!",
  length: 2,
};

obj5.join = Array.prototype.join;

console.log( obj5.join(',') ); // Hello,world!

//It works because the internal algorithm of the built-in join method only cares
//about the correct indexes and the length property.
//It doesn’t check if the object is indeed an array.
//Many built-in methods are like that.

//Another possibility is to inherit by setting obj.__proto__ to Array.prototype,
//so all Array methods are automatically available in obj.

//But that’s impossible if obj already inherits from another object.
//Remember, we only can inherit from one object at a time.

//Borrowing methods is flexible, it allows to mix functionalities from different objects if needed.


//TASK++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Add method "f.defer(ms)" to functions========================================
//Add to the prototype of all functions the method defer(ms),
//that runs the function after ms milliseconds.

function f() {
  console.log("Hello!");
}

Function.prototype.defer = function(ms) {
  setTimeout(this, ms);
};

f.defer(1000); // shows "Hello!" after 1 second

//Add the decorating "defer()" to functions=================================
//Add to the prototype of all functions the method defer(ms), that returns a wrapper,
//delaying the call by ms milliseconds.

function f1(a, b) {
  console.log( a + b );
}

Function.prototype.defer = function(ms) {
  let f1 = this;
  return function(...args) {
    setTimeout(() => f1.apply(this, args), ms);
  }
};

f1.defer(1000)(1, 2); // shows 3 after 1 second

//Please note: we use this in f.apply to make our decoration work for object methods.

//So if the wrapper function is called as an object method,
//then this is passed to the original method f.

Function.prototype.defer = function(ms) {
  let f2 = this;
  return function(...args) {
    setTimeout(() => f2.apply(this, args), ms);
  }
};

let user = {
  name: "John",
  sayHi() {
    console.log(this.name);
  }
}

user.sayHi = user.sayHi.defer(1000);

user.sayHi();//John
