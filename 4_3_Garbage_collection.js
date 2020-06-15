//Garbage collection++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Memory management in JavaScript is performed automatically and invisibly to us.
//We create primitives, objects, functions… //All that takes memory.
//so clean up by garbage collector

//Reachability+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//The main concept of memory management in JavaScript is reachability.
//“reachable” values are those that are accessible or usable somehow.
//They are guaranteed to be stored in memory.

//There’s a base set of inherently reachable values, that cannot be deleted for obvious reasons.
//For instance:
  //Local variables and parameters of the current function.
  //Variables and parameters for other functions on the current chain of nested calls.
  //Global variables.(there are some other, internal ones as well)
  //These values are called roots.

//Any other value is considered reachable if it’s reachable from a root by a reference or by a chain of references.
//For instance,
//if there’s an object in a local variable, and that object has a property referencing another object,
//that object is considered reachable.
//And those that it references are also reachable. Detailed examples to follow.

//// user has a reference to the object (name:"john")
let user = {
  name: "John"
};
//The global variable "user" references the object {name: "John"} (we’ll call it John for brevity).
//The "name" property of John stores a primitive, so it’s painted inside the object.

//If the value of user is overwritten, the reference is lost:
user = null;
//Now John becomes unreachable. There’s no way to access it, no references to it.
//Garbage collector will junk the data and free the memory.

//Two references++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//we copied the reference from user to admin:
// user has a reference to the object
let user1 = {
  name: "John"
};
let admin = user1;
user1 = null;
console.log(admin); //name: "John"
//Then the object is still reachable via admin global variable, so it’s in memory.
//If we overwrite admin too, then it can be removed.

//Interlinked objects+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//Function marry “marries” two objects by giving them references to each other and
//returns a new object that contains them both.
function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;
  return {
    father: man,
    mother: woman
  }
}
let family = marry({ name: "John" }, { name: "Ann" });
console.log(family);
//{ father: { name: 'John', wife: { name: 'Ann', husband: [Circular] } },
//  mother: { name: 'Ann', husband: { name: 'John', wife: [Circular] } } }


//Now let’s remove two references:
delete family.father;
delete family.mother.husband;
console.log(family); //{ mother: { name: 'Ann' } }
//It’s not enough to delete only one of these two references,
//because all objects would still be reachable.

//But if we delete both, then we can see that John has no incoming reference any more:
delete family.mother;
console.log(family); // {}
//Outgoing references do not matter. Only incoming ones can make an object reachable.
//So, John is now unreachable and will be removed from the memory with
//all its data that also became unaccessible.

//Unreachable island+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//It is possible that the whole island of interlinked objects becomes unreachable
//and is removed from the memory.

function marry(man1, woman1) {
  woman1.husband = man1;
  man1.wife = woman1;
  return {
    father: man1,
    mother: woman1
  }
}
let family1 = marry({ name: "John" }, { name: "Ann" });
family1 = null;
//console.log(man1);// unreachable
//To demonstrates how important the concept of reachability is.

//It’s obvious that John and Ann are still linked, both have incoming references.
//But that’s not enough.
//former "family" object has been unlinked from the root, there’s no reference to it any more,
//so the whole island becomes unreachable and will be removed.

//Internal algorithms++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//basic garbage collection algorithm is called “mark-and-sweep”.
//The following “garbage collection” steps are regularly performed:

//  The garbage collector takes roots and “marks” (remembers) them.
//  Then it visits and “marks” all references from them. //references will link to its obj
//  Then it visits marked objects and marks their references.
//    All visited objects are remembered, so as not to visit the same object twice in the future.
//  …And so on until every reachable (from the roots) references are visited.
//  All objects except marked ones are removed.

//We can also imagine the process as spilling a huge bucket of paint from the roots,
//that flows through all references and marks all reachable objects.
//The unmarked ones are then removed.

//Some of the optimizations:
  //Generational collection – objects are split into two sets: “new ones” and “old ones”.
  //Many objects appear, do their job and die fast, they can be cleaned up aggressively.
  //Those that survive for long enough, become “old” and are examined less often.

  //Incremental collection – if there are many objects,
  //and we try to walk and mark the whole object set at once,
  //it may take some time and introduce visible delays in the execution.
  //So the engine tries to split the garbage collection into pieces.
  //Then the pieces are executed one by one, separately.
  //That requires some extra bookkeeping between them to track changes,
  //but we have many tiny delays instead of a big one.

  //Idle-time collection – the garbage collector tries to run only while the CPU is idle,
  //to reduce the possible effect on the execution.
