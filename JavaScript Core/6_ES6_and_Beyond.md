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
