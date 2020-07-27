# Essentials

![Javascript](https://www.educative.io/api/page/5330288608542720/image/download/6288755792019456)

- **Javascript** and **Java**, this two languages are vastly different in many important ways. It's like Car and Carpet.

## Statements

Very simple statement:

```js
a = b * 2;
```

- `a` is a varible that hold `b * 2` result.
- `*` is an operator for multiplication.
- `=` is an operator for assignment.
- `;` is a semicolon. most statements in **Javascript** conclude with a semicolon at the end.

## Expressions

Very simple expression:

```js
a = b * 2;
```

- `2` is a literal expression.
- `a` is a variable expression.
- `b * 2` is an arithemic expression.
- `a = b * 2` is an assignment expression.
- `a * b;` is not very common or useful. Because it wouldn't have any effect on the running of the program.

## Tips

- **Javascript** is an interpreter language and it runs in a browser with **Javascript** engine.
- Chromium (or Chrome) uses **V8** engine.
- Firefox uses **Spider Monkey** engine.
- You can use the browser console to execute **Javascript** code.
- You can use `shift + enter` in the console to move to the next line.
- You can use `enter` in the console to execute the code.
- All numbers on the screen are string.

## Output

- You can use `console.log()` function to print a text in the developer console. For example:

    ```js
    // Phone store story
    console.log("Hello World!");
    ```

## Input

- You can use `prompt()` function to input something. For example:

    ```js
    // Phone store story
    prompt(); // Enter a value and press OK
    ```

- `prompt()` always returns a string value.

## Operators

- For the assignment operator, we first calculate the value on the right-hand side (source value) of the `=` and then put it into the variable that we specify on the left-hand side (target variable).
- Some might prefer to flip the order, so source value on the left and target variable on the right. Don't do that, it doesn't work. For example:

    ```js
    552 = a // Error
    ```

|Operator|Description|Category|
|:-:|:-:|:-:|
|`=`|Assignment|Assignment|
|`+`|Addition|Math|
|`-`|Subtraction|Math|
|`*`|Multiplication|Math|
|`/`|Division|Math|
|`+=`|Compound addition assignment|Compound Assignment|
|`-=`|Compound subtraction assignment|Compound Assignment|
|`*=`|Compound multiplication assignment|Compound Assignment|
|`/=`|Compound division assignment|Compound Assignment|
|`++`|Increment|Increment/Decrement|
|`--`|Decrement|Increment/Decrement|
|`.`|Object property access|Object Property Access|
|`==`|Loose-equals|Equality|
|`===`|Strict-equals|Equality|
|`!=`|Loose not-equals|Equality|
|`!==`|Strict not-equals|Equality|
|`<`|Less than|Comparison|
|`<=`|Less than or loose-equals|Comparison|
|`>`|Greater than|Comparison|
|`>=`|Greater than or loose-equals|Comparison|
|`&&`|And|Logical|
|`\|\|`|Or|Logical|
|`typeof`|Type of a value|Checking|

## Values & Types

- We have some types in **Javascript**, `number`, `string`, `boolean`, `null`, `undefined`, `object` and `symbol`.
- `string` values always surrounded by double quotes `".."` or single quotes `'..'`. The only difference is stylistic preference.
- Values that stands alone without being stored in a variable, called **literal values**. For example:

    ```js
    "I am a string";
    'I am also a string';
    42;
    true;
    false;
    ```

- **Javascript** provides a `typeof` operator that can examine a value and tell you what type it is. For example:

    ```js
    var a;
    typeof a; // "undefined"

    a = "hello world";
    typeof a; // "string"

    a = 42;
    typeof a; // "number"

    a = true;
    typeof a; // "boolean"

    a = null;
    typeof a; // "object" -- weird, bug

    a = undefined;
    typeof a; // "undefined"

    a = { b: "c" };
    typeof a; // "object"
    ```

- This is, `typeof "abc"` returns `"string"`, not `string`.
- `typeof null` is an interesting case, because it errantly returns `"object"`, when you'd expect it to retrun `"null"`.
- We can access object properties by `.` notation or `[..]` notation. But `.` notation is shorter and generally easier to read. For example:

    ```js
    var obj = {
        name: "hamed alavi",
        age: 23,
        isMarried: false
    }

    obj.name; // "hamed alavi"
    obj.age; // 23
    obj.isMarried; // false

    obj["name"]; // "hamed alavi"
    obj["age"]; // 23
    obj["isMarried"]; // false
    ```

- Bracket notation is useful if you have a property name that has special characters in it, like `obj["hello world!"]`. The `[]` notation is also useful if you want to access a property/key but the name stored in another variable. For example:

    ```js
    var obj = {
        a: "hello world",
        b: 42
    }

    var b = "a";

    obj[b]; // "hello world"
    boj["b"]; // 42
    ```

## Converting Between Types

- All `number` values in screen are `string`, so we need convert it to `number` and then do math operation.
- You can use `Number()` (a built-in function) to convert `string` to `number` **explicitly**.
- if you use `==` loose equals operator to make the comparison `"99.99" == 99.99`, **Javascript** will convert the left-hand side `"99.99"` to it's number equivalent `99.99`. The comparison then becomes `99.99 == 99.99`, which is of course `true`.It's called **implicit** conversion.

## Code Comments

- Code without comments is suboptimal (less than the highest standard or quality).
- Too many comments (one per line, for example) is probably a sign of poorly written code.
- Comments should explain *why*, not *what*. They can optionally explain how if that's particularly confusing.

- In **Javascript** there are two types of comments possible: a single-line comment and a multiline comment. For example:

    ```js
    // This is a single-line comment
    /* But this is
        a multiline
            comment.
                */
    ```

- Everything on the line after the `//` is treated as the comment and thus ignored by the compiler. For example:

    ```js
    var a = 42; // 42 is the meaning of life
    ```

- Use multiline comment like this (the common usage):

    ```js
    /* The following value is used because
    it has been shown that it answers
    every question in the universe. */
    var a = 42;
    ```

- Multiline comment can be appear anywhere on a line, because the `*/` ends it. For example:

    ```js
    var a = /* arbitrary value */ 42;
    ```

- The only thing that cannot appear inside a multiline comment is a `*/`, because that would be interpreted to end the comment.

## Variables

- **Javascript** uses the **dynamic typing** variables, meaning variables can hold values of any type without any type enforcement.
- You can use `var` keyword to declare a variable. For example:

    ```js
    var amount = 99.99;

    amount = amount * 2;

    console.log( amount ); // 199.98

    // convert `amount` to a string, and
    // add "$" on the beginning
    amount = "$" + String( amount );

    console.log( amount ); // "$199.98"
    ```

- Variables are managing program **state**. In other words, **state** is tracking the changes to values as your program runs.

- JavaScript variables as constants are usually capitalized, with underscores `_` between multiple words like `MAX_HEALTH`.
- You can use `const` keyword to declare a constant (ES6). For example:

    ```js
    const TAX_RATE = 0.08;
    ```

- If you try to change a `const` you will get an error.
- In **Javascript**, variable names (including function name) must be valid identifiers. An identifier must start with `a-z`, `A-Z`, `$` or `_`.
- We can't use **Javascript** reserved words and **Javascript** keywords for variable names. But its OK for property names. For example: `for`, `in`, `if`, `null`, `true`, `false` and etc.

## Blocks

- In JavaScript, a block is defined by wrapping one or more statements inside a curly-brace pair `{..}`. Dont's use it like below. This block is valid, but isn't commonly seen in **Javascript** programs:

    ```js
    var amount = 99.99;

    // a general block
    {
        amount = amount * 2;
        console.log(amount);
    }
    ```

- Typically, blocks are attached to some other control statement, such as an `if` statement or a loop. For example:

    ```js
    var amount = 99.99;

    // is amount big enough?
    if (amount > 10) {          // block attached to `if`
        amount = amount * 2;
        console.log(amount);    // 199.98
    }
    ```

- Block statements does not need a semicolon (`;`) to conclude it.

## Conditionals

- The `if` statement saying, "If the condition is true, do the following". For example:

    ```js
    var bank_balance = 302.13;
    var amount = 99.99;

    if (amount < bank_balance) {
        console.log("I want to buy this phone!");
    }
    ```

- The `if` statement requires an expression in between the parentheses `()` that can be treated as either `true` or `false`.

- You can even provide an alternative if the condition isn't true, called an `else` clause. For example:

    ```js
    const ACCESSORY_PRICE = 9.99;

    var bank_balance = 302.13;
    var amount = 99.99;

    amount = amount * 2;

    // can we afford the extra purchase?
    if (amount < bank_balance) {
        console.log("I'll take the accessory!");
        amount = amount + ACCESSORY_PRICE;
    }
    // otherwise:
    else {
        console.log("No, thanks.");
    }
    ```

- The `if` statement expects a `boolean`, but if you pass it something that's not already `boolean`, coersion will occur.

- These `false`, `0` and `""` are **falsy** values. Any other value not on the **falsy** list is automatically **truthy**.
- You can use `switch` statement when you want to check a specific case in some different situations. The `break` is important if you want only the statement(s) in one `case` to run. For example:

    ```js
    switch (a) {
    case 2:
        // do something
        break;
    case 10:
        // do another something
        break;
    case 42:
        // do yet something
        break;
    default:
        // fallback to here
        break;
    }
    ```

- If you ommit `break` from a `case`, and that case matches or runs, execution will continue with the next `case`'s statements regardless of that `case` matching. This so called **"fall through"**. For example:

    ```js
    switch (a) {
        case 2:
        case 10:
            // some cool stuff
            break;
        case 42:
            // other stuff
            break;
        default:
            // fallback
    }
    ```

- There is a concise form of a single `if..else` statement in **Javascript** called **"conditional operator"** or often called **"ternary operator"**. For example:

    ```js
    var a = 42;

    var b = (a > 42) ? "hello" : "world"; // world

    /* similar to:

        if (a > 41) {
            b = "hello";
        }
        else {
            b = "world";
        } */
    ```

## Loops

- Repeating only while the condition holds or repeating a set of actions until a certain condition fails, is the job of programming loops.
- A loop includes the test condition as well as a block (typically as `{..}`). Each time the loop block executes, that's called an **iteration**.
- If the condition is initially `false`, a `while` loop will never run, but a `do..while` loop run just the first time. For example:

    ```js
    while (numOfCustomers > 0) {
        console.log("How may I help you?");

        // help the customer...
        numOfCustomers = numOfCustomers - 1;
    }

    // versus:

    do {
        console.log("How may I help you?");

        // help the customer...
        numOfCustomers = numOfCustomers - 1;
    } while (numOfCustomers > 0);
    ```

- We can make an infinite loop with `while (true) {..}` statement. Because the condition is always true.
- We can use **Javascript**'s `break` statement to stop a loop. For example:

    ```js
    var i = 0;

    // a `while..true` loop would run forever, right?
    while (true) {
        // stop the loop?
        if ((i <= 9) === false) {
            break;
        }

        console.log(i);
        i = i + 1;
    }
    // 0 1 2 3 4 5 6 7 8 9
    ```

- There is another loop that can accomplish the task manually, called a `for` loop. For example:

    ```js
    for (var i = 0; i <= 9; i = i + 1) {
    console.log(i);
    }
    // 0 1 2 3 4 5 6 7 8 9
    ```

- If you're going to do counting with your loop iterations, `for` is a more compact and often easier form to understand and write.

## Functions

- We use `function` to prevent repeating some code.
- A function is generally a named section of code that can be "called" by name, and the code inside it will be run each time. For example:

    ```js
    function printAmount() {
        console.log(amount.toFixed(2));
    }

    var amount = 99.99;

    printAmount(); // "99.99"

    amount = amount * 2;

    printAmount(); // "199.98"
    ```

- Functions can optionally take **arguments** (aka **parameters**) -- values you pass in. And they can also optionally return a value back by using `return` keyword. For example:

    ```js
    function printAmount(amt) {
    console.log(amt.toFixed(2));
    }

    function formatAmount() {
        return "$" + amount.toFixed(2);
    }

    var amount = 99.99;

    printAmount(amount * 2); // "199.98"

    amount = formatAmount();
    console.log(amount);    // "$99.99"
    ```

- We can use functions to organize our code.
- Functions are a subtype of `objects` and `typeof` returns `"function"`, which implies that a `function` is a main type and can thus have properties.

## Scope

- In **Javascript**, each function gets its own scope and have access to their own variables. Variable's name can be same in different scopes. For example:

    ```js
    function one() {
        // this `a` only belongs to the `one()` function
        var a = 1;
        console.log(a);
    }

    function two() {
        // this `a` only belongs to the `two()` function
        var a = 2;
        console.log(a);
    }

    one(); // 1
    two(); // 2
    ```

- A scope can be nested inside another scope, and that scope has access to it's parent variables. For example:

    ```js
    function outer() {
        var a = 1;

        function inner() {
            var b = 2;

            // we can access both `a` and `b` here
            console.log (a + b); // 3
        }

        inner();

        // we can access `a` here
        console.log(a); // 1
    }

    outer();
    ```

- Every `function` have access to ancestor (parant, grandparent and etc) variable, and also have access to outer variable called **Global Variable**.

## Arrays

- An array is an `object` that holds value (of any type) not particularly in named properties/keys, but rather in numerically indexed positions. For example:

    ```js
    var arr = [
        "hello world",
        42,
        true
    ];

    arr[0]; // "hello world"
    arr[1]; // 42
    arr[2]; // true

    typeof arr; // object
    ```

- We should use `0` as the index of the first element in the array in **Javascript**.
- Arrays have `lenght` property that returns lenght of arrays in number.

## Built-in Type Methods

- Most built-in properties and methods are powerful and useful. For example:

    ```js
    var a = "hello world";
    var b = 3.14159;

    a.length; // 11
    a.toUpperCase(); // "HELLO WORLD"
    b.toFixed(4); // "3.1415"
    ```

- An `string` value can be wrapped by a `String` object, a `number` can be wrapped by a `Number` object and a `boolean` can be wrapped by a `Boolean` object. You can use their properies as an object. So **Javascript** will take care of the rest for you.

## Comparing Values

- There are two main types of value comparison that you will need to make in your **Javascript** programs: **equality** and **inequality**. The result of any comparison is a strictly `boolean` value (`true` or `false`).

## Coercion

- We have two form of coercion in **Javascript**: **explicit** and **implicit**. For example:

    ```js
    // explicit: we converts types to another
    var a = "42";
    var b = Number(a);
    a; // "42"
    b; // 42

    // implicit: Javascript converts types to another
    var x = "42";
    var z = x * 1;

    x; // "42"
    b; // 42
    ```

- Coercion is not evil, nor does it have to be surprising.

## Truthy & Falsy

- The specific list of **falsy** values in **Javascript** are `""` (empty `string`), `0`, `-0`, `NaN` (invalid `number`), `null`, `undefined` and `fasle`.
- Any value that's not on this "falsy" list is **truthy**, like `"hello"`, `42`, `true`, `[]`, `[1, "2", 3]`, `{}`, `{a: 42}` and `function foo() {..}`.

## Equality

- These `==`, `===`, `!=` and `!==` are equality. The `!` forms of course the symmetric **"not equal"** version of their counterparts.
- Non-equality should not be confused with inequality.
- The `==` checks the value equality and `===` checks for both value and type equality.
- The `==` checks for value equality with coercion allowed, and `===` checks for value equality without allowing coercion. `===` is often called **"strict equality"** for this reason. For example:

    ```js
    var a = "42";
    var b = 42;

    a == b; // true - loose equality
    a === b; // false - strict equality
    ```

- Many developers feel that `===` is more predictable than `==`.
- If either value (aka side) in a comparison could be the `true` or `false` value, avoid `==` and use `===`.
- If either value in a comparison could be of these specific values (`0`, `""` or `[]`), avoid `==` and use `===`.
- In all other cases, you're safe to use `==` and it can be simplifies your code or improve its readability.
- If we compare two non-primitive `object` (like `function` or `array`), actualy we compares their references.
- `array` by default coerced to `string` by simply joining all the values with commas (`,`)
- Two `array`s with the same contents with `==`, would not return `true`. Because they are two different objects. For example:

    ```js
    var a = [1, 2, 3];
    var b = [1, 2, 3];
    var c = "1,2,3";

    a == c; // true
    b == c; // true
    a == b; // false
    ```

## Inequality

- There are no **strict inequality** operators that would disallow coercion the same way `===` **"strict equality** does.For example:

    ```js
    var a = 41;
    var b = "42";
    var c = "43";
    var d = "foo";

    a < b; // true
    b < c; // true

    // the coercion result is a NaN (Not a Number)
    a < d; // fasle
    a > d; // false
    a == d; // false
    ```

## Hoisting

- Wherever a `var` appears inside a scope, that declaration is taken to belong to the entire scope and accessible everywhere throughout. This behavior called **hoisting**. When we declare a `var`, declaration is conceptually **"moved"** to the top of enclosing scope and thats what **Javascript** compiler do for us. For example:

    ```js
    var a = 2;

    foo(); // works because `foo()` declaration is "hoisted"

    function foo() {
        a = 3;

        console.log(a); // 3

        var a; // declaration is "hoisted" to the top of `foo()`
    }

    console.log(a); // 2
    ```

- It's not common or a good idea to rely on variable hoisting to use a variable earlier in its scope than its `var` declaration appears and it can be quite confusing.
- Using hoisted function is accepted and it's much more common in **Javascript** programming.

## Nested Scopes

- We should always formally declare our variables.
- All variable can be accessed inside of inner/lower functions scope. But in outer/upper functions, we can't access to variables. For example:

    ```js
    function foo() {
    var a = 1;

    function bar() {
        var b = 2;

        function baz() {
            var c = 3;

            console.log(a, b, c); // 1 2 3
        }

        baz();
        console.log(a, b); // 1 2
    }

    bar();
    console.log(a); // 1
    }

    foo();

    bar(); // Error - can't access to that scope, same as `baz()`
    ```

- **ES6** lets you declare variables to belong to individual blocks (pairs of `{..}`), using the `let` keyword. You can use it in `while`, `for`, `if` and etc `{..}` scopes. For example:

    ```js
    function foo() {
        var a = 1;

        if (a >= 1) {
            let b = 2;

            while (b < 5) {
                let c = b * 2;
                b++;

                console.log(a + c);
            }
        }
    }

    foo(); // 5 7 9
    ```

- We can use `var` to define a variable globally, or locally to an entire function regardless of block scope.

## Strict Mode

- **"Strict Mode"** was added to **Javascript** by **ES5**.
- Strict mode make your code generally more optimizable by the engine, and it's a big win for code, and you sould use it for all your programs.

- You can opt in to strict mode for an individual function, or an entire file. For example:

    ```js
    function foo() {
        "use strict"

        // this code is strict mode

        function bar() {
            // this code is strict mode
        }
    }

    // this code is not strict mode
    ```

    Another example:

    ```js
    "use strict"

    function foo() {
        // this code is strict mode
        a = 5; // `var` missing, RefferenceError

        function bar() {
            // this code is strict mode
        }
    }

    foo();

    // this code is strict mode
    ```

- If strict mode causes issues in your program, almost certainly it's a sign that you have things in your program you should fix.

## Function As Values

- Not only can you pass a value (argument) to a function, but a function itself can be a value that's assigned to variables, or passed to or returned from other functions. For example:

    ```js
    var foo = function {
        // the foo variable called "anonymous" because it has no name
    }

    var x = function bar() {
        // this function expression is named (bar), even as a reference to it is also assigned to the `x` variable
    }
    ```

- Named function expressions are generally more preferable, though anonymous function expressions are still extremely common.

## Immediately Invoked Function Expressions (IIFEs)

- You can execute a `function` immediately after declaring it in **Javascript**. For example:

    ```js
    (function IIFE() {
        console.log("Hello!");
    })(); // "Hello!"
    ```

    The outer `(..)` that surrounds the `(function IIFE() {..})` function expression is just a nuance of **Javascript** grammar needed to prevent it from being treated as a normal function. The final `()` on the end of expression is what actually executes the function expression referenced immediately before it. For example:

    ```js
    function foo() { .. }

    // `foo` function reference expression,
    // then `()` executes it
    foo();

    // `IIFE` function expression,
    // then `()` executes it
    (function IIFE() { .. })();
    ```

- IIFEs can also have return values. For example:

    ```js
    var x = (function IIFE() {
        return 42;
    })();

    x; // 42
    ```

## Closure

- You can think of closure as a way to **remember** and continue to access a function's scope (its variables) even once the function has finished running. Consider:

    ```js
    function makeAdder(x) {
        // parameter `x` is an inner variable

        // inner function `add()` uses `x`, so
        // it has a "closure" over it
        function add(y) {
            return y + x;
        };

        return add; // return `add` function
    }
    ```

    The reference to the inner `add(..)` function that gets returned with each call to the outer `makeAdder(..)` is able to remember whatever `x` value was passed in to `makeAdder(..)`. Now let's use `makeAdder(..)`:

    ```js
    // `plusOne` gets a reference to the inner `add(..)`
    // function with closure over the `x` parameter of
    // the outer `makeAdder(..)`
    var plusOne = makeAdder(1);

    // `plusTen` gets a reference to the inner `add(..)`
    // function with closure over the `x` parameter of
    // the outer `makeAdder(..)`
    var plusTen = makeAdder(10);

    plusOne(3); // 4 < --1 + 3
    plusOne(41); // 42 <-- 1 + 41

    plusTen(13); // 23 <-- 10 + 13
    ```

    1. When we call `makeAdder(1)`, we get back a reference to its inner `add(..)` that remembers `x` as `1`. We call this function reference `pluseOne(..)`.
    2. When we call `makeAdder(10)`, we get back another reference to its inner `add(..)` that remembers `x` as `10`. We call this function reference `pluseTen(..)`.
    3. When we call `plusOne(3)`, it adds `3` (its inner `y`) to be `1` (remembered by `x`), and we get `4` as the result.
    4. When we call `plusTen(13)`, it adds `13` (its inner `y`) to be `10` (remembered by `x`), and we get `23` as the result.

- Closure is one of the most powerful and useful techniques in all of programming.

## Modules

- The most common usage of closure in **Javascript** is the module pattern.
- Modules are actually some functions and have some inner functions and use some closures and usually returns an `object`. For example:

    ```js
    function User() {
        var username, password;

        function doLogin(user, pw) {
            username = user;
            password = pw;

            // do the rest of the login work
        }

        var publicAPI = {
            login: doLogin
        };

        return publicAPI;
    }

    // create a `User` module instance
    var fred = User();

    fred.login("fred", "12Battery34!");
    ```

## `this` Identifier

- `this` indentifier is very commonly misunderstood concept in **Javascript**.
- `this` is **Javascript** is not related to **object-oriented** patterns.
- It's important to realize that `this` does not refer to a function itself, as the most common misconception.

- Consider:

    ```js
    function foo() {
        console.log(this.bar);
    }

    var bar = "global";

    var obj1 = {
        bar: "obj1",
        foo: foo
    };

    var obj2 = {
        bar: "obj2"
    };

    // --------

    foo(); // "global"
    obj1.foo(); // "obj1"
    foo.call(obj2);// "obj2"
    new foo(); // undefined
    ```

    1. `foo()` ends up setting `this`to the global object in non-strict mode -- in strict mode, `this` would be `undefined` and you'd get an error in accessing the `bar` property -- so `"global"` is the value found for `this.bar`.
    2. `obj1.foo()` sets `this` to the `obj1` object.
    3. `foo.call(obj2)` sets `this` to the `obj2` object.
    4. `new foo()` sets `this` to a brand new empty object.

## Prototypes

- You could think of prototype almost as a fallback if the property is missing.
- Consider:

    ```js
    var foo() {
        a: 42;
    }

    // create `bar` and link it to `foo`
    var bar = Object.create(foo);

    bar.b = "hello world";

    bar.b; // "hello world"
    bar.a; // 42 <-- delegated to `foo`
    ```

    The `a` property doesn't actually exist on the `bar` object, but because `bar` is prototype-linked to `foo`, **Javascript** automatically falls back to looking for `a` on the `foo` object, where it's found.

## Polyfilling

- Consider:

    ```js
    if (!Number.isNaN) {
        Number.isNaN = function isNaN(x) {
            return x !== x;
        };
    }
    ```

    The `if` statement guards againts applying the polyfill definition in ES6 browsers where it will already exist. If it's not already present, we define `Number.isNaN(..)`.

  - The `NaN` value is the only one that would make `x !== x` be `true`.
  - The `NaN` is the only value in the whole language that is not equal to itself.

## Transpiling

- Transpiling means transforming + compiling.
- The new syntax added to the language is designed to make your code more readable and maintainable and you should prefer writing newer and cleaner syntax, not only for yourself but for all other memebers of the development team.
- Using the new syntax earlier allows it to be tested more robustly in the real world, which provides earlier feedback to the **Javascript** committee (TC39).
- ES6 adds a feature called **"default parameter values"**. It looks like this:

    ```js
    function foo(a = 2) {
        console.log(a);
    }

    foo(); // 2
    foo(42); // 42
    ```

    So this new syntax is invalid in pre-ES6 engines. The transpiler should make it run in older environments, like this:

    ```js
    // `void 0` means `undefined`
    function foo() {
        var a = arguments[0] !== (void 0) ? arguments[0] : 2;
        console.log(a);
    }

    foo(); // 2
    foo(42); // 42
    ```

- The `undefined` is the only value that can't get explicitly passed in for a default-value parameter, but the transpiled code makes that much more clear.
- You can use **Babel** and **Traceur** for transpiling.

## Non-JavaScript

- The most common non-JavaScript JavaScript you'll encounter is the DOM API. For example:

    ```js
    var el = document.getElementById("foo");
    ```

    The `document` variable exists as a global variable when your code is running in a browser. It's not provided by the **Javascript** engine. These kind of variables are called **"host objects"**. `getElementById(..)` is also a built-in method on `document` provided by the DOM from your browser.

- `alert(..)` is provided to your **Javascript** program by the browser, not by the **Javascript** engine itself. The same goes with `console.log(..)`.
- You need to be aware of non-**Javascript** variable or methods, as they'll be in every **Javascript** program you write.

## Async & Performance

- The callback alone is hopelessly insufficient for the modern demands of asynchronous programming.
- There are two major deficiencies of callbacks-only coding: Inversion of Control (IoC) trust loss and lack of linear reason-ability. ES6 introduces two new mechanisms (and indeed, patterns): **Promises** and **Generators**.
- Promises are a time-independent wrapper around a "future value," which lets you reason about and compose them regardless of if the value is ready or not yet. Moreover, they effectively solve the IoC trust issues by routing callbacks through a trustable and composable promise mechanism.
- The generator can be paused `yield` points and be resumed asynchronously later.
- The combination of promises and generators that **"yields"** our most effective asynchronous coding pattern to date in **Javascript**.
- To be serious about programming effectively in an async world, you're going to need to get really comfortable with combining promises and generators.
- You should take a program from **"it works"** to **"it works well"**.

## ES6 & Beyond

- **Javascript** evoulation is increasing rapidly.
- ES6 includes new syntax, new data structures (collections), new processing capabilities and new API's.
- ES6 have some exciting things to look forward to reading about: destructuring, default parameter values, symbols, concise methods, computed properties, arrow functions, block scoping, promises, generators, iterators, modules, proxies,weakmaps and much, much more.
