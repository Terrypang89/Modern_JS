//JSON Stringify++++++++++++++++++++++++++++++++++++++++++++++++++
let user = {
  name: "John",
  age: 30,
  toString() {
    return `{name: "${this.name}", age: ${this.age}}`;
  }
};
console.log(user);
// {name: "John", age: 30}
// convert obj to String

// JSON (JavaScript Object Notation) is a general format to represent values and objects.
//It is described as in RFC 4627 standard and was made for javascript
//but many other languages have libraries to handle it as well.
//So it’s easy to use JSON for data exchange when the client uses JavaScript
//and the server is written on Ruby/PHP/Java/Whatever.
let student = {
  name: 'John',
  age: 30,
  isAdmin: false,
  courses: ['html', 'css', 'js'],
  wife: null
};
let json = JSON.stringify(student); // convert obj to JSON
console.log(typeof json); // we've got a string!
console.log(json);
/* JSON-encoded object:
{
  "name": "John",
  "age": 30,
  "isAdmin": false,
  "courses": ["html", "css", "js"],
  "wife": null
}
*/ //JSON.stringify(student) takes the object and converts it into a string.
// json string is called a JSON-encoded or serialized or stringified or marshalled object.
//so that We are ready to send it over the wire or put into a plain data store.
//IMPORTANT:
//Strings use double quotes. No single quotes or backticks in JSON. So 'John' becomes "John".
//Object property names are double-quoted also. That’s obligatory. So age:30 becomes "age":30.
// SUPPORTED BY JSON.stringify: obj, arrays, primitives like strings, numbers, boolean values, null

// a number in JSON is just a number
console.log( JSON.stringify(1) ) // 1
// a string in JSON is still a string, but double-quoted
console.log( JSON.stringify('test') ) // "test"
console.log( JSON.stringify(true) ); // true
console.log( JSON.stringify([1, 2, 3]) ); // [1,2,3]

// NOT SUPPORTED BY JSON.stringify: specific object properties
//  Function properties (methods).
//  Symbolic properties.
//  Properties that store undefined.

let user1 = {
  sayHi() { // ignored
    console.log("Hello");
  },
  [Symbol("id")]: 123, // ignored
  something: undefined // ignored
};
console.log( JSON.stringify(user1) ); // only show {} (empty object)

// SUPPORTED BY JSON.stringify:nested objects and converted automatically.
let meetup = {
  title: "Conference",
  room: {
    number: 23,
    participants: ["john", "ann"]
  }
};
console.log( JSON.stringify(meetup) );
/* The whole structure is stringified:
{
  "title":"Conference",
  "room":{"number":23,"participants":["john","ann"]},
}
*/

// LIMITATION ON JSON.stringify: no circular references.
let room = {
  number: 23
};
let meetup1 = {
  title: "Conference",
  participants: ["john", "ann"]
};
meetup1.place = room;       // meetup references room
room.occupiedBy = meetup1; // room references meetup
//JSON.stringify(meetup1); // Error: Converting circular structure to JSON
// the conversion fails, because of circular reference: room.occupiedBy
// references meetup, and meetup.place references room

//Excluding and transforming: replacer+++++++++++++++++++++++++++++++++++++++++++
//let json = JSON.stringify(value, [replacer], [space])
//value: A value to encode.
//replacer: Array of properties to encode or a mapping function function(key, value).
//space: Amount of space to use for formatting

// to fine-tune the replacement process, like to filter out circular references,
// use second argument of JSON.stringify.
let room2 = {
  number: 23
};
let meetup2 = {
  title: "Conference1",
  participants: [{name: "John"}, {name: "Alice"}],
  place: room2 // meetup2 references room2
};
room2.occupiedBy = meetup2; // room2 references meetup2
console.log( JSON.stringify(meetup2, ['title', 'participants']) );
// {"title":"Conference","participants":[{},{}]}
// The property list is applied to the whole object structure.
//So the objects in participants are empty, because name is not in the list.

//to include objects in partipants, add more replacer
console.log( JSON.stringify(meetup2, ['title', 'participants', 'place', 'name', 'number']) );
/*
{
  "title":"Conference",
  "participants":[{"name":"John"},{"name":"Alice"}],
  "place":{"number":23}
}
*/

// due to occupiedBy is not serialized, use a function instead of an array as the replacer.
//function will be called for every (key, value) pair and should return the “replaced” value,
//which will be used instead of the original one. Or undefined if the value is to be skipped.
console.log( JSON.stringify(meetup2, function replacer(key, value) {
  console.log(`${key}: ${value}`);
  return (key == 'occupiedBy') ? undefined : value;
}));
/* key:value pairs that come to replacer:
  :             [object Object]
  title:        Conference
  participants: [object Object],[object Object]
  0:            [object Object]
  name:         John
  1:            [object Object]
  name:         Alice
  place:        [object Object]
  number:       23
*/
//replacer function gets every key/value pair including nested objects and array items.
//It is applied recursively.
//The value of this inside replacer is the object that contains the current property.

//first call is special. as is is made using a special “wrapper object”: {"": meetup}.
//In other words, the first (key, value) pair has an empty key,
//and the value is the target object as a whole.
//That’s why the first line is ":[object Object]" in the example above.

//Formatting: space+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//the space argument is used exclusively for a nice output.
//Here space = 2 tells JavaScript to show nested objects on multiple lines,
//with indentation of 2 spaces inside an object:
let user2 = {
  name: "John",
  age: 25,
  roles: {
    isAdmin: false,
    isEditor: true
  }
};
console.log(JSON.stringify(user2, null, 2));
/* two-space indents:
{
  "name": "John",
  "age": 25,
  "roles": {
    "isAdmin": false,
    "isEditor": true
  }
}*/ //obj properties has two spaces at front

console.log(JSON.stringify(user2, null, 4));
/* for JSON.stringify(user2, null, 4) the result would be more indented:
{
    "name": "John",
    "age": 25,
    "roles": {
        "isAdmin": false,
        "isEditor": true
    }
}
*/ //space parameter is used solely for logging and nice-output purposes.

//Custom “toJSON”++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//toString for string conversion, an object may provide method toJSON for to-JSON conversion.
//JSON.stringify automatically calls it if available.

let room3 = {
  number: 23
};
let meetup3 = {
  title: "Conference",
  date: new Date(Date.UTC(2017, 0, 1)),
  room3
};
console.log( JSON.stringify(meetup3) );
/*
  {
    "title":"Conference",
    "date":"2017-01-01T00:00:00.000Z",  // (1)
    "room": {"number":23}               // (2)
  }
*/
//date (1) became a string.
//That’s because all dates have a built-in toJSON method which returns such kind of string.

// let’s add a custom toJSON for our object room (2):
let room4 = {
  number: 23,
  toJSON() {
    return this.number;
  }
};
let meetup4 = {
  title: "Conference",
  room4
};
console.log( JSON.stringify(room4) ); // 23
console.log( JSON.stringify(meetup4) );
/*
  {
    "title":"Conference",
    "room": 23
  }
*/
//toJSON is used both for the direct call JSON.stringify(room) and
//when room is nested in another encoded object.

// JSON.parse++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// to decode a JSON-string
//let value = JSON.parse(str, [reviver]);

// str: JSON-string to parse.
// reviver: Optional function(key,value) that will be called for each (key, value) pair
//           and can transform the value.

// stringified array
let numbers = "[0, 1, 2, 3]";
numbers = JSON.parse(numbers);
console.log( numbers[1] ); // 1

// nested objects
let userData = '{ "name": "John", "age": 35, "isAdmin": false, "friends": [0,1,2,3] }';
let user10 = JSON.parse(userData);
console.log( user10.friends[1] ); // 1

//JSON may be as complex as necessary, objects and arrays can include other objects and arrays.
// But they must obey the same JSON format.

//TYPICAL MISTAKES in hand-written JSON (sometimes we have to write it for debugging purposes):
//let json = `{
  //name: "John",                     // mistake: property name without quotes
  //"surname": 'Smith',               // mistake: single quotes in value (must be double)
  //'isAdmin': false                  // mistake: single quotes in key (must be double)
  //"birthday": new Date(2000, 2, 3), // mistake: no "new" is allowed, only bare values
  //"friends": [0,1,2,3]              // here all fine
//}`;

//Using Reviver++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Imagine, we got a stringified meetup object from the server.
// title: (meetup title), date: (meetup date)
let str = '{"title":"Conference","date":"2017-11-30T12:00:00.000Z"}';

//to deserialize it, to turn back into JavaScript object, call JSON.parse
let meetup7 = JSON.parse(str);
console.log( meetup7.date.getDate() ); // Error!
//value of meetup.date is a string, not a Date object.
//How could JSON.parse know that it should transform that string into a Date?

//pass to JSON.parse the reviving function as the second argument,
//that returns all values “as is”, but date will become a Date
let meetup12 = JSON.parse(str, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
console.log( meetup12.date.getDate() ); // 30, now works!

//another example with nested object
let schedule = `{
  "meetups": [
    {"title":"Conference","date":"2017-11-30T12:00:00.000Z"},
    {"title":"Birthday","date":"2017-04-18T12:00:00.000Z"}
  ]
}`;
schedule = JSON.parse(schedule, function(key, value) {
  if (key == 'date') return new Date(value);
  return value;
});
console.log( schedule.meetups[1].date.getDate() ); //18, it works!


//TASK++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Turn the user into JSON and then read it back into another variable.
let user15 = {
  name: "John Smith",
  age: 35
};
console.log(JSON.parse(JSON.stringify(user15)));

//Exclude backreferences
//In simple cases of circular references,
//we can exclude an offending property from serialization by its name.
//But sometimes we can’t just use the name,
//as it may be used both in circular references and normal properties.
//So we can check the property by its value.
//Write replacer function to stringify everything,
//but remove properties that reference meetup:

let room20 = {
  number: 23
};
let meetup20 = {
  title: "Conference",
  occupiedBy: [{name: "John"}, {name: "Alice"}],
  place: room20
};

// circular references
room20.occupiedBy = meetup20;
meetup20.self = meetup20;

console.log( JSON.stringify(meetup20, function replacer(key, value) {
  /* your code */\
  return (key != "" && value == meetup) ? undefined : value;
}));
/* result should be:
{
  "title":"Conference",
  "occupiedBy":[{"name":"John"},{"name":"Alice"}],
  "place":{"number":23}
}
*/
