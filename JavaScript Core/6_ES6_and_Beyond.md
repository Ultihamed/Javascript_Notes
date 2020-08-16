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

    The `\uXXXX` Unicode escaping only supports four hexadecimal characters, so you can only represent the BMP (**B**asic **M**ultilingual **P**lain) set of characters in this way.
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

    String.fromCodePoint(0x1d49e); // "𝒞"
    ```

    We can combine `String.fromCodePoint(..)` and `codePointAt(..)` to get a better version of a Unicode-aware `charAt(..)`. For example:

    ```js
    var s1 = "abc\u0301d",
        s2 = "ab\u0107d",
        s3 = "ab\u{1d49e}d";

    String.fromCodePoint(s1.normalize().codePointAt(2)); // "ć"

    String.fromCodePoint(s1.normalize().codePointAt(2)); // "ć"

    String.fromCodePoint(s1.normalize().codePointAt(2)); // "𝒞"
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

## Symbols

- Unlike the other primitive types, however, symbols don't have a literal form. For example:

    ```js
    var sym = Symbol("some optional description");

    typeof sym; // "symbol"
    ```

- You cannot and should not use `new` with `Symbol(..)`. It's not a constructor, nor you producing an object.
- The paramater passed to `Symbol(..)` is optional. If passed, it should be a string that gives a friendly description for the symbol's purpose.
- The `typeof` output is a new value(`"symbol"`) that is the primary way to identify a symbol.
- Similar to how primitive string values are not instances of `String`, symbols are also not instances of `Symbol`. For example:

    ```js
    sym instanceof Symbol; // false

    var symObj = Object(sym);
    symObj instanceof Symbol; // true

    symObj.valueOf() === sym; // true
    ```

    There's not much reason to use the boxed wrapper object form (`symObj`) instead of the primitive form (`sym`). It's probably best to prefer `sym` over `symObj`.
- The main point of a symbol is to create a string-like value that can't collide with any other value. Consider:

    ```js
    const EVT_LOGIN = Symbol("event.login");

    evthub.listen(EVT_LOGIN, function (data) {
        // ..
    });
    ```

    Here `EVT_LOGIN` holds a value that cannot be duplicated (accidentally or otherwise) by any other value, so it is impossible for there to be any confusion of which event is being dispatched or handled.
- Implicit string coercion of symbols is not allowed. You can coerce explicitly with `toString(..)` or `String(..)`.
- To aid in organizing code with access to these symbols, you can create symbol values with the global symbol registry. For example:

    ```js
    const EVT_LOGIN = Symbol("event.login");

    console.log(EVT_LOGIN); // Symbol(event.login)

    function HappyFace() {
        const INSTANCE = Symbol.for("instance");

        if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

        // ..

        return HappyFace[INSTANCE] = {..};
    }
    ```

    `Symbol.for(..)` looks in the global symbol registry to see if a symbol is already stored with the provided description text, and returns it if so. If not, it creates one to return. In other words, the global symbol registry treats symbol values, by description text, as singletons themselves.
- You can retrieve a registered symbol's description text (key) using `Symbol.keyFor(..)`. For example:

    ```js
    var s = Symbol.for("something cool");

    var desc = Symbol.keyFor(s);
    console.log(desc); // "something cool"

    // get the symbol from the registry again
    var s2 = Symbol.for(desc);
    console.log(desc); // Symbol(something cool)

    s2 === s; // true
    ```

- If a symbol is used as a property/key of an object, it's stored in a special way so that the property will not show up in a normal enumeration of the object's properties. For example:

    ```js
    var o = {
        foo: 42,
        [Symbol("bar")]: "hello world",
        baz: true
    };

    Object.getOwnPropertyNames(o); // [ 'foo', 'baz' ]
    ```

    To retrieve an object's symbol properties:

    ```js
    Object.getOwnPropertySymbols(o); // [ Symbol(bar) ]
    ```

- ES6 comes with a number of predefined built-in symbols that expose various meta behaviors on **JavaScript** object values. However, these symbols are not registered in the global symbol registry, as one might expect. Instead, they're stored as properties on the `Symbol` function object. For example:

    ```js
    // for example for using in `for..of` loop
    var a = [1, 2, 3];

    a[Symbol.iterator]; // native function
    ```

- The specification uses the `@@` prefix notation to refer to the built-in symbols, the most common ones being: `@@iterator`, `@@toStringTag`, `@@toPrimitive`.

## Iterators

- The `IteratorResult` interface specifies that return value from any iterator operation will be an object of the form. For example:

    ```js
    { value: .. , done: true/false }
    ```

    Built-in iterators will always return values of this form, but more properties are, of course, allowed to be present on the return value, as necessary.
- Consider:

    ```js
    var arr = [1, 2, 3];

    var it = arr[Symbol.iterator]();

    it.next(); // { value: 1, done: false }
    it.next(); // { value: 2, done: false }
    it.next(); // { value: 3, done: false }

    it.next(); // { value: undefined, done: true }
    ```

    Each time the method located at `Symbol.iterator` is invoked on this `arr` value, it will produce a new fresh iterator. Most structures will do the same, including all the built-in data structures in **JavaScript**.
- Primitive string values are also iterables by default. For example:

    ```js
    var greeting = "hello world";

    var it = greeting[Symbol.iterator]();

    it.next(); // { value: "h", done: false }
    it.next(); // { value: "e", done: false }
    ..
    ```

- You can call the interator `return(..)` function manually as well. `return(..)` will return an `IteratorResult` object just like `next(..)` does.
- An iterator should not produce any more results after having called `return(..)` or `throw(..)`.
- You make an iterator an iterable by giving it a `Symbol.iterator` method that simply returns the iterator itself. For example:

    ```js
    var it = {
        // make the `it` iterator an interable
        [Symbol.iterator]() { return this; },

        next() {..},
        ..
    };

    it[Symbol.iterator]() === it; // true
    ```

    Now we can consume the `it` iterator with a `for..of` loop:

    ```js
    for (var v of it) {
        console.log(v);
    }
    ```

- You can polyfill the `for..of` loop for pre-ES6 like this:

    ```js
    for (var v, res; (res = it.next()) && !res.done;) {
        v = res.value;
        console.log(v);
    }
    ```

- `...` operator can also an iterator inside an array. For example:

    ```js
    var a = [1, 2, 3, 4, 5];
    var b = [0, ...a, 6];

    console.log(b); // [ 0, 1, 2, 3, 4, 5, 6 ]
    ```

    Array destructuring can partially or completely consume an iterator. For example:

    ```js
    var it = a[Symbol.iterator]();

    var [x, y] = it; // take just the first two elements from `it`
    var [z, ...w] = it; // take the third, then the rest all at once

    // is `it` fully exhausted? Yep.
    it.next(); // { value: undefined, done: true }

    x; // 1
    y; // 2
    z; // 3
    w; // [ 4, 5 ]
    ```

## Generators

- The position of the `*` in a generator is not functionally relevant. The same declaration could be written as any of the following:

    ```js
    function *foo()  {..}
    function* foo()  {..}
    function * foo() {..}
    function*foo()   {..}
    ```

- As of ES6, there is a concise generator form in object literal. For example:

    ```js
    var a = {
        *foo() {..}
    };
    ```

    Though a generator is declared with `*`, you still execute it like a normal function. For example:

    ```js
    foo();
    ```

    You can still pass an arguments, as in:

    ```js
    function *foo(x, y) {
        // ..
    }

    foo(5, 10);
    ```

    But it doesn't actually run the code in the generator. Instead, it produces an iterator that will control the generator to execute its code.
- You can use `yield` keywork to signal the pause point in a generator. For example:

    ```js
    function *foo() {
        var x = 10;
        var y = 20;

        yield;

        var z = x + y;
    }
    ```

    `yield` can appear any number of times (or not at all, technically!) in a generator.
- `yield` is not just a pause point. It's an expression that sends out a value when pausing the generator. For example:

    ```js
    function *foo() {
        while (true) {
            yield Math.randome();
        }
    }
    ```

- `yield` without a value is the same as `yield undefined`.
- The `yield ..` expression not only sends a value, but also receives (e,g., is replaced by) the eventual resumption value. For example:

    ```js
    function *foo() {
        var x = yield 10;
        console.log(x);
    }
    ```

- Consider:

    ```js
    var a, b;

    a = 3;             // valid
    b = 2 + a = 3;     // invalid
    b = 2 + (a = 3);   // valid

    yield 3;           // valid
    a = 2 + yield 3;   // invalid
    a = 2 + (yield 3); // valid
    ```

    `yield ..` expression would behave similar to an assignment expression.
- If you need `yield ..` to appear in a position where an assignment like `a = 3` would not itself be allowed, it needs to be wrapped in a `()`.
- Because of the low precedence of the `yield` keyword, almost any expression after a `yield ..` will be computed first before being sent with `yield`. Only the `...` spread operator and the `,` comma operator have lower precedence, meaning they'd bind after the `yield` has been evaluated. You might use `()` to override (evelate) the low precedence of `yield`. For example:

    ```js
    yield 2 + 3; // same as `yield (2 + 3)`

    (yield 2) + 3; // `yield 2` first, then `+ 3`
    ```

- `yield yield yield 3` is treated as `yield (yield (yield 3))`. A **left-associative** interpretation like `((yield) yield) yield 3)` would make no sense.
- `yield * ..` (yield delegation) requires an iterable. It then invokes that iterable's iterator, and delegates its own host generator's control to that iterator until it's exhausted. For example:

    ```js
    function *foo() {
        yield *[1, 2, 3];
    }
    ```

    The `[1, 2, 3]` value produces an iterator that will step through its values. See another example:

    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
    }

    function *bar() {
        yield *foo();
    }
    ```

    Whatever value(s) `*foo()` produces will be produced by `*bar()`. Another example:

    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
        return 4;
    }

    function *bar() {
        var x = yield *foo();
        console.log("x: ", x);
    }

    for (var v of bar()) {
        console.log(v);
    }
    // 1 2 3
    // x : { value: 4, done: true }
    ```

- Both of `return(..)` and `throw(..)` methods have the effect of aborting a paused generator immediately. For example:

    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
    }

    var it = foo();

    it.next(); // { value: 1, done: false }

    it.return(42); // { value: 42, done: true }

    it.next(); // { value: undefined, done: true }
    ```

- As of ES6, `for..of` loop and the `...` spread operator are call `return(..)` automatically at the end of iteration.
- Do not put a `yield` statement inside the `finally` clause. It's valid and legal, but it's a really terrible idea.
- You can use multiple iterators attached to the same generator concurrently. For example:

    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
    }

    var it1 = foo();
    it1.next(); // { value: 1, done: false }
    it1.next(); // { value: 2, done: false }

    var it2 = foo();
    it2.next(); // { value: 1, done: false }

    it1.next(); // { value: 3, done: false }

    it2.next(); // { value: 2, done: false }
    it2.next(); // { value: 3, done: false }

    it2.next(); // { value: undefined, done: true }
    it1.next(); // { value: undefined, done: true }
    ```

- `throw(..)` will pause the generator and throws an exception. For example:

    ```js
    function *foo() {
        yield 1;
        yield 2;
        yield 3;
    }

    var it = foo();

    it.next(); // { value: 1, done: false }

    try {
        it.throw("Oops!");
    }
    catch (err) {
        console.log(err); // Exception: Oops!
    }

    it.next(); // { value: undefined, done: true }
    ```

- Unlike `return(..)`, the iterator's `throw(..)` method is never called automatically.
- You can polyfill pre-ES6 generator simply. For example:

    ```js
    function foo() {
        function nextState(v) {
            switch (state) {
                case 0:
                    state++;

                    // the `yield` expression
                    return 42;
                case 1:
                    state++;

                    // `yield` expression fulfilled
                    x = v;
                    console.log(x);

                    // the implicit `return`
                    return undefined;
                // no need to handle state `2`
            }
        }

        var state = 0, x;

        return {
            next: function (v) {
                var ret = nextState(v);

                return { value: ret, done: (state == 2) };
            }

            // we'll skip `return(..)` and `throw(..)`
        };
    }
    ```

- Generators are a powerful abstraction tool for organizing and controlling orderly production and consumption of data.

## Modules

- The single most important code organization pattern in all of **JavaScript** is, and always has been, the module.
- The old way traditional module pattern is based on an outer function with inner variables and functions, and a returned **public API** with methods that have closure over the inner data and capabilities. It's often expressed like this:

    ```js
    function Hello(name) {
        function greeting() {
            console.log("Hello " + name + "!");
        }

        // public API
        return {
            greeting: greeting
        };
    }

    var me = Hello("Hamed");
    me.greeting(); // Hello Hamed!
    ```

- Sometimes (the old way), a module is only called for as a singleton (i.e., it just needs one instance), using an IIFE. For example:

    ```js
    var me = (function Hello(name) {
        function greeting() {
            console.log("Hello" + name + "!");
        }

        // public API
        return {
            greeting: greeting
        };
    })("Hamed");

    me.greeting(); // Hello Hamed!
    ```

- As of ES6, we no longer need to rely on the enclosing function and closure to provide us with module support. ES6 modules have first class syntactic and functional support.
- ES6 uses file-based modules, meaning one module per file.
- The API of an ES6 module is static. That is, you define statically what all the top-level exports are on your module's public API, and those cannot be amended later.
- ES6 modules are singletons. That is, there's only one instance of the module, which maintains its state. Every time you import that module to another module, you get a reference to the one centralized instance. If you want to be able to produce multiple module instances, your module will need to provide some sort of factory to do it.
- With ES6, exporting a local private variable, even if it currently holds a primitive string/number/etc, exports a binding to the variable. If the module changes the variable's value, the external import binding now resolves to that new value.
- Importing a module is the same thing as statically requesting it to load (if it hasn't aleady). If you're in a browser, that implies a blocking load over the network. If you're on a server (i.e., **Node.js**), it's a blocking load from the file system. However, don't panic about the performance implications. Because ES6 modules have static definitions, the import requirements can be statically scanned, and loads will happen preemptively, even before you've used the module.
- The importing of a module uses a string value to represent where to get the module (URL, file path, etc), but this value is opaque in your program and only meaningful to the Loader itself.
- The two main new keywords that enable ES6 modules are `import` and `export`.
- Both `import` and `export` must always appear in the top-level scope of their respective usage. For example, you cannot put either an `import` or `export` inside an `if` conditional. They must be appear outside of all blocks and functions.
- The `export` keyword is either put in front of declaration, or used as an operator (of sorts) with a special list of binding to export. For example:

    ```js
    export function foo() {
        // ..
    }

    export var awesome = 42;

    var bar = [1, 2, 3];
    export { bar };
    ```

    Another way of expressing the same exports:

    ```js
    function foo() {
        // ..
    }

    var awesome = 42;
    var bar = [1, 2, 3];

    export { foo, awesome, bar };
    ```

    These are all called **named exports**. Anything you don't label with `export` stays private inside the scope of the module.
- Modules do still have access to `window` and all the **global** that hangs of it, just not as lexical top-level scope. However, you really should stay away from the globals in your modules if at all possible.
- You can **rename** (aka alias) a module member during name export. For example:

    ```js
    function foo() {..}

    export { foo as bar }
    ```

    When this module is imported, only the `bar` member name is available to import. `foo` stays hidden inside the module.
- Consier:

    ```js
    var awesome = 42;
    export { awesome };

    // later
    awesome = 100;
    ```

    When this module is imported, regardless of whether that's before or after the `awesome = 100` setting, once that assignment has happened, the imported binding resolves to the `100` value, not `42`. That's because the binding is, in essence, a reference to, or a pointer to, the `awesome` variable itself, rather than a copy of its value.
- There can only be one `default` per module definition.
- Consider these two snippets:

    ```js
    // ====== 1 ======
    function foo(..) {
        // ..
    }

    export default foo;

    // ====== 2 ======
    function foo(..) {
        // ..
    }

    export { foo as default }
    ```

    In the first snippet, you are exporting a binding to the function expression value at that moment, not to the identifier `foo`. In other words, `export default ..` takes an expression. If you later assign `foo` to a different value inside your module, the module import still reveals the function originally exported, not the new value. By the way, the first snippet could also have been written as:

    ```js
    export default function foo(..) {
        // ..
    }
    ```

    In the second snippet, the default export binding is actually to the `foo` identifier rather than its value, so you get the previously described binding behavior (i.e., if you later change `foo`'s value, the value seen on the import side will also be updated). If you never plan to update a default export's value, `export default ..` is fine. If you do plan to update the value, you must use `export { .. as default }`. Either way, make sure to comment your code to explain your intent!
- The advantage of having each member individually and explicitly exported is that the engine can do the static analysis and optimization.
- You can re-export another module's exports. For example:

    ```js
    export { foo, bar } from "baz";
    export { foo as FOO, bar as BAR } from "baz";
    export * from "baz";
    ```

- If you want to import certain specific named members of a module's API into your top-level scope, you use this syntax:

    ```js
    import { foo, bar, baz } from "foo";
    ```

    The `"foo"` string is called **module specifier**. Because the whole goal is statically analyzable syntax, the module specifier must be a string literal; it cannot be a variable holding the string value.
- You can rename the bound identifiers imported, as:

    ```js
    import { foo as theFooFunc } from "foo";

    theFooFunc();
    ```

- If the module has just a default export that you want to import and bind to an identifier, you can opt to skip the `{..}` surrounding syntax for that binding. For example:

    ```js
    import foo from "foo";

    // or:
    import { default as foo } from "foo";
    ```

- Consider:

    ```js
    export default function foo() {..}

    export function bar() {..}
    export function baz() {..}
    ```

    To import that module's default export and its two named exports, you can do like this:

    ```js
    import FOOFN, { bar, baz as BAZ } from "foo";

    FOOFN();
    bar();
    BAZ();
    ```

- Consider a `"foo"` module exported as:

    ```js
    export function bar() {..}
    export var x = 42;
    export function baz() {..}
    ```

    You can import that entire API to a single namespace binding. For example:

    ```js
    import * as foo from "foo";

    foo.bar();
    foo.x; // 42
    foo.baz();
    ```

- Consider `"world"` module exported as:

    ```js
    export default function foo() {..}
    export function bar() {..}
    export function baz() {..}
    ```

    If the module you're importing with `* as ..` has a default export, it is named `default` in the namespace specified. You can additionally name the default import outside of the namespace binding, as a top-level identifier. So you can import like this:

    ```js
    import foofn, * as hello from "world";

    foofn();
    hello.default();
    hello.bar();
    hello.baz();
    ```

    Avoid designing your module exports in this way, to reduce the chances that your module's users will suffer these strange quirks.
- All imported bindings are immutable and/or read-only. For example:

    ```js
    import foofn, * as hello from "world";

    foofn = 42;         // (runtime) TypeError!
    hello.default = 42; // (runtime) TypeError!
    hello.bar = 42;     // (runtime) TypeError!
    hello.baz = 42;     // (runtime) TypeError!
    ```

- Declarations that occur as a result of an `import` are **hoisted**. For example:

    ```js
    foo();

    import { foo } from "foo";
    ```

- Consider this import form:

    ```js
    import "foo";
    ```

    This form does not actually import any of the module's bindings into your scope. It loads (if not already loaded), compiles (if not already compiled), and evaluates (if not already run) the `"foo"` module. There may be niche cases where a module's definition has side effects. You could envision using `import "foo"` as a sort of preload for a module that may be needed later.

## Classes

- Consider:

    ```js
    class Foo {
        constructor(a, b) {
            this.x = a;
            this.y = y;
        }

        gimmeXY() {
            return this.x * this.y;
        }
    }
    ```

  - `class Foo` implies creating a (special) function of the name `Foo`, much like you did pre-ES6.
  - `constructor(..)` identifies the signature of that `Foo(..)` function, as well as its body contents.
  - Class methods use the same **concise method** syntax available to object literal. This also includes the concise generator, as well as the ES6 getter/setter syntax. However, class methods are non-enumerable whereas object methods are by default enumerable.
  - Unlike object literals, there are no commas (`,`) separating members in a `class` body. In fact, they're not even allowed.
  - Look at the prototype-style of this snippet:

    ```js
    function Foo(a, b) {
        this.x = a;
        this.y = b;
    }

    Foo.prototype.gimmeXY = function () {
        return this.x * this.y;
    }
    ```

  - In either the pre-ES6 form or the new ES6 `class` form, this **class** can now be instantiated and used just as you'd expect:

    ```js
    var f = new Foo(5, 15);

    f.x; // 5
    f.y; // 15
    f.gimmeXY(); // 75
    ```

- Though `class Foo` seems much like `function Foo()`, there are important differences:
  - A `Foo(..)` call of `class Foo` must be made with `new`, as the pre-ES6 option of `Foo.call(obj)` will not work.
  - While `function Foo` is **hoisted**, `class Foo` is not. The `extends ..` clause specifies an expression that cannot be **hoisted**. So, you must declare a `class` before you can instantiate it.
  - `class Foo` in the top global scope creates a lexical `Foo` identifier in that scope, but unlike `function Foo` does not create a global object property of that name.
- A `class` can also be an expression, as, in: `var x = class Y {..}`. This is primarily useful for passing a class definition (technically, constructor) as a function argument or assigning it to an object property.
- ES6 classes also have syntactic sugar for establishing the `[[Prototype]]` delegation link between two function prototypes using the class-oriented familiar terminology `extends` (commonly mislabeled **inheritance** or confusingly labeled **prototype iheritance**). For example:

    ```js
    class bar extends Foo {
        constructor(a, b, c) {
            super(a, b);
            this.z = c;
        }

        gimmeXYZ() {
            return super.gimmeXY() * this.z;
        }
    }

    var b = new Bar(5, 15, 25);

    b.x; // 5
    b.y; // 15
    b.z; // 25
    b.gimmeXYZ(); // 1875
    ```

- In the constructor, `super` automatically refers to the **parent constructor**. In a method, it refers to the **parent object**, such that you can then make a property/method access off it. `Bar extends Foo` of course means to like the `[[Prototype]]` of `Bar.prototype` to `Foo.prototype`.
- `super` is not limited to `class` declarations. It also works in object literals.
- `super(..)` means roughly to call `new Foo(..)`, but isn't actually a usable reference to `Foo` itself.
- Constructors are not required for classes or subclasses. A default constructor is substituted in both cases if omitted. The default subclass constructor automatically calls the parent constructor, and passes along any arguments. In other words, you could think of the default subclass constructor sort of like this:

    ```js
    constructor (...args) {
        super(...args)
    }
    ```

- In a constructor of a subclass, you cannot access `this` until `super(..)` has been called.
- As of ES6, you can you have ability to subclass the built-in natives, like `Array`. For example:

    ```js
    class MyCoolArray {
        first() { return this[0]; }
        last() { return this[this.length - 1]; }
    }

    var a = new MyCoolArray(1, 2, 3);

    a.lenght; // 3
    a; // [ 1, 2, 3 ]

    a.first(); // 1
    a.last(); // 3
    ```

- `new.target` is a new **magical** value available in all functions, though in normal functions it will always be `undefined`. In any constructor, `new.target` always point at the constructor that `new` actually directed invoked, even if the constructor is in a parent class and was delegated to by a `super(..)` call from a child constructor. For example:

    ```js
    class Foo {
        constructor() {
            console.log("Foo: ", new.target.name);
        }
    }

    class Bar extends Foo {
        constructor() {
            super();
            console.log("Bar: ", new.target.name);
        }
        baz() {
            console.log("baz: ", new.target);
        }
    }

    var a = new Foo();
    // Foo: Foo

    var b = new Bar();
    // Foo: Bar <-- respects the `new` call-site
    // Bar: Bar

    b.baz();
    // baz: undefined
    ```

- Consider:

    ```js
    class Foo {
        static cool() { console.log("cool"); }
        wow() { console.log("wow"); }
    }

    class Bar extends Foo {
        static awesome() {
            super.cool();
            console.log("awesome");
        }
        neat() {
            super.wow();
            console.log("neat");
        }
    }

    Foo.cool();        // "cool"
    Bar.cool();        // "cool"
    Bar.awesome();     // "cool"
                       // "awesome"

    var b = new Bar();
    b.neat();          // "wow"
                       // "neat"

    b.awesome();       // undefied
    b.cool();          // undefined
    ```

    That `static` members are on the class's prototype chain. They're actually on the dual/parallel chain between the function constructors.
- If you define a derived class from `Array`, but you want those methods to continune to vend actual `Array` instances instead of from your derived class, this works. For example:

    ```js
    class MyCoolArray extends Array {
        // force `species` to be parent constructor
        static get [Symbol.species]() { return Array; }
    }

    var a = new MyCoolArray(1, 2, 3),
        b = a.map(function (v) { return v * 2; });

    b instanceof MyCoolArray; // false
    b instanceof Array; // true
    ```

    Of course, a derived class can still vend instances of itself using `new this.constructor(..)`.

## Promises

- Promises provide a trustable intermediary to manage callbacks.
- Promise is a **future value**, a time-independent container wrapped around a value.
- A Promise can only have one of two possible resolution outcomes: **fulfilled** or **rejected**, with an optional single value.
- Promises can only resolved (fulfillment or rejection) **once**.
- Once a Promise is resolved, it's an immutable value that cannot be changed.
- To construct a Promise instance, use the `Promise(..)` constructor. For example:

    ```js
    var p = new Promise(function pr(resolve, reject) {
        // ..
    });
    ```

    If you call `reject(..)`, the Promise is rejected, and if any value is passed to `reject(..)`, it is set as the reason for rejection. If you call `resolve(..)` with no value, or any non-Promise value, the Promise is fulfilled. If you call `resolve(..)` and pass another Promise, this Promise will simply adopts the state of the passed Promise (either fulfillment or rejection).
- Promises have a `then(..)` method that accepts one or two callback functions. The first function (if present) is treated as the handler to call if the Promise is fulfilled successfully. The second function (if present) is treated as the handler to call if the Promise is rejected explicitly, or if any error/exception is caught during resolution.
- The shorthand for calling `then(null, handleRejection)` is `catch(handleRejection)`.
- A Promise will propagates its rejection entire the chain and can caught by `catch(..)`.
- You should always observe Promise rejection.
- Promises are genuine instances of the `Promise(..)` constructor.
- `Promise.resolve(..)` creates a Promise resolved to the value passed in. For example:

    ```js
    var p1 = Promise.resolve(42);

    var p2 = new Promise(function (resolve) {
        resolve(42);
    });
    ```

    `p1` and `p2` will have essentially identical behavior. The same goes for resolving with a Promise:

    ```js
    var theP = ajax(..);

    var p1 = Promise.resolve(theP);

    var p2 = new Promise(function pr(resolve) {
        resolve(theP);
    });
    ```

- `Promise.reject(..)` creates an immediately rejected Promise, the same as its `Promise(..)` constructor counterpart. For example:

    ```js
    var p1 = Promise.reject("Oops");

    var p2 = new Promise(function pr(resolve,reject) {
        reject("Oops");
    });
    ```

- `resolve(..)` and `Promise.resolve(..)` can accept a Promise and adopt its state/resolution. But `reject(..)` and `Promise.reject(..)` do not differentiate what value they receive.
- `Promise.all([..])` accepts an array of one or more values (e.g., immediate values, Promises, thenables). It returns a Promise back that will be fulfilled if all the values fulfill, or reject immediately once the first of any of them rejects. Consider:

    ```js
    var p1 = Promise.resolve(42);
    var p2 = new Promise(function pr(resolve) {
        setTimeout(function () {
            resolve(43);
        }, 100);
    });
    var v3 = 44;
    var p4 = new Promise(function pr(resolve,reject) {
        setTimeout(function () {
            reject("Oops");
        }, 10);
    });
    ```

    Now we're using `Promise.all([..])` for combinations of those values:

    ```js
    Promise.all([p1, p2, p3])
        .then(function fulfilled(vals) {
            console.log(vals); // [ 42, 43, 44 ]
        });

    Promise.all([p1, p2, p3, p4])
        .then(
            function fulfillment(vals) {
                // never gets here
            },
            function rejected(reason) {
                console.log(reason); // Oops
            }
        );
    ```

    While `Promise.all([..])` waits for all fulfillments (or the first rejection), `Promise.race([..])` waits only for either the first fulfillment or rejection. For example:

    ```js
    Promise.race([p1, p2, p3])
        .then(function fulfilled(val) {
            console.log(val); // 42
        });

    Promise.race([p2, p4])
        .then(
            function fulfilled(val) {
                // never gets here
            },
            function rejected(reason) {
                console.log(reason); // Oops
            }
        );
    ```

- You should never use `Promise.race([..])` with empty arrays. It will hang forever.

## Generators + Promises

- Combining the trustability of Promises and the synchronicity of code in generators effectively addresses all the major deficiencies of callbacks.
- The yield-a-promise-resume-the-generator pattern is going to be so common and so powerful.

## TypedArrays

- The **type** in the name refers to a **view** layared on type of the bucket of bits which is essentially a mapping of whether the bits should be viewed as an array of 8-bit signed integers, 16-bit signed integers, and so on. You can construct such a bit-bucket. It's called a **buffer**, and you construct it most directly with the `ArrayBuffer(..)` constructor. For example:

    ```js
    var buf = new ArrayBuffer(32);
    buf.byteLenght; // 32
    ```

    `buf` is now a binary buffer that is 32-bytes long (256-bits), that's pre initialized to all `0`s.
- Several web platform features use or return array buffers, such as `FileReader#readAsArrayBuffer(..)`, `XMLHttpRequest$send(..)`, and `ImageData` (canvas data).
- On the top of an array buffer, you can layer a **view**, which comes in the form of a typed array. For example:

    ```js
    var buf = new ArrayBuffer(32);

    var arr = new Unit16Array(buf);
    arr.length; // 16
    ```

    `arr` is a typed array of 16-bit unsigned integers mapped over the 256-bit `buf` buffer, meaning you get 16 elements.
- Endian means if the low-order byte (collection of 8-bit) of a multi-byte number is on the right or the left of the number's byte. For example, let's imagine the base-10 number `3085`, which takes 16-bits to represent. If you have just one 16-bit number container, it'd be represented in binary as `0000110000001101` (hexadecimal `0c0d`) regardless of endianness. But if `3085` represented with two 8-bit numbers, the endianness would significantly affects its storage in memory:

    ```txt
    0000110000001101 / 0c0d (big endian)
    0000110100001100 / 0d0c (little endian)
    ```

- `(3085).toString(2)` return `"110000001101"`, which with an assumed leading four `"0"`s appears to be the big-endian representation.
- A single buffer can have multiple views attached to it. For example:

    ```js
    var buf = new ArrayBuffer(2);

    var view8 = new Uint8Array(buf);
    var view16 = new Uint16Array(buf);

    view16[0] = 3085;
    view8[0]; // 13
    view8[1]; // 13

    view8[0].toString(16); // "d"
    view8[1].toString(16); // "c"

    // swap (as if endian!)
    var tmp = view8[0];
    view8[0] = view8[1];
    view8[1] = tmp;

    view16[0]; // 3340
    ```

- You can create a new view over a new buffer of `length` bytes with `[constructor] (length)`.
- You can create a new view and buffer, and copies the contents from the `typedArr` view with `[constructor] (typedArr)`.
- You can create a new view and buffer, and iterates over the array-like or object `obj` to copy its contents with `[constructor] (obj)`.
- The following typed array constructors are available as of ES6:
  - `Int8Array` (8-bit signed integers), `Uint8Array` (8-bit unsigned integers).
    - `Uint8ClampedArray` (8-bit unsigned integers, each value clamped on setting to the `0` - `255` range).
  - `Int16Array` (16-bit signed integers), `Uint16Array` (16-bit unsigned integers).
  - `Int32Array` (32-bit signed integers), `Uint32Array` (32-bit unsigned integers).
  - `Float32Array` (32-floating point, IEEE-754)
  - `Float64Array` (64-floating point, IEEE-754)
- Instances of typed array constructors are almost the same as regular native arrays.
- You can use TypedArrays as regular arrays without needing to convert. For example:

    ```js
    var a = new Int32Array(3);
    a[0] = 10;
    a[1] = 20;
    a[2] = 30;

    a.map(function (v) {
        console.log(v);
    });
    // 10 20 30

    a.join("-");
    // "10-20-30"
    ```

    You can't use certain `Array.prototype` methods with TypedArrays that don't make sense, such as the mutators (`splice(..)`, `push(..)`, etc) and `concat(..)`.
- TypedArrays have a `sort(..)` method much like regular arrays, but this one defaults to numeric sort comparisons instead of coercing values to strings for lexicographic comparison. For example:

    ```js
    var a = [10, 1, 2];
    a.sort(); // [ 1, 2, 10 ]

    var b = new Uint8Array([10, 1, 2]);
    b.sort(); // [ 1, 2, 10 ]
    ```

## Maps

- You can create an object that is unordered key/value-pair data structures in **JavaScript**, called **Maps**. For example:

    ```js
    var m = new Map();

    var x = { id: 1 },
        y = { id: 2 };

    m.set(x, "foo");
    m.set(y, "bar");

    m.get(x); // "foo"
    m.get(y); // "bar"
    ```

- To delete an element from a map, don't use the `delete` operator, but instead use the `delete(..)` method. For example:

    ```js
    m.set(x, "foo");
    m.set(y, "bar");

    m.delete(y);
    ```

- You can clear entire map's contents with `clear()`.
- To get the length of a map (i.e., the number of keys), use the `size` property (not `length`).
- The `Map(..)` constructor can receive an iterable, which must produce a list of arrays, where the first item in each array is the key and the second item is the value. You can use `entries(..)` method to do that. That makes it easy to make a copy of a map. For example:

    ```js
    var m2 = new Map(m.entries());

    // same as:
    var m2 = new Map(m);
    ```

    Because a map instance is an iterable, and its default iterator is the same as `entries()`, the second shorter form is more preferable. Of course, you can just manually specify an entries list (array of key/value arrays) in the `Map(..)` constructor form. For example:

    ```js
    var x = { id: 1 },
        y = { id: 2 };

    var m = new Map([
        [x, "foo"],
        [y, "bar"]
    ]);

    m.get(x); // "foo"
    m.get(y); // "bar"
    ```

- To get the list of values from a map, use `values()`, which returns an iterator. For example:

    ```js
    var m = new Map();

    var x = { id: 1 },
        y = { id: 2 };

    m.set(x, "foo");
    m.set(y, "bar");

    var vals = [...m.values()];

    vals;                   // [ 'foo', 'bar' ]
    // creates an array from an iterable object
    Array.from(m.values()); // [ 'foo', 'bar' ]
    ```

- To get the list of keys, use `keys()`, which returns an iterator over the keys in the map. For example:

    ```js
    var m = new Map();

    var x = { id: 1 },
        y = { id: 2 };

    m.set(x, "foo");
    m.set(y, "bar");

    var keys = [...m.keys()];

    keys[0] === x; // true
    keys[1] === y; // true
    ```

- To determine if a map has a given key, use `has(..)` method. For example:

    ```js
    var m = new Map();

    var x = { id: 1 },
        y = { id: 2 };

    m.set(x, "foo");

    m.has(x); // true
    m.has(y); // false
    ```

## WeakMaps

- Weakmaps take (only) objects as keys. Those object are held weakly, which means if the object itself is GC'd (GC means **G**arbage **C**olletion), the entry in the WeakMap is also removed.
- WeakMaps do not have a `size` property or `clear()` method, nor do they expose any iterators over their keys, values, or entries.
- A WeakMap only holds its keys weakly, not it's values. For example:

    ```js
    var m = new WeakMap();

    var x = { id: 1 },
        y = { id: 2 },
        z = { id: 3 },
        w = { id: 4 };

    m.set(x, y);

    x = null; // { id: 1 } is GC-eligible
    y = null; // { id: 2 } is GC-eligible
              // only because { id: 1 } is

    m.set(z, y);

    w = null; // { id: 4 } is not GC-eligible
    ```

## Sets

- A set is a collection of unique values (duplicated are ignored). For example:

    ```js
    var s = new Set();

    var x = { id: 1 },
        y = { id: 2 };

    s.add(x);
    s.add(y);
    s.add(x); // ignored, because of duplication

    s.size; // 2

    s.delete(y);
    s.size; // 1

    s.clear();
    s.size; // 0
    ```

- The `Set(..)` constructor form is similar to `Map(..)`, in that it can receive an iterable, like another set or simply an array of values. However, unlike how `Map(..)` expects entries list (array of key/value arrays), `Set(..)` expects a values list (arrays of values). For example:

    ```js
    var x = { id: 1 },
        y = { id: 2 };

    var s = new Set([x, y]);
    ```

- A set doesn't need a `get(..)` because you don't retrieve a value from a set, but rather test if it is present or not, using `has(..)`:

    ```js
    var s = new Set();

    var x = { id: 1 },
        y = { id: 2 };

    s.add(x);

    s.has(x); // true
    s.has(y); // false
    ```

- The default iterator for a set is its `values()` iterator.
- The inherent uniqueness of a set is its most useful trait. Set uniqueness does not allow coercion, so `1` and `"1"` are considered distinct values. For example:

    ```js
    var s = new Set([1, 2, 3, 4, "1", 2, 4, "5"]),
        uniques = [...s];

    uniques; // [ 1, 2, 3, 4, '1', '5' ]
    ```

## WeakSets

- A WeakSet holds its values weakly. For example:

    ```js
    var s = new WeakSet();

    var x = { id: 1 },
        y = { id: 2 };

    s.add(x);
    s.add(y);

    x = null; // `x` is GC-eligible
    y = null; // `y` is GC-eligible
    ```

- WeakSet values must be objects, not primitive values as is allowed with sets.

## API Additions (`Array`)

- ES6 adds a number of helpers to Array, both static and prototype (instance).
- If there's only one argument passed in an array, and that argument is a number, instead of making an array of one element with that number value in it, it constructs an empty array with a `length` property equal to the number. To avoid that, you can use `Array.of(..)` instead of `Array(..)`. For example:

    ```js
    var a = Array(3);
    a.length; // 3
    a[0]; // undefined

    var b = Array.of(3);
    b.length; // 1
    b[0]; // 3

    var c = Array.of(1, 2, 3);
    c.length; // 3
    c; // [ 1, 2, 3 ]
    ```

- `slice(..)` method is often used in duplicating a real array. For example:

    ```js
    var arr2 = arr.slice();
    ```

    The new ES6 `Array.from(..)` method can be a more understandable and graceful approach. For example:

    ```js
    var arr = Array.from(arrLike);

    var arrCopy = Array.from(arr);
    ```

- `Array.from(..)` looks to see if the first argument is an iterable, and if so, it uses the iterator to produce values to **copy** into the returned array. Because real arrays have an iterator for those values, that iterator automatically used.
- If you pass an array-like object as the first argument to `Array.from(..)`, it behaves basically the same as `slice()` (no arguments!) or `apply(..)` does which is that it simply loops over the value, accessing numerically named properties from `0` up to whatever the value of `length` is. Consider:

    ```js
    var arrLike = {
        length: 4,
        2: "foo"
    };

    Array.from(arrLike);
    // [ undefined, undefined, 'foo', undefined ]
    ```

    You could produce a similar outcome like this:

    ```js
    var emptySlotArray = [];
    emptySlotArray.length = 4;
    emptySlotArray[2] = "foo";

    Array.from(emptySlotArray);
    // [ undefined, undefined, "foo", undefined ]
    ```

- `Array.from(..)` never produces empty slots.
- Prior to ES6, if you wanted to produce an array initialized to a certain length with actual `undefined` values in each slot (no empty slots!), you had to do extra:

    ```js
    var a = Array(4); // four empty slots!

    var b = Array.apply(null, { length: 4 }); // four `undefined` values
    ```

    But `Array.from(..)` now makes this easier:

    ```js
    var c = Array.from({ length: 4 }); // four `undefined` values
    ```

- You sould never intentionally work with empty slots, as it will almost certainly lead to strange/unpredictable bahavior in your programs.
- The `Array.from(..)`'s second parameter is a mapping callback (almost as the same as the regular `Array#map(..)` expects) which is called to map/transform each value from the source to the returned target. For example:

    ```js
    var arrLike = {
        length: 4,
        2: "foo"
    };

    Array.from(arrLike, function mapper(val, idx) {
        if (typeof val == "string") {
            return val.toUpperCase();
        }
        else {
            return idx;
        }
    });
    // [ 0, 1, 'FOO', 3 ]
    ```

- If you use the base `Array.of(..)` you'll get an `Array` instance, but if you use for example `MyCoolArray.of(..)`, you'll get a `MyCoolArray` instance. But with `Symbol.species`, you can change its way. For example:

    ```js
    class MyCoolArray extends Array {
        // force `species` to be parent constructor
        static get [Symbol.species]() { return Array; }
    }

    var x = new MyCoolArray(1, 2, 3);

    x.slice(1) instanceof MyCoolArray; // false
    x.slice(1) instanceof Array; // true
    ```

    It's important to note that the `@@species` setting is only used for the prototype methods, like `slice(..)`. It's not used by `of(..)` and `from(..)`. They both just use the `this` binding. For example:

    ```js
    class MyCoolArray extends Array {
        // force `species` to be parent constructor
        static get [Symbol.species]() { return Array; }
    }

    var x = new MyCoolArray(1, 2, 3);

    MyCoolArray.from(x) instanceof MyCoolArray; // true
    MyCoolArray.of([2, 3]) instanceof MyCoolArray; // true
    ```

- `copyWithin(..)` copies a portion of an array to another location in the same array, overwriting whatever was there before. The arguments are target, start, and optionally end. If any of the arguments are negative, they're taken to be relative from the end of the array. For example:

    ```js
    [1, 2, 3, 4, 5].copyWithin(3, 0); // [ 1, 2, 3, 1, 2 ]

    [1, 2, 3, 4, 5].copyWithin(3, 0, 1); // [ 1, 2, 3, 1, 5 ]

    [1, 2, 3, 4, 5].copyWithin(0, -2, -1); // [ 4, 2, 3, 4, 5 ]
    ```

    The `copyWithin(..)` method does not extend the array's length. Copying simply stops when the end of the array is reached.
- The copying doesn't always go in left-to-right (ascending index) order. Consider:

    ```js
    [1, 2, 3, 4, 5].copyWithin(2, 1); // ???
    ```

    The algorithm avoids this case by copying in reverse order to avoid that gotcha.
- As of ES6, you can fill an existing array entirely (or partially) with a specified value with `Array#fill(..)` method. For example:

    ```js
    var a = Array(4).fill(undefined);
    a;
    // [ undefined, undefined, undefined, undefined ]
    ```

    `fill(..)` optionally takes start and end paramaters, which indicate a subset portion of the array to fill. For example:

    ```js
    var a = [null, null, null, null].fill(42, 1, 3);

    a; // [ null, 42, 42, null ]
    ```

- The most common way to search for a value in an array has generally been `indexOf(..)` method, which returns the index the value is found or `-1` if not found. For example:

    ```js
    var a = [1, 2, 3, 4, 5];

    (a.indexOf(3) != -1); // true
    (a.indexOf(7) != -1); // false

    (a.indexOf("2") != -1); // false
    ```

    Another way to search is using `some(..)` method. It works by calling a function callback for each element, until one of those calls returns a `true`/truthy value, and then it stops. Because you get to define the callback function, you have full control over how a match is made:

    ```js
    var a = [1, 2, 3, 4, 5];

    a.some(function matcher(v) {
        return v == "2";
    }); // true

    a.some(function matcher(v) {
        return v == 7;
    }); // false
    ```

- `find(..)` lets you match against complex values like objects. For example:

    ```js
    var points = [
        { x: 10, y: 20 },
        { x: 20, y: 30 },
        { x: 30, y: 40 },
        { x: 40, y: 50 },
        { x: 50, y: 60 }
    ];

    points.find(function matcher(point) {
        return (
            point.x % 3 == 0 &&
            point.y % 4 == 0
        );
    }); // { x: 30, y: 40 }
    ```

- As of ES6, You can find the position index of the matched value with `findIndex(..)`. For example:

    ```js
    var points = [
        { x: 10, y: 20 },
        { x: 20, y: 30 },
        { x: 30, y: 40 },
        { x: 40, y: 50 },
        { x: 50, y: 60 }
    ];

    points.findIndex(function matcher(point) {
        return (
            point.x % 3 == 0 &&
            point.y % 4 == 0
        );
    }); // 2

    points.findIndex(function matcher(point) {
        return (
            point.x % 6 == 0 &&
            point.y % 7 == 0
        );
    }); // -1
    ```

- Don't use `findIndex(..) != -1` (the way it's always been done with `indexOf(..)`) to get a boolean from the search, because `some(..)` already yields the `true`/`false` you want. And don't do `a[a.findIndex(..)]` to get the matched value, because that's what `find(..)` accomplishes.
- Use `indexOf(..)` if you need the index of a strict match, or `firstIndex(..)` if you need the index of a more customized match.
- Consider:

    ```js
    var a = [1, 2, 3];

    [...a.values()]; // [ 1, 2, 3 ]
    [...a.keys()]; // [ 0, 1, 2 ]
    [...a.entries()]; // [ [ 0, 1 ], [ 1, 2 ], [ 2, 3 ] ]

    [...a[Symbol.iterator]()]; // [ 1, 2, 3]
    ```

## API Additions (`Object`)

- `Object.is(..)` works basically as same as `===` comaprison with two important exceptions. Consider:

    ```js
    var x = NaN, y = 0, z = -0;

    x === x; // false
    y === z; // true

    Object.is(x, y); // true
    Object.is(y, z); // false
    ```

    In cases where you're trying to strictly identify a `NaN` or `-0` value, `Object.is(..)` is now the preferred option.
- ES6 adds a `Number.isNaN(..)` utility which may be a slightly more convenient test. You may prefer `Number.isNaN(x)` over `Object.is(x, NaN)`.
- You can accurately test for `-0` with clumsy `x == 0 && 1 / x === -Infinity`, but in this case `Object.is(x, -0)` is much better.
- Symbols are likely going to be mostly used as special (meta) properties on objects. So the `Object.getOwnPropertySymbols(..)` utility was introduced, which retrieves only the symbol properties directly on an object. For example:

    ```js
    var o = {
        foo: 42,
        [Symbol("bar")]: "hello world",
        baz: true
    };

    Object.getOwnPropertySymbols(o); // [ Symbol(bar) ]
    ```

- You can link objects `[[Prototype]]` with `Object.setPrototypeOf(..)` method. For example:

    ```js
    var o1 = {
        foo() { console.log("foo"); }
    };
    var o2 = {
        // .. o2's definition
    };

    Object.setPrototypeOf(o2, o1);

    // delegates to `o1.foo()`
    o2.foo(); // foo
    ```

    Alternatively:

    ```js
    var o1 = {
        foo() { console.log("foo"); }
    };

    var o2 = Object.setPrototypeOf({
        // .. o2's definition
    }, o1);

    // delegates to `o1.foo()`
    o2.foo(); // foo
    ```

- AS of ES6, you can copy/mix one object's properties to another with `Object.assign(..)`. For example:

    ```js
    var target = {},
        o1 = { a: 1 }, o2 = { b: 2 },
        o3 = { c: 3 }, o4 = { d: 4 };

    // setup read-only property
    Object.defineProperty(o3, "e", {
        value: 5,
        enumerable: true,
        writable: false,
        configuration: false
    });

    // setup non-enumerable property
    Object.defineProperty(o3, "f", {
        value: 6,
        enumerable: false
    });

    o3[Symbol("g")] = 7;

    // setup non-enumerable symbol
    Object.defineProperty(o3, Symbol("h"), {
        value: 8,
        enumerable: false
    });

    Object.setPrototypeOf(o3, o4);
    ```

    Only the properties `a`, `b`, `c`, `e`, and `Symbol("g")` will be copied to `target`:

    ```js
    Object.assign(target, o1, o2, o3);

    target.a; // 1
    target.b; // 2
    target.c; // 3

    Object.getOwnPropertyDescriptor(target, "e");
    // { value: 5, writable: true, enumerable: true, configuration: true }

    Object.getOwnPropertySymbols(target);
    // [ Symbol('g') ]
    ```

    The `d`, `f`, and `Symbol("h")` properties are omitted from copying; non-enumerable properties and non-owned properties are all excluded from the assignment. Also, `e` is copied as a normal property assignment, not duplicated as a read-only property.

## API Additions (`Math`)

- ES6 adds some **Trigonometry** math APIs:
  - `cosh(..)` - Hyperbolic cosine
  - `acosh(..)` - Hyperbolic arccosine
  - `sinh(..)` - Hyperbolic sine
  - `asinh(..)` - Hyperbolic arcsine
  - `tanh(..)` - Hyperbolic tangent
  - `atanh(..)` - Hyperbolic arctanget
  - `hypot(..)` - The squareroot of the sum of the squares(i.e., the generalized Pythagorean theorem)
- ES6 adds some **Arithmetic** math APIs:
  - `cbrt(..)` - Cube root
  - `clz32(..)` - Count leading zeros in 32-bit binary representation
  - `expm1(..)` - The same as `exp(..) - 1`
  - `log2(..)` - Binary logarithms (log base 2)
  - `log10(..)` - Log base 10
  - `log1p(..)` - The same as `log(x + 1)`
  - `imul(..)` - 32-bit integer multiplication of two numbers
- ES6 adds some **Meta** math APIs:
  - `sign(..)` - Returns the sign of the number
  - `trunc(..)` - Returns only the integer part of a number
  - `fround(..)` - Rounds to nearest 32-bit (single precision) floating-point value

## API Additions (`Number`)

- ES6 adds some helpful numeric constants as static properties:
  - `Number.EPSILON` - The minimum value between any two numbers: `2^-52`
  - `Number.MAX_SAFE_INTEGER` - The highest integer that can **safely** be represented unambiguously in a **JavaScript** number value: `2^53 - 1`
  - `Number.MIN_SAFE_INTEGER` - The lowest integer that can **safely** be represented unambiguously in a **JavaScript** number value: `-(2^53 - 1)` or `(-2)^53 + 1`
- ES6 adds a fixed utility `Number.isNaN(..)` instead of broken `isNaN(..)`. For example:

    ```js
    var a = NaN, b = "NaN", c = 42;

    isNaN(a); // true
    isNaN(b); // true -- oops!
    isNaN(c); // false

    Number.isNaN(a); // true
    Number.isNaN(b); // false -- fixed!
    Number.isNaN(c); // false
    ```

- Consider:

    ```js
    var a = NaN, b = Infinity, c = 42;

    Number.isFinite(a); // false
    Number.isFinite(b); // fasle

    Number.isFininite(c); // true
    ```

    The standard global `isFinite(..)` coerces its argument, but `Number.isFinite(..)` omits the coercive behavior. For example:

    ```js
    var a = "42";

    isFinite(a); // true
    Number.isFinite(a); // false
    ```

    You can use `Number.isFinite(+x)`, which explicitly coerces `x` to a number before passing it in.
- **JavaScript** number values are always floating point. ES6 adds a `Number.isInteger(..)` helper utility that potentially can determine if a number is integer or not. For example:

    ```js
    Number.isInteger(4);        // true
    Number.isInteger(4.2);      // false
    Number.isInteger(NaN);      // false
    Number.isInteger(Infinity); // false
    ```

    The old way to determine an interger was:

    ```js
    x === Math.floor(x);
    ```

- In **JavaScript**, there's no difference between `4`, `4.`, `4.0`, or `4.0000`. All of these would be considered an **integer**, and would thus yield `true` from `Number.isInteger(..)`.
- ES6 defines a `Number.isSafeInteger(..)` utility, which checks to make sure the value is both an integer and within the range of `Number.MIN_SAFE_INTEGER`-`Number.MAX_SAFE_INTEGER` (inclusive). For example:

    ```js
    var x = Math.pow(2, 53),
        y = Math.pow(-2, 53);

    Number.isSafeInteger(x - 1); // true
    Number.isSafeInteger(y + 1); // true

    Number.isSafeInteger(x); // false
    Number.isSafeInteger(y); // false
    ```

## API Additions (`String`)

- You can use `String.raw(..)` for obtain the raw string value without any processing of escape sequences. This function will almost never be called manually, but will be used with tagged template literals. For example:

    ```js
    var str = "bc";

    String.raw`\ta${str}d\xE9`;
    // "\tabcd\xE9", not "    abcdé"
    ```

- In languages like **Python** and **Ruby**, you can repeat a string as:

    ```js
    "foo" * 3; // "foofoofoo"
    ```

    That doesn't work in **JavaScript** and `"foo"` coerces to the `NaN` number. However, ES6 defines a string prototype method `repeat(..)` to accomplish the task. For example:

    ```js
    "foo".repeat(3); // "foofoofoo"
    ```

- ES6 adds three new methods for searching/inspection through a string. `startsWith(..)`, `endsWith(..)` and `includes(..)`. For example:

    ```js
    var palindrome = "step on no pets";

    palindrome.startsWith("step on"); // true
    palindrome.startsWith("on", 5); // true

    palindrome.endsWith("no pets"); // true
    palindrome.endsWith("no", 10); // true

    palindrome.includes("on"); // true
    palindrome.includes("on", 6); // false
    ```

## Meta Programming

- Meta programming focuses on one or more of the following: code inspecting itself, code modifying itself, or code modifying default language behavior so other code is affected.
- If a function has a `name` value assigned, that's typically the name used in stack traces in developer tool.
- You can see the result of `name` properties from these functions below:

    ```js
    (function () {..}); // name:
    (function* () {..}); // name:
    window.foo = function () {..}; // name:

    class Awesome {
        constructor() {..} // name: Awesome
        funny() {..} // name: funny
    }

    var c = class Awesome {..}; // name: Awesome

    var o = {
        foo() {..}, // name: foo
        *bar() {..}, // name: bar
        baz: () => {..}, // name: baz
        bam: function () {..}, // name: bam
        get qux() {..}, // name: qux
        set fuz() {..}, // name: fuz
        ["b" + "iz"]: function () {..}, // name: biz
        [Symbol("buz")]: function () {..} // name: [buz]
    };

    var x = o.foo.bind(o); // name: bound foo
    (function () {..}).bind(o); // name: bound

    export default function () {..} // name: default

    var y = new Function(); // name: anonymous
    var GeneratorFunction = function* () {}.__proto__.constructor;
    var z = new GeneratorFunction(); // name: anonymous
    ```

    You can use `Object.defineProperty(..)` to manually change they `name` property if so desired.
- `Symbol.iterator` represents the location (property) on any object where the language mechanisms automatically look to find a method that will construct an iterator instance for consuming that object's values. Many objects come with a default one defined.
- You can define your own iterator logic for any object value by setting the `Symbol.iterator` property. For example:

    ```js
    var arr = [4, 5, 6, 7, 8, 9];

    for (var v of arr) {
        console.log(v);
    }
    // 4 5 6 7 8 9

    // define iterator that only produces values from odd indexes
    arr[Symbol.iterator] = function* () {
        var idx = 1;
        do {
            yield this[idx];
        } while ((idx += 2) < this.length);
    };

    for (var v of arr) {
        console.log(v);
    }
    // 5 7 9
    ```

- The `@@toStringTag` symbol on the prototype (or instance itself) specifies a string value to use the `[object___]` stringification. For example:

    ```js
    var obj1 = {};
    var obj2 = {
        [Symbol.toStringTag]: "myObj"
    };

    obj1.toString(); // [object Object]
    obj2.toString(); // [object myObj]
    ```

- If you need to define methods that generate new instances, use the meta programming of the `new this.constructor[Symbol.species](..)` pattern instead of the hard-writing of `new this.constructor(..)` or `new XYZ(..)`.
