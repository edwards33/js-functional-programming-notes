// example of higher order functions

// any function that does at least one of the following
//   * Accepts a function as an argument
//   * Returns a new function

// Receives a function as an argument
const withCount = fn => {
  let count = 0

  // Returns a new function
  return (...args) => {
    console.log(`Call count: ${++count}`)
    return fn(...args)
  }
}

const add = (x, y) => x + y

const countedAdd = withCount(add)

console.log(countedAdd(1, 2))
console.log(countedAdd(2, 2))
console.log(countedAdd(3, 2))

//------------------------------------------
// example of pure Functions

// A pure function is a function whose output is derived
// entirely from its inputs and causes no side effects

// The most common example of pure functions that people have
// encountered are mathematical functions. You might recall
// from math, seeing a function that looked like this:
// f(x) = x + 1. This is a function that accepts one variable,
// and returns a value based on that input. We can write this in
// JavaScript as:

const f = x => x + 1

// This function is a pure function because we always get the same
// output from the same input, and we cause no side effects in our
// program or outside world.

// Let's compare this with several impure functions.

// Impure Function ex. 1 - Output not derived solely from inputs
const COST_OF_ITEM = 19
function cartTotal(quantity) {
  return COST_OF_ITEM * quantity
}

cartTotal(2) // 38

// While this function returns the same value each time it is called
// the result is not derived _only_ from its inputs, but depends on a global state

// Impure Function ex. 2 - Same input, different output
function generateID() {
  return Math.floor(Math.random() * 10000)
}

function createUser(name, age) {
  return {
    id: generateID(),
    name,
    age
  }
}

createUser('Kyle', 33) // { id: 6723, name: "Kyle", age: 33 }
createUser('Kyle', 33) // { id: 1384, name: "Kyle", age: 33 }
createUser('Kyle', 33) // { id: 2880, name: "Kyle", age: 33 }

// If this were a pure function, calling createUser with the same
// arguments would return the same user object. The generateID
// function is impure, and its use in createUser makes that function
// impure as well

// Impure Function ex. 3 - Side Effects
let id = 0
function createFoodItem(name) {
  return {
    id: ++id,
    name
  }
}

createFoodItem('Cheeseburger') // { id: 1, name: 'Cheeseburger' }
createFoodItem('Fries') // { id: 2, name: 'Fries' }
createFoodItem('Milkshake') // { id: 3, name: 'Milkshake' }

// Not only does the function impurely return a different id
// if given the same name, it has the side effect of modifying
// state outside of the function. Pure functions have no effect on
// outside state

// Impure Function ex. 4 - Side Effects #2
function logger(message) {
  console.log(message)
}

// Side effects are not confined to the state of our application,
// they include affecting the outside world. In this case,
// we're affecting the state of our run-time environment, be that
// a Node server or a browser

//--------------------------------

// example of immutable Data

// A mutable data structure can be changed after creation, an immutable
// data structure cannot. You might recognize the conflict between the
// purity of functional programming and the side effect of mutations.

// Functional programming utilizes immutable data to ensure that the
// internal state of a data structure is never changed. This makes
// functional programming thread-safe, and capable of handling some
// difficult situations where mutable data structures struggle.

// In JavaScript, common data structures like arrays and objects can be
// mutated. A way to test this is to assign several variables the same
// reference to a data structure, and then check that mutating one, mutates
// all references.

const a = [1, 2, 3]
const b = a
b.push(4)
console.log(a) // [1, 2, 3, 4]
console.log(a === b) // true, same reference

// Or with an object
const c = { foo: 'bar' }
const d = c
d.foo = 'baz'
console.log(d.foo) // 'baz'
console.log(c === d) // true, same reference

// In functional programming, we use immutable data structures, which means
// that when we want to modify data, we return a new data structure
// that clones the previous state and merges in the updated part of our state.
// Thus, our original data remains the same, and our reference check fails,
// because they are indeed new structures.

// One of the ways I like to describe the difference between mutable
// and immutable data structures is to think about taking a drink from
// a glass. Let's create two classes, a MutableGlass and an ImmutableGlass,
// and look at how they differ when we implement a `takeDrink` method.

// Taking a drink from the mutable glass returns the same glass as before
// with the amount of content mutated to the correct amount.
class MutableGlass {
  constructor(content, amount) {
    this.content = content
    this.amount = amount
  }

  takeDrink(value) {
    this.amount = Math.max(this.amount - value, 0)
    return this
  }
}

// We can verify this by checking the references of the first glass and
// the glass returned by `takeDrink()` and see that they are the same.
const mg1 = new MutableGlass('water', 100)
const mg2 = mg1.takeDrink(20)
console.log(mg1.amount === 80 && mg1.amount === mg2.amount) // true
console.log(mg1 === mg2) // true

// Taking a drink from the immutable glass returns an entirely new glass,
// but with the correct content and amount of it in the glass.
class ImmutableGlass {
  constructor(content, amount) {
    this.content = content
    this.amount = amount
  }

  takeDrink(value) {
    return new ImmutableGlass(this.content, Math.max(this.amount - value, 0))
  }
}

// We can verify this by checking the references and seeing that they are
// _not_ equal
const ig1 = new ImmutableGlass('water', 100)
const ig2 = ig1.takeDrink(20)
console.log(ig1.amount !== ig2.amount) // true
console.log(ig1 === ig2) // false

//-------------------------------

// example of currying

// Currying is the technique of writing a function so that it
// receives its arguments one at a time, returning a new function with each
// argument until it has received all its arguments and finally evaluates

// Curried functions are essential to functional composition. We often
// don't have all of the arguments a function needs up front. Currying
// means we can delay supplying an argument until it is available
// an necessary.

// Canonical Example - ES5
function addFunction(x) {
  // x is stored in closure here and is available in the body of our
  // returned function awaitng the y value
  return function(y) {
    return x + y
  }
}

const addFive = addFunction(5) // returns a function awaiting a second value
addFive(4) // 9
addFive(15) // 20
addFive(8) // 13

// Some helpful jargon to learn when discussing functions is "arity". Arity
// describes the number of arguments a function receives. There are words
// to describe particular arities, such as:

// 1 argument = unary
// 2 arguments = binary
// 3 arguments = ternary
// 4 arguments = quaternary (no that's not a typo)

// Any function that receives more than one argument can be described as a
// multivariate function. Thus, currying can then be described as the act of
// refactoring a multivariate function into one that is a series of unary functions.

// Typically, an `add()` function is a binary function, receiving two arguments
// at the _same_ time. This is quite the restraint. What if we don't have both
// our arguments just yet, but know that we will want to add something with a value
// we already have? In functional programming, every function is a curried function,
// so we can do this without any problem. We supply the arguments we have, and the
// function doesn't evaluate until it receives its final argument.

// I want to take some time to demonstrate writing curried functions in ES2015.
// In the add example above, I use ES5 to clearly demonstrate we are returning
// a new function and where the values are stored in closure. We can write this
// function much more succinctly with ES2015+ arrow function syntax.

const add2 = x => y => x + y

// Unary arrow functions do not require parentheses around the argument, and
// will implicitly return the expression that follows the arrow.Thus, we can
// create our series of unary functions with very little code.

//-------------------------------------

// example of Partial Application

// Curried functions create a wonderful emergent property, "partial application",
// that is useful for building up reusability in our applications that you
// just can't get with normal, multivariate functions. Because curried functions
// return a new function with each argument (except for the final one), we are
// able to "partially apply" values and store them in closure, available to any
// subsequent function, thus creating new, reusable functions with some values
// already supplied.

// Imagine we have an application that needs to make requests to different APIs.
// We can create a function that bakes in the base URL, while allowing other
// arguments to be passed in later

const fetch = require('node-fetch')

const getFromAPI = baseURL => endPoint => callback =>
  fetch(`${baseURL}${endPoint}`)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => {
      console.error(err.message)
    })

// Now we can partially apply a baseURL to create a reusable function for
// one of our APIs

const getGithub = getFromAPI(
  'https://api.github.com'
)

// We can create several get request functions by partially applying different
// endpoints to our getGithub function

const getGithubUsers = getGithub('/users')
const getGithubRepos = getGithub('/repositories')

// Now we can use our callback to get the data and do something with it.

getGithubUsers(data =>
  data.forEach(user => {
    console.log(`User: ${user.login}`)
  })
)
getGithubRepos(data =>
  data.forEach(repo => {
    console.log(`Repo: ${repo.name}`)
  })
)

// We can still continue to reuse previous partially applied functions

const getGithubOrgs = getGithub('/organizations')
getGithubOrgs(data =>
  data.forEach(org => {
    console.log(`Org: ${org.login}`)
  })
)

// We can start the process all over by partially applying a new baseURL

const getReddit = getFromAPI('https://reddit.com')

// And let's get some pictures of some cute animals

const getRedditAww = getReddit('/r/aww.json')

// And fetch the URLs of those images

const imageURLs = getRedditAww(payload =>
  payload.data.children.forEach(child => {
    console.log(
      child.data.preview.images[0].source.url
    )
  })
)

//------------------------------------------

// example of Pointfree

// Pointfree programming refers to a method in which anonymous functions with interim
// variables are not used, and instead the function itself is passed as an argument to
// the consuming function. This might sound a bit confusing, but can be easily
// understood with a few examples.

// For starters, we have to be clear on how a function is invoked when it is passed
// as a callback to another function. Let's look at the Array.prototype.map method as an example.

const arr = [1, 2, 3]

arr.map(x => x * 2) // [2, 4, 6]

// The map method receives a callback, in this case, an anonymous function that uses an interim
// variabled which we have defined as `x`. What we name this interim is not very important to the
// function. It's just a pointer to a value passed to the callback when it is called.

// Think about what happens under the hood. That anonymous function is called with each item of the
// array passed into it's `x` placeholder. Instead of creating an anonymous function, we can define
// a function with the same argument signature, and pass it in by name to the same effect.

const doubleFunction = x => x * 2

arr.map(doubleFunction) // [2, 4, 6]

// This is pointfree programming. The doubleFunction function is invoked for each item in the array.
// Pointfree makes our functionality more legible and reduces the chances of bugs by
// eliminating the need for declaring and tracking interim variables. We can easily test
// our doubleFunction function (do you really need to?) and be confident of how it'll function in
// the map method.

//----------------------------------------
// example of Composition

// Composition is the heart and soul of functional programming. Composition is the
// act of combining several functions to create a new function. It is a way of
// building up complexity atomically.

// If you studied math in school, you might remember functions that
// look something like these ones:

const fFun = x => x + 1
const g = x => x * 3

// A composition is the nesting of one function inside the other,
// passing its returned value as the input to another.

fFun(g(2)) // 7
fFun(g(4)) // 13

// I am guessing that most of the functions in your program are
// not written with a single letter as a name. Thus, nesting them
// to build up complexity can be cumbersome.

// Let's make some slightly more useful functions and witness this firsthand.

const scream = str => str.toUpperCase()
const exclaim = str => `${str}!`
const repeat = str => `${str} ${str}`

repeat(exclaim(scream('I love egghead'))) // I LOVE EGGHEAD! I LOVE EGGHEAD!

// What we need is a way to create a new function with the same functionality
// that removes the need for nesting. How about a higher order function
// that takes functions as arguments and returns the new function? We'll call
// this function `compose`

const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)

// `compose` takes any number of functions as arguments, returns a function
// that awaits a value. When that value is received, it passes it to the
// last function in the array, the most nested function in our previous example,
// and passes the result to the next function, unnesting each layer and
// eventually returning our final result.

const enhance = compose(repeat, exclaim, scream)

// Notice that argument order reflects the left-to-right order of
// the next version. Now, using this `enhance` function with the
// same string, we get the same result.

enhance('I love egghead') // I LOVE EGGHEAD! I LOVE EGGHEAD!

// Another way to create compositions that you might come across in libraries like
// Ramda or lodash-fp is the `pipe` function. It works exactly the same as `compose`,
// except the functions are reduced from left-to-right instead of right-to-left

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x)

const enhanceWithPipe = pipe(scream, exclaim, repeat)

enhanceWithPipe('I love egghead') // I LOVE EGGHEAD! I LOVE EGGHEAD!

//------------------------------------------

// example of Associative Property

// This is kind of a bonus lesson, because you don't _need_ to know
// it to get started, but it will help.

// Functional compositions obey the associative property of mathematics.
// That is, we can change the grouping of compositions and acheive the
// same result. Let's remember what the property is first.

// In mathematics, if there are two or more occurences of the same operation,
// the order in which you perform the operations does not matter. Take addition,
// for example:

console.log(1 + 2 + 3) // 6
console.log((1 + 2) + 3) // 6
console.log(1 + (2 + 3)) // 6

// Each of these operations is equivalent due to the associative property.
// This holds true for compositions.

const composeFn = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x)
const screamFn = str => str.toUpperCase()
const exclaimFn = str => `${str}!`
const repeatFn = str => `${str} ${str}`

const comp1 = composeFn(repeatFn, exclaimFn, screamFn)
const comp2 = composeFn(composeFn(repeatFn, exclaimFn), screamFn)
const comp3 = composeFn(repeatFn, composeFn(exclaimFn, screamFn))

comp1('x') === comp2('x') === comp3('x')

// Each of our compositions is the same! Learning this property of math
// allows us to conceive of ever more complex functions through the composition
// of compositions.

//--------------------------------------

//example of Debugging Compositions

const {
  composeFromShared,
  mapFromShared,
  split,
  join,
  lowerCase
} = require('./shared')

const bookTitles = [
  'The Culture Code',
  'Designing Your Life',
  'Algorithms to Live By'
]

// One of the challenges of debugging functional compositions is that,
// by design, we have removed side effects in favor of pure, pointfree
// functions. We need to create an "escape hatch" that lets us examine
// values at different parts of their transformation during a composition.
// This can be achieved with the use of a `trace()` function.

const trace = msg => x => (console.log(msg, x), x)

// The code above may look a bit confusing. We are using the comma operator,
// a not-so-well-known operator that evaluates each expression from left to
// right and returns the final expression, in order to first log out our
// message and value, and then return the value. We can insert `trace`s into
// our compositions to see what a value is at a given point in the evaluation.

// Let's try to take the `bookTitles` from above and try to make a list of URL
// slugs from them. We'll do this through a composition, debugging as we go along.
// We'll iterate through buggy versions of the composition until we arrive at the
// best version.

let slugify = composeFromShared(
  join('-'),
  mapFromShared(lowerCase),
  mapFromShared(split(' '))
)

//console.log(slugify(bookTitles)) // str.toLowerCase is not a function

// Ok, something isn't right about our composition, let's add some traces to see into
// the transformations

slugify = composeFromShared(
  join('-'),
  mapFromShared(lowerCase),
  trace('after split'),
  mapFromShared(split(' '))
)

//console.log(slugify(bookTitles))
// [[ 'The', 'Culture', 'Code' ], [ 'Designing', 'Your', 'Life' ], ['Algorithms', 'to', 'Live', 'By']]
// str.toLowerCase is not a function

// Ok, that makes sense, `lowerCase` expects a string and is instead receiving an array.
// Let's switch the order of our split and lowerCase

slugify = composeFromShared(
  join('-'),
  mapFromShared(split(' ')),
  mapFromShared(lowerCase)
)

console.log(slugify(bookTitles))
// 'the,culture,code-designing,your,life-algorithms,to,live,by'

// Ok, no errors, but that isn't what we wanted, let's trace after the split and figure it out.

slugify = composeFromShared(
  join('-'),
  trace('after split'),
  mapFromShared(split(' ')),
  mapFromShared(lowerCase)
)

console.log(slugify(bookTitles))
// [['the', 'culture', 'code'], ['designing', 'your', 'life'], ['algorithms', 'to', 'live', 'by']]
// 'the,culture,code-designing,your,life-algorithms,to,live,by'

// Ahh yes, again, split rears it's ugly head and returns a two-dimensional array. We need
// a `mapFromShared` on our join as well

slugify = composeFromShared(
  mapFromShared(join('-')),
  mapFromShared(split(' ')),
  mapFromShared(lowerCase)
)

console.log(slugify(bookTitles))
// ['the-culture-code', 'designing-your-life', 'algorithms-to-live-by']

// Awesome, our composition is debugged, but you might realize we're calling map three
// times and we can make this a bit better by composing `join`, `split`, and `lowercase`
// and passing that into map.

slugify = composeFromShared(
  mapFromShared(
    composeFromShared(
      join('-'),
      split(' '),
      lowerCase
    )
  )
)

console.log(slugify(bookTitles))
