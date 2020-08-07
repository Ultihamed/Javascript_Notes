# ES6 & Beyond

![ES6](https://scotch-res.cloudinary.com/image/upload/w_1050,q_auto:good,f_auto/media/4741/PTLHvdFMQuW7VhAXQc0G_es6_what_to_use_and_what_not_to.png.jpg)

## Preface

- The evolutionary changes to the language introduced in the **ECMAScript 2015 Language Specification**.
- ES6 is a radical jump forward for the language.

## Versioning

- The ill-fated ES4 never came about.
- In 2009, ES5 was officially finalized (later ES5.1 in 2011), and settled as the widespread standard for **JavaScript** for the modern revolution and explosion of browsers, such as **Firefox**, **Chrome**, **Opera**, **Safari**, and many others.

## Transpiling

- You can transpile ((transformation + compile) your ES6 code to ES5 to run your program in older browsers. For example consider:

    ```js
    var foo = [1, 2, 3];

    var obj = {
        foo // means `foo: foo`
    };

    obj.foo; // [ 1, 2, 3 ]
    ```

    But (roughly) here's how that transpiles:

    ```js
    var foo [1, 2, 3];

    var obj = {
        foo: foo
    };

    obj.foo; // [ 1, 2, 3 ]
    ```

    It lets us shorten the `foo: foo` in an object literal declaration to just `foo`, if the names are the same.

## Shims/Polyfills

- `Object.is(..)` is a new utility for checking strict equality of two values but without nuanced exceptions that `===` has for `NaN` and `-0` values. The polyfill for `Object.is(..)` is pretty easy:

    ```js
    if (!Object.is) {
        Object.is = function (v1, v2) {
            // test for `-0`
            if (v1 === 0 && v2 ==== 0) {
                return 1 / v1 === 1 / v2;
            }
            // test for `NaN`
            if (v1 !== v2) {
                return v2 !== v2;
            }
            // everything else
            return v1 === v2;
        };
    }
    ```

- If you decide to keep the status quo and just wait around for all browsers without a feature supported to go away before you start using the feature, you're always going to be way behind.

## Block-Scoped Declarations

- Before ES6, if you needed to create a block of scope, the most prevalent way to do so other than a regular function declaration was the immediately invoked function expression (IIFE). For example:

    ```js
    var a = 2;

    (function IIFE() {
        var a = 3;
        console.log(a); // 3
    })();

    console.log(a); // 2
    ```

    But now all we need is a pair of `{..}` to create a scope. Instead of using `var`, which always declares variables attached to the enclosing function (or global, if top level) scope, use `let`. For example:

    ```js
    var a = 2;

    {
        let a = 3;
        console.log(a); // 3
    }

    console.log(a); // 2
    ```

- There's another experimental (not standardized) form of the `let` declaration called the `let`-block, which look likes:

    ```js
    let (a = 2, b, c) {
        // ..
    }
    ```

    Unfortunately, the `let (..) {..}` form, the most expilict of the options, was not adopted in ES6.
- Consider:

    ```js
    let a = 2;

    if (a > 1) {
        let b = a * 3;
        console.log(b); // 6

        for (let i = a; i <= b; i++) {
            let j = i + 10;
            console.log(j);
        }
        // 12 13 14 15 16

        let c = a + b;
        console.log(c); // 8
    }
    ```

    The `if` statement contains `b` and `c` block-scoped variables, and the `for` loop contains `i` and `j` block-scoped variables.
- Accessing a `let`-declared variable earlier than its `let ..` declaration/initialization causes an error, whereas with `var` declarations the ordering doesn't matter (except stylistically). For example:

    ```js
    {
        console.log(a); // undefined
        console.log(b); // ReferenceError!

        var a;
        let b;
    }
    ```

    This error means you're accessing a variable that's been declared but not yet initialized. Explicit assignment or not, you cannot access `b` until the `let be` statement is run.
- `typeof` behaves differently  with TDZ (**T**emporal **D**ead **Z**one) variables than it does with undeclared (or declared!) variables. For example:

    ```js
    {
        // `a` is not declared
        if (typeof a === "undefined") {
            console.log("cool");
        }

        // `b` is declared, but in its TDZ
        if (typeof b === "undefined") { // ReferenceError!
            // ..
        }

        // ..

        let b;
    }
    ```

    So `let` declaration should all be at the top of their scope.
- `const` is a variable that's read-only after initial value is set. For example:

    ```js
    {
        const a = 2;
        console.log(a); // 2

        a = 3; // TypeError!
    }
    ```

    A `const` declaration must have an explicit initialization. If you wanted a constant with the `undefined` value, you'd have declare `const a = undefined` to get it. The value is not frozen or immutable because of `const`, just the assignment of it. If the value is complex, such as an object or array, the contents of the value can still be modified. For example:

    ```js
    {
        const a = [1, 2, 3];
        a.push(4);
        console.log(a); // [ 1, 2, 3, 4 ]
    }

    a = 42; // TypeError!
    ```

    The `a` variable doesn't actually hold a constant array; rather, it holds a constant reference to the array. The array itself is freely mutable.
- To avoid potentially confusing code, only use `const` for variables that you're intentionally and obviously signaling will not change. In other words, don't rely on `const` for code behavior, but instead use it as a tool for signaling intent, when intent can be signaled clearly.
