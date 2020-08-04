//Function object, NFE+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//As we already know, a function in JavaScript is a value.

//Every value in JavaScript has a type. What type is a function?

//In JavaScript, functions are objects.

//A good way to imagine functions is as callable “action objects”. We can not only call them,
//but also treat them as objects: add/remove properties, pass by reference etc.

//The “name” property++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Function objects contain some useable properties.
//For instance, a function’s name is accessible as the “name” property:

function sayHi() {
  console.log("Hi");
}

console.log(sayHi.name); // sayHi

//What’s kind of funny, the name-assigning logic is smart.
//It also assigns the correct name to a function even if it’s created without one,
//and then immediately assigned:

let sayHi1 = function() {
  console.log("Hi");
};

console.log(sayHi1.name); // sayHi (there's a name!)

//It also works if the assignment is done via a default value:

function f(sayHi2 = function() {}) {
  console.log(sayHi2.name); // sayHi (works!)
}

f();

//In the specification, this feature is called a “contextual name”.
//If the function does not provide one, then in an assignment it is figured out from the context.

//Object methods have names too:

let user = {

  sayHi3() {
    // ...
  },

  sayBye3: function() {
    // ...
  }

}

console.log(user.sayHi3.name); // sayHi
console.log(user.sayBye3.name); // sayBye

//There’s no magic though. There are cases when there’s no way to figure out the right name.
//In that case, the name property is empty, like here:

// function created inside array
let arr = [function() {}];

console.log( arr[0].name ); // <empty string>
// the engine has no way to set up the right name, so there is none
//In practice, however, most functions do have a name.

//The “length” property+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//There is another built-in property “length” that returns the number of function parameters, for instance:

function f1(a) {}
function f2(a, b) {}
function many(a, b, ...more) {}

console.log(f1.length); // 1
console.log(f2.length); // 2
console.log(many.length); // 2
//Here we can see that rest parameters are not counted.

//The length property is sometimes used for introspection in functions that
//operate on other functions.

//For instance, in the code below the ask function accepts a question to ask and
//an arbitrary number of handler functions to call.

//Once a user provides their answer, the function calls the handlers.
//We can pass two kinds of handlers:

//A zero-argument function, which is only called when the user gives a positive answer.
//A function with arguments, which is called in either case and returns an answer.
//To call handler the right way, we examine the handler.length property.

//The idea is that we have a simple, no-arguments handler syntax for positive cases
//(most frequent variant), but are able to support universal handlers as well:

function ask(question, ...handlers) {
  let isYes = confirm(question);
  console.log(isYes); //true if press yes else false
  for(let handler of handlers) { // two handles if true, lese one handler only
    console.log(handler); //() => alert('You said yes'), result => alert(result)
    if (handler.length == 0) {
      if (isYes) {
        handler();
        console.log("test true"); // if true will run
      }
    } else {
      handler(isYes); // run for both true and flase
      console.log("test flase");
    }
  }
}

// for positive answer, both handlers are called
// for negative answer, only the second one
//ask("Question?", () => console.log('You said yes'), result => alert(result));

//This is a particular case of so-called polymorphism – treating arguments differently
//depending on their type or, in our case depending on the length.
//The idea does have a use in JavaScript libraries.

//Custom properties++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//We can also add properties of our own.
//Here we add the counter property to track the total calls count:

function sayHi3() {
  console.log("Hi");

  // let's count how many times we run
  sayHi3.counter++;
}
sayHi3.counter = 0; // initial value

sayHi3(); // Hi
sayHi3(); // Hi

console.log( `Called ${sayHi3.counter} times` ); // Called 2 times

//A property is not a variable
//A property assigned to a function like sayHi.counter = 0 does not define
//a local variable counter inside it.
//In other words, a property counter and a variable let counter are two unrelated things.

//We can treat a function as an object, store properties in it,
//but that has no effect on its execution. Variables are not function properties and vice versa.
//These are just parallel worlds.

//Function properties can replace closures sometimes.
//For instance, we can rewrite the counter function example from the chapter Variable scope
//to use a function property:

function makeCounter() {
  // instead of:
  // let count = 0
  function counter() {
    return counter.count++;
  };
  counter.count = 0;
  return counter;
}

let counter = makeCounter();
console.log( counter() ); // 0
console.log( counter() ); // 1
console.log( counter() ); // 2

//The count is now stored in the function directly, not in its outer Lexical Environment.

//Is it better or worse than using a closure?

//The main difference is that if the value of count lives in an outer variable,
//then external code is unable to access it. Only nested functions may modify it.
// And if it’s bound to a function, then such a thing is possible:

function makeCounter1() {
  function counter1() {
    return counter1.count++;
  };
  counter1.count = 0;
  return counter1;
}
let counter1 = makeCounter1();

counter1.count = 10;
console.log( counter1() ); // 10
console.log( counter1() ); // 11

//Named Function Expression++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Named Function Expression, or NFE, is a term for Function Expressions that have a name.

//For instance, let’s take an ordinary Function Expression:

let sayHi4 = function(who) {
  console.log(`Hello, ${who}`);
};
sayHi4("hi");
//And add a name to it:

let sayHi5 = function func(who) {
  console.log(`Hello, ${who}`);
};
sayHi5("test");

//Did we achieve anything here? What’s the purpose of that additional "func" name?

//First let’s note, that we still have a Function Expression.
//Adding the name "func" after function did not make it a Function Declaration,
//because it is still created as a part of an assignment expression.

//Adding such a name also did not break anything.

//The function is still available as sayHi():

//There are two special things about the name func, that are the reasons for it:

//1->It allows the function to reference itself internally.
//2->It is not visible outside of the function.
//For instance, the function sayHi below calls itself again with "Guest" if no who is provided:

let sayHi6 = function func(who) {
  if (who) {
    console.log(`Hello, ${who}`);
  } else {
    func("Guest"); // use func to re-call itself
  }
};

sayHi6("true");
sayHi6(); // Hello, Guest as it called twice func,

// But this won't work:
//func(); // Error, func is not defined (not visible outside of the function)

//Why do we use func? Maybe just use sayHi for the nested call?

//Actually, in most cases we can:
let sayHi7 = function(who) {
  if (who) {
    console.log(`Hello, ${who}`);
  } else {
    sayHi("Guest");
  }
};

//The problem with that code is that sayHi may change in the outer code.
//If the function gets assigned to another variable instead, the code will start to give errors:

let sayHi8 = function(who) {
  if (who) {
    console.log(`Hello, ${who}`);
  } else {
    sayHi8("Guest8"); // Error: sayHi is not a function
  }
};

let welcome = sayHi8;
welcome(); // Guest8
sayHi8 = null;

//welcome(); // Error, the nested sayHi call doesn't work any more!

//That happens because the function takes sayHi from its outer lexical environment. T
//here’s no local sayHi, so the outer variable is used.
//And at the moment of the call that outer sayHi is null.

//The optional name which we can put into the Function Expression is meant to
//solve exactly these kinds of problems.

//Let’s use it to fix our code:
let sayHi9 = function func(who) {
  if (who) {
    console.log(`Hello, ${who}`);
  } else {
    func("Guest9"); // Now all fine
  }
};
let welcome9 = sayHi9;
sayHi9 = null;

welcome9(); // Hello, Guest (nested call works)

//Now it works, because the name "func" is function-local.
//It is not taken from outside (and not visible there).
//The specification guarantees that it will always reference the current function.

//The outer code still has it’s variable sayHi or welcome.
//And func is an “internal function name”, how the function can call itself internally.

//There’s no such thing for Function Declaration
//The “internal name” feature described here is only available for Function Expressions,
//not for Function Declarations. For Function Declarations,
//there is no syntax for adding an “internal” name.

//Sometimes, when we need a reliable internal name,
//it’s the reason to rewrite a Function Declaration to Named Function Expression form.

//Tasks++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Set and decrease for counter------------------------------------------------------
//Modify the code of makeCounter() so that the counter can also decrease and set the number:

//counter() should return the next number (as before).
//counter.set(value) should set the counter to value.
//counter.decrease() should decrease the counter by 1.
//See the sandbox code for the complete usage example.

//P.S. You can use either a closure or the function property to keep the current count.
//Or write both variants.

//The solution uses count in the local variable, but addition methods are written right into
//the counter. They share the same outer lexical environment and also can access the current count.

function makeCounter10() {
  let makeCounter10 = 0;

  function counter10() {
    return count10++;
  }

  counter10.set = value10 => count10 = value10;

  counter10.decrease = () => count10--;

  return counter10;
}

console.log(makeCounter()); //{ [Function: counter] count: 0 }

//Sum with an arbitrary amount of brackets++++++++++++++++++++++++++++++++++++++++

//Write function sum that would work like this:

//sum(1)(2) == 3; // 1 + 2
//sum(1)(2)(3) == 6; // 1 + 2 + 3
//sum(5)(-1)(2) == 6
//sum(6)(-1)(-2)(-3) == 0
//sum(0)(1)(2)(3)(4)(5) == 15

//1->For the whole thing to work anyhow, the result of sum must be function.
//2->That function must keep in memory the current value between calls.
//3->According to the task, the function must become the number when used in ==.
//  Functions are objects, so the conversion happens as described in the chapter Object
//  to primitive conversion, and we can provide our own method that returns the number.

function sum(a) {
  let currentSum = a;
  function f(b) {
    currentSum += b;
    return f;
  }

  f.toString = function() {
    return currentSum;
  };
  return f;
}

console.log( sum(1)(2) ); // 3
console.log( sum(5)(-1)(2) ); // 6
console.log( sum(6)(-1)(-2)(-3) ); // 0
console.log( sum(0)(1)(2)(3)(4)(5) ); // 15

//Please note that the sum function actually works only once. It returns function f.

//Then, on each subsequent call, f adds its parameter to the sum currentSum, and returns itself.

//There is no recursion in the last line of f.

//Here is what recursion looks like:

function f1(b) {
  currentSum += b;
  return f1(); // <-- recursive call
}
//And in our case, we just return the function, without calling it:

function f2(b) {
  currentSum += b;
  return f2; // <-- does not call itself, returns itself
}

//This f will be used in the next call, again return itself, so many times as needed.
//Then, when used as a number or a string – the toString returns the currentSum.
//We could also use Symbol.toPrimitive or valueOf here for the conversion.

function sum1(a) {

  let currentSum1 = a;

  function f3(b) {
    currentSum1 += b;
    return f3;
  }

  f3.toString = function() {
    return currentSum1;
  };

  return f3;
}
