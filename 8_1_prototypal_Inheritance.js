//Prototypal inheritance+++++++++++++++++++++++++++++++++++++++++++++++++++++++

//sometimes we want to take something and extend it

//For instance, we have a user object with its properties and methods,
//and want to make admin and guest as slightly modified variants of it.
//We’d like to reuse what we have in user, not copy/reimplement its methods,
//just build a new object on top of it.

//Prototypal inheritance is a language feature that helps in that.

//[[Prototype]]++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//In JavaScript, objects have a special hidden property [[Prototype]]
//(as named in the specification), that is either null or references another object.
//That object is called “a prototype”:

//The prototype is a little bit “magical”.
//When we want to read a property from object, and it’s missing,
//JavaScript automatically takes it from the prototype.
//In programming, such thing is called “prototypal inheritance”.
//Many cool language features and programming techniques are based on it.

//The property [[Prototype]] is internal and hidden, but there are many ways to set it.

// special name __proto__, is One of them:

let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

rabbit.__proto__ = animal;
console.log(rabbit); //{ jumps: true }

//__proto__ is a historical getter/setter for [[Prototype]]
//__proto__ is not the same as [[Prototype]]. It’s a getter/setter for it.

//It exists for historical reasons.
//In modern language it is replaced with functions Object.getPrototypeOf/Object.setPrototypeOf
//that also get/set the prototype. .

//By the specification, __proto__ must only be supported by browsers,
//but in fact all environments including server-side support it.
//For now, as __proto__ notation is a little bit more intuitively obvious

//If we look for a property in rabbit, and it’s missing,
//JavaScript automatically takes it from animal.

//// we can find both properties in rabbit now:
console.log( rabbit.eats ); // true (**)
console.log( rabbit.jumps ); // true

//Here the line (*) sets animal to be a prototype of rabbit.

//Then, when alert tries to read property rabbit.eats (**), it’s not in rabbit,
//so JavaScript follows the [[Prototype]] reference and finds it in animal (look from the bottom up):

//can say that "animal is the prototype of rabbit" or "rabbit prototypically inherits from animal".

//So if animal has a lot of useful properties and methods,
//then they become automatically available in rabbit.
//Such properties are called “inherited”.

//If we have a method in animal, it can be called on rabbit:

let animal1 = {
  eats: true,
  walk() {
    console.log("Animal walk");
  }
};

let rabbit1 = {
  jumps: true,
  __proto__: animal1
};

// walk is taken from the prototype
rabbit1.walk(); // Animal walk
console.log(rabbit1);

//The method is automatically taken from the prototype
//The prototype chain can be longer:

let animal2 = {
  eats: true,
  walk() {
    console.log("Animal walk");
  }
};

let rabbit2 = {
  jumps: true,
  __proto__: animal2
};

let longEar2 = {
  earLength: 10,
  __proto__: rabbit2
};

// walk is taken from the prototype chain
longEar2.walk(); // Animal walk
console.log(longEar2.jumps); // true (from rabbit)

//There are only two limitations:

//  ->  The references can’t go in circles.
//      JavaScript will throw an error if we try to assign __proto__ in a circle.
//  ->  The value of __proto__ can be either an object or null. Other types are ignored.

//Also it may be obvious, but still: there can be only one [[Prototype]].
//An object may not inherit from two others.

//Writing doesn’t use prototype++++++++++++++++++++++++++++++++++++++++++++++++++

//The prototype is only used for reading properties.
//Write/delete operations work directly with the object.

let animal3 = {
  eats: true,
  walk() {
    /* this method won't be used by rabbit */
  }
};

let rabbit3 = {
  __proto__: animal3
};

rabbit3.walk = function() {
  console.log("Rabbit! Bounce-bounce!");
};

rabbit3.walk(); // Rabbit! Bounce-bounce!
//rabbit.walk() call finds the method immediately in the object and executes it,
//without using the prototype:

//Accessor properties are an exception, as assignment is handled by a setter function.
//So writing to such a property is actually the same as calling a function.

let user4 = {
  name: "John",
  surname: "Smith",

  set fullName(value) { //use setter
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() { //use getter
    return `${this.name} ${this.surname}`;
  }
};

let admin4 = {
  __proto__: user4,
  isAdmin: true
};

//getter triggers
console.log(admin4.fullName); // John Smith (*)

// setter triggers!
admin4.fullName = "Alice Cooper"; // (**)

// use getter triggers after setter getter
console.log(admin4.fullName); //Alice Cooper

//Here in the line (*) the property admin.fullName has a getter in the prototype user,
//so it is called. And in the line (**) the property has a setter in the prototype, so it is called.

//The value of “this”++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// QUESTION:
//what’s the value of this inside set fullName(value)?
//Where are the properties this.name and this.surname written: into user or admin?

//answer is simple: "this" is not affected by prototypes at all

//No matter where the method is found: in an object or its prototype.
//In a method call, this is always the object before the dot.

//the setter call admin.fullName= uses admin as this, not user.

//That is actually a super-important thing, because we may have a big object with many methods,
//and have objects that inherit from it. And when the inheriting objects run the inherited methods,
//they will modify only their own states, not the state of the big object.

//For instance, here animal represents a “method storage”, and rabbit makes use of it.
//The call rabbit.sleep() sets this.isSleeping on the rabbit object:

// animal has methods
let animal5 = {
  walk() {
    if (!this.isSleeping) {
      console.log(`I walk`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit5 = {
  name: "White Rabbit",
  __proto__: animal5
};

rabbit5.walk(); // rabbit to walk() through _proto_

rabbit5.sleep(); // modifies rabbit.isSleeping to be true

console.log(rabbit5.isSleeping); // true as
console.log(animal5.isSleeping); // undefined (no such property in the prototype)
animal5.sleep(); // set animal.isSleeping to be true

console.log(animal5.isSleeping); // true as it has been defined.

//If we had other objects, like bird, snake, etc., inheriting from animal,
//they would also gain access to methods of animal.
//But this in each method call would be the corresponding object,
//evaluated at the call-time (before dot), not animal.
//So when we write data into this, it is stored into these objects.

//As a result, methods are shared, but the object state is not.

//for…in loop++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The for..in loop iterates over inherited properties too.
let animal6 = {
  eats: true
};

let rabbit6 = {
  jumps: true,
  __proto__: animal
};

// Object.keys only returns own keys
console.log(Object.keys(rabbit6)); // jumps

// for..in loops over both own and inherited keys
for(let prop in rabbit6) console.log(prop); // jumps, then eats

//If that’s not what we want, and we’d like to exclude inherited properties,
//there’s a built-in method obj.hasOwnProperty(key):
//it returns true if obj has its own (not inherited) property named key.

let animal7 = {
  eats: true
};

let rabbit7 = {
  jumps: true,
  __proto__: animal7
};

for(let prop in rabbit7) {
  let isOwn = rabbit7.hasOwnProperty(prop); //get its own property, jumps

  if (isOwn) {
    console.log(`Our: ${prop} -> ` + isOwn); // Our: jumps
  } else {
    console.log(`Inherited: ${prop} -> ` + isOwn); // Inherited: eats
  }
}

//Here we have the following inheritance chain: rabbit inherits from animal,
//that inherits from Object.prototype (because animal is a literal object {...},
//so it’s by default), and then null above it:

//Note, there’s one funny thing.
//Where is the method rabbit.hasOwnProperty coming from? We did not define it.
//Looking at the chain we can see that the method is provided by Object.prototype.hasOwnProperty.
//In other words, it’s inherited.

//…But why does hasOwnProperty not appear in the for..in loop like eats and jumps do,
//if for..in lists inherited properties?

//The answer is simple: it’s not enumerable.
//Just like all other properties of Object.prototype, it has enumerable:false flag.
//And for..in only lists enumerable properties.
//That’s why it and the rest of the Object.prototype properties are not listed.

//Almost all other key/value-getting methods ignore inherited properties
//Almost all other key/value-getting methods, such as Object.keys,
//Object.values and so on ignore inherited properties.

//They only operate on the object itself. Properties from the prototype are not taken into account.

//TASK+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//+Working with prototype+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Here’s the code that creates a pair of objects, then modifies them.

let animal8 = {
  jumps: null
};
let rabbit8 = {
  __proto__: animal8,
  jumps: true
};

console.log( rabbit8.jumps ); // ? (1) true

delete rabbit8.jumps;

console.log( rabbit8.jumps ); // ? (2) null

delete animal8.jumps;

console.log( rabbit8.jumps ); // ? (3) undefined

//+Searching algorithm+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The task has two parts.
let head = {
  glasses: 1
};

let table = {
  pen: 3
};

let bed = {
  sheet: 1,
  pillow: 2
};

let pockets = {
  money: 2000
};

//Use __proto__ to assign prototypes in a way that any property lookup will follow the path:
//pockets → bed → table → head. For instance, pockets.pen should be 3 (found in table), and
//bed.glasses should be 1 (found in head).

let head1 = {
  glasses: 1
};

let table1 = {
  pen: 3,
  __proto__:head1
};

let bed1 = {
  sheet: 1,
  pillow: 2,
  __proto__:table1
};

let pockets1 = {
  money: 2000,
  __proto__: bed1
};

console.log( pockets1.pen ); // 3
console.log( bed1.glasses ); // 1
console.log( table1.money ); // undefined

//Answer the question: is it faster to get glasses as pockets.glasses or head.glasses?
//Benchmark if needed.

//In modern engines, performance-wise,
//there’s no difference whether we take a property from an object or its prototype.
//They remember where the property was found and reuse it in the next request.

//For instance, for pockets.glasses they remember where they found glasses (in head),
//and next time will search right there.
//They are also smart enough to update internal caches if something changes,
//so that optimization is safe.

//+Where does it write?+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//We have rabbit inheriting from animal.

//If we call rabbit.eat(), which object receives the full property: animal or rabbit?
let animal9 = {
  eat() {
    this.full = true;
  }
};

let rabbit9 = {
  __proto__: animal9
};
rabbit9.eat(); // rabbit9 receive full property

//That’s because this is an object before the dot, so rabbit.eat() modifies rabbit.
//Property lookup and execution are two different things.
//The method rabbit.eat is first found in the prototype, then executed with this=rabbit.

//+Why are both hamsters full?+++++++++++++++++++++++++++++++++++++++++++++++++++++
//We have two hamsters: speedy and lazy inheriting from the general hamster object.

//When we feed one of them, the other one is also full. Why? How can we fix it?

let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
  /*
  eat(food) {
   // assign to this.stomach instead of this.stomach.push to fix issue
   this.stomach = [food];
  }
  */
};

let speedy = {
  __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// This one found the food
speedy.eat("apple");
console.log( speedy.stomach ); // apple

// This one also has it, why? fix please.
console.log( lazy.stomach ); // apple

//speedy.eat("apple").

//The method speedy.eat is found in the prototype (=hamster),
//then executed with this=speedy (the object before the dot).

//Then this.stomach.push() needs to find stomach property and call push on it.
//It looks for stomach in this (=speedy), but nothing found.

//Then it follows the prototype chain and finds stomach in hamster.

//Then it calls push on it, adding the food into the stomach of the prototype.

//So all hamsters share a single stomach!

//Both for lazy.stomach.push(...) and speedy.stomach.push(),
//the property stomach is found in the prototype (as it’s not in the object itself),
//then the new data is pushed into it.

let hamster1 = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy1 = {
  __proto__: hamster1,
  stomach: []
};

let lazy1 = {
  __proto__: hamster1,
  stomach: []
};

// Speedy one found the food
speedy1.eat("apple");
console.log( speedy1.stomach ); // apple

// Lazy one's stomach is empty
console.log( lazy1.stomach ); // <nothing>
