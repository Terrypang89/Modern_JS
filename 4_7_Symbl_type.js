//Symbol type+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//By specification, object property keys may be either of string type, or of symbol type.
//Not numbers, not booleans, only strings or symbols, these two types.

//Symbols+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//A “symbol” represents a unique identifier.
//A value of this type can be created using Symbol():

// id is a new symbol
let id = Symbol();

// give symbol a description (also called a symbol name), mostly useful for debugging purposes:
// id is a symbol with the description "id"
let id1 = Symbol("id");

//Symbols are guaranteed to be unique. Even if we create many symbols with the same description,
//they are different values. The description is just a label that doesn’t affect anything.

//here are two symbols with the same description – they are not equal:
let id2 = Symbol("id");
let id3 = Symbol("id");

console.log(id2 == id3); // false

//+Symbols don’t auto-convert to a string+
//Most values in JavaScript support implicit conversion to a string. For instance,
//we can alert almost any value, and it will work. \
//Symbols are special. They don’t auto-convert.
let id4 = Symbol("id");
console.log(id4); // TypeError: Cannot convert a Symbol value to a string

//That’s a “language guard” against messing up, because strings and symbols are fundamentally
//different and should not accidentally convert one into another.

//If we really want to show a symbol, we need to explicitly call .toString() on it, like here:

let id5 = Symbol("id");
console.log(id5.toString()); // Symbol(id), now it works

//Or get symbol.description property to show the description only:

let id6 = Symbol("id");
console.log(id6.description); // id

//“Hidden” properties+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Symbols allow us to create “hidden” properties of an object,
//that no other part of code can accidentally access or overwrite.

// if we’re working with user objects, that belong to a third-party code.
//We’d like to add identifiers to them.

let user = { // belongs to another code
  name: "John"
};
let id7 = Symbol("id");
user[id7] = 1;
console.log( user[id7] ); // we can access the data using the symbol as the key

//benefit of using Symbol("id") over a string "id"?
//As user objects belongs to another code, and that code also works with them,
//we shouldn’t just add any fields to it. That’s unsafe.
//But a symbol cannot be accessed accidentally, the third-party code probably won’t even see it,
//so it’s probably all right to do.

//imagine that another script wants to have its own identifier inside user,
//for its own purposes. That may be another JavaScript library,
//so that the scripts are completely unaware of each other.

//Then that script can create its own Symbol("id"), like this:
// ...
let id8 = Symbol("id");
// user1[id8] = "Their id value";
//no conflict between our and their identifiers, because symbols are always different,
//even if they have the same name.

//But if we used a string "id" instead of a symbol for the same purpose,
//then there would be a conflict:

let user2 = { name: "John" };
// Our script uses "id" property
user2.id = "Our id value";
// ...Another script also wants "id" for its purposes...
user2.id = "Their id value"
// Boom! overwritten by another script!

//Symbols in a literal+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//If we want to use a symbol in an object literal {...}, we need square brackets around it.

let id9 = Symbol("id");
let user3 = {
  name: "John",
  [id9]: 123 // not "id: 123"
};
//That’s because we need the value from the variable id as the key, not the string “id”.

//+Symbols are skipped by for…in+

let id10 = Symbol("id10");
let user4 = {
  name: "John",
  age: 30,
  [id10]: 123
};
for (let key in user4) console.log(key); // name, age (no symbols)
// the direct access by the symbol works
console.log( "Direct: " + user4[id] );

//Object.keys(user) also ignores them.
//That’s a part of the general “hiding symbolic properties” principle.
//If another script or a library loops over our object,
//it won’t unexpectedly access a symbolic property.

//In contrast, Object.assign copies both string and symbol properties:
let id11 = Symbol("id");
let user5 = {
  [id11]: 123
};

let clone = Object.assign({}, user5);
console.log( clone[id11] ); // 123

//There’s no paradox here. That’s by design.
//The idea is that when we clone an object or merge objects,
//we usually want all properties to be copied (including symbols like id).

//Global symbols++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//usually all symbols are different, even if they have the same name.
//But sometimes we want same-named symbols to be same entities.

//use lobal symbol registry. We can create symbols in it and access them later,
//and it guarantees that repeated accesses by the same name return exactly the same symbol.

//In order to read (create if absent) a symbol from the registry, use Symbol.for(key).

//That call checks the global registry, and if there’s a symbol described as key,
//then returns it, otherwise creates a new symbol Symbol(key) and
//stores it in the registry by the given key.
// read from the global registry
let id12 = Symbol.for("id"); // if the symbol did not exist, it is created

// read it again (maybe from another part of the code)
let idAgain = Symbol.for("id");

// the same symbol
console.log( id12 === idAgain ); // true

//Symbols inside the registry are called global symbols. If we want an application-wide symbol,
//accessible everywhere in the code – that’s what they are for.

//Symbol.keyFor++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//For global symbols, not only Symbol.for(key) returns a symbol by name,
//but there’s a reverse call: Symbol.keyFor(sym),
//that does the reverse: returns a name by a global symbol.

// get symbol by name
let sym = Symbol.for("name");
let sym2 = Symbol.for("id");

// get name by symbol
console.log( Symbol.keyFor(sym) ); // name
console.log( Symbol.keyFor(sym2) ); // id

//The Symbol.keyFor internally uses the global symbol registry to look up the key for the symbol.
//So it doesn’t work for non-global symbols. If the symbol is not global,
//it won’t be able to find it and returns undefined.

let globalSymbol = Symbol.for("name");
let localSymbol = Symbol("name");

console.log( Symbol.keyFor(globalSymbol) ); // name, global symbol
console.log( Symbol.keyFor(localSymbol) ); // undefined, not global

console.log( localSymbol.description ); // name

//System symbols+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//There exist many “system” symbols that JavaScript uses internally,
//and we can use them to fine-tune various aspects of our objects.

//They are listed in the specification in the Well-known symbols table:

//Symbol.hasInstance
//Symbol.isConcatSpreadable
//Symbol.iterator
//Symbol.toPrimitive
//…and so on.
//For instance, Symbol.toPrimitive allows us to describe object to primitive conversion.

//Other symbols will also become familiar when we study the corresponding language features.
