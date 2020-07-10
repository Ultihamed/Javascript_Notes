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
