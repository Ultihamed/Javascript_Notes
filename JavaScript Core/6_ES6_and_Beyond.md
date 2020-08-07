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

## Block-Scoped Functions

- Consider:

    ```js
    {
        foo(); // works!

        function foo() {
            // ..
        }
    }

    foo(); // Reference Error
    ```

    The `foo()` function is declared inside the `{..}` block, and as ES6 is block-scoped there. So it's not available outside that block. But also note that it is **hoisted** within the block, as opposed to `let` declaration, which suffer the TDZ error trap.

## Spread/Rest

- ES6 introduces a new `...` operator that's typically referred to as the **spread or rest operator**, depending on where/how it's used. For example:

    ```js
    function foo(x, y, z) {
        console.log(x, y, z);
    }

    foo(...[1, 2, 3]); // 1 2 3
    ```

    When `...` is used in front of an array (actually, any iterable), it acts to spread it out into its individual value. The `...` operator acts to give us a simpler syntactic replacement for the `apply(..)` method, which we would typically have used pre-ES6 as:

    ```js
    foo.apply(null, [1, 2, 3]);
    ```

- The `...` operator can be used to spread out/expand a value in other contexts as well, such as inside another array declaration. For example:

    ```js
    var a = [2, 3, 4];
    var b = [1, ...a, 5];

    console.log(b); // [ 1, 2, 3, 4, 5 ]
    ```

    In this usage of `...` is basically replacing `concat(..)`, as it behaves like `[1].concat(a, [5])` here.
- You can use `...` operator to gather a set of values together into an array. Consider:

    ```js
    function foo(x, y, ...z) {
        console.log(x, y, z);
    }

    foo(1, 2, 3, 4, 5); // 1 2 [ 3, 4, 5 ]
    ```

    The `...z` in this snippet essentially saying: "gather the rest of the arguments (if any) into an array called `z`". Because `x` was assigned `1`, and `y` was assigned `2`, the rest of the arguments `3`, `4`, and `5` were gathered into `z`. Of course, if you don't have any named parameters, the `...` gathers all arguments. For example:

    ```js
    function foo(...args) {
        console.log(args);
    }

    foo(1, 2, 3, 4, 5); // [ 1, 2, 3, 4, 5 ]
    ```

    The `...args` in the `foo(..)` function declaration is usually called **rest parameters**, because you're collecting the rest of the parameters.

## Default Parameter Values

- Consider this pre-ES6 snippet:

    ```js
    function foo(x, y) {
        x = x || 11;
        y = y || 31;

        console.log(x + y);
    }

    foo(); // 42
    foo(5, 6); // 11
    foo(5); // 36
    foo(null, 6); // 17
    ```

    This way can be more dangerous, if for example you need to be able to pass in what would otherwise be considered a falsy value for one of the parameters. For example:

    ```js
    foo(0, 42); // 53 <-- Oops, not 42
    ```

    Why? Because the `0` is falsy, and so the `x || 11` results in `11`, not the directly passed in `0`. To fix this gotcha, some people will instead write the check more verbosely like this:

    ```js
    function foo(x, y) {
        x = (x !== undefined) ? x : 11;
        y = (y !== undefined) ? x : 31;

        console.log(x + y);
    }

    foo(0, 42); // 42
    foo(undefined, 6); // 17
    ```

    There's a principle applied to **JavaScript**'s design here that is important to remember: `undefined` means missing. That is, there's no difference between `undefined` and missing, at least as far as function arguments go.
- A nice helpful syntax added as of ES6 to streamline the assignment of default values to missing arguments:

    ```js
    function foo(x = 11, y = 31) {
        console.log(x + y);
    }

    foo(); // 42
    foo(5, 6); // 11
    foo(0, 42); // 42

    foo(5); // 36
    foo(5, undefined); // 36 <-- `undefined` is missing
    foo(5, null); // 5 <-- null coerces to `0`

    foo(undefined, 6); // 17 <-- `undefined` is missing
    foo(null, 6); // 6 <-- null coreces to `0`
    ```

    `x = 11` in a function declaration is more like `x !== undefined ? x : 11` than much more common idiom `x || 11`, so you'll need to be careful in converting your pre-ES6 code to this ES6 default parameter value syntax.
- A rest/gather parameters cannot have a default value. So, while `function foo(...vals=[1, 2, 3]) {` might seem an intriguing capability, it's not valid syntax. You'll need to continue to apply that sort of logic manually if necessary.

## Default Value Expressions

- Function default values can be any valid expression, even a function call. For example:

    ```js
    function bar(val) {
        console.log("bar caleld!");
        return y + val;
    }

    function foo(x = y + 3, z = bar(x)) {
        console.log(x, y);
    }

    var y = 5;
    foo();   // "bar called"
             // 8 13
    foo(10); // "bar called"
             // 10 15

    y = 6;
    foo(undefined, 10); // 9 10
    ```

    The default value expressions are only run if and when they're needed -- that is, when a parameter's argument is ommited or is `undefined`.
- A reference to an identifier in a default value expression first matches the formal parameters' scope before looking to an outer scope. Consider:

    ```js
    var w = 1, z = 2;

    function foo(x = w + 1, y = x + 1, z = z + 1) {
        console.log(x, y, z);
    }

    foo(); // ReferenceError
    ```

    The `w` in the `w + 1` default value expression looks for `w` in the formal parameters' scope, but does not find it, so the outer scope's `w` is used. Next, the `x` in the `x + 1` default value expression finds `x` in the formal parameters' scope, and luckily `x` has already been initialized, so the assignment to `y` works fine. However, the `z` in the `z + 1` finds `z` as a not-yet-initialized-at-that-moment paramater variable, so it never tries to find the `z` from the outer scope. ES6 has a TDZ, which prevents a variable from being accessed in its uninitialized state. As such, the `z + 1` default value expression throws a TDZ `ReferenceError` error.
- A default value expression can even be an inline function expression call -- commonly referred to as an immediately invoked function expression (IIFE). For example:

    ```js
    function foo(x =
        (function (v) { return v + 11; })(31)
    ) {
        console.log(x);
    }

    foo(); // 42
    ```
