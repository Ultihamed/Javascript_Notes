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

## Property Descriptors

- Consider:

    ```js
    var myObject = {
        a: 2
    };

    Object.getOwnPropertyDescriptor(myObject, "a");
    // {
    // value: 2,
    // writable: true,
    // enumerable: true,
    // configurable: true
    // }
    ```

    As you can see, the property descriptor for our normal object property `a` is much more than just its `value` of `2`. It includes 3 more other characteristics: `writable`, `enumerable`, and `configurable`.
- We can use `Object.defineProperty(..)` to add a new property, or modify an existing one (if it's `configurable`!), with the desired characteristics. For example:

    ```js
    var myObject = {};

    Object.defineProperty(myObject, "a", {
        value: 2,
        writable: true,
        configurable: true,
        enumerable: true
    });

    myObject.a; // 2
    ```

## Writable

- The ability for you to change the value of a property is controlled by `writable`. Consider:

    ```js
    var myObject = {};

    Object.defineProperty(myObject, "a", {
        value: 2,
        writable: false, // not writable!
        configurable: true,
        enumerable: true
    });

    myObject.a = 3;

    myObject.a; // 2
    ```

    As you can see, our modification of the `value` silently failed. If we try in `strict mode`, we get an error:

    ```js
    "use strict";

    var myObject = {};
    Object.defineProperty(myObject, "a", {
        value: 2,
        writable: false, // not writable!
        configurable: true,
        enumerable: true
    });

    myObject.a = 3; // TypeError
    ```

## Configurable

- Changing `configurable` to `false` is a **one-way action, and cannot be undone!**
- `configurable:false` prevents is the ability to use the `delete` operator to remove an existing property. For example:

    ```js
    var myObject = {
        a: 2
    };

    myObject.a; // 2
    delete myObject.a;
    myObject.a; // undefined

    Object.defineProperty(myObject, "a", {
        value: 2,
        writable: true,
        configurable: false,
        enumerable: true
    });

    myObject.a; // 2
    delete myObject.a;
    myObject.a; // 2
    ```

- `delete` is only used to remove object properties (which can be removed) directly from the object in question.
- If an object property is the last remaining reference to some object/function, and you `delete` it, that removes the reference and now that unreferenced object/function can be garbage collected.

## Object Constant

- By combining `writable: false` and `configurable: false`, you can essentially create a constant (cannot be changed, redefined or deleted) as an object property, like:

    ```js
    var myObject = {};

    Object.defineProperty(myObject, "FAVORITE_NUMBER", {
        value: 42,
        writable: false,
        configurable: false
    });
    ```

## Prevent Extensions

- If you want to prevent an object from having new properties added to it, but otherwise leave the rest of the object's properties alone, call `Object.preventExtensions(..)`:

    ```js
    var myObject = {
        a: 2
    };

    Object.preventExtensions(myObject);

    myObject.b = 5;
    myObject.b; // undefined
    ```

    In `non-strict mode`, the creation of `b` fails silently. In `strict mode`, it throws a `TypeError`.

## Seal

- `Object.seal(..)` creates a **sealed** object, which means it takes an existing object and essentially calls `Object.preventExtensions(..)` on it, but also marks all its existing properties as `configurable: false`. So, not only can you not add any more properties, but you also cannot reconfigure or delete any existing properties (though you can still modify their values).

## Freeze

- `Object.free(..)` creates a frozen object, which means it takes an existing object and essentially calls `Object.seal(..)` on it, but it also mark all **data accessor** properties as `writable: false`, so their values cannot be changed.
- This approach is the highest level of immutability that you can attain for an object itself, as it prevents any changes to the object or to any of its direct properties.

## `[[Get]]`

- One important result of this `[[Get]]` operation is that if it cannot through any means come up with a value for the requested property, it instead returns the value `undefined`. For example:

    ```js
    var myObject = {
        a: 2
    };

    myObject.b; // undefined
    ```

- Inspecting only the value results, you cannot distinguish whether a property exists and holds the explicit value `undefined`, or whether the property does not exist and `undefined` was the default return value afer `[[Get]]` failed to return something explicitly. For example:

    ```js
    var myObject = {
        a: undefined
    };

    myObject.a; // undefined

    myObject.b; // undefined - performed a bit more "work" for the reference `myObject.b`
    ```

## `[[Put]]`

- If the property of a object presents, the `[[Put]]` algorithm roughly check:
    1. Is the property an accessor descriptor? **If so, call the setter, if any**.
    2. Is the property a data descriptor with `writable` of `false`? **If so, silently fail in `non-strict mode`, or throw `TypeError` in `strict mode`**.
    3. Otherwise, set the value to the existing property as normal.

## Getters & Setters

- Getters are properties which actually call a hidden function to retrieve a value.
- Setters are properties which actually call a hidden function to set a value.
- Consider:

    ```js
    var myObejct = {
        // define a getter for `a`
        get a() {
            return 2;
        }
    };

    myObject.a = 3;

    myObject.a; // 2
    ```

    Since we only defined a getter for `a`, if we try to set the value of `a` later, the set operation won't throw an error but will just silently throw the assignment away. Even if there was a valid setter, our custom getter is hard-coded to return only `2`, so the set operation would be moot. Another example:

    ```js
    var myObject = {
        // define a getter for `a`
        get a() {
            return this._a_;
        },

        // define a setter for `a`
        set a(val) {
            this._a_ = val * 2;
        }
    };

    myObject.a = 2;

    myObject.a; // 4
    ```

## Existence

- We can ask an object if it has a certain property without asking to get that property's value:

    ```js
    var myObejct = {
        a: 2
    };

    ("a" in myObejct); // true
    ("b" in myObejct); // false

    myObejct.hasOwnProperty("a"); // true
    myObejct.hasOwnProperty("b"); // false
    ```

    The `in` operator will check to see if the property is in the object, or if it exist at any higher level of the `[[Prototype]]` chain object traversal. By contrast, `hasOwnProperty(..)` checks to see if only `myObject` has the property or not, and will not consult the `[[Prototype]]` chain.
- It's possible to create an object that does not link to `Object.prototype` (via `Object.create(null)`). In this case, a method call like `myObject.hasOwnProperty(..)` would fail.

## Enumeration

- Consider:

    ```js
    var myObject = {};

    Object.defineProperty(
        myObject,
        "a",
        // make `a` enumerable, as normal
        { enumerable: true, value: 2 }
    );

    Object.defineProperty(
        myObject,
        "b",
        // make `b` NON-enumerable
        { enumerable: false, value: 3 }
    );

    myObject.b; // 3
    ("b" in myObject); // true
    myObject.hasOwnProperty("b"); // true

    // .......

    for (var k in myObject) {
        console.log(k, myObject[k]);
    }
    // "a" 2
    ```

    You'll notice that `myObject.b` in fact exist and has an accessible value, but it doesn't show up in a `for..in` loop. That's because **enumerable** basically means **will be included if the object's properties are iterated through**. Another way that enumerable and non-enumerable properties can be distinguished:

    ```js
    var myObject = {};

    Object.defineProperty(
        myObject,
        "a",
        // make `a` enumerable, as normal
        { enumerable: true, value: 2 }
    );

    Object.defineProperty(
        myObject,
        "b",
        // make `b` non-enumerable
        { enumerable: false, value: 3 }
    );

    myObject.propertyIsEnumerable("a"); // true
    myObject.propertyIsEnumerable("b"); // false

    Object.keys(myObject); // ["a"]
    Object.getOwnPropertyNames(myObject); // ["a", "b"]
    ```

    `Object.keys(..)` returns an array of all enumerable properties, whereas `Object.getOwnPropertyNames(..)` returns an array of all properties, enumerable or not.

## Iteration

- With numerically-indexed arrays, iterating over the values is typically done with a standard `for` loop, like:

    ```js
    var myArray = [1, 2, 3];

    for (var i = 0; i < myArray.length; i++) {
        console.log(myArray[i]);
    }
    // 1 2 3
    ```

- `forEach(..)` will iterate over all values in the array, and ignores any callback return values.
- `every(..)` keeps going until the end or the callback returns a `false` (or **falsy**) value.
- `some(..)` keeps going until the end or the callback returns a `true` (or **truthy**) value.
- Helpfully, ES6 adds a `for..of` loop syntax for iterating over arrays (and objects, if the object defines its own custom itertor):

    ```js
    var myArray = [1, 2, 3];

    for (var v of myArray) {
        console.log(v);
    }
    // 1
    // 2
    // 3
    ```

- You can manually iterate the array, using the built-in `@@iterator`. For example:

    ```js
    var myArray = [1, 2, 3];

    var it = myArray[Symbol.iterator]();

    it.next(); // { value: 1, done: false }
    it.next(); // { value: 2, done: false }
    it.next(); // { value: 3, done: false }
    it.next(); // { done: true }
    ```

- `foo..of` calls `next()` function automatically and it's a powerful new syntactic tool for manipulating user-defined objects.
- We could have declared `Symbol` directly in a object, like `var myObject = { a: 2, b: 3, [Symbol.iterator]: function () { /* .. */ } }`.
- You can even generate **infinite** iterators which never **finish** and always return a new value (such as a random number, an incremented value, a unique identifier, etc), though you probably will not use such iterators with an unbounded `for..of` loop, as it would never end and would hang your program. For example:

    ```js
    var randoms = {
        [Symbol.iterator]: function () {
            return {
                next: function () {
                    return { value: Math.random() };
                }
            };
        }
    };

    var randoms_pool = [];
    for (var n of randoms) {
        randoms_pool.push(n);

        // don't proceed unbounded!
        if (randoms_pool.length === 100) break;
    }
    ```

    This iterator will generate random numbers "forever", so we're careful to only pull out 100 values so our program doesn't hang.

## Class Theory

- Does **JavaScript** actually has classes? Plain and simple: **No**.
- A class is a blue-print. To actually get an object we can interact with, we must build (aka, **instantiate**) something from the class. The end result of such **construction** is an object, typically called an **instance**, which we can directly call methods on and access any public data properties from, as necessary. **This object is a copy** of all the characteristics described by the class (Classes mean copies).
- A class is instantiated into object form by a copy operation.
- Classes are a design pattern. Many languages provide syntax which enables natural class-oriented software design. **JavaScript** also has a similar syntax, but it behaves very differently from what you're used to with classes in those other languages.

## Constructor

- Consider:

    ```js
    class CoolGuy {
        specialTrick = nothing

        CoolGuy(trick) {
            specialTrick = trick
        }

        showOff() {
            output("Here's my trick: ", specialTrick)
        }
    }
    ```

    To make a `CoolGuy` instance, we would call the class constructor:

    ```js
    Joe = new CoolGuy("jumping rope");

    Joe.showOff(); // Here's my trick: jumping rope
    ```

    Notice that the `CoolGuy` class has a constructor `CoolGuy()`, which is actually what we call when we say `new CoolGuy(..)`. We get an object back (an instance of our class) from the constructor, and we can call the method `showOff()`, which prints out that particular `CoolGuy`s special trick.
- In **JavaScript**, it's most appropriate to say that a **constructor** is any function called with `new` kewword in front of it. Functions aren't constructors, but function calls are **constructor calls** if and only if `new` is used.

## Class Inheritance

- Once a child class is defined, it's separate and distinct from the parent class.
- The child class contains an initial copy of the behavior from the parent, but can then override any inherited behavior and even define new behavior.

## Polymorphism

- Polymorphism means having different functions at multiple levels of an inheritance chain with the same name.
- In many languages, the keyword `super` is used, in **JavaScript** we use `inherited:`, which leans on the idea that a **super class** is the parent/ancentor of the current class.
- When classes are inherited, there is a way for the classes themselves (not the object instances created from them!) to relatively reference the class inherited from, and this relative reference is usually called `super`.
- If the child **overrides** a method it inherits, both the original and overriden versions og the method are actually maintained, so that they are both accessible.
- Don't let polymorphism confuse you into thinking a child class is linked to its parent class. A child class instead gets a copy of what it needs from the parent class. **Class inheritance implies copies**.

## Multiple Inheritance

- If a class could inherit from two other classes, it would more closely fit the parent/child metaphor.
- Multiple-inheritance means that each parent class definition is copied into the child class.
- there are no **classes** in **JavaScript** to instantiate, only objects.

## Explicit Mixins

- There is no class in **JavaScript**, the mechanism is like this:

    ```js
    // vastly simplified `mixin(..)` example:
    function mixin(sourceObj, targetObj) {
        for (var key in sourceObj) {
            // only copy if not already present
            if (!(key in targetObj)) {
                targetObj[key] = sourceObj[key];
            }
        }

        return targetObj;
    }

    var Vehicle = {
        engines: 1,

        ignition: function () {
            console.log("Turning on my engine.");
        },

        drive: function () {
            this.ignition();
            console.log("Steering and moving forward!");
        }
    };

    var Car = mixin(Vehicle, {
        wheels: 4,

        drive: function () {
            Vehicle.drive.call(this);
            console.log("Rolling on all " + this.wheels + " wheels!");
        }
    });
    ```

    `Car` now has a copy of the properties and functions from `Vehicle`. Technically, functions are not actually duplicated, but rather references to the functions are copied. `Car` already had a `drive` property (function), so that property reference was not overridden (see the `if` statement in `mixin(..)` above).
- Explicit pseudo-polymorphism should be avoided wherever possible, because the cost outweighs the benefit in most respects.

## Parasitic Inheritance

- **JavaScript** does not automatically create copies (as classes imply) between objects.
- Consider:

    ```js
    // "Traditional JS Class" `Vehicle`
    function Vehicle() {
        this.engines = 1;
    }
    Vehicle.prototype.ignition = function () {
        console.log("Turning on my engine.");
    };
    Vehicle.prototype.drive = function () {
        this.ignition();
        console.log("Steering and moving forward!");
    };

    // "Parasitic Class" `Car`
    function Car() {
        // first, `car` is a `Vehicle`
        var car = new Vehicle();

        // now, let's modify our `car` to specialize it
        car.wheels = 4;

        // save a privileged reference to `Vehicle::drive()`
        var vehDrive = car.drive;

        // override `Vehicle::drive()`
        car.drive = function () {
            vehDrive.call(this);
            console.log("Rolling on all " + this.wheels + " wheels!");
        };

        return car;
    }

    var myCar = new Car();

    myCar.drive();
    // Turning on my engine.
    // Steering and moving forward!
    // Rolling on all 4 wheels!
    ```

## Implicit Mixins

- Consider:

    ```js
    var Something = {
        cool: function () {
            this.greeting = "Hello World";
            this.count = this.count ? this.count + 1 : 1;
        }
    };

    Something.cool();
    Something.greeting; // "Hello World"
    Something.count; // 1

    var Another = {
        cool: function () {
            // implicit mixin of `Something` to `Another`
            Something.cool.call(this);
        }
    };

    Another.cool();
    Another.greeting; // "Hello World"
    Another.count; // 1 (not shared state with `Something`)
    ```

    We essentially **borrow** the function `Something.cool()` and call it in the context of `Another` (via its `this` binding) instead of `Something`. The end result is that the assignments that `Something.cool()` makes are applied against the `Another` object rather than the `Something` object.
- Generally, avoid such constructs where possible to keep cleaner and more maintainable code.

## `[[Prototype]]`

- The default `[[Get]]` proceeds to follow the `[[Prototype]]` **link** of the object if it cannot find the requested property on the object directly.
- Consider:

    ```js
    var anotherObject = {
        a: 2
    };

    // create an object linked to `anotherObject`
    var myObject = Object.create(anotherObject);

    for (var k in myObject) {
        console.log("found: " + k);
    }
    // found: a

    ("a" in myObject); // true
    ```

    If you use `in` for a object, you can see all of the object properties.
- All normal (built-in, not host-specific extension) objects in **JavaScript "descend from"** (aka, have at the top of their `[[Prototype]]` chain) the `Object.protorype` object.
- Consider:

    ```js
    myObject.foo = "bar";
    ```

    If the `myObject` object already has a normal data accessor property called `foo` directly present on it, the assignment is as simple as changing the value of the exisiting property. If the `foo` is not already present directly on `myObject`, the `[[Prototype]]` chain in traversed, just like for the `[[Get]]` operation. If `foo` is not found anywhere in the chain, the property `foo` is added directly to `myObject` with the specified value, as expected.
- You can define a property for a object with `Object.defineProperty(..)` function.
- Consider:

    ```js
    var anotherObject = {
        a: 2
    };

    var myObject = Object.create(anotherObject);

    anotherObject.a; // 2
    myObject.a; // 2

    anotherObject.hasOwnProperty("a"); // true
    myObject.hasOwnProperty("a"); // false

    myObject.a++; // oops, implicit shadowing!

    anotherObject.a; // 2
    myObject.a; // 3

    myObject.hasOwnProperty("a"); // true
    ```

## **Class** Functions

- Each object created from calling `new Foo()` will end up `[[Prototype]]`-linked to this (below) "Foo dot prototype" object. For example:

    ```js
    function Foo() {
        // ...
    }

    Foo.prototype; // { }

    // ====== Next Example ======

    function Bar() {
        // ...
    }

    var a = new Bar();

    Object.getPrototypeOf(a) === Bar.protortype; // true
    ```

- In **JavaScript**, we don't make copies from one object (**class**) to another (**instance**). We make links between objects. For the `[[Prototype]]` mechanism, visually, the arrows move from right to left, and from bottom to top.
- **Inheritance** implies a copy operation, and JavaScript doesn't copy object properties (natively, by default). Instead, **JavaScript** creates a link between two objects, where one object can essentially delegate property/function access to another object.
