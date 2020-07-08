# Scope & Closures

![Scope & Closures](https://www.debuggr.io/static/deed0850c5939ca6f2e263e03e0a9249/af144/cover.png)

## Preface

- While flickering mouse trails and annoying pop-up prompts may be where **Javascript** started.
- **Javascript** was made by **Brendan Eich**.
- variables are living in **Scopes**.

## Compiler Theory

- In traditional compiled-language process, they are typically do three steps before they are executed, roughly called **"compilation"**:
    1. **Tokenizing/Lexing:** breaking up a string of characters into meaningful (to the language) chunks, called tokens. For instance, consider the program: `var a = 2;`. This program would likely be broken up into the following tokens: `var`, `a`, `=`, `2` and `;`. Whitespace may or may not be persisted as a token, depending on whether it's meaningful or not.
    2. **Parsing:** taking a stream (array) of tokens and turning it into a tree of nested elements, which collectively represent the grammatical structure of the program. This tree is called **"AST"** (**A**bstract **S**yntax **T**ree). For instance, consider this program: `var a = 2;`: this might start with a top-level node called `VariableDeclaration` with a child node called `Identifier` (whose value is `a`), and another child called `AssignmentExpression` which itself has a child called `NumericLiteral` (whose value is `2`).
    3. **Code-Generation:** the process of taking as AST and turning it into executable code.
- For **Javascript**, the compilation that occurs happens, in many cases, mere microseconds (or less!) before the code is executed. To ensure the fastest performance, **Javascript** **Engines** use all kinds of tricks (like JITs, which lazy compile and even hot re-compile, etc).

## Understanding Scope

- Scope is **Javascript Engine** friend, that collects and maintains list of all identifiers (variables), and enforces a strict set of rules as to how these are accessible to currently executing code.
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

- Using both `eval(..)` and `with` will decrease **Javascript Engine**'s performance, because it cannot know at lexing time exactly what code you may pass to `eval(..)` to modify the lexical scope, or the contents of the object you may pass to `with` to create a new lexical scope to be consulted. **Don't use them at all**.
