# Async & Performance

![Async & Performance](https://bs-uploads.toptal.io/blackfish-uploads/blog/post/seo/og_image_file/og_image/19504/0425-ToPromiseOrNotToPromise-Waldek_Social-e67f662e816296781823c9a99d12c7b7.png)

## Preface

- Promises are now the official way to provide async return values in both **JavaScript** and the **DOM**.
- The relationship between the **now** and **later** part of your program is at the heart of asynchronous programming.

## Parallel Threading

- Remember, async is about the gap between now and later. But parallel is about things being able to occur simultaneously.
- **JavaScript** never shares data across threads, which means that level of nondeterminism isn't a concern.
- Consider:

    ```js
    var a = 1;
    var b = 2;

    function foo() {
        a++;
        b = b * a;
        a = b + 3;
    }

    function bar() {
        b--;
        a = 8 + b;
        b = a * 2;
    }

    // ajax(..) is some arbitrary Ajax function given by a library
    ajax("http://some.url.1", foo);
    ajax("http://some.url.2", bar);
    ```

    Chunk 1 is synchronous (happens now), but chunk 2 and 3 are asynchronous (happen later), which means their execution will be separated by a gap of time. Chunk 1:

    ```js
    var a = 1;
    var b = 2;
    ```

    Chunk 2 (`foo()`):

    ```js
    a++;
    b = b * a;
    a = b + 3;
    ```

    Chunk 3 (`bar()`):

    ```js
    b--;
    a = 8 + b;
    b = a * 2;
    ```

## Interaction

- To address such a race condition, you can coordinate ordering interaction. For example:

    ```js
    var res = [];

    function response(data) {
        if (data.url == "http://some.url.1") {
            res[0] = data;
        }
        else if (data.url == "http://some.url.2") {
            res[1] = data;
        }
    }

    // ajax(..) is some arbitrary Ajax function given by a library
    ajax("http://some.url.1", response);
    ajax("http://some.url.2", response);
    ```

    Regardless of which Ajax response comes back first, `res[0]` will always hold the `"http://some.url.1"` results and `res[1]` will always hold the `"http://some.url.2"` results. Through simple coordination, we eliminated the **race condition** nondeterminism.

## Jobs

- The **Job queue** is a queue hanging off the end of every tick in the event loop queue.
- Certain async-implied actions that may occur during a tick of the event loop will not cause a whole new event to be added to the event loop queue, but will instead add an item (aka Job) to the end of the current tick's Job queue.
- The event loop queue is like an amusement park ride, where once you finish the ride, you have to go to the back of the line to ride again. But the Job queue is like finishing the ride, but then cutting in line and getting right back on.
- Jobs are kind of like the spirit of the `setTimeout(..0)` hack, but implemented in such a way as to have a much more well-defined and guaranteed ordering: **later, but as soon as possible**.
- Consider:

    ```js
    console.log("A");

    setTimeout(function () {
        console.log("B");
    }, 0);

    // theoretical "Job API"
    schedule(function () {
        console.log("C");

        schedule(function () {
            console.log("D");
        });
    });
    ```

    It would print out `A C D B`, because the Jobs happen at the end of the current event loop tick, and the timer fires to schedule for the next event loop tick (if available!).

## Callbacks

- Callbacks are by far the most common way that asynchrony in **JavaScript** programs is expressed and managed. Indeed, the callback is the most fundamental async pattern in the language.
- Callback function wraps or encapsulates the continuation of the program.
- Consider:

    ```js
    doA(function () {
        doB();

        doC(function () {
            doD();
        })

        doE();
    });

    doF();
    ```

    The operations will happen in this order:

    ```js
    `doA()`
    `doF()`
    `doB()`
    `doC()`
    `doE()`
    `doD()`
    ```

    So imagine this snippent working like this:

    ```js
    doA(function () {
        doC();

        doD(function () {
            doF();
        })

        doE();
    });

    doB();
    ```

- **Inversion of control** is when you take part of your program and give over control of its execution to another third party.

## Trying to Save Callbacks

- Split-callback design:

    ```js
    function success(data) {
        console.log(data);
    }

    function failure(data) {
        console.log(data);
    }

    ajax("http://some.url.1", success, failure);
    ```

- Error-first style (or **Node** style) design:

    ```js
    function response(err, data) {
        // error?
        if (err) {
            console.log(err);
        }
        // otherwise, assume success
        else {
            console.log(data);
        }
    }

    ajax("http://some.url.1", response);
    ```

- Always invoke callbacks asynchronously, even if that's **right away** on the next turn of the event loop, so that all callbacks are predictably async.

## Promises

- Most new async APIs being added to **JavaScript**/DOM platform are being built on Promises.
- Promises can have, at most, one resolution value (fulfillment or rejection).
- With Promises, the `then(..)` call can actually take two functions, the first for fulfillment, and the second for rejection. For example:

    ```js
    add(fetchX(), fetchY())
    .then(
        // fulfillment handler
        function (sum) {
            console.log(sum);
        },
        // rejection handler
        function (err) {
            console.log(err); // bummer!
        }
    );
    ```

- Consider:

    ```js
    function foo(x) {
        // start doing something that could take a while

        // make a `listener` event notification
        // capability to return

        return listener;
    }

    var evt = foo(42);

    evt.on("completion", function () {
        // now we can do the next step!
    });

    evt.on("failure", function () {
        // oops, something went wrong with `foo(..)`
    });
    ```

    `foo(..)` expressly creates an event subscription capability to return back, and the calling code receives and registers the two event handlers against it.
- In Promises we use `then(..)` to register a **then** event. Or perhaps more precisely, `then(..)` registers **fulfillment** and/or **rejection** event(s), though we don't see those terms used explicitly in the code.
- Consider:

    ```js
    function foo(x) {
        // start doing something that could take a while

        // construct and return a promise
        return new Promise(function (resolve, reject) {
            // eventually, call `resolve(..)` or `reject(..)`,
            // which are the resolution callbacks for
            // the promise.
        });
    }

    var p = foo(42);

    bar(p);

    baz(p);
    ```

    The internal of `bar(..)` and `baz(..)` might look like:

    ```js
    function bar(fooPromise) {
        // listen for `foo(..)` to complete
        fooPromise.then(
            function () {
                // `foo(..)` has now finished, so do `bar(..)`'s task
            },
            function () {
                // oops, something went wrong in `foo(..)`
            }
        );
    }

    // ditto for `baz(..)`
    ```

- Given that Promises are constructed by the `new Promise(..)` syntax.
- Consider:

    ```js
    Object.prototype.then = function () {};
    Array.prototype.then = function () {};

    var v1 = { hello: "world" };
    var v2 = { "Hello", "World"};
    ```

    Both `v1` and `v2` will be assumed to be thenables. But they're don't.
- Thenable duck typing can be hazardous if it incorrectly identifies something as a Promise that isn't.

## Promise Trust

- When you call `then(..)` on a Promise, even if that Promise was already resolved, the callback you provide to `then(..)` will **always** be called asynchronously. No more need to insert your own `setTimeout(..,0)` hacks. Promises prevent Zalgo **automatically**.
- When a Promise is resolved, all `then(..)` registered callbacks on it will be called, in order, immediately at the next asynchronous opportunity, and nothing that happens inside of one of those callbacks can affect/delay the calling of the other callbacks. For example:

    ```js
    p.then( function () {
        p.then(function () {
            console.log("C");
        });
        console.log("A");
    });
    p.then(function () {
        console.log("B");
    });
    // A B C
    ```

- If you register both fulfillment and rejection callbacks from a Promise, and the Promise get resolved, one of the two callbacks will always be called.
- If for some reason the Promise creation code tries to call `resolve(..)` or `reject(..)` multiple times, or tries to call both, the Promise will accept only the first resolution, and will silently ignore any subsequent attempts. Because a Promise can only be resolved once, any `then(..)` registered callbacks will only ever be called once (each).
- If you register the same callback more than once, (e.g., `p.then(..); p.then(..);`), it'll be called as many times as it was registered.
- If you don't explicitly resolve with a value either way, the value is `undefined`, as is typical in **JavaScript**.
- If you call `resolve(..)` or `reject(..)` with multiple parameters, all subsequent parameters beyond the first will be silently ignored.
- If you reject a Promise with a reason (aka error message), that value is passed to the rejection callback(s).
- If you pass an immediate, non-Promise, non-thenable value to `Promise.resolve(..)`, you get a promise that's fulfilled with that value. In other words, these two promises `p1` and `p2` will behave basically identically:

    ```js
    var p1 = new Promise(function (resolve, reject) {
        resolve(42);
    });

    var p2 = Promise.resolve(42);
    ```

    But if you pass a genuine Promise to `Promise.resolve(..)`, you just get the same promise back:

    ```js
    var p1 = Promise.resolve(42);

    var p2 = Promise.resolve(p1);

    p1 === p2; // true
    ```

- `Promise.resolve(..)` will accept any thenable, and will unwrap it to its non-thenable value. But you get back from `Promise.resolve(..)` a real, genuine Promise in its place, **one that you can trust**.
