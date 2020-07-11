# `this` & Object Prototypes

![JavaScript Object Prototypes](https://i.morioh.com/5c10835d36.png)

## Preface

- You must pass some complex ways to make a cool things like **Google Maps** with **JavaScript**.

## Why `this`

- The name **this** creates confusion when developers try to think about it too literally.
- The `this` doesn't let a function get a reference to itself like might have assumed.
- Consider:

    ```js
    function foo(num) {
        console.log("foo: " + num);

        // keep track of how many times `foo` is called
        this.count++;
    }

    foo.count = 0;

    var i = 0;

    for (i = 0; i < 10; i++) {
        if (i > 5) {
            foo(i);
        }
    }

    // foo: 6
    // foo: 7
    // foo: 8
    // foo: 9

    // how many times was `foo` called?
    console.log(foo.count); // 0 -- WTF?
    ```

    Why `0` ? you can solve this problem with creating an object:

    ```js
    function foo(num) {
        console.log("foo: " + num);

        // keep track of how many times `foo` is called
        data.count++;
    }

    var data = {
        count: 0
    };

    var i;

    for (i = 0; i < 10; i++) {
        if (i > 5) {
            foo(i);
        }
    }
    // foo: 6
    // foo: 7
    // foo: 8
    // foo: 9

    // how many times was `foo` called
    console.log(data.count); // 4
    ```

    But its not a good idea. To reference a function object from inside itself, `this` by itself will typically be insufficient. You generally need a reference to the function object via a lexical identifier (variable) that points at it. Now consider these two functions:

    ```js
    function foo() {
        foo.count = 4; // `foo` refers to itself
    }

    setTimeOut(function () {
        // anonymous function (no name), cannot refer to itself
    }, 10)
    ```

- You cannot use a `this` reference to look something up in a lexical scope. It is not possible. Every time you feel yourself trying to mix lexical scope look-ups with `this`, remind yourself: **there is no bridge**.
- `this` binding has nothing to do with where a function is declared, but has instead everything to do with the manner in which the function is called.

## Call-site & Call-stack

- The location in code where a function is called (not where it's declared) **call-site**.
- **Call-stack** is the stack of function that have been called to get us to the current moment in execution. For example:

    ```js
    function baz() {
        // call-stack is: `baz`
        // so, our call-site is in the global scope

        console.log("baz");
        bar(); // <-- call-site for `bar`
    }

    function bar() {
        // call-stack is: `baz` -> `bar`
        // so, our call-site is in `baz`

        console.log("bar");
        foo(); // <-- call-site for `foo`
    }

    function foo() {
        // call-stack is: `baz` -> `bar` -> `foo`
        // so, our call-site is in `bar`

        console.log("foo");
    }

    baz(); // <-- call-site for `baz`
    ```

## Default Binding

- Consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var a = 2;

    foo(); // 2
    ```

    Think of it as two sides of the same coin. `var a = 2` and `this.a` are point to the same thing (in global scope). The default binding for `this` applies to the function call, and so points `this` at the global object.

    In our snippet, `foo()` is called with a plain, un-decorated function reference. None of the outer rules will demonstrate will apply here, so the default binding applies instead. If `strict mode` is in effect, the global object is not eligible for the default binding, so `this` is instead set to `undefined`. For example:

    ```js
    function foo() {
        "use strict"

        console.log(this.a);
    }

    var a = 2;

    foo(); // TypeError: `this` is `undefined`
    ```

    The `strict mode` state of the call-site of `foo()` is irrelevent. Now consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var a = 2;

    (function () {
        "use strict"

        foo(); // 2
    })();
    ```

    Intentionally mixing `strict mode` and non-`strict mode` together in your own code is generally frowned upon.

## Implicit Binding

- Consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj = {
        a; 2,
        foo: foo
    };

    obj.foo(); // 2
    ```

    Here the function really **"owned"** or **"contained"** by the `obj` object. However, the call-site uses the `obj` context to **reference** the function, so you could say that the `obj` object **"owns"** or **"contains"** the **function reference** at the time the function is called. When there is a context object for a function reference, the implicit binding rule says that it's that object which should be used for the function call's `this` binding. Because `obj` is the `this` for the `foo()` call, `this.a` is synonymous with `obj.a`.

    Only the **top/last** level of an object property reference chain matters to the call-site. For instance:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj2 = {
        a: 42,
        foo: foo
    }

    var obj1 = {
        a: 2,
        obj2: obj2
    }

    obj1.obj2.foo(); // 42
    ```

## Implicitly Lost

- Consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj = {
        a: 2,
        foo: foo
    };

    var bar = obj.foo; // function reference/alias!

    var a = "oops, global"; // `a` also property on global object

    bar(); // "oops, global"
    ```

    The call-site is `bar()`, which is plain, un-decorated call and thus the default binding applies. The more subtle, more common, and more unexpected way this occurs is when we consider passing a callback function:

    ```js
    function foo() {
        console.log(this.a);
    }

    function doFoo(fn) {
        // `fn` is just another reference to `foo`

        fn(); // <-- call-site!
    }

    var obj = {
        a: 2,
        foo: foo
    };

    var a = "oops, global"; // `a` also property on global object

    doFoo(obj.foo); // "oops, global"
    ```

    Parameter passing is just an **implicit** assignment, and since we're passing a function, it's an implicit reference assignment, so the end result is the same as the previous snippet. Now, what if the function you're passing your callback to is not your own, but built-in to the language? No difference, same outcome:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj = {
        a: 2,
        foo: foo
    };

    var a = "oops, global"; // `a` also property on global object

    setTimeout(obj.foo, 100); // "oops, global"
    ```

- Event handlers in popular **JavaScript** libraries are quite fond of forcing your callback to have a `this` which points to, for instance, the DOM element that triggered the event.
- Either way the this is changed unexpectedly, you are not really in control of how your callback function reference will be executed, so you have no way (yet) of controlling the call-site to give your intended binding.

## Explicit Binding

- **"All"** functions in the language have some utilities available to them (via their `[[prototype]]) which can be useful for explicit binding.
- The vast majority of functions provided, and certainly all function you will create, do have access to `call(..)` and `apply(..)`. They both take, as their first parameter, an object to use for the `this`, and then invoke the function with that `this` specified. Since you are directly stating what you want the `this` to be, we call it explicit binding. Consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj = {
        a: 2
    };

    foo.call(obj); // 2
    ```

    Invoking `foo` with explicit binding by `foo.call(..)` allows us to force its `this` to be `obj`.

- With respect to `this` binding, `call(..)` and `apply(..)` are identical.

## Hard Binding

- Consider:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj = {
        a: 2
    };

    var bar = function () {
        foo.call(obj);
    }

    bar(); // 2
    setTimeout(bar, 100); // 2

    // `bar` hard binds `foo`'s `this` to `obj`
    // so that is cannot be overriden

    bar.call(window); // 2
    ```

    This binding is both explicit and strong, so we call it **hard binding**.
- The most typical way to wrap a function with a hard binding creates a pass-thru of any arguments passed and any return value received:

    ```js
    function foo(something) {
        console.log(this.a, something);
        return this.a + something;
    }

    var obj = {
        a: 2
    }

    var bar = function () {
        return foo.apply(obj, arguments);
    }:

    var b = bar(3); // 2 3

    console.log(b); // 5
    ```

    Another way to express this pattern is to create a re-usable helper:

    ```js
    function foo(something) {
        console.log(this.a, something);
        return this.a + something;
    }

    // simple `bind` helper
    function bind(fn, obj) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    var obj = {
        a: 2
    };

    var bar = bind(foo, obj);

    var b = bar(3); // 2 3
    console.log(b); // 5
    ```

    Since hard binding is such a common pattern, it's provided with a built-in utility as of ES5: `Function.prototype.bind`, and it's used like this:

    ```js
    function foo(something) {
        console.log(this.a, something);
        return this.a + something;
    }

    var obj = {
        a: 2
    };

    var bar = foo.bind(obj);

    var b = bar(3); // 2 3
    console.log(b); // 5
    ```

    Here `bind(..)` returns a new function that is **hard-coded** to call the original function with the `this` context set as your specified.
- As of ES6, the hard-bound function produced by `bind(..)` has a `.name` property that derives from the original target function. For example: `bar = foo.bind(..)` should have a bar.name value of `"bound foo"`, which is the function call name that should show up in a stack trace.
- Many libaries functions and indeed many new built-in functions in the **JavaScript** language and host environment, provide an optional parameter, usually called **"context"**, which is designed for you not having to use `bind(..)` to ensure your callback function uses a particular `this`. For example:

    ```js
    function foo(el) {
        console.log(el, this.id);
    }

    var obj = {
        id: "awesome"
    };

    // use `obj` as `this` for `foo(..)` calls
    [1, 2, 3].forEach(foo, obj); // 1 awesome 2 awesome 3 awesome
    ```
