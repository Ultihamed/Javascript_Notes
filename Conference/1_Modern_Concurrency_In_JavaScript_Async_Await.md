# Async/Await: Modern Concurrency In JavaScript [(Reference)](https://www.youtube.com/watch?v=NsQ2QIrQShU)

![Async/Await](https://i.ytimg.com/vi/NsQ2QIrQShU/maxresdefault.jpg)

## Concurrency

- Concurrency is doing tasks in a period of time. For example:

    ![Concurrency](https://i.ibb.co/Cw0PYb9/Screenshot-from-2020-07-28-05-26-30.png)
- All modern **JavaScript Engines** use the non-blocking/event-loop approach.
- These are a few things that will block the thread in **JavaScript**:
  - `alert` and `prompt` and `confirm`.
  - synchronous `XMLHttpRequest` (rare).
  - `fs.readFileSync` and friends in **Node**.
- These are some callbacks cons:
  - Doing thing in sequence is hard. Doing things in parallel is harder.
  - Give up constructs such as `for/while` and `try/catch`.
  - Error handling is difficult.
  - Code readability suffers and systems become hard to maintain.

## Promises and Generators

- This but powerful abstraction on top of callbacks.
- Promises solves several problems:
  - Easy chaining sequential/parallel tasks.
  - Error handling.
  - Composable -- can pass around a representation.
- Promise style example:

    ```js
    readFile('config.json')
        .then(..)
        .catch(..);
    ```

- You can have some chaining Promises. For example:

    ```js
    sleep(1000)
        .then(() => {
            console.log("one");
            return sleep(1000);
        })
        .then(() => {
            console.log("two");
            return sleep(1000);
        })
        .then(() => {
            console.log("three");
        });
    ```

- You can use Promises in parallel. For example:

    ```js
    // This would be very difficult with callbacks
    fetchJSON("user-profile");
        .then((user) => {
            return fetchJSON(`/users/${user.id}/friends`);
        })
        .then((friendIDs) => {
            let promises = friendIDs.map((id) => {
                return fetchJSON(`/users/${id}`);
            });
            return Promise.all(promises);
        })
        .then((friends) => console.log(friends));
    ```

- You can attach a single `catch(..)` to the end of a Promise chain. Exceptions will bubble up similar to how it works in synchronous code. For example:

    ```js
    fetchJSON("/user-profile")
        .then((user) => {..})
        .then((friendIDs) => {..})
        .then((friends) => {})
        .catch((error) => {
            console.error("An error occurred.", error);
        });
    ```

- We can pause our functions using Generators. For example:

    ```js
    function* generatorFunc() {
        let result = fetch("/users");
        // pause execution by yielding
        yield result;
        // later something caused us to resume
        console.log("We're back!");
    }
    ```

- Async/await is basically a thin layer if syntax over Promises and Generators (you can combine Promises and Generators together and make it awesome). For example:

    ```js
    async function getUsers() {
        // Here's the magic
        let result = await fetchJSON("/users");
        console.log(result);
    }
    ```

- You can only use `await` inside of an `async`.
- You can animate something using an `async` function. For example:

    ```js
    async function animate(element) {
        for (let i = 0; i < 100; i++) {
            element.style.left = i + "px";
            await sleep(16);
        }
    }
    ```

- An `async` function always returns a Promise.
- When we await a Promise, our function pauses until the Promise is ready (resolved).
- We can still use all our favorite promise helpers in `async` functions such as `Promise.all([..])`. For example:

    ```js
    async function getUserFriends() {
        let user = await fetchJSON("/users/me");
        let friendIDs = await fetchJSON(`/friends/${user.id}`);
        let promises = friendIDs.map((id) => {
            return fetchJSON(`/users/${id}`);
        });
        let friends = await Promise.all(promises);
        console.log(friends);
    }

    let promise = getUserFriends();
    ```

- Don't forget to `await`.
- Be careful about doing too much sequentially when you can actually do it in parallel.
- Using `await` in `map` or `filter`, won't do what you might expect (it returns an `array` of `Promise`).
- Even though it looks synchronous, remember your code has been paused/resumed.
- You can use `async/await` functions in most of environment such as **Chrome**, **FireFox**, **Node**, **Deno**, and use **Babel** for the rest.
