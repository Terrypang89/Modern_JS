//The old "var"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//there are three ways of variable declaration:
// let, const, var

//The var declaration is similar to let.
//Most of the time we can replace let by var or vice-versa and expect things to work:

var message = "Hi";
console.log(message); // Hi

//But internally var is a very different beast, that originates from very old times.
//It’s generally not used in modern scripts, but still lurks in the old ones.

//If you don’t plan on meeting such scripts you may even skip this chapter or postpone it.

//On the other hand, it’s important to understand differences when migrating old scripts
//from var to let, to avoid odd errors.

//“var” has no block scope++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Variables, declared with var, are either function-wide or global.
//They are visible through blocks.

if (true) {
  var test = true; // use "var" instead of "let"
}

console.log(test); // true, the variable lives after if

//As var ignores code blocks, we’ve got a global variable test.
//If we used let test instead of var test, then the variable would only be visible inside if:

if (true) {
  let test1 = true; // use "let"
}

//console.log(test1); // Error: test is not defined

//The same thing for loops: var cannot be block- or loop-local:

for (var i = 0; i < 10; i++) {
  // ...
}

console.log(i); // 10, "i" is visible after loop, it's a gl

//If a code block is inside a function, then var becomes a function-level variable:

function sayHi() {
  if (true) {
    var phrase = "Hello";
  }

  console.log(phrase); // works
}

sayHi();
//console.log(phrase); // Error: phrase is not defined (Check the Developer Console)

//As we can see, var pierces through if, for or other code blocks. That’s because
//a long time ago in JavaScript blocks had no Lexical Environments. And var is a remnant of that.

//“var” tolerates redeclarations+++++++++++++++++++++++++++++++++++++++++++++++

//If we declare the same variable with let twice in the same scope, that’s an error:

let user;
//let user; // SyntaxError: 'user' has already been declared

//With var, we can redeclare a variable any number of times.
//If we use var with an already-declared variable, it’s just ignored:

var user1 = "Pete";

var user1 = "John"; // this "var" does nothing (already declared)
// ...it doesn't trigger an error

console.log(user1); // John

//“var” variables can be declared below their use++++++++++++++++++++++++++++++++

//var declarations are processed when the function starts (or script starts for globals).

//In other words, var variables are defined from the beginning of the function,
//no matter where the definition is (assuming that the definition is not in the nested function).

function sayHi2() {
  phrase2 = "Hello2";

  console.log(phrase2); // Hello2
  var phrase2;
}
sayHi2();

//…Is technically the same as this (moved var phrase above):

function sayHi3() {
  var phrase3;

  phrase3 = "Hello3";

  console.log(phrase3);
}
sayHi3();

//…Or even as this (remember, code blocks are ignored):

function sayHi4() {
  phrase4 = "Hello4"; // (*)

  if (false) {
    var phrase4;
  }
  console.log(phrase4);
}
sayHi4();

//People also call such behavior “hoisting” (raising),
//because all var are “hoisted” (raised) to the top of the function.

//So in the example above, if (false) branch never executes, but that doesn’t matter.
//The var inside it is processed in the beginning of the function,
//so at the moment of (*) the variable exists.

//Declarations are hoisted, but assignments are not.--------------------------

function sayHi5() {
  console.log(phrase5); //undefined

  var phrase5 = "Hello5";
}
sayHi5();

//The line var phrase = "Hello" has two actions in it:

//1->Variable declaration var
//2->Variable assignment =.

//The declaration is processed at the start of function execution (“hoisted”),
//but the assignment always works at the place where it appears.
//So the code works essentially like this:

function sayHi6() {
  var phrase6; // declaration works at the start...

  console.log(phrase6); // undefined
  phrase6 = "Hello6"; // ...assignment - when the execution reaches it.
}

sayHi6();

//Because all var declarations are processed at the function start,
//we can reference them at any place. But variables are undefined until the assignments.

//In both examples above alert runs without an error,
//because the variable phrase exists. But its value is not yet assigned, so it shows undefined.

//IIFE-----------------------------------------------------------------------------

//As in the past there was only var, and it has no block-level visibility,
//programmers invented a way to emulate it.
//What they did was called “immediately-invoked function expressions” (abbreviated as IIFE).

//That’s not something we should use nowadays, but you can find them in old scripts.

(function() {

  let message7 = "Hello7";

  console.log(message7); // Hello

})();

//Here a Function Expression is created and immediately called.
//So the code executes right away and has its own private variables.

//The Function Expression is wrapped with parenthesis (function {...}),
//because when JavaScript meets "function" in the main code flow,
//it understands it as the start of a Function Declaration.
//But a Function Declaration must have a name, so this kind of code will give an error:

// Try to declare and immediately call a function
/*
function() { // <-- Error: Function statements require a function name

  let message8 = "Hello8";

  console.log(message8); // Hello

}();
*/

//Even if we say: “okay, let’s add a name”, that won’t work,
//as JavaScript does not allow Function Declarations to be called immediately:

// syntax error because of parentheses below
function go() {

}(); // <-- can't call Function Declaration immediately

// the parentheses around the function is a trick to show JavaScript that
//the function is created in the context of another expression,
//and hence it’s a Function Expression: it needs no name and can be called immediately.

//There exist other ways besides parentheses to tell JavaScript that we mean a Function Expression:

// Ways to create IIFE

/*
(function() {
  console.log("Parentheses around the function");
})();

(function() {
  console.log("Parentheses around the whole thing");
}());

!function() {
  console.log("Bitwise NOT operator starts the expression");
}();

+function() {
  console.log("Unary plus starts the expression");
}();
*/

//In all the above cases we declare a Function Expression and run it immediately.
//Let’s note again: nowadays there’s no reason to write such code.
