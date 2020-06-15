//Object copying, references+++++++++++++++++++++++++++++++++++++++++++++++++++++
// fundamental differences of objects vs primitives is that
//they are stored and copied “by reference”.

//Primitive values: strings, numbers, booleans – are assigned/copied “as a whole value”.
let message = "Hello!";
let phrase = message;

//A variable stores not the object itself,
//but its “address in memory”, in other words “a reference” to it.

//object is stored somewhere in memory. And the variable user has a “reference” to it.
//When an object variable is copied – the reference is copied, the object is not duplicated.
let user = { name: "John" };
let admin = user; // copy the reference

//Now we have two variables, each one with the reference to the same object:
admin.name = 'Pete'; // changed by the "admin" reference
console.log(user.name); // 'Pete', changes are seen from the "user" reference

//there is only one object. As if we had a cabinet with two keys and
//used one of them (admin) to get into it.
//Then, if we later use another key (user) we can see changes.

//Comparison by reference++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Two objects are equal only if they are the same object.
let a = {};
let b = a; // copy the reference
console.log( a == b ); // true, both variables reference the same object
console.log( a === b ); // true

// two independent objects are not equal, even though both are empty
let c = {};
let d = {}; // two independent objects
console.log( c == d ); // false

//comparisons like obj1 > obj2 or for a comparison against a primitive obj == 5,
//objects are converted to primitives

//Cloning and merging, Object.assign+++++++++++++++++++++++++++++++++++++++++++++++
//duplicate an object? Create an independent copy, a clone? not reference?
//create a new object and replicate the structure of the existing one by iterating over
//its properties and copying them on the primitive level.

let user1 = {
  name: "John",
  age: 30
};
let clone = {}; // the new empty object
// let's copy all user properties into it
for (let key in user1) {
  clone[key] = user1[key];
}
// now clone is a fully independent object with the same content
clone.name = "Pete"; // changed the data in it
console.log( user1.name ); // still John in the original object

//use object.assign as above
//Object.assign(dest, [src1, src2, src3...])

// dest :The first argument dest is a target object.
//Further arguments src1, ..., srcN (can be as many as needed) are source objects.
//It copies the properties of all source objects src1, ..., srcN into the target dest.
//In other words, properties of all arguments starting from the second are copied into the first object.
//The call returns dest.

let user2 = { name: "John" };
let permissions1 = { canView: true };
let permissions2 = { canEdit: true };
// copies all properties from permissions1 and permissions2 into user
Object.assign(user2, permissions1, permissions2);
// now user2 = { name: "John", canView: true, canEdit: true }

//If the copied property name already exists, it gets overwritten:
let user3 = { name: "John" };
Object.assign(user3, { name: "Pete" });
console.log(user3.name); // now user = { name: "Pete" }

//Object.assign to replace for..in loop for simple cloning:
let user4 = {
  name: "John",
  age: 30
};
let clone1 = Object.assign({}, user4);
console.log(clone1); // {  name: "John", age: 30}
//It copies all properties of user into the empty object and returns it.

//Nested cloning+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//we assumed that all properties of user are primitive.
//But properties can be references to other objects. What to do with them?
let user4 = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};
console.log( user4.sizes.height ); // 182

//it’s not enough to copy clone.sizes = user.sizes, because the user4.sizes is an object,
//it will be copied by reference. So clone and user will share the same sizes:

let clone2 = Object.assign({}, user4);
console.log( user4.sizes === clone2.sizes ); // true, same object

// user and clone share sizes
user4.sizes.width++;       // change a property from one place
console.log(clone2.sizes.width); // 51, see the result from the other one

//To fix that, we should use the cloning loop that examines each value of user[key] and,
//if it’s an object, then replicate its structure as well.
//That is called a “deep cloning”.
