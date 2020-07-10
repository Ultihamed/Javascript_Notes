# Scope & Closures

![Scope & Closures](https://www.debuggr.io/static/deed0850c5939ca6f2e263e03e0a9249/af144/cover.png)

## Preface

- While flickering mouse trails and annoying pop-up prompts may be where **JavaScript** started.
- **JavaScript** was made by **Brendan Eich**.
- variables are living in **Scopes**.

## Compiler Theory

- In traditional compiled-language process, they are typically do three steps before they are executed, roughly called **"compilation"**:
    1. **Tokenizing/Lexing:** breaking up a string of characters into meaningful (to the language) chunks, called tokens. For instance, consider the program: `var a = 2;`. This program would likely be broken up into the following tokens: `var`, `a`, `=`, `2` and `;`. Whitespace may or may not be persisted as a token, depending on whether it's meaningful or not.
    2. **Parsing:** taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree is called **"AST"** (**A**bstract **S**yntax **T**ree). For instance, consider this program: `var a = 2;`: this might start with a top-level node called `VariableDeclaration` with a child node called `Identifier` (whose value is `a`), and another child called `AssignmentExpression` which itself has a child called `NumericLiteral` (whose value is `2`).
    3. **Code-Generation:** the process of taking as AST and turning it into executable code.
- For **JavaScript**, the compilation that occurs happens, in many cases, mere microseconds (or less!) before the code is executed. To ensure the fastest performance, **JavaScript** **Engines** use all kinds of tricks (like JITs, which lazy compile and even hot re-compile, etc).

## Understanding Scope

- Scope is **JavaScript Engine** friend, that collects and maintains list of all identifiers (variables), and enforces a strict set of rules as to how these are accessible to currently executing code.
- Consider: `var a = 2;`. Encountering `var a`, **Compiler** asks scope to see if a variable exists for that particular scope collection. If so, **Compiler** ignores this declaration and moves on. Otherwise, **Compiler** asks scope to declare a new variable called `a` for that scope collection. The code **Engine** runs will ask scope if there is a variable called `a` accessible in the current scope collection. If so, **Engine** uses that variable. If not, **Engine** looks elsewhere. To summarize: two distinct actions are taken for a variable assignment: First, **Compiler** declares a variable (if not previously declared in the current scope), and second, when executing, **Engine** looks up the variable in Scope and assigns to it, if found.

## Compiler Speak

- An **LHS** (**L**eft-**H**and **S**ide) look-up is done when a variable appears on the left-hand side of an assignment operation, and an **RHS** (**R**ight-**H**and **S**ide) look-up is done when a variable appears on the right-hand side of an assignment operation.
- LHS look-up is trying to find the variable container itself. RHS look-up is indistinguishable and it means **"go get that value of..."**.
- Consider: `console.log(a)`. The reference to `a` is an RHS reference.
- Consider: `a = 2;`. The reference to `a` is an LHS reference.
- It's better to conceptually think about LHS as "who's the target of the assignment".
- It's better to conceptually think about RHS as "who's the source of the assignment".
- To (implicitly) assign to a function parameter, an LHS look-up is performed, like `function foo(a) {..}`.

## Nested Scope

- If a variable cannot be found in the immediate scope, **Engine** consults the next outer containing scope, continuing until found or until the outermost (aka, global) scope has been reached. Consider:

    ```js
    function foo(a) {
        console.log(a + b);
    }

    var b = 2;

    foo(2); // 4
    ```

    The RHS reference for `b` cannot be resolved inside the function `foo`, but it can be resolved in the scope surrounding it (in this case, the global).
- The simple rules for traversing nested scope: **Engine** starts at the currently executing scope, looks for the variable there, then if not found, keeps going up one level, and so on. If the outermost global scope is reached, the search stops, whether it finds the variable or not.

## Errors

- If an RHS look-up fails to ever find a variable, anywhere in the nested scopes, this results in a `ReferenceError` being thrown by the **Engine**. It's important to note that the error is of the type `ReferenceError`.
- if the **Engine** is performing an LHS look-up and arrives at the top floor (global scope) without finding it, and if the program is not running in **"Strict Mode"**, then the global scope will create a new variable of that name **in the global scope**, and hand it back to **Engine**.
- Strict mode behavior is that it disallows the automatic/implicit global variable creation and **Engine** whould throw a `ReferenceError`.
- if a variable is found for an RHS look-up, but you try to do something with its value that is impossible, such as trying to execute-as-function a non-function value, or reference a property on a `null` or `undefined` value, then **Engine** throws a different kind of error, called a `TypeError`.

## Lex-time & Look-ups

- Consider:

    ```js
    function foo(a) {

        var b = a * 2;

        function bar(c) {
            console.log(a, b, c);
        }

        bar(b * 3);
    }

    foo(2); // 2 4 12
    ```

  - The global scope has just one identifier in it: `foo`.
  - The scope of `foo` includes the three identifiers: `a`, `bar`, `c`.
  - The scope of `bar` includes just one identifier: `c`.
  - Had there been a `c` both inside of `bar(..)` and inside of `foo(..)`, the `console.log(..)` statement would have found and used the one in `bar(..)`, never getting to the one in `foo(..)`.
- Scope look-ups stops once it finds the first match. The same identifier name can be specified at multiple layers of nested scope, which is called **"shadowing"** (the inner identifier "shadows" the outer identifier).
- `a = 5` actually is `window.a = 5`. So global variables are also automatically properties of the global object (`window` in browsers, etc).

## Cheating Lexical

- Cheating lexical scope leads to poorer performance.
- Consider:

    ```js
    function foo(str, a) {
        eval(str); // cheating!
        console.log(a, b);
    }

    var b = 2;

    foo("var b = 3;", 1); // 1, 3
    ```

    This `eval(..)` take takes a string a as an argument, and threats the contents of the string as if it had actually been authored code at that point in the program. This code actually creates variable `b` inside of `foo(..)` that shadows the `b` that was declared in the outer (global) scope.
- `eval(..)` is usually used to execute dynamically create code, as dynamically evaluating essentially static code from a string literal would provide no real benefit to just authoring the code directly.
- `eval(..)` can modifies the existing lexical scope.
- This `eval(..)` is old, legacy behavior and long-since **deprecated**.
- The `new Function (..)` function constructors similarly takes a string of code in its last argument to turn into a dynamically-generated function. This function-constructor syntax is slightly safer than `eval(..)`, but it should still be avoided in your code.
- `with` is typically explained as a short-hand for making multiple property references against an object without repeating the object reference itself each time. For example:

    ```js
    var obj = {
        a: 1,
        b: 2,
        c: 3
    };

    // more "tedious" to repeat "obj"
    obj.a = 2;
    obj.b = 3;
    obj.c = 4;

    // "easier" short-hand
    with (obj) {
        a = 3;
        b = 4;
        c = 5;
    }

    console.log(obj.c); // 5
    ```

    Don't use `with` anymore. It's now **deprecated**.
- The `with` statement takes an object, one which has zero or more properties, and treats that object as if it is a wholly separate lexical scope, and thus the object's properties are treated as lexically defined identifiers in that "scope". The `with` statement actually creates a whole new lexical scope out of thin air, from the object you pass to in.
- In addition to being a bad idea to use, both `eval(..)` and `with` are affected (restricted) by **strict mode**.

## Performance

- Using both `eval(..)` and `with` will decrease **JavaScript Engine**'s performance, because it cannot know at lexing time exactly what code you may pass to `eval(..)` to modify the lexical scope, or the contents of the object you may pass to `with` to create a new lexical scope to be consulted. **Don't use them at all**.

## Hiding In Plain Scope

- You can **"hide"** variables and functions by enclosing them in the scope of a function.
- Giving the enclosing scope "access" to some variables which are unnecessary, may be **"dangerous"**. For example you should do like this:

    ```js
    function doSomething(a) {
        function doSomethingElse(a) {
            return a - 1;
        }

        var b;

        b = a + doSomethingElse(a * 2);

        console.log(b * 3);
    }

    doSomething(2); // 15
    ```

    Instead doing:

    ```js
    function doSomething(a) {
        b = a + doSomethingElse(a * 2);

        console.log(b * 3);
    }

    function doSomethingElse(a) {
        return a - 1;
    }

    var b;

    doSomething(2); // 15
    ```

## Collision Avoidance

- You can avoid unintended collision between two different identifiers with the same name. For example:

    ```js
    function foo() {
        function bar(a) {
            i = 3; // changing the `i` in the enclosing scope's for-loop
            console.log(a + i);
        }

        for (var i = 0; i < 10; i++) {
            bar(i * 2); // oops, infinite loop ahead!
        }
    }

    foo();
    ```

    Here you can type `var i = 3` instead of `i = 3` to solve this infinite loop problem.

## Global "NameSpaces"

- Multiple libraries loaded into your program can quite easily collide with each other if the don't properly hide their internal/private functions and variables.
- Libraries typically will create a single variable declaration, often an object with a sufficiently unique name, in the global scope. This object is then used as a **"namespace"** for that library, where all specific exposures of functionality are made as properties off that object (namespace), rather than as top-level lexically scoped identifiers themselves. For example:

    ```js
    var MyRealCoolLibrary = {
        awesome: "stuff",
        doSomething: function () {
            // ....
        },
        doAnotherThing: function () {
            // ...
        }
    };
    ```

## Module Management

- Another option for collision avoidance is the more modern **"module"** approach, using any of various dependency managers.
- Modules are kept in private, non-collision-susceptible scopes, which prevents any accidental scope coillisions.

## Functions As Scopes

- The easiest way to distinguish function declaration vs. function expression is the position of the word "function" in the statement (not just a line, but a distinct statement). If "function" is the very first thing in the statement, then it's a function declaration. Otherwise, it's a function expression. In other words, `(function foo(){ .. })` as an expression means the identifier `foo` is found only in the scope where the `..` indicates, not in the outer scope. Hiding the name `foo` inside itself means it's not pollute the enclosing scope unnecessarily.

## Anonymous vs. Named

- Consider:

    ```js
    setTimeout( function(){
        console.log("I waited 1 second!");
    }, 1000 );
    ```

    This is called an **"anonymous function expression"**, becauses `function()...` has no name identifier on it.

- Function expressions can be anonymous, but function declarations cannot omit the name. That would be illegal **JavaScript** grammer.
- Anonymous functions have some draw-backs:
    1. Anonymous functions have no useful name to display in stack traces, which can make debugging more difficult.
    2. Event handler function wants to unbind itself after it fires. With anonymous it can't, because the function need a name to self-referencing.
    3. Anonymous functions omit a name that is often helpful in providing more readable/understandable code. A descriptive name helps self-document the code in question.
- Inline function expressions are powerful and useful.
- Providing a name for your function expression quite effectively addresses all these draw-backs, but has no tangible downsides. The best practice is to always name your function expressions:

    ```js
    setTimeout(function timeOutHandler() { // <-- Look, I have a name!
        console.log("I waited 1 second");
    }), 1000);
    ```

## Invoking Function Expressions Immedialtely

- **IIFE** stands for **I**mmediately **I**nvoked **F**unction **E**xpression. We have a function as an expression by virtue of wrapping it in a `()` pair, we can execute that function by adding another `()` on the end, like `(function foo() {..})()`.
- There is another form of IIFE, that inverts the order of things, where the function to execute is given second, after the invokation and parameters to pass it. This pattern is used in the UMD (**U**niversal **M**odule **D**efinition). For example:

    ```js
    var a = 2;

    (function IIFE(def) {
        def(window);
    })(function def(global) {

        var a = 3;
        console.log(a); // 3
        console.log(global.a); // 2
    });
    ```

## Blocks As Scopes

- Using `var` in `if` or `for` loop (or etc) scope is **fake** block-scoping, for stylistic reasons. So you can access it from outside the scope. For example:

    ```js
    // you can access `bar` from outside of `if` scope, so it have fake block-scoping
    var foo = true;

    if (foo) {
        var bar = foo * 2;
        bar = something(bar);
        console.log(bar);
    }

    bar = 10; // you can modify `bar` value, because it is accessible

    // you can access `i` from outside of `if` scope, so it have fake block-scoping
    for (var i = 5; i < 10; i++) {
        // ..
    }

    console.log(i); // 10
    ```

- Block scope is a tool to hiding information in functions to hiding information in blocks of our code.

## `try/catch`

- Many linters seem to still complain if you have two or more `catch` clauses in the same scope which each declare their error variable with the same identifier name. To avoid these unnecessary warnings, some devs will name their `catch` variables `err1`, `err2`, etc. Other devs will simply turn off the linting check for duplicate variable names. For example:

    ```js
    try {
        undefined(); // illegal operation to force an exception!
    }
    catch (err) {
        console.log(err); // works!
    }

    console.log(err); // ReferenceError: `err` not found
    ```

## `let`

- Fortunately, ES6 changes that, and introduces a new keyword `let` which sits alongside `var` as another way to declare variables.
- The `let` keyword implicitly hijacks any block's scope for its variable declaration. For example:

    ```js
    var foo = true;

    if (foo) {
        let bar = foo * 2;
        bar = something(bar);
        console.log(bar);
    }

    console.log(bar); // ReferenceError
    ```

- We can create an arbitrary block for `let` to bind by simply including a `{..}` pair anywhere a statement is valid grammer. For example:

    ```js
    var foo = true;

    if (foo) {
        { // <-- explicit block
            let bar = foo * 2;
            bar = something(bar);
            console.log(bar);
        }
    }

    console.log(bar); // ReferenceError
    ```

- Declarations made with `let` **will not hoist** to the entire scope of the block they appear in. For example:

    ```js
    {
        console.log(bar); // ReferenceError!
        let bar = 2;
    }

    // Error: Cannot access 'bar' before initialization
    ```

- A particular case where `let` shines is in the for-loop case.

## Garbage Collection

- Declaring explicit blocks for variables to locally bind to is a powerful tool that you can add to your code toolbox. Consider:

    ```js
    function process(data) {
        // do something interesting
    }

    var someReallyBigData = { .. };

    process(someReallyBigData);

    var btn = document.getElementById("my_button");

    btn.addEventListener("click", function click(evt) {
        console.log("button clicked");
    }, /*capturingPhase=*/false);
    ```

    The `click` function click handler callback doesn't need the `someReallyBigData` variable at all. That means, theoretically, after `process(..)` runs, the big memory-heavy data structure could be garbage collected. Block-scoping can address this concern, making it clearer to the engine that it does not need to keep `someReallyBigData` around:

    ```js
    function process(data) {
        // do something interesting
    }

    // anything declared inside this block can go away after!
    {
        let someReallyBigData = { .. };

        process(someReallyBigData);
    }

    var btn = document.getElementById("my_button");

    btn.addEventListener("click", function click(evt) {
        console.log("button clicked");
    }, /*capturingPhase=*/false);
    ```

- **JavaScript Engine** have automatic memory management known as garbage collection (GC).

## `const`

- Any attempt to change `const` value at a later time results in an error.
- `const` means constant (fixed value).
- `const` block-scoping is like `let` block-scoping. For example:

    ```js
    var foo = true;

    if (foo) {
        var a = 2;
        const b = 3; // block-scoped to the containing `if`

        a = 3; // just fine!
        b = 4; // error!
    }

    console.log(a); // 3
    console.log(b); // ReferenceError!
    ```

## Chicken Or The Egg

- Both variables and functions, are processed first, before any part of your code is executed.
- **JavaScript** will see `var a = 2;` as two statements: `var a;` and `a = 2;`. So `var a;` (variable dcelaration) compiles first. Consider:

    ```js
    a = 2;

    var a;

    console.log(a);
    ```

    **JavaScript Engine** looks this code like:

    ```js
    var a;

    a = 2;

    console.log(a); // 2
    ```

    Now Consider:

    ```js
    console.log(a);

    var a = 2;
    ```

    We said functions and variables will compiles (hoisting) first. So **JavaScript Engine** looks this code like:

    ```js
    var = a;

    console.log(a); // undefined

    a = 2;
    ```

    Another example:

    ```js
    foo();

    function foo() {
        console.log(a); // undefined
        var a = 2;
    }
    ```

    **JavaScript Engine** looks this code like:

    ```js
    function foo() {
        var a;

        console.log(a); // undefined

        a = 2;
    }

    foo();
    ```

    Another example:

    ```js
    foo(); // TypeError
    bar(); // ReferenceError

    var foo = function bar() {
        // ...
    };
    ```

    This snippet is more accurately interpreted (with hoisting) as:

    ```js
    var foo;

    foo(); // TypeError
    bar(); // ReferenceError

    foo = function () {
        var bar = ...self...
        // ...
    }
    ```

    Another example about functions hoisting:

    ```js
    foo(); // 1

    var foo;

    function foo() {
        console.log(1);
    }

    foo = function () {
        console.log(2);
    };
    ```

    `1` is printed instead of `2`. This snippet is interpreted by the **Engine** as:

    ```js
    function foo() {
        console.log(1);
    }

    foo(); // 1

    foo = function () {
        console.log(2);
    };
    ```

- Always the egg (declaration) comes before the chicken (assignment).
- While multiple/duplicate `var` declarations are effectively ignored, subsequent function declarations do override previous ones. For example:

    ```js
    foo(); // 3

    function foo() {
        console.log(1);
    }

    var foo = function () {
        console.log(2);
    };

    function foo() {
        console.log(3);
    }
    ```

- Avoid declaring functions in blocks.

## Closures

- Closure is all around you in **JavaScript**, you just have to recognize and embrace it.
- You do not even really have to intentionally create closures to take advantage of them.
- Consider and remember:

    ```js
    function foo() {
        var a = 2;

        function bar() {
            console.log(a);
        }

        return bar; // return a function
    }

    var baz = foo();

    baz(); // 2 -- Whoa, closure was just observed, man.
    ```

- Closure lets the function continue to access the lexical scope it was defined in at author-time.
- Consider:

    ```js
    function foo() {
        var a = 2;

        function baz() {
            console.log(a); // 2
        }

        bar(baz);
    }

    function bar(fn) {
        fn(); // look ma, I saw closure!
    }
    ```

    These passings-around of functions can be indirect, too:

    ```js
    var fn;

    function foo() {
        var a = 2;

        function baz() {
            console.log(a);
        }

        fn = baz; // assign `baz` to global variable
    }

    function bar() {
        fn(); // look ma, I saw closure!
    }

    foo();

    bar(); // 2
    ```

- All kind of **JavaScript** frameworks (like jQuery or etc) uses closures:

    ```js
    // jQuery
    function setupBot(name, selector) {
        $(selector).click(function activator() {
            console.log("Activating: " + name);
        });
    }

    setupBot("Closure Bot 1", "#bot_1");
    setupBot("Closure Bot 2", "#bot_2");
    ```

- Consider:

    ```js
    for (var i = 1; i <= 5; i++) {
        (function () {
            var j = i;
            setTimeout(function timer() {
                console.log(j);
            }, j * 1000);
        })();
    }
    ```

    You can use this snippet simpler like this:

    ```js
    for (var i = 1; i <= 5; i++) {
        (function (j) {
            setTimeout(function timer() {
                console.log(j);
            }, j * 1000);
        })(i);
    }
    ```

    You can use `let` keyword. This behavior says that the variable will be declared not just once for the loop, **but each iteration**. For example:

    ```js
    for (let i = 1; i <= 5; i++) {
        setTimeout(function timer() {
            console.log(i);
        }, i * 1000);
    }
    ```

    I don't know about you, but that makes me a happy **JavaScripter**.

## Modules

- Here you see a simple module:

    ```js
    function CoolModule() {
        var something = "cool";
        var another = [1, 2, 3];

        function doSomething() {
            console.log(something);
        }

        function doAnother() {
            console.log(another.join(" ! "));
        }

        return {
            doSomething: doSomething,
            doAnother: doAnother
        };
    }

    var foo = CoolModule();

    foo.doSomething(); // cool
    foo.doAnother(); // 1 ! 2 ! 3
    ```

    It's appropriate to think of this object return value as essentially a **public API for our module**.
- Without the execution of the outer function, the creation of the inner scope and the closures would not occur. Because it is a `function`.
- There are two **requirements** for the module pattern to be exercised:
    1. There must be an outer enclosing function, and it must be invoked at least once (each time creates a new module instance).
    2. The enclosing function must return back at least one inner function, so that this inner function has closure over the private scope, and can access and/or modify that private state.
- An object with a function property on it alone is not really a module.
- You can turn your module function into an IIFE. For example:

    ```js
    var foo = (function CoolModule() {
        var something = "cool";
        var another = [1, 2, 3];

        function doSomething() {
            console.log(something);
        }

        function doAnother() {
            console.log(another.join(" ! "));
        }

        return {
            doSomething: doSomething,
            doAnother: doAnother
        };
    })();

    foo.doSomething(); // cool
    foo.doAnother(); // 1 ! 2 ! 3
    ```

- Another slight but powerful variation on the module pattern is to name the object you are returning as your public API:

    ```js
    var foo = (function CoolModule(id) {
        function change() {
            // modifying the public API
            publicAPI.identify = identify2;
        }

        function identify1() {
            console.log(id);
        }

        function identify2() {
            console.log(id.toUpperCase());
        }

        var publicAPI = {
            change: change,
            identify: identify1
        }

        return publicAPI;
    })("foo module");

    foo.identify(); // foo module
    foo.change();
    foo.identify(); // FOO MODULE
    ```

- You can create a module manager like this:

    ```js
    var MyModules = (function Manager() {
        var modules = {}

        function define (name, deps, impl) {
            for (var i = 0; i < deps.lenght; i++) {
                deps[i] = modules[deps[i]];
            }
            modules[name] = impl.apply(impl, deps);
        }

        function get(name) {
            return modules[name];
        }

        return {
            define: define,
            get: get
        };
    })();
    ```

    Here you can add some modules to your module manager:

    ```js
    MyModules.define("bar", [], function () {
        function hello(who) {
            return "Let me introduce:" + who;
        }

        return {
            hello: hello
        };
    });

    MyModules.define("foo", ["bar"], function (bar) {
        var hungry = "hippo";

        function awesome() {
            console.log(bar.hello(hungry).toUpperCase());
        }

        return {
            awesome: awesome
        };
    });

    var bar = MyModules.get("bar");
    var foo = MyModules.get("foo");

    console.log(
        bar.hello("hippo")
    ); // Let me introduce: hippo

    foo.awesome(); // LET ME HIPPO
    ```

    Here `foo` even receives the instance of `bar` as a dependency parameter, and can use it accordingly.
- ES6 adds first-class syntax support for the concept of modules. When loaded via the module system, ES6 treats a file as a separate module. Each module can both import other modules or specific API members, as well export their own public API members.
- ES6 Module APIs are static (the APIs don't change at run-time).
- ES6 modules do not have an "inline" format, they must be defined in separate files (one per module).
- You can use `export` keyword in ES6 to export a module. Then use `import` keyword to import that module into your file. For example:

    ```js
    function hello(who) {
        return "Let me introduce:" + who;
    }

    export hello;
    ```

    Then you can import it to another file:

    ```js
    // import only `hello()` from the "bar" module
    import hello from "bar";

    var hungry = "hippo";

    function awesome() {
        console.log(
            hello(hungry).toUpperCase()
        );
    }

    export awesome;
    ```

    You can import the entire modules into a file using `module` keyword. For example:

    ```js
    // import the entire "foo" and "bar" modules
    module foo from "foo";
    module bar from "bar";

    console.log(
        bar.hello("rhino)
    ); // Let me introduce: rhino

    foo.awesome(); // LET ME INTRODUCE: HIPPO
    ```

- `import` imports one or more members from a module's API into the current scope, each to a bound variable (like `hello` API).
- `module` imports an entire module API to a bound variable (like `foo`, `bar` API).
- `export` exports an identifier (variable, function) to the public API for the current module.
- Closure is when a function can remember and access its lexical scope even when it's invoked outside its lexical scope.
