//Scheduling: setTimeout and setInterval+++++++++++++++++++++++++++++++++++++++++
//We may decide to execute a function not right now, but at a certain time later.
//That’s called “scheduling a call”.

//setTimeout allows us to run a function once after the interval of time.
//setInterval allows us to run a function repeatedly, starting after the interval of time,
//then repeating continuously at that interval.

//These methods are not a part of JavaScript specification.
//But most environments have the internal scheduler and provide these methods.
//In particular, they are supported in all browsers and Node.js.

//setTimeout+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//let timerId = setTimeout(func|code, [delay], [arg1], [arg2], ...)

//Parameters:

//func|code:
//Function or a string of code to execute. Usually, that’s a function.
//For historical reasons, a string of code can be passed, but that’s not recommended.

//delay:
//The delay before run, in milliseconds (1000 ms = 1 second), by default 0.

//arg1, arg2…:
//Arguments for the function (not supported in IE9-)

function sayHi() {
  console.log('Hello');
}

//setTimeout(sayHi, 1000);

//If the first argument is a string, then JavaScript creates a function from it.
//So, this will also work:

//setTimeout("console.log("Hello")", 1000);

//But using strings is not recommended, use arrow functions instead of them, like this:

setTimeout(() => console.log('Hello'), 1000);

//Pass a function, but don’t run it
//Novice developers sometimes make a mistake by adding brackets () after the function:

// wrong!
//setTimeout(sayHi(), 1000);
//That doesn’t work, because setTimeout expects a reference to a function.
//And here sayHi() runs the function, and the result of its execution is passed to setTimeout.
//In our case the result of sayHi() is undefined (the function returns nothing),
//so nothing is scheduled.

//Canceling with clearTimeout++++++++++++++++++++++++++++++++++++++++++++++++++++

//A call to setTimeout returns a “timer identifier” timerId that we can use to cancel the execution.

//let timerId = setTimeout(...);
//clearTimeout(timerId);

//In the code below, we schedule the function and then cancel it (changed our mind).

let timerId = setTimeout(() => cosnole.log("never happens"), 1000);
console.log(timerId); // timer identifier

clearTimeout(timerId);
console.log(timerId); // same identifier (doesn't become n

//As we can see from alert output, in a browser the timer identifier is a number.
//In other environments, this can be something else.
//For instance, Node.js returns a timer object with additional methods.

//Again, there is no universal specification for these methods, so that’s fine.

//For browsers, timers are described in the timers section of HTML5 standard.

//setInterval++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//The setInterval method has the same syntax as setTimeout:
//let timerId = setInterval(func|code, [delay], [arg1], [arg2], ..

//All arguments have the same meaning. But unlike setTimeout it runs the function not only once,
//but regularly after the given interval of time.

//To stop further calls, we should call clearInterval(timerId).

//The following example will show the message every 2 seconds.
//After 5 seconds, the output is stopped:

// repeat with the interval of 2 seconds
let timerId1 = setInterval(() => console.log('tick'), 2000); // tick, tick

// after 5 seconds stop
setTimeout(() => { clearInterval(timerId1); console.log('stop'); }, 5000); //stop

//Time goes on while alert is shown
//In most browsers, including Chrome and Firefox the internal timer
//continues “ticking” while showing alert/confirm/prompt.

//So if you run the code above and don’t dismiss the alert window for some time,
//then in the next alert will be shown immediately as you do it.
//The actual interval between alerts will be shorter than 2 seconds.

//Nested setTimeout+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//There are two ways of running something regularly.

//One is setInterval. The other one is a nested setTimeout, like this
/** instead of:
let timerId = setInterval(() => alert('tick'), 2000);
*/
/*
let timerId2 = setTimeout(function tick() {
  console.log('tick2');
  timerId2 = setTimeout(tick2, 2000); // (*)
}, 2000);
*/
//The setTimeout above schedules the next call right at the end of the current one (*).

//The nested setTimeout is a more flexible method than setInterval.
//This way the next call may be scheduled differently, depending on the results of the current one.

//For instance, we need to write a service that sends a request to the server every 5 seconds
//asking for data, but in case the server is overloaded,
//it should increase the interval to 10, 20, 40 seconds…

let delay = 5000;
/*
let timerId3 = setTimeout(function request() {
  //...send request...

  if (request failed due to server overload) {
    // increase the interval to the next run
    delay *= 2;
  }

  timerId3 = setTimeout(request, delay);

}, delay);
*/

//And if the functions that we’re scheduling are CPU-hungry,
//then we can measure the time taken by the execution and plan the next call sooner or later.

//Nested setTimeout allows to set the delay between the executions more precisely than setInterval.

//Let’s compare two code fragments. The first one uses setInterval:
/*
let i = 1;
setInterval(function() {
  func(i++);
}, 100);
*/

// run 100ms , 200ms, 300ms

//The second one uses nested setTimeout:
/*
let i = 1;
setTimeout(function run() {
  func(i++);
  setTimeout(run, 100);
}, 100);
*/

//For setInterval the internal scheduler will run func(i++) every 100ms:

//The real delay between func calls for setInterval is less than in the code!

//That’s normal, because the time taken by func's execution “consumes” a part of the interval.

//It is possible that func's execution turns out to be longer than we expected and
//takes more than 100ms.

//In this case the engine waits for func to complete, then checks the scheduler and
//if the time is up, runs it again immediately.

//In the edge case, if the function always executes longer than delay ms,
//then the calls will happen without a pause at all.

//so The nested setTimeout guarantees the fixed delay (here 100ms).

//That’s because a new call is planned at the end of the previous one.


//Garbage collection and setInterval/setTimeout callback-----------------------------
//When a function is passed in setInterval/setTimeout,
//an internal reference is created to it and saved in the scheduler.
//It prevents the function from being garbage collected,
//even if there are no other references to it.

// the function stays in memory until the scheduler calls it
//setTimeout(function() {...}, 100);
//For setInterval the function stays in memory until clearInterval is called.

//there’s a side-effect. A function references the outer lexical environment,
//so, while it lives, outer variables live too.
//They may take much more memory than the function itself.
//So when we don’t need the scheduled function anymore,
//it’s better to cancel it, even if it’s very small.

//Zero delay setTimeout++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//There’s a special use case: setTimeout(func, 0), or just setTimeout(func).

//This schedules the execution of func as soon as possible.
//But the scheduler will invoke it only after the currently executing script is complete.

//So the function is scheduled to run “right after” the current script.

//For instance, this outputs “Hello”, then immediately “World”:

setTimeout(() => console.log("World"));

console.log("Hello");

//The first line “puts the call into calendar after 0ms”.
//But the scheduler will only “check the calendar” after the current script is complete,
//so "Hello" is first, and "World" – after it.

//There are also advanced browser-related use cases of zero-delay timeout,
//that we’ll discuss in the chapter Event loop: microtasks and macrotasks.

//Zero delay is in fact not zero (in a browser)----------------------------------
//In the browser, there’s a limitation of how often nested timers can run.
//The HTML5 standard says: “after five nested timers,
//the interval is forced to be at least 4 milliseconds.”.

//Let’s demonstrate what it means with the example below.
//The setTimeout call in it re-schedules itself with zero delay.
//Each call remembers the real time from the previous one in the times array.
//What do the real delays look like? Let’s see:

/*
let start = Date.now();
let times = [];

setTimeout(function run() {
  times.push(Date.now() - start); // remember delay from the previous call

  if (start + 100 < Date.now()) console.log(times); // show the delays after 100ms
  else setTimeout(run); // else re-schedule
});
*/

// an example of the output:
// 1,1,1,1,9,15,20,24,30,35,40,45,50,55,59,64,70,75,80,85,90,95,100
//First timers run immediately (just as written in the spec),
//and then we see 9, 15, 20, 24.... The 4+ ms obligatory delay between invocations comes into play.

//The similar thing happens if we use setInterval instead of setTimeout:
//setInterval(f) runs f few times with zero-delay, and afterwards with 4+ ms delay.

//That limitation comes from ancient times and many scripts rely on it,
//so it exists for historical reasons.

//For server-side JavaScript, that limitation does not exist,
//and there exist other ways to schedule an immediate asynchronous job,
//like setImmediate for Node.js. So this note is browser-specific.

//Tasks+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Output every second-------------------------------------------------------------
//Write a function printNumbers(from, to) that outputs a number every second,
//starting from from and ending with to.

//Make two variants of the solution.

//Using setInterval. or Using nested setTimeout.

//Using setInterval:

function printNumbers(from, to) {
  let current = from;

  let timerId0 = setInterval(function() {
    console.log(current);
    if (current == to) {
      clearInterval(timerId0);
    }
    current++;
  }, 1000);
}

// usage:
printNumbers(5, 10);
//Using nested setTimeout:

function printNumbers1(from1, to) {
  let current1 = from1;

  setTimeout(function go1() {
    console.log(current1);
    if (current1 < to) {
      setTimeout(go1, 1000);
    }
    current1++;
  }, 1000);
}

// usage:
printNumbers1(5, 10);

//Note that in both solutions, there is an initial delay before the first output.
//The function is called after 1000ms the first time.

//If we also want the function to run immediately,
//then we can add an additional call on a separate line, like this:

function printNumbers2(from2, to2) {
  let current2 = from2;

  function go2() {
    console.log(current2);
    if (current2 == to2) {
      clearInterval(timerId2);
    }
    current2++;
  }
  go2();
  let timerId2 = setInterval(go2, 1000);
}

printNumbers2(5, 10);

//What will setTimeout show?-------------------------------------------------------

//In the code below there’s a setTimeout call scheduled, then a heavy calculation is run, that takes more than 100ms to finish.

//When will the scheduled function run?

//After the loop.
//Before the loop.
//In the beginning of the loop.
//What is alert going to show?

//let i = 0;

//setTimeout(() => alert(i), 100); // ?

// assume that the time to execute this function is >100ms
//for(let j = 0; j < 100000000; j++) {
//  i++;
//}

//Any setTimeout will run only after the current code has finished.

//The i will be the last one: 100000000.

let i = 0;

setTimeout(() => console.log(i), 100); // 100000000

// assume that the time to execute this function is >100ms
for(let j = 0; j < 100000000; j++) {
  i++;
}
