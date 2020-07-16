# Types & Grammar

![Types & Grammar](https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_1080,q_100,w_1080/v1/gcs/platform-data-duolingo/events/grammar_BgnJsH1.jpg)

## Built-in Types

- A type is an intrinsic, built-in set of characteristics that uniquely identifies the behavior of a particular value and distinguishes it from other values, both to the **Engine** and to the developer.
- Javascript defines seven built-in types:
    1. `null`
    2. `undefined`
    3. `boolean`
    4. `number`
    5. `string`
    6. `object`
    7. `symbol` --- added in ES6!

    All of these types except `object` are called **primitives**.
- The `typeof` operator inspects the type of the given value, and always returns one of seven string values. For example:

    ```js
    typeof undefined        === "undefined"; // true
    typeof true             === "boolean";   // true
    typeof 42               === "number";    // true
    typeof "42"             === "string";    // true
    typeof { life: 42}      === "object";    // true
    typeof [1, 2, 3]        === "object";    // true
    typeof function () { }  === "function";  // true
    typeof null             === "object";    // true - buggy in JavaScript
    typeof Symbol()         === "symbol";    // true - added in ES6
    ```

- `null` is the only primitive value that is **falsy**, but that also returns `"object"` from the `typeof` check.
- Function is actually a **subtype** of object. They can have properties. For example:

    ```js
    function a(b, c) {
        /* .. */
    }
    ```

    The function object has a `length` property set to the number of formal parameters it is declared with. For instance:

    ```js
    a.length; // 2
    ```

## Values as Types

- In **JavaScript**, variables don't have types -- **values have types**. Variables can hold any value, at any time.
- A variable can, in one assignment statement, hold a `string`, and in the next hold a `number`, and so on.
- The value, like `"42"` with the `string` type, can be created from the `number` value through a process called **coercion**.
- If you use `typeof` against a variable, it's not asking "what's the type of the variable?" as it may seem, since **JavaScript** variables have to types. Instead, it's asking "what's the type of the value in the variable?". For example:

    ```js
    var a = 42;
    typeof a; // "number"

    a = true;
    typeof a; // "boolean"
    ```

- The `typeof` operator always returns a string. So:

    ```js
    typeof typeof 42; // "string"
    ```

- Avoid declare variables using `window`, for example: `window.a = 42;`. It's not working in some **JavaScript** environments (like **Node.js**).

## `undefined` vs undeclared

- Variables that have no value currently, actually have the `undefined` value. Calling `typeof` against such variables will return `"undefined"`. For example:

    ```js
    var a;

    typeof a; // "undefined"

    var b = 42;
    var c;

    // later
    b = c;

    typeof b; // "undefined"
    typeof c; // "undefined"
    ```

- An **undeclared** variable is one of that has not been formally declared in the accessible scope. For example:

    ```js
    var a;

    a; // "undefined"
    b; // ReferenceError: b is not defined

    typeof a; // "undefined"
    typeof b; // "undefined"
    ```

## Arrays

- you can make multidimensional `array`s in **JavaScript**. For example:

    ```js
    var a = [1, "2", [3]];

    a.lenght; // 3
    a[0] === 1; // true
    a[2][0] === 3; // true
    ```

- In **JavaScript**, you don't need to presize your `array`s, you can just declare then and add values as you see fit:

    ```js
    var a = [];

    a.lenght; // 0

    a[0] = 1;
    a[1] = "2";
    a[2][3];

    a.lenght; // 3
    ```

- Using `delete` on an `array` value will remove that slot from the `array`, but if you even remove the final element, it does not update the `lenght` property, so be careful!
- Be careful about creating **sparse** `array`s (leaving or creating /empty/missing slots). For example:

    ```js
    var a = [];

    a[0] = 1;
    // no `a[1]` slot set here
    a[2] = [3];

    a[1]; // undefined

    a.lenght; // 3
    ```

- `array`s are numerically indexed, but the tricky thing is that they also are objects that can have `string` keys/properties added to them (but which don't count toward the `lenght` of the `array`). For example:

    ```js
    var a = [];

    a[0] = 1;
    a["foobar"] = 2;

    a.lenght; // 1
    a["foobar"]; // 2
    a.foobar; // 2
    ```

- You must be aware of, a `string` value intended as a key can be coerced to a standard base-10 `number`, then it is assumed that you wanted to use it as a `number` index rather than as a `string` key. For example:

    ```js
    var a = [];

    a["13"] = 42;

    a.lenght; // 14
    ```

- Use `object`s for holding values in keys/properties, and save `array`s for strictly numerically indexed values.

## String

- `string`s are like `array`s. For instance, both of them have a `lenght` property, and `indexOf(..)` method, and a `concat(..)` method. But in **JavaScript**, `string` is not `array`s of characters. For example:

    ```js
    var a = "foo";
    var b = ["f", "o", "o"];

    a.lenght; // 3
    b.lenght; // 3

    a.indexOf("o"); // 1
    b.indexOf("o"); // 1

    var c = a.concat("bar"); // "foobar"
    var d = b.concat(["b", "a", "r"]); // ["f", "o", "o", "b", "a", "r"]

    a === c; // false
    b === d; // false

    a; // "foo"
    b; // ["f", "o", "o"]

    a[1] = "O";
    b[1] = "O";

    a; // "foo"
    b; // ["f", "O", "o"]
    ```

    **JavaScript** `string`s are immutable, while `array`s are quite mutable.
- You can convert a `string` to an `array` (aka, **hack**). For example:

    ```js
    var a = "Persian Sight";

    var c = a.split("").reverse().join("");

    c; // "thgiS naisreP"
    ```
