//F.prototype++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Remember, new objects can be created with a constructor function, like new F().
//If F.prototype is an object, then the new operator uses it to set [[Prototype]] for the new object.

//JavaScript had prototypal inheritance from the beginning.
//It was one of the core features of the language.

//But in the old times, there was no direct access to it.
//The only thing that worked reliably was a "prototype" property of the constructor function,
//described in this chapter. So there are many scripts that still use it.

//Please note that Function .prototype here means a regular property named "prototype" on F.
//It sounds something similar to the term “prototype”,
//but here we really mean a regular property with this name.

let animal = {
  eats: true
};

function Rabbit(name) {
  this.name = name;
}

Rabbit.prototype = animal;

let rabbit = new Rabbit("White Rabbit"); //  rabbit.__proto__ == animal

console.log( rabbit.eats ); // true
console.log( Rabbit.eats); //undefineds
console.log( Rabbit); //[Function: Rabbit]
//Setting Rabbit.prototype = animal literally states the following:
//"When a new Rabbit is created, assign its [[Prototype]] to animal".

//Rabbit -> prototype -> animal{eats:true} <- [Prototype] <- rabbit{name: "white Rabbit"}

//F.prototype only used at new F time
//F.prototype property is only used when new F is called,
//it assigns [[Prototype]] of the new object.

//If, after the creation, F.prototype property changes (F.prototype = <another object>),
//then new objects created by new F will have another object as [[Prototype]],
//but already existing objects keep the old one.

//Default F.prototype, constructor property+++++++++++++++++++++++++++++++++++++++++++++
//Every function has the "prototype" property even if we don’t supply it.

//The default "prototype" is an object with the only property constructor that
//points back to the function itself.

function Rabbit() {}

/* default prototype
Rabbit.prototype = { constructor: Rabbit };
*/

//We can check it:
function Rabbit1() {}
// by default:
// Rabbit1.prototype = { constructor: Rabbit1 }

console.log( Rabbit1.prototype.constructor == Rabbit1 ); // true

//Rabbit1{prototye} <--> default "prototype" {constructor}
// so is a call back

//Naturally, if we do nothing,
//the constructor property is available to all rabbits through [[Prototype]]:

function Rabbit2() {}
// by default:
// Rabbit.prototype = { constructor: Rabbit }

let rabbit2 = new Rabbit2(); // inherits from {constructor: Rabbit}
// rabbit2 = Rabbit2().constructor
// rabbit2 = Rabbit2.prototype
console.log(rabbit2.constructor == Rabbit2); // true (from prototype)
//console.log(Rabbit2.prototype.constructor == Rabbit2)

//can use constructor property to create a new object using the same constructor as the existing one.

function Rabbit3(name) {
  this.name = name;
  console.log(name);
}

let rabbit3 = new Rabbit3("White Rabbit");

let rabbit4 = new rabbit3.constructor("Black Rabbit");

//That’s handy when we have an object, don’t know which constructor was used for it
//(e.g. it comes from a 3rd party library), and we need to create another one of the same kind.

//But probably the most important thing about "constructor" is that…
// …JavaScript itself does not ensure the right "constructor" value.

//Yes, it exists in the default "prototype" for functions, but that’s all.
//What happens with it later – is totally on us.

//In particular, if we replace the default prototype as a whole,
//then there will be no "constructor" in it.

function Rabbit5() {}

Rabbit5.prototype = {
  jumps: true
};

let rabbit5 = new Rabbit5();
console.log(rabbit5.constructor === Rabbit5); // false because prototype content jumps:true unless empty
console.log(rabbit5.constructor ); //[Function: Object]

//So, to keep the right "constructor" we can choose to add/remove properties to
//the default "prototype" instead of overwriting it as a whole:

function Rabbit6() {}

// Not overwrite Rabbit.prototype totally
// just add to it
Rabbit6.prototype.jumps = true
// the default Rabbit.prototype.constructor is preserved

//Or, alternatively, recreate the constructor property manually:
Rabbit6.prototype = {
  jumps: true,
  constructor: Rabbit6
}; // manually set Rabbit6.prototype.constructor = Rabbit6

console.log(Rabbit6.constructor == Rabbit6); //true

// now constructor is also correct, because we added it

//TASK+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+Changing "prototype"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//In the code below we create new Rabbit, and then try to modify its prototype.

//In the start, we have this code:
function Rabbit8() {}
Rabbit8.prototype = {
  eats: true
};

let rabbit8 = new Rabbit8();

console.log( rabbit8.eats ); // true

//We added one more string (emphasized). What will alert show now?

Rabbit8.prototype = {};

console.log( rabbit8.eats ); // true
//The assignment to Rabbit.prototype sets up [[Prototype]] for new objects,
//but it does not affect the existing ones.

//…And if the code is like this (replaced one line)?

let rabbit9 = new Rabbit8();

Rabbit8.prototype.eats = false;

console.log( rabbit9.eats ); // false
//Objects are assigned by reference. The object from Rabbit.prototype is not duplicated,
//it’s still a single object referenced both by Rabbit.prototype and by the [[Prototype]] of rabbit.

//So when we change its content through one reference, it is visible through the other one.

//And like this (replaced one line)?

let rabbit10 = new Rabbit8();

delete rabbit10.eats;

console.log( rabbit10.eats ); // false
//All delete operations are applied directly to the object.
//Here delete rabbit.eats tries to remove eats property from rabbit,
//but it doesn’t have it. So the operation won’t have any effect.

//The last variant:
let rabbit11 = new Rabbit8();

delete Rabbit8.prototype.eats;

console.log( rabbit11.eats ); // undefined
//The property eats is deleted from the prototype, it doesn’t exist any more.

//Create an object with the same constructor++++++++++++++++++++++++++++++++++++++++
//Imagine, we have an arbitrary object obj, created by a constructor function –
//we don’t know which one, but we’d like to create a new object using it.

//Can we do it like that?

//  let obj2 = new obj.constructor();
//Give an example of a constructor function for obj which lets such code work right.
//And an example that makes it work wrong.

//We can use such approach if we are sure that "constructor" property has the correct value.
//For instance, if we don’t touch the default "prototype", then this code works for sure:

function User(name) {
  this.name = name;
}

let user = new User('John');
let user2 = new user.constructor('Pete');

console.log( user2.name ); // Pete (worked!)
console.log( user.name ); // john (worked!)

//It worked, because User.prototype.constructor == User.

//…But if someone, so to speak,
//overwrites User.prototype and forgets to recreate constructor to reference User,
//then it would fail.

User.prototype = {}; // (*) set user default prototype to null

let user3 = new User('John'); //call to default prototye of User
let user4 = new user3.constructor('Pete'); //call to constructor of default prototype

console.log( user4.name ); // undefined
console.log( user3.name ); // john

//Why user4.name is undefined?

//Here’s how new user.constructor('Pete') works:

//->  First, it looks for constructor in user3. Nothing.
//->  Then it follows the prototype chain. The prototype of user is User3.prototype,
//    and it also has nothing.
//->  The value of User3.prototype is a plain object {}, its prototype is Object.prototype.
//    And there is Object.prototype.constructor == Object. So it is used.

//->  At the end, we have let user4 = new Object('Pete').
//    The built-in Object constructor ignores arguments,
//    it always creates an empty object, similar to let user4 = {},
//    that’s what we have in user4 after all.
