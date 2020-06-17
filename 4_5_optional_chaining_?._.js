//Optional chaining '?.'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//The optional chaining ?. is an error-proof way to access nested object properties,
//even if an intermediate property doesn’t exist.

// The problems+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//For example, some of our users have addresses, but few did not provide them.
//Then we can’t safely read user.address.street:

let user = {}; // the user happens to be without address
//  console.log(user.address.street); // Error!

//Or, in the web development,
//we’d like to get an information about an element on the page, but it may not exist:

// Error if the result of querySelector(...) is null
//  let html = document.querySelector('.my-element').innerHTML;

//Before ?. appeared in the language, the && operator was used to work around that.
let user1 = {}; // user has no address
console.log( user1 && user1.address && user1.address.street ); // undefined (no error)

//Optional chaining++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//The optional chaining ?. stops the evaluation and returns undefined if the part before ?.
//is undefined or null.
//we’ll be saying that something “exists” if it’s not null and not undefined.

let user2 = {}; // user has no address
console.log( user2?.address?.street ); // undefined (no error)

//Reading the address with user?.address works even if user object doesn’t exist:
let user3 = null;
console.log( user3?.address ); // undefined
console.log( user3?.address.street ); // undefined
console.log( user3?.address.street.anything ); // undefined

//n the last two lines the evaluation stops immediately after user?.,
//never accessing further properties. But if the user actually exists,
//then the further intermediate properties, such as user.address must exist.

//So, if user happens to be undefined due to a mistake, we’ll know about it and fix it.
//Otherwise, coding errors can be silenced where not appropriate, and become more difficult to debug.

//+Don’t overuse the optional chaining+
//For example, if according to our coding logic user object must be there, but address is optional,
//then user.address?.street would be better.
//So, if user happens to be undefined due to a mistake, we’ll know about it and fix it. Otherwise,
//coding errors can be silenced where not appropriate, and become more difficult to debug.

//+The variable before ?. must exist+
//If there’s no variable user, then user?.anything triggers an error:
//ReferenceError: user is not defined
//  user?.address;

//Short-circuiting++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//As it was said before, the ?. immediately stops (“short-circuits”) the evaluation
//if the left part doesn’t exist.

//So, if there are any further function calls or side effects, they don’t occur:
let user4 = null;
let x = 0;
user4?.sayHi(x++); // nothing happens
console.log(x); // 0, value not incremented

//+Other cases: ?.(), ?.[]+
//The optional chaining ?. is not an operator, but a special syntax construct,
//that also works with functions and square brackets.

//example, ?.() is used to call a function that may not exist.
//In the code below, some of our users have admin method, and some don’t:
let user5 = {
  admin() {
    console.log("I am admin");
  }
}
let user6 = {};
user5.admin?.(); // I am admin
user6.admin?.();

// in both lines we first use the dot . to get admin property,
//because the user object must exist, so it’s safe read from it.

//Then ?.() checks the left part: if the admin function exists, then it runs (for user1).
//Otherwise (for user2) the evaluation stops without errors.

//The ?.[] syntax also works, if we’d like to use brackets [] to access properties instead of dot ..
//Similar to previous cases, it allows to safely read a property from an object that may not exist.

let user7 = {
  firstName: "John"
};
let user8 = null; // Imagine, we couldn't authorize the user
let key = "firstName";
console.log( user7?.[key] ); // John
console.log( user8?.[key] ); // undefined
console.log( user7?.[key]?.something?.not?.existing); // undefined

//Also we can use ?. with delete:
delete user7?.name; // delete user.name if user exists

//We can use ?. for safe reading and deleting, but not writing

//The optional chaining ?. has no use at the left side of an assignment:
// the idea of the code below is to write user.name, if user exists

user9?.name = "John"; // Error, doesn't work
// because it evaluates to undefined = "John"
