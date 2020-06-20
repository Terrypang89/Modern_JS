//Recursion and stack+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Recursion is a programming pattern that
//situations when a task can be naturally split into several tasks of the same kind, but simpler.
//Or when a task can be simplified into an easy action plus a simpler variant of the same task.

//When a function solves a task, in the process it can call many other functions.
//A partial case of this is when a function calls itself. That’s called recursion.

//Two ways of thinking+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//et’s write a function pow(x, n) that raises x to a natural power of n.
//In other words, multiplies x by itself n times.

//  pow(2, 2) = 4
//  pow(2, 3) = 8
//  pow(2, 4) = 16

//There are two ways to implement it.
//  Iterative thinking: the for loop:
function pow(x, n) {
  let result = 1;
  // multiply result by x n times in the loop
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  return result;
}
console.log( pow(2, 3) ); // 8

//  Recursive thinking: simplify the task and call self:
function pow1(x, n) {
  if (n == 1) {
    return x;
  } else {
    return x * pow1(x, n - 1);
  }
}
console.log( pow1(2, 3) ); // 8

//When pow(x, n) is called, the execution splits into two branches:

//>If n == 1, then everything is trivial. It is called the base of recursion,
//  because it immediately produces the obvious result: pow(x, 1) equals x.

//>Otherwise, we can represent pow(x, n) as x * pow(x, n - 1).
//  In maths, one would write xn = x * xn-1.
//  This is called a recursive step: we transform the task into a simpler action
//  (multiplication by x) and a simpler call of the same task (pow with lower n).
//  Next steps simplify it further and further until n reaches 1.

//For example, to calculate pow(2, 4) the recursive variant does these steps:

//pow(2, 4) = 2 * pow(2, 3)
//pow(2, 3) = 2 * pow(2, 2)
//pow(2, 2) = 2 * pow(2, 1)
//pow(2, 1) = 2

//So, the recursion reduces a function call to a simpler one, and then – to even more simpler,
//and so on, until the result becomes obvious.

//+Recursion is usually shorter+
function pow2(x, n) {
  return (n == 1) ? x : (x * pow2(x, n - 1));
}

console.log( pow2(2, 3) ); // 8

//The maximal number of nested calls (including the first one) is called recursion depth.
//In our case, it will be exactly n

//The maximal recursion depth is limited by JavaScript engine.
//We can rely on it being 10000, some engines allow more,
//but 100000 is probably out of limit for the majority of them.

//There are automatic optimizations that help alleviate this (“tail calls optimizations”),
//but they are not yet supported everywhere and work only in simple cases.

//The execution context and stack++++++++++++++++++++++++++++++++++++++++++++++++
//Now let’s examine how recursive calls work.

//The information about process of execution of a running function is stored in its execution context.

//The execution context is an internal data structure that
//contains details about the execution of a function:
//where the control flow is now, the current variables, the value of this
//(we don’t use it here) and few other internal details.

//One function call has exactly one execution context associated with it.

//When a function makes a nested call, the following happens:
//  >The current function is paused.
//  >The execution context associated with it is remembered in a special data structure
//    called execution context stack.
//  >The nested call executes.
//  >After it ends, the old execution context is retrieved from the stack,
//    and the outer function is resumed from where it stopped.

//    +pow(2, 3)+

//From above examples:
//In the beginning of the call pow(2, 3) the execution context will store variables: x = 2, n = 3,
//the execution flow is at line 1 of the function.

//-> Context: { x: 2, n: 3, at line 1 } pow(2, 3)

//That’s when the function starts to execute. The condition n == 1 is false,
//  so the flow continues into the second branch of if:

// return x * pow(x, n - 1); //second branch of if
//he variables are same, but the line changes, so the context is now:

//-> Context: { x: 2, n: 3, at line 5 } pow(2, 3)

//To calculate x * pow(x, n - 1), we need to make a subcall of pow with new arguments pow(2, 2).

//    +pow(2, 2)+

//To do a nested call, JavaScript remembers the current execution context in the execution context stack.

//Here we call the same function pow, but it absolutely doesn’t matter.
//The process is the same for all functions:

//  >The current context is “remembered” on top of the stack.
//  >The new context is created for the subcall.
//  >When the subcall is finished – the previous context is popped from the stack,
//    and its execution continues.

//Here’s the context stack when we entered the subcall pow(2, 2):

//  ->Context: { x: 2, n: 2, at line 1 } pow(2, 2)
//  ->Context: { x: 2, n: 3, at line 5 } pow(2, 3)

//The new current execution context is on top (and bold),
//and previous remembered contexts are below.

//When we finish the subcall – it is easy to resume the previous context,
//because it keeps both variables and the exact place of the code where it stopped.

//    +pow(2, 1)+

//The process repeats: a new subcall is made at line 5, now with arguments x=2, n=1.

//A new execution context is created, the previous one is pushed on top of the stack:
//  ->Context: { x: 2, n: 1, at line 1 } pow(2, 1)
//  ->Context: { x: 2, n: 2, at line 5 } pow(2, 2)
//  ->Context: { x: 2, n: 3, at line 5 } pow(2, 3)
//There are 2 old contexts now and 1 currently running for pow(2, 1).

//The exit Memory issue recursion+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//During the execution of pow(2, 1), unlike before, the condition n == 1 is truthy,
//so the first branch of if works:

function pow3(x, n) {
  if (n == 1) {
    return x; // <-
  } else {
    return x * pow(x, n - 1);
  }
}

//There are no more nested calls, so the function finishes, returning 2.

//As the function finishes, its execution context is not needed anymore,
//  so it’s removed from the memory. The previous one is restored off the top of the stack:

//  ->Context: { x: 2, n: 2, at line 5 } pow(2, 2)
//  ->Context: { x: 2, n: 3, at line 5 } pow(2, 3)

//The execution of pow(2, 2) is resumed. It has the result of the subcall pow(2, 1),
//so it also can finish the evaluation of x * pow(x, n - 1), returning 4.

//Then the previous context is restored:
//  ->Context: { x: 2, n: 3, at line 5 } pow(2, 3)

//When it finishes, we have a result of pow(2, 3) = 8.
//The recursion depth in this case was: 3.

//As we can see from the illustrations above,
//recursion depth equals the maximal number of context in the stack.

//Note the memory requirements. Contexts take memory.
//In our case, raising to the power of n actually requires the memory for n contexts,
//for all lower values of n.

//A loop-based algorithm is more memory-saving:
function pow4(x, n) {
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= x;
  }
  return result;
}
//The iterative pow uses a single context changing i and result in the process.
//Its memory requirements are small, fixed and do not depend on n.

//Any recursion can be rewritten as a loop.
//The loop variant usually can be made more effective.

//…But sometimes the rewrite is non-trivial,
//especially when function uses different recursive subcalls depending on conditions and
//merges their results or when the branching is more intricate.
//And the optimization may be unneeded and totally not worth the efforts.

//Recursive traversals+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Another great application of the recursion is a recursive traversal.

let company = {
  sales: [{
    name: 'John', salary: 1000
  }, {
    name: 'Alice', salary: 1600
  }],

  development: {
    sites: [{
      name: 'Peter', salary: 2000
    }, {
      name: 'Alex', salary: 1800
    }],

    internals: [{
      name: 'Jack', salary: 1300
    }]
  }
};

//Now let’s say we want a function to get the sum of all salaries. How can we do that?
//Let’s try recursion.

//As we can see, when our function gets a department to sum, there are two possible cases:

//>Either it’s a “simple” department with an array of people –
//  then we can sum the salaries in a simple loop.
//>Or it’s an object with N subdepartments – then we can make N recursive calls
//  to get the sum for each of the subdeps and combine the results.

//The 1st case is the base of recursion, the trivial case, when we get an array.

//The 2nd case when we get an object is the recursive step.
//  A complex task is split into subtasks for smaller departments.
//  They may in turn split again, but sooner or later the split will finish at (1).

let company1 = { // the same object, compressed for brevity
  sales: [{name: 'John', salary: 1000}, {name: 'Alice', salary: 1600 }],
  development: {
    sites: [{name: 'Peter', salary: 2000}, {name: 'Alex', salary: 1800 }],
    internals: [{name: 'Jack', salary: 1300}]
  }
};

// The function to do the job
function sumSalaries(department) {
  if (Array.isArray(department)) { // case (1)
    return department.reduce((prev, current) => prev + current.salary, 0); // sum the array
  } else { // case (2)
    let sum = 0;
    for (let subdep of Object.values(department)) { //get array out from obj and dump array to function
      sum += sumSalaries(subdep); // recursively call for subdepartments, sum the results
    }
    return sum;
  }
}

console.log(sumSalaries(company1)); // 7700

//We can easily see the principle: for an object {...} subcalls are made,
//  while arrays [...] are the “leaves” of the recursion tree, they give immediate result.

//Note that the code uses smart features that we’ve covered before:

//  ->Method arr.reduce explained in the chapter Array methods to get the sum of the array.
//  ->Loop for(val of Object.values(obj)) to iterate over object values:
//    Object.values returns an array of them.

//Recursive structures++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//A recursive (recursively-defined) data structure is a structure that replicates itself in parts.

//We’ve just seen it in the example of a company structure above.

//A company department is:
//  Either an array of people.
//  Or an object with departments.

//For web-developers there are much better-known examples: HTML and XML documents.
//In the HTML document, an HTML-tag may contain a list of:
//  -Text pieces.
//  -HTML-comments.
//  -Other HTML-tags (that in turn may contain text pieces/comments or other tags etc).
//  -That’s once again a recursive definition.

//Linked list, recursive structure++++++++++++++++++++++++++++++++++++++++++++++++++
//we want to store an ordered list of object. The natural choice would be an array:

let arr1 = [obj1, obj2, obj3];

//but there’s a problem with arrays.
//The “delete element” and “insert element” operations are expensive.
//For instance, arr.unshift(obj) operation has to renumber all elements to make room for a new obj,
//and if the array is big, it takes time. Same with arr.shift().

//The only structural modifications that do not require mass-renumbering are those
//that operate with the end of array: arr.push/pop.
//So an array can be quite slow for big queues, when we have to work with the beginning.

//Alternatively, if really need fast insertion/deletion, choose another data structure linked list.

//The linked list element is recursively defined as an object with:
//  -value.
//  -next property referencing the next linked list element or null if that’s the end.

//examples:
let list = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }

//An alternative code for creation:

let list1 = { value: 1 };
list1.next = { value: 2 };
list1.next.next = { value: 3 };
list1.next.next.next = { value: 4 };
list1.next.next.next.next = null;

//To join:
list1.next.next = secondList;

//To remove a value from the middle, change next of the previous one:
list.next = list.next.next;

//list.next jump over 1 to value 2. The value 1 is now excluded from the chain.
// If it’s not stored anywhere else, it will be automatically removed from the memory.

//Unlike arrays, there’s no mass-renumbering, we can easily rearrange elements.

//The main drawback is that we can’t easily access an element by its number.
//In an array that’s easy: arr[n] is a direct reference.
//But in the list we need to start from the first item and go next N times to get the Nth element.

//…But we don’t always need such operations.
//when we need a queue or even a deque –
//the ordered structure that must allow very fast adding/removing elements from both ends,
//but access to its middle is not needed.

//Lists can be enhanced:
//  -We can add property prev in addition to next to reference the previous element,
//    to move back easily.
//  -We can also add a variable named tail referencing the last element of the list
//    (and update it when adding/removing elements from the end).
//  …The data structure may vary according to our needs.

//TASK++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+Sum all numbers till the given one+

//Write a function sumTo(n) that calculates the sum of numbers 1 + 2 + ... + n.
/*
  sumTo(1) = 1
  sumTo(2) = 2 + 1 = 3
  sumTo(3) = 3 + 2 + 1 = 6
  sumTo(4) = 4 + 3 + 2 + 1 = 10
  ...
  sumTo(100) = 100 + 99 + ... + 2 + 1 = 5050
*/

//Make 3 solution variants:

//  Using a for loop.
//  Using a recursion, cause sumTo(n) = n + sumTo(n-1) for n > 1.
//  Using the arithmetic progression formula.
//An example of the result:

//function sumTo(n) { /*... your code ... */ }
//console.log( sumTo(100) ); // 5050

//The solution using a loop:
function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}
console.log( sumTo(100) );

//The solution using recursion:
function sumTo1(n) {
  if( sum == 1) return 1;
  return n + sumTo1(n-1);
}
console.log( sumTo1(100) );

//The solution using the formula: sumTo(n) = n*(n+1)/2:

function sumTo2(n) {
  return n * (n + 1) / 2;
}
console.log( sumTo2(100) );
//P.S. Naturally, the formula is the fastest solution.
//It uses only 3 operations for any number n. The math helps!

//The loop variant is the second in terms of speed.
//In both the recursive and the loop variant we sum the same numbers.
// But the recursion involves nested calls and execution stack management.
//That also takes resources, so it’s slower.

//P.P.S. Some engines support the “tail call” optimization:
//if a recursive call is the very last one in the function (like in sumTo above),
//then the outer function will not need to resume the execution,
//so the engine doesn’t need to remember its execution context.
//That removes the burden on memory, so counting sumTo(100000) becomes possible.
//But if the JavaScript engine does not support tail call optimization (most of them don’t),
//there will be an error: maximum stack size exceeded,
//because there’s usually a limitation on the total stack size.


//+Calculate factorial+
//The factorial of a natural number is a number multiplied by "number minus one",
//then by "number minus two", and so on till 1. The factorial of n is denoted as n!

//We can write a definition of factorial like this:

//    n! = n * (n - 1) * (n - 2) * ...*1

//Values of factorials for different n:
/*
1! = 1
2! = 2 * 1 = 2
3! = 3 * 2 * 1 = 6
4! = 4 * 3 * 2 * 1 = 24
5! = 5 * 4 * 3 * 2 * 1 = 120
*/

//The task is to write a function factorial(n) that calculates n! using recursive calls.
//console.log( factorial(5) ); // 120

//By definition, a factorial is n! can be written as n * (n-1)!.
//In other words, the result of factorial(n) can be calculated as n multiplied by
//the result of factorial(n-1). And the call for n-1 can recursively descend lower, and lower,
//till 1.

function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}
console.log( factorial(5) ); // 120

//The basis of recursion is the value 1.
//We can also make 0 the basis here, doesn’t matter much, but gives one more recursive step:

function factorial1(n) {
  return n ? n * factorial1(n - 1) : 1;
}

console.log( factorial1(5) ); // 120

//+Fibonacci numbers+
//the sequence of Fibonacci numbers has the formula Fn = Fn-1 + Fn-2.
//In other words, the next number is a sum of the two preceding ones.
//First two numbers are 1, then 2(1+1), then 3(1+2), 5(2+3) and so on: 1, 1, 2, 3, 5, 8, 13, 21....

//Fibonacci numbers are related to the Golden ratio and many natural phenomena around us.
//Write a function fib(n) that returns the n-th Fibonacci number.

//An example of work:

//function fib(n) { /* your code */ }

//alert(fib(3)); // 2
//alert(fib(7)); // 13
//alert(fib(77)); // 5527939700884757

function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

console.log( fib(3) ); // 2
console.log( fib(7) ); // 13
// fib(77); // will be extremely slow!

//…But for big values of n it’s very slow. For instance,
//fib(77) may hang up the engine for some time eating all CPU resources.

//That’s because the function makes too many subcalls.
//The same values are re-evaluated again and again.

//For instance, let’s see a piece of calculations for fib(5):

//  fib(5) = fib(4) + fib(3)
//  fib(4) = fib(3) + fib(2)

//Here we can see that the value of fib(3) is needed for both fib(5) and fib(4).
//So fib(3) will be called and evaluated two times completely independently.

//We can clearly notice that fib(3) is evaluated two times and fib(2) is evaluated three times.
//The total amount of computations grows much faster than n, making it enormous even for n=77.

//We can optimize that by remembering already-evaluated values:
//if a value of say fib(3) is calculated once, then we can just reuse it in future computations.

//Another variant would be to give up recursion and use a totally different loop-based algorithm.

//Instead of going from n down to lower values, we can make a loop that starts from 1 and 2,
//then gets fib(3) as their sum, then fib(4) as the sum of two previous values,
//then fib(5) and goes up and up, till it gets to the needed value.
//On each step we only need to remember two previous values.

//Here are the steps of the new algorithm in details.
//The start:

// a = fib(1), b = fib(2), these values are by definition 1
//  let a = 1, b = 1;

// get c = fib(3) as their sum
//  let c = a + b;

/* we now have fib(1), fib(2), fib(3)
a  b  c
1, 1, 2
*/
//Now we want to get fib(4) = fib(2) + fib(3).
//Let’s shift the variables: a,b will get fib(2),fib(3), and c will get their sum:

  //a = b; // now a = fib(2)
  //b = c; // now b = fib(3)
  //c = a + b; // c = fib(4)

/* now we have the sequence:
     a  b  c
  1, 1, 2, 3
  */
//The next step gives another sequence number:

//  a = b; // now a = fib(3)
//  b = c; // now b = fib(4)
//  c = a + b; // c = fib(5)

/* now the sequence is (one more number):
      a  b  c
1, 1, 2, 3, 5
*/
//…And so on until we get the needed value.
//That’s much faster than recursion and involves no duplicate computations.

// using algorithm
function fib1(n) {
  let a = 1;
  let b = 1;
  for (let i = 3; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}

console.log( fib1(3) ); // 2
console.log( fib1(7) ); // 13
console.log( fib1(77) ); // 5527939700884757

//The loop starts with i=3,
//because the first and the second sequence values are hard-coded into variables a=1, b=1.

//The approach is called dynamic programming bottom-up.

//+Output a single-linked list+
//Let’s say we have a single-linked list (as described in the chapter Recursion and stack):

let list5 = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};
//Write a function printList(list) that outputs list items one-by-one.

//Loop-based solution, The loop-based variant of the solution:

function printList(list5) {
  let tmp = list;

  while (tmp) {
    console.log(tmp.value);
    tmp = tmp.next;
  }

}

printList(list5);

//Please note that we use a temporary variable tmp to walk over the list.
//Technically, we could use a function parameter list instead:

function printList1(list5) {
  while(list5) {
    console.log(list5.value);
    list5 = list5.next;
  }
}
//…But that would be unwise. In the future we may need to extend a function,
//do something else with the list. If we change list, then we lose such ability.

//Talking about good variable names, list here is the list itself.
//The first element of it. And it should remain like that. That’s clear and reliable.

//From the other side, the role of tmp is exclusively a list traversal, like i in the for loop.

//Recursive solution
//The recursive variant of printList(list) follows a simple logic:
//to output a list we should output the current element list, then do the same for list.next:


function printList(list5) {

  console.log(list5.value); // output the current item
  if (list5.next) {
    printList(list5.next); // do the same for the rest of the list
  }
}
printList(list5);

//Technically, the loop is more effective.
//These two variants do the same, but the loop does not spend resources for nested function calls.

//From the other side, the recursive variant is shorter and sometimes easier to understand.


//+Output a single-linked list in the reverse order+
//Output a single-linked list from the previous task Output a single-linked list in reverse order.

//Using a recursion

//We need to first output the rest of the list and then output the current one:

let list6 = {
  value: 1,
  next: {
    value: 2,
    next: {
      value: 3,
      next: {
        value: 4,
        next: null
      }
    }
  }
};

function printReverseList(list6) {
  if (list6.next) {
    printReverseList(list6.next);
  }
  console.log(list6.value);
}

printReverseList(list6);

//Using a loop
//The loop variant is also a little bit more complicated then the direct output.

//There is no way to get the last value in our list. We also can’t “go back”.

//So what we can do is to first go through the items in the direct order and
//remember them in an array, and then output what we remembered in the reverse order:

function printReverseList1(list6) {
  let arr = [];
  let tmp = list;

  while (tmp) {
    arr.push(tmp.value);
    tmp = tmp.next;
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    console.log( arr[i] );
  }
}
printReverseList1(list6);

//Please note that the recursive solution actually does exactly the same:
//it follows the list, remembers the items in the chain of nested calls
//(in the execution context stack), and then outputs them.
