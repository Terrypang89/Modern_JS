//Prototype methods, objects without __proto__

//In the first chapter of this section,
//we mentioned that there are modern methods to setup a prototype.

//The __proto__ is considered outdated and somewhat deprecated
//(in browser-only part of the JavaScript standard).

//The modern methods are:
//Object.create(proto[, descriptors]) –
//  creates an empty object with given proto as [[Prototype]] and optional property descriptors.
//Object.getPrototypeOf(obj) –
//  returns the [[Prototype]] of obj.
//Object.setPrototypeOf(obj, proto) –
//  sets the [[Prototype]] of obj to proto.

//These should be used instead of __proto__.
let animal = {
  eats: true
};

// create a new object with animal as a prototype
let rabbit = Object.create(animal);
console.log(rabbit.eats); // true
console.log(Object.getPrototypeOf(rabbit) === animal); // true

Object.setPrototypeOf(rabbit, {}); // change the prototype of rabbit to {}

//Object.create has an optional second argument: property descriptors.
//We can provide additional properties to the new object there, like this:

let animal1 = {
  eats: true
};

let rabbit1 = Object.create(animal1, {
  jumps: {
    value: true
  }
});

console.log(rabbit1.jumps); // true

//The descriptors are in the same format as described "Very plain" objects
//As we know, objects can be used as associative arrays to store key/value pairs.

//…But if we try to store user-provided keys in it (for instance, a user-entered dictionary),
//we can see an interesting glitch: all keys work fine except "__proto__".

///Check out the example:in the chapter Property flags and descriptors.

//We can use Object.create to perform an object cloning more powerful than
//copying properties in for..in:

let clone = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

//This call makes a truly exact copy of obj, including all properties: enumerable and non-enumerable,
//data properties and setters/getters – everything, and with the right [[Prototype]].

//Brief history+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//If we count all the ways to manage [[Prototype]], there are a lot!
//Many ways to do the same thing!
//Why?

//That’s for historical reasons.
//The "prototype" property of a constructor function has worked since very ancient times.
//Later, in the year 2012, Object.create appeared in the standard.

//It gave the ability to create objects with a given prototype,
//but did not provide the ability to get/set it. So browsers implemented the
//non-standard __proto__ accessor that allowed the user to get/set a prototype at any time.

//Later, in the year 2015, Object.setPrototypeOf and Object.getPrototypeOf were added
//to the standard, to perform the same functionality as __proto__.
//As __proto__ was de-facto implemented everywhere, it was kind-of deprecated and
//made its way to the Annex B of the standard, that is: optional for non-browser environments.

//As of now we have all these ways at our disposal.

//Why was __proto__ replaced by the functions getPrototypeOf/setPrototypeOf?
//That’s an interesting question, requiring us to understand why __proto__ is bad.
//Read on to get the answer.

//"Very plain" objects+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//As we know, objects can be used as associative arrays to store key/value pairs.

//…But if we try to store user-provided keys in it (for instance,
//a user-entered dictionary), we can see an interesting glitch:
//all keys work fine except "__proto__".

//Check out the example:
let obj = {};

let key = prompt("What's the key?", "__proto__");
obj[key] = "some value";

console.log(obj[key]); // [object Object], not "some value"!

//Here, if the user types in __proto__, the assignment is ignored!
//That shouldn’t surprise us. The __proto__ property is special:
//it must be either an object or null. A string can not become a prototype.

//But we didn’t intend to implement such behavior, right?
//We want to store key/value pairs, and the key named "__proto__" was not properly saved.
//So that’s a bug!

//Here the consequences are not terrible. But in other cases we may be assigning object values,
//and then the prototype may indeed be changed.
//As a result, the execution will go wrong in totally unexpected ways.

//What’s worse – usually developers do not think about such possibility at all.
//That makes such bugs hard to notice and even turn them into vulnerabilities,
//especially when JavaScript is used on server-side.

//Unexpected things also may happen when assigning to toString,
//which is a function by default, and to other built-in methods.

//How can we avoid this problem?

//First, we can just switch to using Map for storage instead of plain objects,
//then everything’s fine.

//But Object can also serve us well here,
//because language creators gave thought to that problem long ago.

//__proto__ is not a property of an object, but an accessor property of Object.prototype:

//Object {} -> [prototype] -> Object.prototype { get __proto__: function set __proto__:function } <- [[Prototype]] <- Obj {}

//So, if obj.__proto__ is read or set, the corresponding getter/setter is called from its prototype,
// and it gets/sets [[Prototype]].

//As it was said in the beginning of this tutorial section:
//__proto__ is a way to access [[Prototype]], it is not [[Prototype]] itself.

//Now, if we intend to use an object as an associative array and be free of such problems,
//we can do it with a little trick:

let obj1 = Object.create(null);

let key1 = prompt("What's the key?", "__proto__");
obj1[key1] = "some value";

console.log(obj1[key1]); // "some value"

//Object.create(null) creates an empty object without a prototype ([[Prototype]] is null):

// obj1{} -> [[Prototype]] -> null

//So, there is no inherited getter/setter for __proto__.
//Now it is processed as a regular data property, so the example above works right.

//We can call such objects “very plain” or “pure dictionary” objects,
//because they are even simpler than the regular plain object {...}.

//A downside is that such objects lack any built-in object methods, e.g. toString:
let obj2 = Object.create(null);

console.log(obj2); // Error (no toString)
//…But that’s usually fine for associative arrays.

//Note that most object-related methods are Object.something(...), like Object.keys(obj) –
//they are not in the prototype, so they will keep working on such objects:

let chineseDictionary = Object.create(null);
chineseDictionary.hello = "你好";
chineseDictionary.bye = "再见";

console.log(Object.keys(chineseDictionary)); // hello,bye
