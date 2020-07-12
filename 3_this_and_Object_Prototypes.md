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

## `new` Binding

- There is no connection to class-oriented functionality implied by `new` usage is **JavaScript**.
- In **JavaScript**, constructors are **just functions** that happen to be called with the `new` operator front of them. They are not attached to classes, nor are they instantiating a class.
- Pretty much any function, including the built-in object functions like `Number(..)` can be called with `new` in front of it, and that make that function call a **constructor** call.
- When a function is invoked with `new` in front of it, otherwise known as a constructor call, the following things are done automatically:
    1. a brand new object is created (aka, constructed) out of thin air
    2. the newly constructed object is `[[prototype]]`-linked
    3. the newly constructed object is set as the `this` binding for that function call
    4. unless the function returns its own alternate **object**, the `new`-invoked function call will automatically return the newly constructed object.
- Consider:

    ```js
    function foo(a) {
        this.a = a;
    }

    var bar = new foo(2);
    console.log(bar.a); // 2
    ```

    Here `new` is the final way that a function call's `this` can be bound. We'll call this **new binding**.
- All you need to do is find the call-site and inspect it to see which rule applies. It should be clear that the default binding is the lowest priority rule of the 4. Which is more precedent, implicit binding or explicit binding? Let's test it:

    ```js
    function foo() {
        console.log(this.a);
    }

    var obj1 = {
        a: 2,
        foo: foo
    };

    var obj2 = {
        a: 3,
        foo: foo
    };

    obj1.foo(); // 2
    obj2.foo(); // 3

    obj1.foo.call(obj2); // 3
    obj2.foo.call(obj1); // 2
    ```

    So, explicit binding takes precedence over implicit binding, which means you should ask first if explicit binding applies before checking for implicit binding.
- Consider:

    ```js
    function foo(something) {
        this.a = something;
    }

    var obj1 = {
        foo: foo
    };

    var obj2 = {};

    obj1.foo(2);
    console.log(obj1.a); // 2

    obj1.foo.call(obj2, 3);
    console.log(obj2.a); // 3

    var bar = new obj1.foo(4);
    console.log(obj1.a); // 2
    console.log(bar.a); // 4
    ```

- `new` and `call/apply` cannot be used together, so `new foo.call(obj)` is not allowd.
- Consider:

    ```js
    function foo(something) {
        this.a = something;
    }

    var obj = {};

    var bar = foo.bind(obj1);
    bar(2);
    console.log(obj1.a); // 2

    var baz = new bar(3);
    console.log(obj1.a); // 2
    console.log(baz.a); // 4
    ```

    `bar` is hard-bound againts `obj1`, but `new bar(3)` did **not** change `obj1.a` to be `3` as we would have expected. Since `new` was applied, we got the newly created object back, which we named `baz`, and we see in fact that `baz.a` has the value `3`.
- One of the capabilities of `bind(..)` is that any arguments passed after the first `this` binding argument are defaulted as standard arguments to the underlying function (technically called **"partial application"**, which is a subset of **"currying"**). For example:

    ```js
    function foo(p1, p2) {
        this.val = p1 + p2;
    }

    // using `null` here because we don't care about
    // the `this` hard-binding in this scenario, and
    // it will be overridden by the `new` call anyway!
    var bar = foo.bind(null, "p1");

    var baz = new bar("p2");

    console.log(baz.val); // p1p2
    ```

## Determining `this`

- Is the function called with `new` (**new binding**)? If so, `this` is the newly constructed object.

    ```js
    var bar = new foo();
    ```

- Is the function called with `call` or `apply` (**explicit binding**), even hidden inside a `bind` hard binding? If so, `this` is the explicitly specified object.

    ```js
    var bar = foo.call(obj2);
    ```

- Is the function called with a context (implicit binding), otherwise known as an owning or containing object? If so, `this` is that context object.

    ```js
    var bar = obj1.foo();
    ```

- Otherwise, default the `this` (**default binding**). If in `strict mode`, pick `undefined`, otherwise pick the `global` object.

    ```js
    var bar = foo();
    ```

## Ignored `this`

- If you pass `null` or `undefined` as a `this` binding parameter to `call`, `apply` or `bind`, those values are effectively ignored, and instead the **default binding** rule applies to the invocation.

    ```js
    function foo() {
        console.log(this.a);
    }

    var a = 2;

    foo.call(null); // 2
    ```

- Consider:

    ```js
    function foo(a, b) {
        console.log("a:" + a + "b:" + b);
    }

    // spreading out array as parameters
    foo.apply(null, [2, 3]); // a:2, b:3

    //currying with `bind(..)`
    var bar = foo.bind(null, 2);
    bar(3); // a:2, b:3
    ```

    Both these utilities require a `this` binding for the first parameter. If the functions in question don't care about `this`, you need a placeholder value, and `null` might seem like a reasonable choice as shown in this snippet.
- Unfortunately, there's no ES6 syntactic substitute for currying, so the `this` parameter of the `bind(..)`call still needs attension.
- There's a slight hidden **danger** in always using `null` when you don't care about the `this` binding. It might inadvertently reference (or worse, mutate!) the `global` object (`window` in the browser).

## Safer `this`

- `Object.create(null)` is similar to `{}`, but without the delegation to `Object.prototype`, so it's **more empty** than just `{}`. Consider:

    ```js
    function foo(a, b) {
        console.log("a:" + a + ", b:" + b);
    }

    // our DMZ empty object
    var ø = Object.create(null);

    // spreading out array as parameters
    foo.apply(ø, [2, 3]); // a:2, b:3

    // currying with `bind(..)`
    var bar = foo.bind(ø, 2);
    bar(3); // a:2, b:3
    ```

    Not only functionally **safer**, there's a sort of stylistic benefit to `ø`, that is semantically conveys "I want the `this` to be empty" a little more clear than `null` might. But again, name your DMZ (**d**e-**m**ilitarized **z**one) object whatever you prefer.

## Indirection

- Another thing to be aware of is you can (intentionally or not!) create **indirect references** to functions, and in those cases, when that function reference is invoked, the default binding rule also applies.
- One of the most common ways that indirect references occur is from an assignment:

    ```js
    function foo() {
        console.log(this.a);
    }

    var a = 2;
    var o = { a: 3, foo: foo };
    var p = { a: 4 }

    o.foo(); // 3
    (p.foo = o.foo)(); // 2
    ```

    Here the effective call-site is just `foo()`, not `p.foo()` or `o.foo()` as you might expect. So the default binding rule applies.

## Softening Binding

- Let's demonstrate its usage:

    ```js
    function foo() {
        console.log("name: " + this.name);
    }

    var obj = { name: "obj" },
        obj2 = { name: "obj2" },
        obj3 = { name: "obj3" };

    var fooOBJ = foo.softBind(obj);

    fooOBJ(); // name: obj

    obj2.foo = foo.softBind(obj);
    obj2.foo(); // name: obj2 < ----look!!!

    fooOBJ.call(obj3); // name: obj3 < ----look!

    setTimeout(obj2.foo, 10); // name: obj <---- falls back to soft-binding
    ```

    The soft-bound version of the `foo()` function can be manually `this`-bound to `obj2` or `obj3` as shown, but it falls back to `obj` if the default binding would otherwise apply.

## Lexical `this`

- Normal functions abide by the 4 rules we just covered. But ES6 introduces a special kind of function that does not use these rules: **arrow-function**.
- Arrow-functions are signified not by the `function` keyword, but by the `=>` so called **"fat arrow"** operator. Instead of using four standard `this` rules, arrow-functions adopt the `this` binding from enclosing (function or global) scope. For example:

    ```js
    function foo() {
        // return an arrow function
        return (a) => {
            // `this` here is lexically adopted from `foo()`
            console.log(this.a);
        };
    }

    var obj1 = {
        a: 2
    };

    var obj2 = {
        a: 3
    };

    var bar = foo.call(obj1);

    bar.call(obj2); // 2, not 3
    ```

    The lexical binding of an arrow-function cannot be ovverridden (even with `new`!). The most common use-case will likely be in the use of callbacks, such as event handlers or timers:

    ```js
    function foo() {
        setTimeout(() => {
            // `this`here is lexically adopted from `foo()`
            console.log(this.a);
        }, 100);
    }

    var obj = {
        a: 2
    };

    foo.call(obj); // 2
    ```

- It's important to note that arrow-functions essentially are disabling the traditional `this` mechanism in favor of more widely-understood lexical scoping.
- If you find yourself writing `this`-style code, but most or all the time, you defeat the `this` mechanism with lexical `self = this` or arrow-function "tricks", perhaps you should either:
    1. Use only lexical scope and forget the false pretense of `this`-style code.
    2. Embrace `this`-style mechanisms completely, including using `bind(..)` where necessary, and try to avoid `self = this` and arrow-function "lexical this" tricks.

## Object Syntax

- Objects come in two forms: the declarative (literal) form, and the constructed form. The literal syntax for an object looks like this:

    ```js
    var myObj = {
        key: value
        // ...
    }
    ```

    The constructed form looks like this:

    ```js
    var myObj = new Object();
    myObj.key = value;
    ```

    The constructed form and the literal form result in exactly the same sort of object. The only difference really is that you can add one or more key/value pairs to the literal declaration, whereas with constructed-form objects, you must add the properties one-by-one.
- It's extremely uncommon to use the **constructed form** for creating objects. You would pretty much always want to use the literal syntax form. The same will be true of most of the built-in objects.

## Built-in Objects

- There are several object sub-types, usually referred to as built-in objects. For some of them, their names seems to imply they are directly related to their simple primitives counter-parts, but in fact, their relation is more complicated:
  - `String`
  - `Number`
  - `Boolean`
  - `Object`
  - `Function`
  - `Array`
  - `Date`
  - `RegExp`
  - `Error`
- Each of Object built-in functions can be used as a constructor (that is, a function call with the `new` operator) with the result being a newly constructed object of the sub-type in question. For instance:

    ```js
    var strPrimitive = "I am a string";
    typeof strPrimitive; // string
    strPrimitive instanceof String; // false

    var strObject = new String("Im a a string");
    typeof strObject; // object
    strObject instanceof String; // ture

    // inspect the object sub-type
    Object.prototype.toString.call(strObject); // [object String]
    ```

    The primitive value `"I am a string"` is not an object, it's a primitive literal and immutable value.
- Luckily, the language automatically coerces a `"string"` primitive to a `String` object when necessary, which means you almost never need to explicitly create the **Object** form. It is **strongly preferred** by the majority of the **JavaScript** community to use the literal form for a value, where possible, rather than the constructed object form.
- `null` and `undefined` have no object wrapper form, only their primitive values. By contrast, `Date` values can only be created with their constructed object form, as they have no literal form counter-part.
- Since objects are created either way, the simpler literal form is almost universally preferred.
- Only use the constructed form if you need the extra options.

## Object Contents

- What is stored in the container are these property names, which act as pointers (technically, references) to where the values are stored. Consider:

    ```js
    var myObject = {
        a: 2
    };

    myObject.a; // 2

    myObject["a"]; // 2
    ```

    `.a` is a **property access** and `["a"]` is a **key access**. We will use the most common term, **property access** from here on.
- The main difference between the two `.` and `[".."]` syntaxes, is that `.` operator requires an `Identifier` compatible property name after it, whereas the `[".."]` syntax can take basically any UTF-8/unicode compatible string as the name for the property. For example:

    ```js
    var wantA = true;
    var myObject = {
        a; 2;
    };

    var idx;

    id (wantA) {
        idx = "a";
    }

    // later

    console.log(myObject[idx]); // 2
    ```

- In objects, property names are always strings. If you use any other value besides a `string` (primitive) as the property, it will first be converted to a string. For example:

    ```js
    var myObject = {};

    myObject[true] = "foo";
    myObject[3] = "bar";
    myObject[myObject] = "baz";

    myObject["true"]; // "foo"
    myObject["3"]; // "bar"
    myObject["[object Object]"]; // "baz"
    ```

## Computed Property Names

- ES6 adds computed property names, where you can specifiy an expression, surrounded by a `[]` pair, in the key-name position of an object-literal declaration:

    ```js
    var prefix = "foo";

    var myObject = {
        [prefix + "bar"]: "hello",
        [prefix + "baz"]: "world"
    };

    myObject["foobar"]; // hello
    myObject["foobaz"]; // world
    ```

## Property vs. Method

- Every time you access a property on an object, that is a property access, regardless of the type of value you get back.
- The safest conclusion is probably that "function" and "method" are interchangeable in **JavaScript**.

## Arrays

- Arrays assume numeric indexing, which means that values are stored in locations, usually called indices, at non-negative integers, such as `0` and `42`. For example:

    ```js
    var myArray = ["foo", 42, "bar"];

    myArray.length; // 3

    myArray[0]; // "foo"

    myArray[2]; // "bar"
    ```

- Arrays are objects, so you can add propeties onto the array:

    ```js
    var myArray = ["foo", 42, "bar"];

    myArray.baz = "baz";

    myArray.length; // 3

    myArray.baz; // "baz"
    ```

- Adding named properties (regardless of `.` or `[]` operator syntax) does not change the reported `lenght` of the array.
- Use objects to store key/value pairs, and arrays to store values at numeric indices.
- If you try to add a property to an array, but the property name looks like a number, it will end up instead as a numeric index (thus modifying the array contents):

    ```js
    var myArray = ["foo", 42, "bar"];

    myArray["3"] = "baz";

    myArray.length; // 4

    myArray[3]; // "baz"
    ```

- Consider:

    ```js
    function anotherFunction() { /*..*/ }

    var anotherObject = {
        c: true
    };

    var anotherArray = [];

    var myObject = {
        a: 2,
        b: anotherObject, // reference, not a copy!
        c: anotherArray, // another reference!
        d: anotherFunction
    };

    anotherArray.push(anotherObject, myObject);
    ```

    It's refers to references, so it's not a copy. You can have a copy for your objects with `assign(..)` function. For example:

    ```js
    var newObj = Object.assign({}, myObject);

    newObj.a; // 2
    newObj.b === anotherObject; // true
    newObj.c === anotherArray; // true
    newObj.d === anotherFynction; // true
    ```
