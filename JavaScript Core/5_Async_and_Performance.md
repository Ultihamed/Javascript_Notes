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

## Chain Flow

- We can string multiple Promises together to represent a sequence of async steps.
- Every time you call `then(..)` on a Promise, it creates and returns a new Promise, which we can chain with.
- Whatever value you return from the `then(..)` call's fulfillment callback (the first parameter) is automatically set as the fulfillment of the chained Promise (from the first point).

- Consider:

    ```js
    var p = Promise.resolve(21);

    var p2 = p.then(function (v) {
        console.log(v); // 21

        // fulfill `p2` with value `42`
        return v * 2;
    });

    // chain off `p2`
    p2.then(function (v){
        console.log(v); // 42
    });
    ```

    Thankfully, we can easily just chain these together:

    ```js
    var p = Promise.resovle(21);

    p.then(function (v) {
        console.log(v); // 21

        // fulfill the chained promise with value `42`
        return v * 2;
    }).then(function (v) {
        console.log(v); // 42
    });
    ```

- Each Promise resolution is thus just a signal to proceed to the next step.
- Consider:

    ```js
    function delay(time) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, time);
        });
    }

    delay(100) // step 1
        .then(function STEP2() {
            console.log("step 2 (after 100ms)");
            return delay(200);
        })
        .then(function STEP3() {
            console.log("step 3 (after another 200ms)");
        })
        .then(function STEP4() {
            console.log("step 4 (next Job)");
            return delay(50);
        })
        .then(function STEP5() {
            console.log("step 5 (after another 50ms)");
        });
    ```

    Calling `delay(200)` creates a promise that will fulfill in 200ms, and then we return that from the first `then(..)` fulfillment callback, which causes the second `then(..)`'s promise to wait on that 200ms promise.
- If you call `then(..)` on a promise, and you only pass a fulfillment handler to it, an assumed rejection handler is substitute. For example:

    ```js
    var p = new Promise(function (resolve, reject) {
        reject("Oops");
    });

    var p2 = p.then(
        function fulfilled() {
            // never gets here
        }
        // assumed rejection handler, if omitted or
        // any other non-function value passed
        // function(err) {
        // throw err;
        // }
    );
    ```

    In essence, this allows the error to continue propagating along a Promise chain until an explicitly defined rejection handler is encountered.
- If a proper valid function is not passed as the fulfillment handler parameter to `then(..)`, there's also a default handler substituted. For example:

    ```js
    var p = Promise.resolve(42);

    p.then(
        // assumed fulfillment handler, if omitted or
        // any other non-function value passed
        // function (v) {
        //     return v;
        // }
        null,
        function rejected(err) {
            // never gets here
        }
    );
    ```

## Terminology: Resovle, Fulfill, and Reject

- Consider:

    ```js
    var p = new Promise(function (X, Y) {
        // X() for fulfillment
        // Y() for rejection
    });
    ```

    The first parameter is usually used to mark the Promise as fulfilled, and the second parameter always marks the Promise as rejected. Almost all literature uses `reject(..)` as second parameter name, and because that's exactly (and only!) what is does, that's a very good choice for the name. I'd strongly recommand you always use `reject(..)`. For eaxmple:

    ```js
    var p = new Promise(function (resolve, reject) {
        // resolve() for fulfillment
        // reject() for rejection
    });
    ```

- Consider:

    ```js
    var rejectedPr = new Promise(function (resolve, reject) {
        // resolve this promise with a rejected promise
        resolve(Promise.reject("Oops"));
    });

    rejectedPr.then(
        function fulfilled() {
            // never gets here
        },
        function rejected(err) {
            console.log(err); // "Oops"
        }
    );
    ```

    It should be clear now that `resolve(..)` is the appropriate name for the first callback parameter of the `Promise(..)` constructor.

## Error Handling

- Consider:

    ```js
    function foo(){
        setTimeout(function () {
            baz.bar();
        }, 100);
    }

    try {
        foo();
        // later throws global error from `baz.bar()`
    }
    catch (err) {
        // never gets here
    }
    ```

    `try..catch` would certainly be nice to have, but it doesn't work across async operations. Now Consider:

    ```js
    var p = Promise.resolve(42);

    p.then(
        function fulfilled(msg) {
            // numbers don't have string functions, so will throw an error
            console.log(msg.toLowerCase());
        },
        function rejected(err) {
            // never gets here
        }
    )
    ```

    To avoid losing an error to the silence of a forgotten/discarded Promise, always end your chain with a final `catch(..)`, like:

    ```js
    var p = Promise.resolve(42);

    p.then(
        function fulfilled(msg) {
            // numbers don't have string functions, so will throw an error
            console.log(msg.toLowerCase());
        }
    ).catch(handleErrors);
    ```

## Promise Patterns

- Consider:

    ```js
    var p1 = request("http://some.url.1/");
    var p2 = request("http://some.url.2/");

    Promise.all([p1, p2])
        .then(function (msgs) {
            // both `p1` and `p2` fulfill and pass in
            // their messages here
            return request(
                "http://some.url.3/?v=" + msgs.join(",")
            );
        })
        .then(function (msg) {
            console.log(msg);
        });
    ```

    `Promise.all([..])` expects a single arguments, and `array`, consisting generally of Promise instances. The promise returned from the `Promise.all([..])` call will receive a fulfillment message (`msg` in this snippet) that is an `array` of all the fulfillment messages from the passed in promises, in the same order as specified (regardless of fulfillment order).
- The main promise returned from `Promise.all([..])` will only be fulfilled if and when all its constituent promises are fulfilled. If any one of those promises instead is rejected, the main `Promise.all([ .. ])` promise is immediately rejected, discarding all results from any other promises.
- `Promise.race([ .. ])` expects a single `array` argument, containing one or more Promises, thenables, or immediate values.
- Similar to `Promise.all([..])`, `Promise.race([..])` will fulfill if any Promise resolution is a fulfillment, and it will reject if and when any Promise resolution is a rejection.
- If you pass an empty `array`, instead of immediately resolving, the main `race([..])` Promise will never resolve. So be careful never to send in an empty `array`.
- Consider:

    ```js
    var p1 = request("http://some.url.1/");
    var p2 = request("http://some.url.2/");

    Promise.race([p1, p2])
        .then(function (msg) {
            // either `p1` or `p2` will win the race
            return request(
                "http://some.url.3/?v=" + msg
            );
        })
        .then(function (msg) {
            console.log(msg);
        });
    ```

    Because only one promise wins, the fulfillment value is a single message, not an `array` as it was for `Promise.all([..])`.
- Promises cannot be canceled. So they can only be silently ignored.

## Promise API Recap

- The revealing constructor `Promise(..)` must be used with `new`, and must be provided a function callback that is synchronously/immediately called. This function is passed two function callbacks that acts as resolution capabilities for the promise. We commonly label these `resolve(..)` and `reject(..)`. For example:

    ```js
    var p = new Promise(function (resolve, reject) {
        // `resolve(..)` to resolve/fulfill the promise
        // `reject(..)` to reject the promise
    });
    ```

    If `resolve(..)` is passed an immediaten non-Promise, non-thenable value, then the promise is fulfilled with that value. But if `resolve(..)` is passed a genuine Promise or thenable value, that value is unwrapped recursively, and whatever its final resolution/state is will be adopted by the promise.
- There are two shortcuts for creating an already-rejected and an already-fulfilled Promises. For example:

    ```js
    var p1 = new Promise(function (resolve, reject) {
        reject("Oops");
    });

    var p2 = new Promise(function (resolve, reject) {
        resolve("Done");
    });

    // an already-rejected Promise
    var p3 = Promise.reject("Oops");

    // an already-fulfilled Promise
    var p4 = Promise.resolve("Done");
    ```

    However, `Promise.resolve(..)` also unwraps thenable values. The return value could be a fulfillment or a rejection. For example:

    ```js
    var fulfilledTh = {
        then: function (cb) { c(42); }
    };
    var rejectedTh = {
        then: function (cb, errCb) {
            errCb("Oops");
        }
    };

    var p1 = Promise.resolve(fulfilledTh);
    var p2 = Promise.resolve(rejectedTh);

    // `p1` will be a fulfilled promise
    // `p2` will be a rejected promise
    ```

- Remember to `Promise.resolve(..)` doesn't do anything if what you pass is already a genuine Promise. It just returns the value directly.
- Each Promise instance has `then(..)` and `catch(..)` methods, which allow registering of fulfillment and rejecion handlers for the Promise. Once the Promise is resolved, one or the other of these handlers will be called, but not both, and it will always be called asynchronously.
- `catch(..)` takes only the rejection callback as a parameter, and automatically substitutes the default fulfillment callback. In other word, it's equivalent to `then(null, ..)`. For example:

    ```js
    p.then(fulfilled);

    p.then(fulfilled, rejected);

    p.catch(rejected); // or `p.then(null, rejected)`
    ```

- `then(..)` and `catch(..)` also create and return a new promise, which can be used to express Promise chain flow control.
- The static helpers `Promise.all([..])` and `Promise.race([..])` on the ES6 `Promise` API both create a Promise as their return value.
- For `Promise.all([..])`, all the promises you pass in must fulfill for the returned promise to fulfill. If any promise is rejected, the main returned promise is immediately rejected, too. For fulfillment, you receive an `array` of all the passed in promises fulfillment values. For rejection, you receive just the first promise rejection reason value. This pattern is classically called a **gate**: all must arrive before the gates opens.
- For `Promise.race([..])`, only the first promise to resolve (fulfillment or rejection) **wins**. This pattern is classically called a **latch**: first one to open the latch gets through.
- See these examples of `Promise.all([..])`and `Promsie.race([..])`:

    ```js
    var p1 = Promise.resolve(42);
    var p2 = Promise.resolve("Hello World");
    var p3 = Promise.reject("Oops");

    Promise.race([p1, p2, p3])
        .then(function (msg) {
            console.log(msg); // 42
        });

    Promise.all([p1, p2, p3])
        .then(function (err) {
            console.log(err); // "Oops"
        });

    Promise.all ([p1, p2])
        .then(function (msgs) {
            console.log(msgs); // [42, "Hello World"]
        });
    ```

    Be careful! If an empty `array` is passed to `Promise.all([..])`, it will fulfill immediately, but `Promise.race([..])` will hang forever and never resolve.

## Unwrap/Spread Arguments

- Consider:

    ```js
    function spread(fn) {
        return Function.apply.bind(fn, null);
    }
    Promise.all(foo(10, 20))
        .then(
            spread(function (x, y) {
                console.log(x, y); // 200 599
            })
        );
    ```

    You could inline the functional magic to avoid the extra helper:

    ```js
    Promise.all(foo(10, 20))
        .then(Function.apply.bind(
            function (x, y) {
                console.log(x, y); // 200 599
            },
            null
        ));
    ```

    ES6 has an even better answer for us: **destructuring**. The array destructuring assignment form looks like this:

    ```js
    Promise.all(foo(10, 29))
        .then(function (msgs) {
            var [x, y] = msgs;

            console.log(x, y); // 200 599
        })
    ```

    But best of all, ES6 offers the array parameter destructuring form:

    ```js
    Promise.all(foo(10, 20))
        .then(function ([x,y]) {
            console.log(x, y); // 200 599
        });
    ```

## Promise Uncancelable

- No individual Promise should be cancelable, but it's sensible for a sequence to be cancelable, because you don't pass around a sequence as a single immutable value like you do with a Promise.

## Promise Performance

-
