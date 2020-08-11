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

## Destructing

- Consider:

    ```js
    function foo() {
        return [1, 2, 3];
    }

    var tmp = foo(),
        a = tmp[0], b = tmp[1], c = tmp[2];

    console.log(a, b, c); // 1 2 3
    ```

    As you can see, we created a manual assignment of the values in the array that `foo()` return individual variables `a`, `b`, and `c`, and to do so we (unfortunately) needed the `tmp` variable. Similarly, we can do the following with objects. For example:

    ```js
    function bar() {
        return {
            x: 4,
            y: 5,
            z: 6
        };
    }

    var tmp = bar(),
        x = tmp.x, y = tmp.y, z = tmp.z;

    console.log(x, y, z); // 4 5 6
    ```

    ES6 adds a dedicated syntax for destructuring, specifically array destructuring and object destructuring. This syntax eliminates the need for the `tmp` variable in the previous snippet, making them much cleaner. Consider:

    ```js
    var [a, b, c] = foo();
    var { x: x, y: y, z: z } = bar();

    console.log(a, b, c); // 1 2 3
    console.log(x, y, z); // 4 5 6
    ```

    That `[a, b ,c]` on the lefthand side of `=` assignment treated as a kind of **pattern** for decomposing the righthand side array value into separate variable assignment. Similarity, `{ x: x, y: y, z: z }` specifies a **pattern** to decompose the object value from `bar()` into separate variable assignments. If the property name being matched is the same as the variable you want to declare, you can actually shorten the syntax. For example:

    ```js
    var { x, y, z } = bar();

    console.log(x, y, z); // 4 5 6
    ```

    We're actually leaving off the `x:` part when we use the shorter syntax.
- When you use object destructuring assignment -- that is, putting the `{..}` object literal-looking syntax on the lefthand side of the `=` operator -- you invert that `target: source` pattern. Consider:

    ```js
    var { x: bam, y: baz, z: bap } = bar();
    ```

    Here `x: bam` means the `x` property is the source value and `bam` is the target variable to assign to. In other words, object literals are `target <-- source`, and object destructing assignments are `source --> target`. For example:

    ```js
    var aa = 10, bb = 20;

    var o = { x: aa, y: bb };
    var     { x: AA, y: BB } = o;

    console.log(AA, BB);
    ```

- Destructuring is a general assignment operation, not just a declaration. For example:

    ```js
    var a, b, c, x, y, z;

    [a, b, c] = foo();
    ({ x, y, z } = bar());

    console.log(a, b, c); // 1 2 3
    console.log(x, y, z); // 4 5 6
    ```

    The assignment expression don't actually need to be just variable identifiers. Anything that's a valid assignment expression is allowed. For example:

    ```js
    var o = {};

    [o.a, o.b, o.c] = foo();
    ({ x: o.x, y: o.y, z: o.z } = bar());

    console.log(o.a, o.b, o.c); // 1 2 3
    console.log(o.x, o.y, o.z); // 4 5 6
    ```

    You can even use computed property expressions in the destructing. For example:

    ```js
    var which = "x", o = {};

    ({ [which]: o[which] } = bar());

    console.log(o.x); // 4
    ```

    The `o[which]` part is just a normal object key reference, which equates to `o.x` as the target of the assignment.
- With object destructor you can use the general assignments to create object mappings/transformations. For example:

    ```js
    var o1 = {a: 1, b: 2, c: 3},
        o2 = {};

    ({ a: o2.x, b: o2.y, c: o2.z } = o1);

    console.log(o2.x, o2.y, o2.z); // 1 2 3
    ```

    Or you can map an object to an array. For example:

    ```js
    var o1 = { a: 1, b: 2, c: 3},
        o2 = [];

    ({ a: o2[0], b: o2[1], c: o2[3] } = o1);

    console.log(a2); // [ 1, 2 ,3 ]
    ```

    Or the other way around:

    ```js
    var a = [1, 2, 3].
        o2 = {};

    [o2.a, o2.b, o2.c] = a;

    console.log(o2.a, o2.b, o2.c); // 1 2 3
    ```

    Or you could reorder one array to another:

    ```js
    var a1 = [1, 2, 3],
        a2 = [];

    [a2[2], a2[0], a2[1]] = a1;

    console.log(a2); // [ 2, 3, 1 ]
    ```

- You can solve the traditional **swap two variables** task without a temporary variable using ES6 destructor. For example:

    ```js
    var x = 10, y = 20;

    [y, x] = [x, y];

    console.log(x, y); // 20 10
    ```

- The object destructuring form allows a source property (holding any value type) to be listed multiple times. For example:

    ```js
    var { a: X, a: Y } = { a: 1 };

    console.log(X); // 1
    console.log(Y); // 2
    ```

- You can use destructing assignment like JSON or with an object literal value for readability sake. For example:

    ```js
    // harder to read:
    var { a: { b: [c, d], e: { f } }, g } = obj;

    // better:
    var {
        a : {
            b: [c, d],
            e: {f}
        },
        g
    } = obj;
    ```

- With both array destructuring assignment and object destructuring assignment, you do not have to assign all the values that are present. For example:

    ```js
    var [, b] = foo();
    var { x, z } = bar();

    console.log(b, x, y); // 2 4 6
    ```

    The `1` and `3` values that came back from `foo()` are discarded, as is the `5` value from `bar()`.
- If you try to assign more values than are present in the value you're
destructuring/decomposing, you get graceful fallback to `undefined`, as you'd expect. For example:

    ```js
    var [,, c, d] = foo();
    var {w, z} = bar();

    console.log(c, z); // 3 6
    console.log(d, w); // undefined undefined
    ```

- In addition to the gather/rest usage in function declarations, `...` can perform the same behavior in destructing assignments. For example:

    ```js
    var a = [2, 3, 4];
    var b = [1, ...a, 5];

    console.log(b); // [ 1, 2, 3, 4, 5 ]
    ```

    If `...a` appears in an array destructing position, it performs the gather behavior. For example:

    ```js
    var a = [2, 3, 4];
    var [b, ...c] = a;

    console.log(b, c); // 2 [ 3, 4 ]
    ```

    The first part names `b` for the first value in `a` (`2`). But then `...c` gathers the rest of the values (`3` and `4`) into an array and calls it `c`.

- Both forms of destructing (array and object) can offer a default value option for an assignment, using the `=` syntax similar to the default function argument values. For example:

    ```js
    var [a = 3, b = 6, c = 9, d = 12] = foo();
    var { x = 5, y = 12, z = 15, w = 20 } = bar();

    console.log(a, b, c, d); // 1 2 3 12
    console.log(x, y, z, w); // 4 5 6 20
    ```

    Here `d` and `w` are `undefined` in `foo` and `bar` function. Instead they used their default values (`12` for `d`, and `20` for `w`). You can combine the default value assignment with the alternative assignment expression syntax. For example:

    ```js
    var { x, y, z, w: WW = 20 } = bar();

    console.log(x, y, z, WW); // 4 5 6 20
    ```

- Destructuring is great and can be very useful, but it's also a sharp sword that can cause injury (to someone's brain) if used unwisely.

## Nested Destructing

- If the values you're destructing have nested objects or arrays, you can destructure those nested value as well. For example:

    ```js
    var a1 = [1, [2, 3, 4], 5];
    var o1 = { x: { y: { z: 6 } } };

    var [a, [b, c, d], e] = a1;
    var { x: { y: { z: w } } } = o1;

    console.log(a, b, c, d, e); // 1 2 3 4 5
    console.log(w); // 6
    ```

- Nested destructuring can be a simple way to flatten out object namespaces. For example:

    ```js
    var App = {
        model: {
            User: function () {..}
        }
    };

    // instead of:
    // var User = App.model.User;

    var { model: { User } } = App;
    ```

## Destructuring Parameters

- Consider array destructuring for parameters:

    ```js
    function foo([x, y]) {
        console.log(x, y);
    }

    foo([1, 2]); // 1 2
    foo([1]); // 1 undefined
    foo([]); // undefined undefined
    ```

    Object destructuring for parameters works, too:

    ```js
    function foo({ x, y }) {
        console.log(x, y);
    }

    foo({ y: 1, x: 2 }); // 2 1
    foo({ y: 42 }); // undefined 42
    foo({}); // undefined undefined
    ```

    We get optional parameters (in any position) for free, as you can see leaving off the `x` **parameter** worked as we'd expect. Of course, all variations of destructuring are available to us with parameter destructuring, including nested destructuring, default values, and more. For example:

    ```js
    function f1([x = 2, y = 3, z]) {..}
    function f2([x, y, ...z], w) {..}
    function f3([x, y, ...z], ...w) {..}

    function f4({ x : X, y }) {..}
    function f5({ x: x = 10, y: 20 }) {..}
    function f6({ x = 10 } = {}, { y } = { y: 10 }) {..}
    ```

    Let's take one example from this snippet and examine it, for illustration purposes:

    ```js
    function f3([x, y, ...z], ...w) {
        console.log(x, y, z, w);
    }

    f3([]); // undefined undefined
    f3([1, 2, 3, 4], 5, 6); // 1 2 [ 3, 4 ] [ 5, 6 ]
    ```

## Object Literal Extensions

- If you need to define a property that is the same name as a lexical identifier, you can shorten it for example `x: x` to `x`. For example:

    ```js
    // pre-ES6
    var x = 2, y = 3;
    var obj = {
        x: x,
        y: y
    }

    // ES6 and beyond
        var x = 2, y = 3;
    var obj = {
        x,
        y
    }
    ```

- Functions attached to properties in object literals have a concise form (concise method). For example:

    ```js
    // pre-ES6
    var o = {
        x: function {
            // ..
        },
        y: function {
            // ..
        }
    }

    // ES6 and beyond
    var o = {
        x() {
            // ..
        },
        y() {
            // ..
        }
    }
    ```

    concise methods have special behaviors that their older counterpart don't. Specifically, the allowance for `super` keyword. Generators also have a concise method form. Fo example:

    ```js
    var o {
        *foo() {
            // ..
        }
    };
    ```

- Concise methods imply anonymous function expressions.

## ES5 Getter/Setter

- Consider:

    ```js
    var o = {
        __id: 10,
        get id() { return this.__id++; },
        set id(v) { this.__id = v; }
    }

    o.id;      // 10
    o.id;      // 11
    o.id = 20;
    o.id;      // 20

    // ..
    o.id;      // 21
    o.id;      // 22
    ```

    These getter and setter literal forms are also present in classes.
- The setter literal must have exactly one declared parameters. Omitting it or listing others is illegal syntax. The single required parameter can use destructuring and defaults (e.g., `set id({ id: v = 0 }) {..}`), but the gather/rest `...` is not allowed(`set id(...v) {..}`).

## Computed Property Names

- ES6 adds a syntax to the object literal definition which allows you to specify an expression that should be computed, whose result is the property name assigned. For example:

    ```js
    var prefix = "user_";

    var o = {
        baz: function (..) {..},
        [prefix + "foo"]: function (..) {..},
        [prefix + "baz"]: function (..) {..}
        ..
    };
    ```

    Probably the most common use of computed property names will be with `Symbol`s. For example:

    ```js
    var o = {
        [Symbol.toStringTag]: "Really cool thing",
        ..
    };
    ```

- Computed property names can also appear as the name of a concise method or a concise generator. For example:

    ```js
    var o = {
        ["f" + "oo"]() {..}, // computed concise method
        *["b" + "ar"]() {..} // computed concise generator
    }
    ```

## Setting `[[Prototype]]`

- Consider:

    ```js
    var o1 = {
        //..
    };

    var o2 = {
        __proto__: o1,
        // ..
    }
    ```

    `o2` is declared with a normal object literal, but it's also `[[Prototype]]`-linked to `o1`. The `__proto__` property name here can also be a string `"__proto__"`. It cannot be the result of a computed property name. Don't use it like `o.__proto__`. This form is both a getter than setter. Instead, you can use the ES6 `Object.setPrototypeOf(..)` utility. For example:

    ```js
    var o1 = {
        // ..
    };

    var o2 = {
        // ..
    };

    Object.setPrototypeOf(o2, o1);
    ```

## Object `super`

- You can use `super` in plain objects' concise methods. For example:

    ```js
    var o1 = {
        foo() {
            console.log("o1:foo");
        }
    };

    var o2 = {
        foo() {
            super.foo();
            console.log("o2:foo");
        }
    };

    Object.setPrototypeOf(o2, o1);

    o2.foo();
    ```

- `super` is only allowed in concise method, not regular function expression properties. It also only allowed in `super.XXX` form (for property/method access), not in `super()` form.

## Template Literals

- ES6 introduces a new type of string literal, using the ``` ` ``` backtick as the delimiter. These string literals allow basic string interpolation expressions to be embedded, which are then automatically parsed and evaluated. Consider this old pre-ES6 way:

    ```js
    var name = "Kyle";

    var greeting = "Hello" + name + "!";

    console.log(greeting); // "Hello Kyle"
    console.log(typeof greeting); // "string"
    ```

    Now, see the new ES6 way:

    ```js
    var name = "Kyle";

    var greeting = `Hello ${name}!`;

    console.log(greeting); // "Hello Kyle!"
    console.log(typeof greeting); // "string"
    ```

    The fancy term for such parsing and evaluating is interpolation (much more accurate than templating). The result of a ``` `..` ``` string literal is, simply, just a string.
- One really nice benefit of interpolated string literals is they are allowed to split across multiple lines. For example:

    ```js
    var text =
        `Now is the time for all good men
        to come to the aid of their
        country!`;

    console.log(text);
    // Now is the time for all good men
    // to come to the aid of their
    // country!
    ```

- Any valid expression is allowed to appear inside `${..}` in an interpolated string literal, including function calls, inline function expression calls, and even other interpolated string literals. For example:

    ```js
    function upper(s) {
        return s.toUpperCase();
    }

    var who = "reader";

    var text =
        `A very ${upper("warm")} welcome
        to all of you ${upper(`${who}s`)}!`;

    console.log(text);
    // A very WARM welcome
    // to all of you READERS!
    ```

- An interpolated string literal is just lexically scoped where it appears, not dynamically scoped in any way. For example:

    ```js
    function foo(str) {
        var name = "foo";
        console.log(str);
    }

    function bar() {
        var name = "bar";
        foo(`Hello from ${name}!`);
    }

    var name = "global";

    bar(); // "Hello from bar!"
    ```

- You can split your interpolated string literal by using **tagged string literals**. For example:

    ```js
    function foo(strings, ...values) {
        console.log(strings);
        console.log(values);
    }

    var Hamed = "Hamed";
    var Hamid = "Hamid";

    // tag function
    foo`My name is ${Hamed} and my brother name is ${Hamid}`;
    // [ 'My name is ', ' and my brother name is ', '' ]
    // [ 'Hamed', 'Hamid' ]
    ```

- ES6 comes with a built-in function that can be used as a string literal tag: `String.raw(..)`. It simply passes through the raw version of the `strings` values. For example:

    ```js
    console.log("Hello\nWorld");
    // Hello
    // World

    console.log(String.raw`Hello\nWorld`);
    // Hello\nWorld

    console.log(String.raw`Hello\nWorld`.length);
    // 12
    ```

## Arrow Functions

- It's the primary motivation for the new ES6 `=>` feature. Let's see an arrow function looks like, as compared to normal functions::

    ```js
    function foo(x, y) {
        return x + y;
    }

    // versus

    var foo = (x, y) => x + y;
    ```

    Here, brackets (`{..}`) were ommited. Because there's only one expression (it's optional). There's an implied `return` in front of the expression. Here's some other arrow function variations to consider:

    ```js
    var f1 = () => 12;
    var f2 = x => x * 2;
    var f3 = (x, y) = {
        var z = x * 2 + y;
        y++;
        x *= 3;
        return (x + y + z) / 2;
    }
    ```

- Arrow functions are anonymous function expressions.
- All the capabilities of normal function parameters are available to arrow functions, including default values, destructuring, rest parameters, and so on.
- You can use arrow functions as callbacks. For example:

    ```js
    var a = [1, 2, 3, 4, 5];

    a = a.map(v => v * 2);

    console.log(a); // [ 2, 4, 6, 8, 10 ]
    ```

- Inside arrow functions, the `this` binding is not dynamic, but instead lexical. Consider:

    ```js
    var controller = {
        makeRequest: function (..) {
            btn.addEventListener("click", () => {
                // ..
                this.makeRequest(..);
            }, false);
        }
    };
    ```

    Lexical `this` in the arrow function callback in the previous snippet now points to the same value as in the enclosing `makeRequest(..)` function. In other words, `=>` is a syntactic stand-in for `var self = this`.

## `for..of` Loops

- The value you loop over with `for..of` must be an iterable, or it must be a value which can be coerced/boxed to an object that is an iterable.
- Let's compare `for..of` to `for..in` to illustrate the difference:

    ```js
    var a = ["a", "b", "c", "d", "e"];

    for (var inx in a) {
        console.log(idx);
    }
    // 0 1 2 3 4

    for (var val of a) {
        console.log(val);
    }
    // "a" "b" "c" "d" "e"
    ```

    As you can see, `for..in` loops over the keys/indexes in the `a` array, while `for..of` loops over the values in `a`.
- Standard built-in values in **JavaScript** that are by default iterables (or provide them) include:
  - Arrays
  - Strings
  - Generators
  - Collections / TypedArrays
- Here's how to loop over the characters in a primitive string:

    ```js
    for (var c of "hello") {
        console.log(c);
    }
    // "h" "e" "l" "l" "o"
    ```

    The `"hello"` primitive string value is coerced/boxed to the `String` object wrapper equivalent, which is an iterable by default.
- You can do assignmet expressions with `for..of`. For example:

    ```js
    var o = {};

    for (o.a of [1, 2, 3]) {
        console.log(o.a);
    }
    // 1 2 3

    for ({x: o.a} of [{ x: 1 }, { x: 2 }, { x: 3 }]) {
        console.log(o.a);
    }
    // 1 2 3
    ```

## Regular Expressions

- In ES6, the `u` flag tells a regular expression to process a string with the interpretation of Unicode (UTF-16) characters, such that such an extended character will be mached as a single entity.
- Consider:

    ```js
    // non-sticky mode
    var re1 = /foo/,
        str = "++foo++";

    re1.lastIndex; // 0
    re1.test(str); // true
    re1.lastIndex; // 0 -- not updated

    re1.lastIndex = 4;
    re1.test(str); // true -- ignored `lastIndex`
    re1.lastIndex; // 4 -- not updated
    ```

    1. `test(..)` doesn't pay any attension to `lastIndex`'s value, and always performs its match from the beginning of the input string.
    2. Because our pattern does not have a `^` start-of-input anchor, the search for `"foo"` is free to move ahead through the whole string looking for a match.
    3. `lastIndex` is not updated by `test(..)`.

    Now let's try a **sticky mode** regular expression:

    ```js
    // sticky mode
    var re2 = /foo/y,
        str = "++foo++";

    re2.lastIndex; // 0
    re2.test(str); // false -- "foo" not around at `0`
    re2.lastIndex; // 0

    re2.lastIndex = 2;
    re2.test(str); // true
    re2.lastIndex; // 5 -- updated to after previous match

    re2.test(str); // false
    re2.lastIndex; // 0 -- reset after previous match failure
    ```

    1. `test(..)` uses `lastIndex` as the exact and only position in `str` to look to make a match. There is no moving ahead to look for the match -- it's either there at the `lastIndex` position or not.
    2. If a match is made, `test(..)` updates `lastIndex` to point to the chatacter immediately following the match. If a match fails, `test(..)` resets `lastIndex` back to `0`.
- Consider:

    ```js
    var re = /f../y,
        str = "foo       far       fad";

    str.match(re); // [ 'foo' ]

    re.lastIndex = 10;
    str.match(re); // [ 'far' ]

    re.lastIndex = 20;
    str.match(re); // [ 'fad' ]
    ```

    `y` requires that `lastIndex` be in the exact position for a match to occur. But it doesn't strictly require that you manually set `lastIndex`. If you can't predict the structure of the input string in a sufficiently patterned way, this technique may not be suitable and you may not be able to use `y`.
- Consider:

    ```js
    var re = /\d+\.\s(.*?)(?:\s|$)/y,
        str = "1. foo 2. bar 3. baz";

    str.match(re); // [ '1. foo ', 'foo' ]

    re.lastIndex; // 7 -- correct position!
    str.match(str); // [ '1. bar ', 'bar ]

    re.lastIndex; // 14 -- correct position!
    str.match(str); // [ '3. baz ', 'baz ]
    ```

    This works because I knew something ahead of time about the structure of the input string: there is always a numeral prefix like `"1. "` before the desired match (`"foo"`, etc), and either a space after it, or the end of the string (`$` anchor). So the regular expression I constructed captures all of that in each main match, and then I use a matching group `()` so that the stuff I really care about is separated out for convenience. If you're going to use `y` sticky mode for repeated matches, you'll probably want to look for opportunities to have `lastIndex` automatically positioned as we've just demonstrated.
- You can do a match with the `g` global match flag and the `exec(..)` method. For example:

    ```js
    var re = /o+./g,
        str = "foot book more";

    re.exec(str); // [ 'oot' ]
    re.lastIndex; // 4

    re.exec(str); // [ 'ook' ]
    re.lastIndex; // 9

    re.exec(str); // [ 'or' ]
    re.lastIndex; // 13

    re.exec(str); // null -- no more matches!
    re.lastIndex; // 0 -- starts over now!
    ```

    Now consider:

    ```js
    var re = /o+./g,
        str = "foot book more";

    str.match(re); // [ 'oot', 'ook', 'or' ]
    ```

    The `y` sticky flag will give you one-at-a-time progressive matching with utilities like `test(..)` and `match(..)`. Just make sure the `lastIndex` is always in the right position for each match.
- A pattern like `/^foo/y` will always and only find a `"foo"` match at the beginning of a string, if it's allowed to match there. If `lastIndex` is not `0`, the match will fail. For example:

    ```js
    var re = /^foo/y,
        str = "foo";

    re.test(str); // true
    re.test(false); // false
    re.lastIndex; // 0 -- reset after failure

    re.lastIndex = 1;
    re.test(str); // false -- failed for positioning
    re.lastIndex; // 0 -- reset after failure
    ```

## Regular Expression `flags`

- Prior to ES6, if you wanted to examine a regular expression object to see what flags it had applied, you needed to parse them out. Probably with another regular expression (from the content of the `source` property). For example:

    ```js
    var re = /foo/ig;

    re.toString(); // "/foo/ig"

    var flags = re.toString().match(/\/([grim]*)$/)[1];

    flags; // "ig"
    ```

    As of ES6, you can now get these values directly, with the new `flags` property. For example:

    ```js
    var re = /foo/ig;

    re.flags; // "gi"
    ```

    It's a small nuance, but the ES6 specification calls for the expression's flags to be listed in this order: `"gimuy"`, regardless of what order the original pattern was specified with. That's the reason for the difference between `/ig` and `"gi"`.
- As of ES6, you can override the flags when duplicating. Prior to ES6, it would throw an error. For example:

    ```js
    var re1 = /foo*/y;
    re1.source; // "foo*"
    re1.flags; // "y"

    var re2 = new RegExp(re1);
    re2.source; // "foo*"
    re2.flags; // "y"

    var re3 = new RegExp(re1, "ig");
    re3.source; // "foo*"
    re3.flags; // "gi"
    ```

## Number Literal Extensions

- Consider:

    ```js
    var dec = 10,
        oct = 052,
        hex = 0x2a;
    ```

    The default output interpretation is always base-10. So, the three variables in the previous snippet all have the `42` value stored in them.
- Consider:

    ```js
    Number("42"); // 42
    Number("052"); // 52
    Number("0x2a"); // 42
    ```

    ES5 continued to permit the browser-extended octal form (including such inconsistencies), except that in strict mode, the octal literal (`052`) form is disallowed. The old octal `052` form will be continue to be legal (though unspecified) in non-strict mode, but should really never be used anymore. Here are the new ES6 number literal forms:

    ```js
    var dec = 42,
        oct = 0o52,     // or `0O52
        hex = 0x2a,     // or `0X2a`
        bin = 0b101010; // or `0B101010`
    ```

    The string representations of these forms are all able to be coerced/converted to their number equivalent. For example:

    ```js
    Number("42");       // 42
    Number("0o52");     // 42
    Number("0x2a");     // 42
    Number("0b101010"); // 42
    ```

- As of ES6, you can convert numbers to another numerial system forms. For example:

    ```js
    var a = 42;

    a.toString(); // "42" -- also `a.toString(10)`
    a.toString(8); // "52"
    a.toString(16); // "2a"
    a.toString(2); // "101010"
    ```

## Unicode

- Prior to ES6, **JavaScript** strings could specify Unicode characters using Unicode escaping. For example:

    ```js
    var snowman = "\u2603";
    console.log(snowman); // "☃"
    ```

    The `\uXXXX` Unicode escaping only supports four hexadecimal characters, so you can only represent the BMP set of characters in this way.
- As of ES6, we now have a new form for Unicode escaping (in strings and regular expressions), called Unicode code point escaping. For example:

    ```js
    var gclef = "\u{1D11E}";
    console.log(gclef); // "𝄞"
    ```

    Prior to ES6, you most do something like this:

    ```js
    var gclef = "\uD834\uDD1E";
    console.log(gclef); // "𝄞"
    ```

    As you can see, the difference is the presence of the `{}` in the escape sequence, which allows it to contain any number of hexadecimal characters. Because you only need six to represent the highest possible code point value in Unicode (i.e., 0x10FFFF), this is sufficient.
- By default, **JavaScript** string operations and methods are not sensitive to astral symbols in string values. For example:

    ```js
    var snowman = "☃";
    snowman.length; // 1

    var gclef = "𝄞";
    gclef.length; // 2
    ```

    But you can do a trick to calculate it accurately:

    ```js
    var gclef = "𝄞";

    [...gclef].length; // 1
    Array.from(gclef).length; // 1
    ```

- As of ES6, strings have built-in iterators. This iterator happens to be Unicode-aware, meaning it will automatically output an astral symbol as a single value. But in some case it wouldn't work. For example:

    ```js
    var s1 = "\xE9",
        s2 = "e\u0301";

    // same output
    console.log(s1); // "é"
    console.log(s2); // "é"

    [...s1].length; // 1
    [...s2].lenght; // 2
    ```

    As you can see, `lenght` trick doesn't work with `s2`. In this case, we can perform a Unicode normalization on the value before inquiring about its length, using the ES6 `String#normalize(..)` utility. For example:

    ```js
    var s1 = "\xE9",
        s2 = "e\u0301";

    s1.normalize().length; // 1
    s2.normalize().length; // 1

    s1 === s2; // false
    s1 === s2.normalize(); // true
    ```

    Normalization can even combine multiple adjacent combining marks if there's a suitable Unicode character they combine to. For example:

    ```js
    var s1 = "o\u0302\u0300",
        s2 = s1.normalize(),
        s3 = "ồ";

    s1.length; // 3
    s2.length; // 1
    s3.length; // 1

    s2 === s3; // true
    ```

    Unfortunately, normalization isn't fully perfect here, either. For example:

    ```js
    var s1 = "e\u0301\u0330";

    console.log(s1); // "ḛ́"

    s1.normalize().length; // 2
    ```

- Consider the `charAt(..)` function for pre-ES6 to see characters position:

    ```js
    var s1 = "abc\u0301d",
        s2 = "ab\u0107d",
        s3 = "ab\u{1d49e}d";

    console.log(s1); // "abćd"
    console.log(s2); // "abćd"
    console.log(s3); // "abd"

    s1.charAt(2); // "c"
    s2.charAt(2); // "ć"
    s3.charAt(2); // "" <-- unprintable surrogate
    s3.charAt(3); // "" <-- unprintable surrogate
    ```

    You can hack this by a trick:

    ```js
    var s1 = "abc\u0301d",
        s2 = "ab\u0107d",
        s3 = "ab\u{1d49e}d";

    [...s1.normalize()][2]; // "ć"
    [...s2.normalize()][2]; // "ć"
    [...s3.normalize()][2]; // ""
    ```

    But this trick isn't performance wise. What about a Unicode-aware version of the `charCodeAt(..)` utility? ES6 gives us `codePointAt(..)`. For example:

    ```js
    var s1 = "abc\u0301d",
        s2 = "ab\u0107d",
        s3 = "ab\u{1d49e}d";

    s1.normalize().codePointAt(2).toString(16); // "107"
    s2.normalize().codePointAt(2).toString(16); // "107"
    s3.normalize().codePointAt(2).toString(16); // "1d49e"
    ```

    What about the other direction? A Unicode-aware version of `String.fromCharCode(..)` is ES6's `String.fromCodePoint(..)`. For example:

    ```js
    String.fromCodePoint(0x107); // "ć"

    String.fromCodePoint(0x1d49e); // ""
    ```

    We can combine `String.fromCodePoint(..)` and `codePointAt(..)` to get a better version of a Unicode-aware `charAt(..)`. For example:

    ```js
    var s1 = "abc\u0301d",
        s2 = "ab\u0107d",
        s3 = "ab\u{1d49e}d";

    String.fromCodePoint(s1.normalize().codePointAt(2)); // "ć"

    String.fromCodePoint(s1.normalize().codePointAt(2)); // "ć"

    String.fromCodePoint(s1.normalize().codePointAt(2)); // ""
    ```

- Unicode can also be used in identifier names (variables, properties, etc.). Prior to ES6, you could do this with Unicode-escapes. For example:

    ```js
    var \u03A9 = 42;

    // same as: var Ω = 42;
    ```

    As of ES6, you can also use code point escape syntax/ For example:

    ```js
    var \u{2B400} = 42;

    // same as: var 𫐀 = 42;
    ```
