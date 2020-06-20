//Object to primitive conversion+++++++++++++++++++++++++++++++++++++++++++++++++

//What happens when objects are added obj1 + obj2, subtracted obj1 - obj2 or printed using alert(obj)?
//objects are auto-converted to primitives, and then the operation is carried out.

//For Object conversion to primitives:
//  All objects are true in a boolean context. There are only numeric and string conversions.
//  The numeric conversion happens when we subtract objects or apply mathematical functions.
//    For instance, Date objects (to be covered in the chapter Date and time) can be subtracted,
//    and the result of date1 - date2 is the time difference between two dates.
//  As for the string conversion – it usually happens when we output an object like alert(obj) and
//    in similar contexts.

//ToPrimitives++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//We can fine-tune string and numeric conversion, using special object methods.
//There are three variants of type conversion, so-called “hints”,

//+"string"+
//For an object-to-string conversion,
//when we’re doing an operation on an object that expects a string, like alert:
// output
//console.log(obj);

// using object as a property key
//let anotherObj[obj] = 123;

//+"number"+
//For an object-to-number conversion, like when we’re doing maths:

// explicit conversion
//  let num = Number(obj);

// maths (except binary plus)
//  let n = +obj; // unary plus
//  let delta = date1 - date2;

// less/greater comparison
//  let greater = user1 > user2;

//+"default"+
//Occurs in rare cases when the operator is “not sure” what type to expect.

//For instance, binary plus + can work both with strings (concatenates them) and numbers (adds them),
//so both strings and numbers would do. So if the a binary plus gets an object as an argument,
//it uses the "default" hint to convert it.

//if an object is compared using == with a string, number or a symbol,
//it’s also unclear which conversion should be done, so the "default" hint is used.

// binary plus uses the "default" hint
//  let total = obj1 + obj2;

// obj == number uses the "default" hint
//  if (user == 1) { ... };

//The greater and less comparison operators, such as < >, can work with both strings and numbers too.
//Still, they use the "number" hint, not "default". That’s for historical reasons.

//To do the conversion, JavaScript tries to find and call three object methods:

//Call obj[Symbol.toPrimitive](hint) –
//  the method with the symbolic key Symbol.toPrimitive (system symbol), if such method exists,
// Otherwise if hint is "string"
//  try obj.toString() and obj.valueOf(), whatever exists.
//Otherwise if hint is "number" or "default"
//  try obj.valueOf() and obj.toString(), whatever exists.

//Symbol.toPrimitive++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//a built-in symbol named Symbol.toPrimitive that should be used to name the conversion method

//obj[Symbol.toPrimitive] = function(hint) {
  // must return a primitive value
  // hint = one of "string", "number", "default"
//};

//using user object implements it
let user = {
  name: "John",
  money: 1000,
  [Symbol.toPrimitive](hint) {
    console.log(`hint: ${hint}`);
    return hint == "string" ? `{name: "${this.name}"}` : this.money;
  }
};
// conversions demo:
console.log(user); // hint: string -> {name: "John"}
console.log(+user); // hint: number -> 1000
console.log(user + 500); // hint: default -> 1500

//user becomes a self-descriptive string or a money amount depending on the conversion.
//The single method user[Symbol.toPrimitive] handles all conversion cases.

//toString/valueOf++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Methods toString and valueOf come from ancient times.
//They are not symbols (symbols did not exist that long ago),
//but rather “regular” string-named methods.
//They provide an alternative “old-style” way to implement the conversion

//If there’s no Symbol.toPrimitive then JavaScript tries to find them and try in the order:
//  toString -> valueOf for “string” hint.
//  valueOf -> toString otherwise.

//These methods must return a primitive value. If toString or valueOf returns an object,
//then it’s ignored (same as if there were no method).

//By default, a plain object has following toString and valueOf methods:
//  The toString method returns a string "[object Object]".
//  The valueOf method returns the object itself.

let user1 = {name: "John"};

console.log(user1); // [object Object] to be tostring method
console.log(user1.valueOf() === user); // true as return obj itself
//default valueOf is mentioned here only for the sake of completeness, to avoid any confusion.
//As you can see, it returns the object itself, and so is ignored.

//For instance, here user does the same as above using a combination of toString and
//valueOf instead of Symbol.toPrimitive:

//Return types+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//important thing to know about all primitive-conversion methods is that
//they do not necessarily return the “hinted” primitive.

//no control whether toString returns exactly a string,
//or whether Symbol.toPrimitive method returns a number for a hint "number".

//the only mandatory thing: these methods must return a primitive, not an object.

//For historical reasons, if toString or valueOf returns an object, there’s no error,
//but such value is ignored (like if the method didn’t exist).
//That’s because in ancient times there was no good “error” concept in JavaScript.

//In contrast, Symbol.toPrimitive must return a primitive, otherwise there will be an error.


//Further conversions++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//many operators and functions perform type conversions, e.g. multiplication * converts operands to numbers.

//If we pass an object as an argument, then there are two stages:
//  The object is converted to a primitive (using the rules described above).
//  If the resulting primitive isn’t of the right type, it’s converted.

let obj = {
  // toString handles all conversions in the absence of other methods
  toString() {
    return "2";
  }
};
console.log(obj * 2); // 4, object converted to primitive "2",
//then multiplication made it a number

//  The multiplication obj * 2 first converts the object to primitive (that’s a string "2").
//  Then "2" * 2 becomes 2 * 2 (the string is converted to number).

//Binary plus will concatenate strings in the same situation, as it gladly accepts a string:
let obj1 = {
  toString() {
    return "2";
  }
};
console.log(obj1 + 2); // 22 ("2" + 2), conversion to primitive returned a string => concatenation
