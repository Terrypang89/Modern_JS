//Variable scope++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//JavaScript is a very function-oriented language. It gives us a lot of freedom.
//A function can be created dynamically, passed as an argument to another function and
//called from a totally different place of code later.

//We already know that a function can access variables outside of it.

//We’ll talk about let/const variables here
//In JavaScript, there are 3 ways to declare a variable:
//let, const (the modern ones), and var (the remnant of the past).

//In this article we’ll use let variables in examples.
//Variables, declared with const, behave the same, so this article is about const too.
//The old var has some notable differences, they will be covered in the article The old "var".

//Code blocks++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//If a variable is declared inside a code block {...}, it’s only visible inside that block.

{
  // do some job with local variables that should not be seen outside

  let message = "Hello"; // only visible in this block

  console.log(message); // Hello
}

//console.log(message); // Error: message is not defined

//We can use this to isolate a piece of code that does its own task,
//with variables that only belong to it:

{
  // show message
  let message = "Hello";
  console.log(message);
}

{
  // show another message
  let message = "Goodbye";
  console.log(message);
}

//There’d be an error without blocks:
//Please note, without separate blocks there would be an error,
//if we use let with the existing variable name:

// show message
let message2 = "Hello";
console.log(message2);

//let message2 = "Goodbye"; // Error: variable already declared
//console.log(message2);

//For if, for, while and so on, variables declared in {...} are also only visible inside:

if (true) {
  let phrase = "Hello!";

  console.log(phrase); // Hello!
}
//console.log(phrase); // Error, no such variable!

//Here, after if finishes, the alert below won’t see the phrase, hence the error.
//That’s great, as it allows us to create block-local variables, specific to an if branch.

//The similar thing holds true for for and while loops:
for (let i = 0; i < 3; i++) {
  // the variable i is only visible inside this for
  console.log(i); // 0, then 1, then 2
}
//console.log(i); // Error, no such variable

//Visually, let i is outside of {...}. But the for construct is special here:
//the variable, declared inside it, is considered a part of the block.

//Nested functions+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//A function is called “nested” when it is created inside another function.
//It is easily possible to do this with JavaScript.

function sayHiBye(firstName, lastName) {

  // helper nested function to use below
  function getFullName() {
    return firstName + " " + lastName;
  }
  console.log( "Hello, " + getFullName() );
  console.log( "Bye, " + getFullName() );
}

sayHiBye("hi", "bye");

//Here the nested function getFullName() is made for convenience.
//It can access the outer variables and so can return the full name.
//Nested functions are quite common in JavaScript.

//What’s much more interesting, a nested function can be returned:
//either as a property of a new object or as a result by itself.
//It can then be used somewhere else. No matter where,
//it still has access to the same outer variables.

//Below, makeCounter creates the “counter” function that
//returns the next number on each invocation:

function makeCounter() {
  let count = 0;

  return function() {
    return count++;
  };
}

let counter = makeCounter();

console.log( counter() ); // 0
console.log( counter() ); // 1
console.log( counter() ); // 2

//Despite being simple, slightly modified variants of that code have practical uses,
//for instance, as a random number generator to generate random values for automated tests.

//How does this work? If we create multiple counters,
//will they be independent? What’s going on with the variables here?

//Undestanding such things is great for the overall knowledge of JavaScript and beneficial
//for more complex scenarios. So let’s go a bit in-depth.

//Lexical Environment+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Here be dragons!
//The in-depth technical explanation lies ahead.

//As far as I’d like to avoid low-level language details,
//any understanding without them would be lacking and incomplete, so get ready.

//Step 1. Variables---------------------------------------------------
//->In JavaScript, every running function, code block {...}, and
//the script as a whole have an internal (hidden) associated object known as the Lexical Environment.

//->The Lexical Environment object consists of two parts:
//1->Environment Record – an object that stores all local variables as its properties
//(and some other information like the value of this).
//2->reference to the outer lexical environment, the one associated with the outer code.

//A “variable” is just a property of the special internal object, Environment Record.
//“To get or change a variable” means “to get or change a property of that object”.

//In this simple code without functions, there is only one Lexical Environment:

let phrase = "Hello";  //--- <Lexical Environment> { pharse: Hello } --> <outer> Null
console.log(phrase);

//This is the so-called global Lexical Environment, associated with the whole script.
//above, the {} means Environment Record (variable store) and the arrow means the outer reference.
//The global Lexical Environment has no outer reference, that’s why the arrow points to null.

//As the code starts executing and goes on, the Lexical Environment changes.

//execution start     ----------------  {phrase1: <uninitialized>} --> <outer> Null
let phrase1;       // ----------------  {phrase1: <undefined>}
phrase1 = "Hello"; // ----------------  {phrase1: "Hello"}
phrase1 = "Bye";   // ----------------  {phrase1: "Bye"}

//{} on the right-hand side demonstrate how the
//global Lexical Environment changes during the execution:

//1-> When the script starts, the Lexical Environment is pre-populated with all declared variables.
//  ->Initially, they are in the “Uninitialized” state. That’s a special internal state,
//  ->it means that the engine knows about the variable,
//  ->but it cannot be referenced until it has been declared with let.
//  ->It’s almost the same as if the variable didn’t exist.

//2->Then let phrase definition appears. There’s no assignment yet, so its value is undefined.
//  We can use the variable from this point forward.
//3->phrase is assigned a value.
//4->phrase changes the value.

//Everything looks simple for now, right?

//A variable is a property of a special internal object,
//associated with the currently executing block/function/script.
//Working with variables is actually working with the properties of that object.

//Lexical Environment is a specification object
//“Lexical Environment” is a specification object:
//it only exists “theoretically” in the language specification to describe how things work.
//We can’t get this object in our code and manipulate it directly.

//JavaScript engines also may optimize it, discard variables that are unused to save memory
//and perform other internal tricks, as long as the visible behavior remains as described.

//Step 2. Function Declarations----------------------------------------------
//A function is also a value, like a variable.

//The difference is that a Function Declaration is instantly fully initialized.

//When a Lexical Environment is created,
//a Function Declaration immediately becomes a ready-to-use function (unlike let,
//that is unusable till the declaration).

//That’s why we can use a function, declared as Function Declaration,
//even before the declaration itself.

//For example, here’s the initial state of the global Lexical Environment when we add a function:

//execution starts                    ----- {phrase2: <uninitialized>} ---> null
let phrase2 = "hello";  //            ----- {}
function say(name){
  console.log('${phrase1}, ${name}')
}

//Naturally, this behavior only applies to Function Declarations,
//not Function Expressions where we assign a function to a variable,
//such as let say = function(name)....


//Step 3. Inner and outer Lexical Environment-------------------------------------

//When a function runs, at the beginning of the call, a new Lexical Environment is
//created automatically to store local variables and parameters of the call.

//For instance, for say("John"), it looks like this (the execution is at the line,
//labelled with an arrow):

//execution starts                    ----- {phrase2: <uninitialized>} ---> null
let phrase3 = "hello";  //            ----- {}
function say1(name){                  //  <Lexical environment of call>
  console.log('${phrase3}, ${name}')  //  {name:"John"} ------>  {say:function}       ----> null
}                                     //  {phrase2}      <outer>  {phrase2:"hello"}  <outer>
say1("John") // Hello, John

//During the function call we have two Lexical Environments:
//the inner one (for the function call) and the outer one (global):

//The inner Lexical Environment corresponds to the current execution of say.
//It has a single property: name, the function argument. We called say("John"),
//so the value of the name is "John".

//The outer Lexical Environment is the global Lexical Environment.
//It has the phrase variable and the function itself.

//The inner Lexical Environment has a reference to the outer one.

//When the code wants to access a variable – the inner Lexical Environment is searched first,
//then the outer one, then the more outer one and so on until the global one.

//If a variable is not found anywhere, that’s an error in strict mode (without use strict,
//an assignment to a non-existing variable creates a new global variable,
//for compatibility with old code).

//In this example the search proceeds as follows:

//For the name variable, the console.log inside say finds it immediately in the inner Lexical Environment.
//When it wants to access phrase, then there is no phrase locally,
//so it follows the reference to the outer Lexical Environment and finds it there.

//execution starts                    ----- {phrase2: <uninitialized>} ---> null
let phrase4 = "hello";  //            ----- {}
function say2(name){                  //  <Lexical environment of call>
  console.log('${phrase4}, ${name}')  //  {name:"John"} ------>  {say:function}       ----> null
}                                     //  found at first <outer>  {phrase2:"hello"}  <outer>
say2("John") // Hello, John           //                          found after follow the reference to the outer laxical Environment

//Step 4. Returning a function---------------------------------------------------
//1) two nested Lexical Environments
function makeCounter0() {    // Laxical Env at makecounter call()    Global Laxical env
  let count = 0;            //
  return function() {       //  {count = 0;}                     -----  {makeCounter: function} ------- outer
    return count++;         //                                outer   {counter: undefined}
  };
}
let counter0 = makeCounter0();

//At the beginning of each makeCounter() call, a new Lexical Environment object is created,
//to store variables for this makeCounter run.

//So, counter.[[Environment]] has the reference to {count: 0} Lexical Environment.
//That’s how the function remembers where it was created, no matter where it’s called.
//The [[Environment]] reference is set once and forever at function creation time.

//Later, when counter() is called, a new Lexical Environment is created for the call,
//and its outer Lexical Environment reference is taken from counter.[[Environment]]:

//2) when counter() is called
function makeCounter1() {    // Laxical Env at makecounter call()    Global Laxical env
  let count1 = 0;           //
  return function() {       //  empty -- {count = 0;}           -----  {makeCounter: function} ------- outer
    return count1++;        //       outer                      outer   {counter: function}
  };
}
let counter1 = makeCounter1();

//Now when the code inside counter() looks for count variable,
//it first searches its own Lexical Environment (empty, as there are no local variables there),
//then the Lexical Environment of the outer makeCounter() call, where it finds and changes it.

//A variable is updated in the Lexical Environment where it lives.

//3) when counter() is called
function makeCounter2() {    // Laxical Env at makecounter call()    Global Laxical env
  let count2 = 0;           //             <modified here>
  return function() {       //  empty -- {count = 1;}           -----  {makeCounter: function} ------- outer
    return count2++;        //       outer                      outer   {counter: function}
  };
}
let counter2 = makeCounter2();

//If we call counter() multiple times, the count variable will be increased to 2, 3 and so on,
//at the same place.

//Closure
//There is a general programming term “closure”, that developers generally should know.

//A closure is a function that remembers its outer variables and can access them.
//In some languages, that’s not possible,
//or a function should be written in a special way to make it happen.
//But as explained above, in JavaScript, all functions are naturally closures
//(there is only one exception, to be covered in The "new Function" syntax).

//That is: they automatically remember where they were created using a hidden [[Environment]]
//property, and then their code can access outer variables.

//When on an interview, a frontend developer gets a question about “what’s a closure?”,
//a valid answer would be a definition of the closure and an explanation that
//all functions in JavaScript are closures, and maybe a few more words about technical details:
//the [[Environment]] property and how Lexical Environments work.

//Garbage collection++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Usually, a Lexical Environment is removed from memory with all the variables
//after the function call finishes. That’s because there are no references to it.
//As any JavaScript object, it’s only kept in memory while it’s reachable.

//…But if there’s a nested function that is still reachable after the end of a function,
//then it has [[Environment]] property that references the lexical environment.

//In that case the Lexical Environment is still reachable even after the completion of the function,
//so it stays alive.

function f() {
  let value = 123;

  return function() {
    console.log(value);
  }
}

let g = f(); // g.[[Environment]] stores a reference to the Lexical Environment
// of the corresponding f() call

//Please note that if f() is called many times, and resulting functions are saved,
//then all corresponding Lexical Environment objects will also be retained in memory.
//All 3 of them in the code below:

function f1() {
  let value = Math.random();

  return function() { console.log(value); };
}

// 3 functions in array, every one of them links to Lexical Environment
// from the corresponding f() run
let arr = [f1(), f1(), f1()];


//A Lexical Environment object dies when it becomes unreachable (just like any other object).
//In other words, it exists only while there’s at least one nested function referencing it.

//In the code below, after the nested function is removed,
//its enclosing Lexical Environment (and hence the value) is cleaned from memory:

function f2() {
  let value = 123;

  return function() {
    console.log(value);
  }
}

let g1 = f2(); // while g function exists, the value stays in memory

g1 = null; // ...and now the memory is cleaned up

//Real-life optimizations------------------------------------------------------

//As we’ve seen, in theory while a function is alive, all outer variables are also retained.

//But in practice, JavaScript engines try to optimize that. They analyze variable usage and
//if it’s obvious from the code that an outer variable is not used – it is removed.

//An important side effect in V8 (Chrome, Opera) is that such variable will become unavailable in debugging.

//Try running the example below in Chrome with the Developer Tools open.
//When it pauses, in the console type alert(value).

function f3() {
  let value = Math.random();
  function g() {
    debugger; // in console: type alert(value); No such variable!
  }
  return g;
}

let g2 = f3();
g2();

//As you could see – there is no such variable! In theory, it should be accessible,
//but the engine optimized it out.

//That may lead to funny (if not such time-consuming) debugging issues. One of them –
//we can see a same-named outer variable instead of the expected one:

let value = "Surprise!";
function f4() {
  let value = "the closest value";
  function g() {
    debugger; // in console: type alert(value); Surprise!
  }
  return g;
}

let g4 = f4();
g4();

//This feature of V8 is good to know. If you are debugging with Chrome/Opera,
//sooner or later you will meet it.

//That is not a bug in the debugger, but rather a special feature of V8.
//Perhaps it will be changed sometime. You always can check for it by
//running the examples on this page.

//Tasks+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Does a function pickup latest changes?------------------------------------------

//The function sayHi uses an external variable name. When the function runs,
//which value is it going to use?

let name = "John";

function sayHi() {
  console.log("Hi, " + name);
}

name = "Pete";

sayHi(); // what will it show: "John" or "Pete"? so is Pete
//Such situations are common both in browser and server-side development.
//A function may be scheduled to execute later than it is created,
//for instance after a user action or a network request.

//So, the question is: does it pick up the latest changes?

//A function gets outer variables as they are now, it uses the most recent values.

//Old variable values are not saved anywhere. When a function wants a variable,
//it takes the current value from its own Lexical Environment or the outer one.

//Which variables are available?-----------------------------------------------

//The function makeWorker below makes another function and returns it.
//That new function can be called from somewhere else.

//Will it have access to the outer variables from its creation place,
//or the invocation place, or both?

function makeWorker10() {                      //                            \\                              \\
  let name12 = "Pete";                         //                             \\                              \\
  return function() {   //                    //                              \\                              \\
    console.log(name12); //  empty -> (uter)-> //  {name2:Pete}  -> (outer) ->\\ {makeWorker: function }      \\ -> (outer) -> null
  };                    //                    //                              \\ {name2: john}                \\
}                                             //                              \\                              \\
let name12 = "John";                                                          \\                              \\
                                                                              \\                              \\
// create a function                                                          \\                              \\
let work10 = makeWorker10();                                                  \\                              \\

// call it
work10(); // what will it show?
//Which value it will show? “Pete” or “John”? so is Pete.

//The work() function in the code below gets name from the place of its origin
//through the outer lexical environment reference:

//But if there were no let name in makeWorker(), then the search would go outside and
//take the global variable as we can see from the chain above.
//In that case the result would be "John".

//Are counters independent?------------------------------------------------------
//Here we make two counters: counter and counter2 using the same makeCounter function.

//Are they independent? What is the second counter going to show? 0,1 or 2,3 or something else?

function makeCounter5() {
  let count10 = 0;

  return function() {
    return count10++;
  };
}

let counter10 = makeCounter5();
let counter102 = makeCounter5();

console.log( counter10() ); // 0
console.log( counter10() ); // 1

console.log( counter102() ); // ? 0
console.log( counter102() ); // ? 1

//Functions counter and counter2 are created by different invocations of makeCounter.

//So they have independent outer Lexical Environments, each one has its own count.

//Counter object------------------------------------------------------------------
//Here a counter object is made with the help of the constructor function.

//Will it work? What will it show?

function Counter20() {
  let count20 = 0;

  this.up = function() {
    return ++count20;
  };
  this.down = function() {
    return --count20;
  };
}

let counter20 = new Counter20();

console.log( counter20.up() ); //  1
console.log( counter20.up() ); //  2
console.log( counter20.down() ); // 1

//Function in if--------------------------------------------------------------
//Look at the code. What will be the result of the call at the last line?

let phrase = "Hello";
if (true) {
  let user = "John";
  function sayHi() {
    console.log(`${phrase}, ${user}`);
  }
}
sayHi(); //error
//The result is an error.

//The function sayHi is declared inside the if, so it only lives inside it.
//There is no sayHi outside.

//Sum with closures------------------------------------------------------------
//Write function sum that works like this: sum(a)(b) = a+b.

//Yes, exactly this way, using double parentheses (not a mistype).

//For instance:

//sum(1)(2) = 3
//sum(5)(-1) = 4

//For the second parentheses to work, the first ones must return a function.
function sum(a) {
  return function(b) {
    return a + b; // takes "a" from the outer lexical environment
  };

}
console.log( sum(1)(2) ); // 3
console.log( sum(5)(-1) ); // 4

//Is variable visible?---------------------------------------------------------
//What will be the result of this code?

let x = 1;

function func() {
  console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 2;
}
func(); // error

//In example we can observe peculiar difference between “non-existing” and “unitialized” variable.

//As you may have read in the article Variable scope, a variable starts in the “uninitialized” state
// from the moment when the execution enters a code block (or a function).
//And it stays uninitalized until the corresponding let statement.

//In other words, a variable technically exists, but can’t be used before let.

//The code above demonstrates it.

function func2() {
  // the local variable x is known to the engine from the beginning of the function,
  // but "unitialized" (unusable) until let ("dead zone")
  // hence the error

  console.log(x); // ReferenceError: Cannot access 'x' before initialization

  let x = 2;
}
func2();

//This zone of temporary unusability of a variable (from the beginning of
//the code block till let) is sometimes called the “dead zone”.

//Filter through function---------------------------------------------------------

//We have a built-in method arr.filter(f) for arrays.
//It filters all elements through the function f.
//If it returns true, then that element is returned in the resulting array.

//Make a set of “ready to use” filters:

//inBetween(a, b) – between a and b or equal to them (inclusively).
//inArray([...]) – in the given array.
//The usage must be like this:

//arr.filter(inBetween(3,6)) – selects only values between 3 and 6.
//arr.filter(inArray([1,2,3])) – selects only elements matching with one of the members of [1,2,3].
//For instance:

/* .. your code for inBetween and inArray */
//let arr = [1, 2, 3, 4, 5, 6, 7];

//alert( arr.filter(inBetween(3, 6)) ); // 3,4,5,6

//alert( arr.filter(inArray([1, 2, 10])) ); // 1,2

//Filter inBetween
function inBetween(a, b) {
  return function(x) {
    return x >= a && x <= b;
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
console.log( arr.filter(inBetween(3, 6)) ); // 3,4,5

//Filter inArray
function inArray(arr) {
  return function(x) {
    return arr.includes(x);
  };
}

let arr = [1, 2, 3, 4, 5, 6, 7];
console.log( arr.filter(inArray([1, 2, 10])) ); // 1,2

//Sort by field---------------------------------------------------------------
//We’ve got an array of objects to sort:

let users = [
  { name: "John", age: 20, surname: "Johnson" },
  { name: "Pete", age: 18, surname: "Peterson" },
  { name: "Ann", age: 19, surname: "Hathaway" }
];
//The usual way to do that would be:

// by name (Ann, John, Pete)
users.sort((a, b) => a.name > b.name ? 1 : -1);

// by age (Pete, Ann, John)
users.sort((a, b) => a.age > b.age ? 1 : -1);
//Can we make it even less verbose, like this?

users.sort(byField('name'));
users.sort(byField('age'));
//So, instead of writing a function, just put byField(fieldName).

//Write the function byField that can be used for that.
function byField(fieldName){
  return (a, b) => a[fieldName] > b[fieldName] ? 1 : -1;
}

//Army of functions-----------------------------------------------------
//The following code creates an array of shooters.

//Every function is meant to output its number. But something is wrong…

function makeArmy() {
  let shooters = [];
  let i = 0;
  while (i < 10) {
    let shooter = function() { // shooter function
      console.log( i ); // should show its number
    };
    shooters.push(shooter);
    i++;
  }
  return shooters;
}
let army = makeArmy();

army[0](); // the shooter number 0 shows 10
army[5](); // and number 5 also outputs 10...
// ... all shooters show 10 instead of their 0, 1, 2, 3...
//Why do all of the shooters show the same value? Fix the code so that they work as intended.

//Let’s examine what’s done inside makeArmy, and the solution will become obvious.

//1->It creates an empty array shooters:
//let shooters = [];

//2->Fills it in the loop via shooters.push(function...).
//Every element is a function, so the resulting array looks like this:
/*
shooters = [
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); },
  function () { alert(i); }
];*/

//3->The array is returned from the function.

//Then, later, the call to army[5]() will get the element army[5] from the array
//(it will be a function) and call it.

//Now why all such functions show the same?

//That’s because there’s no local variable i inside shooter functions.
//When such a function is called, it takes i from its outer lexical environment.

//What will be the value of i?

//If we look at the source:
/*
function makeArmy() {
  ...
  let i = 0;
  while (i < 10) {
    let shooter = function() { // shooter function
      alert( i ); // should show its number
    };
    ...
  }
  ...
}*/

//…We can see that it lives in the lexical environment associated with
//the current makeArmy() run.

//But when army[5]() is called, makeArmy has already finished its job,
//and i has the last value: 10 (the end of while).

//As a result, all shooter functions get from the outer lexical envrironment the same,
//last value i=10.

//We can fix it by moving the variable definition into the loop:
/*
function makeArmy() {
  let shooters = [];
  for(let i = 0; i < 10; i++) {
    let shooter = function() { // shooter function
      alert( i ); // should show its number
    };
    shooters.push(shooter);
  }
  return shooters;
}
let army = makeArmy();
army[0](); // 0
army[5](); // 5
*/

//Now it works correctly, because every time the code block in for (let i=0...) {...} is executed,
//a new Lexical Environment is created for it, with the corresponding variable i.

//So, the value of i now lives a little bit closer. Not in makeArmy() Lexical Environment,
//but in the Lexical Environment that corresponds the current loop iteration.
//That’s why now it works.

/*
shooters = [             <for block laxical env>
  function () { alert(i); },  ->  {i:0}
  function () { alert(i); },  ->  {i:1}
  function () { alert(i); },  ->  {i:2}
  function () { alert(i); },  ->  {i:3}   -> (outer)  -> makeArray()
  function () { alert(i); },  ->  {i:4}                   Laxical env
  function () { alert(i); },  ->  {i:5}
  function () { alert(i); },  ->  {i:6}
  function () { alert(i); },  ->  {i:7}
  function () { alert(i); },  ->  {i:8}
  function () { alert(i); }   ->  {i:9}
];*/

//Here we rewrote while into for.

//Another trick could be possible, let’s see it for better understanding of the subject:

function makeArmy2() {
  let shooters2 = [];
  let i2 = 0;
  while (i2 < 10) {
    let j2 = i2;
    let shooter2 = function() { // shooter function
      console.log( j2 ); // should show its number
    };
    shooters2.push(shooter2);
    i2++;
  }
  return shooters2;
}

let army2 = makeArmy2();

army2[0](); // 0
army2[5](); // 5
//The while loop, just like for, makes a new Lexical Environment for each run.
//So here we make sure that it gets the right value for a shooter.

//We copy let j = i. This makes a loop body local j and copies the value of i to it.
//Primitives are copied “by value”, so we actually get a complete independent copy of i,
//belonging to the current loop iteration.
