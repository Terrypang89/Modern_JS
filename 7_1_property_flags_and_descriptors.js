"use strict";
//Property flags and descriptors+++++++++++++++++++++++++++++++++++++++++++++++++++
//Objects can store properties

//property was a simple “key-value” pair to us.
//But an object property is actually a more flexible and powerful thing.

//Property Flags++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Object properties, besides a value, have three special attributes (so-called “flags”):

//writable – if true, the value can be changed, otherwise it’s read-only.
//enumerable – if true, then listed in loops, otherwise not listed.
//configurable – if true, the property can be deleted and these attributes can be modified,
//                otherwise not.

//when create a property, usually all are true but it can be changed anytime

//Method "Object.getOwnPropertyDescriptor" allows to query the full info about a Property
// syntax ->  et descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);

//  obj -> The object to get information from.
//  propertyName -> The name of the property.
//  Returned value -> is a so-called “property descriptor” object:
//    it contains the value and all the flags.

let user = {
  name: "John"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

console.log( JSON.stringify(descriptor, null, 2 ) );
/* property descriptor:
{
  "value": "John",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/

//  Method Object.defineProperty
//  Object.defineProperty(obj, propertyName, descriptor)

//  obj, propertyName -> object and its property to apply the descriptor.
//  descriptor  ->  Property descriptor object to apply.

//  If the property exists, defineProperty updates its flags.
//  Otherwise, it creates the property with the given value and flags; in that case,
//  if a flag is not supplied, it is assumed false.

let user1 = {};

Object.defineProperty(user1, "name", {
  value: "John"
});

let descriptor1 = Object.getOwnPropertyDescriptor(user1, 'name');

console.log( JSON.stringify(descriptor1, null, 2 ) );
/*
{
  "value": "John",
  "writable": false,
  "enumerable": false,
  "configurable": false
}
 */

// Compare it with “normally created” user.name above:
//now all flags are falsy.
//If that’s not what we want then we’d better set them to true in descriptor.

// Non-writable++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//  Let’s make user.name non-writable (can’t be reassigned) by changing writable flag:

let user2 = {
  name: "John"
};

Object.defineProperty(user2, "name", {
  writable: false
});

 console.log( JSON.stringify(Object.getOwnPropertyDescriptor(user2, 'name')));
//  {"value":"John","writable":false,"enumerable":true,"configurable":true}
//  user2.name = "Pete"; // Error: Cannot assign to read only property 'name'

//  Now no one can change the name of our user,
//  unless they apply their own defineProperty to override ours.

//Errors appear only in strict mode
//In the non-strict mode, no errors occur when writing to non-writable properties and
//such. But the operation still won’t succeed.
//Flag-violating actions are just silently ignored in non-strict.

let user3 = { };

Object.defineProperty(user3, "name", {
  value: "John",
  // for new properties we need to explicitly list what's true
  enumerable: true,
  configurable: true
});

console.log(Object.getOwnPropertyDescriptor(user3, 'name')); // John
/*
{ value: 'John',
  writable: false,
  enumerable: true,
  configurable: true }
*/
//  user.name = "Petere"; // Error

//Non-enumerable++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Now let’s add a custom toString to user.
//a built-in toString for objects is non-enumerable, it does not show up in for..in.
//But if we add a toString of our own, then by default it shows up in for..in, like this:

let user4 = {
  name: "John",
  toString() {
    return this.name;
  }
};

// By default, both our properties are listed:
for (let key in user4) console.log(key); // name, toString

//set enumerable:false. Then it won’t appear in a for..in loop
Object.defineProperty(user4, "toString", {
  enumerable: false
});

// Now our toString disappears:
for (let key in user4) console.log(key); // name

//Non-enumerable properties are also excluded from Object.keys:
console.log(Object.keys(user4)); // name

//Non-configurable++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//The non-configurable flag (configurable:false) is sometimes preset for built-in objects
//and properties.

//A non-configurable property can not be deleted.
//For instance, Math.PI is non-writable, non-enumerable and non-configurable:

let descriptor2 = Object.getOwnPropertyDescriptor(Math, 'PI');

console.log( JSON.stringify(descriptor2, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
//or user unable to change the value of Math.PI or overwrite it.

//  Math.PI = 3; // Error

// delete Math.PI won't work either

//Making a property non-configurable is a one-way road.
// We cannot change it back with defineProperty.

//To be precise, non-configurability imposes several restrictions on defineProperty:
//  ->  Can’t change configurable flag.
//  ->  Can’t change enumerable flag.
//  ->  Can’t change writable: false to true (the other way round works).
//  ->  Can’t change get/set for an accessor property (but can assign them if absent).

//making user.name a “forever sealed” constant:
let user5 = { };

Object.defineProperty(user5, "name", {
  value: "John",
  writable: false,
  configurable: false
});

// won't be able to change user.name or its flags
// all this won't work:
//   user.name = "Pete"
//   delete user.name
//   defineProperty(user, "name", { value: "Pete" })

//  Object.defineProperty(user5, "name", {writable: true}); // Error

//“Non-configurable” doesn’t mean “non-writable”

//Notable exception: a value of non-configurable, but writable property can be changed.
//The idea of configurable: false is to prevent changes to property flags and its deletion,
//                          not changes to its value.

//Object.defineProperties+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//method Object.defineProperties(obj, descriptors) that allows to define many properties at once.
/*
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
*/

Object.defineProperties(user, {
  name: { value: "John", writable: false },
  surname: { value: "Smith", writable: false }
});

console.log(Object.getOwnPropertyDescriptor(user, 'name'));
/*{ value: 'John',
  writable: false,
  enumerable: true,
  configurable: true }*/
console.log(Object.getOwnPropertyDescriptor(user, 'surname'));
/*{ value: 'Smith',
  writable: false,
  enumerable: false,
  configurable: false }*/

//Object.getOwnPropertyDescriptors+++++++++++++++++++++++++++++++++++++++++++++++
//method Object.getOwnPropertyDescriptors(obj) To get all property descriptors at once.

//Together with Object.defineProperties it can be used as a “flags-aware” way of cloning an object:

//  let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));

//Normally when we clone an object, we use an assignment to copy properties, like this:
/*
for (let key in user) {
  clone[key] = user[key]
}*/

//…But that does not copy flags.
//So if we want a “better” clone then Object.defineProperties is preferred.

//Another difference is that for..in ignores symbolic properties,
//but Object.getOwnPropertyDescriptors returns all property descriptors including symbolic ones.

//Sealing an object globally++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Property descriptors work at the level of individual properties.

//There are also methods that limit access to the whole object:
//Object.preventExtensions(obj) -> Forbids the addition of new properties to the object.
//Object.seal(obj) -> Forbids adding/removing of properties.
//                    Sets configurable: false for all existing properties.
//Object.freeze(obj) -> Forbids adding/removing/changing of properties.
//                       Sets configurable: false, writable: false for all existing properties.

//And also there are tests for them:

//Object.isExtensible(obj) -> Returns false if adding properties is forbidden, otherwise true.
//Object.isSealed(obj) -> Returns true if adding/removing properties is forbidden,
//                        and all existing properties have configurable: false.
//Object.isFrozen(obj) -> Returns true if adding/removing/changing properties is forbidden,
//                        and all current properties are configurable: false, writable: false.
