# Async + Await (or How to Write Synchronous Looking Code, Without the Wait) [(Reference)](https://www.youtube.com/watch?v=BDqZLfBFeGk)

![Async/Await](https://i.ytimg.com/vi/BDqZLfBFeGk/maxresdefault.jpg)

## Promise and `async/await`

- A Promise could be an AJAX call returning data or it could be access to a user's webcam or also resizing an image. All of these things take time, we simply kick of the proccess with Promises and move along with lives.
- Don't code like christmas tree callbacks hell anymore. For example:

    ```js
    makeBreakFast(function () {
        makeCoffee(function () {
            drinkCoffee(function () {
                cleanUp(function () {
                    // Finally done and it's time for lunch
                });
            });
        });
    }); // WTF
    ```

    Instead, do like this:

    ```js
    // kick of both things, one often another
    const coffeePromise = makeCoffee();
    const breakfastPromise = makeBreakfast();

    // then once each are done, deal with them
    coffeePromise.then(coffee => {
        drinkCoffee();
    });

    breakfastPromise.then(([eggs, bacon]) => {
        eat(eggs, bacon);
    });

    // you can also wait until both are done
    Promise
        .all([coffeePromise, breakfastPromise])
        .then((coffee, breakfast) => {
            sitDownWith(coffee, breakfast);
        });
    ```

    Another example of christmas three callbacks hell about animation:

    ```js
    moveTo(50, 50, function () {
        moveTo(20, 100, function () {
            moveTo(100, 200, function () {
                moveTO(2, 10, function () {
                    // done
                });
            });
        });
    });
    ```

    Instead, do like this:

    ```js
    moveTo(50, 50)
        .then(() => moveTo(20, 100))
        .then(() => moveTo(100, 200))
        .then(() => moveTo(2, 10));
    ```

- Its easy to make you own Promise. For example:

    ```js
    function sleep(amount) {
        return new Promise((resolve, reject) => {
            if (amount < 300) {
                return reject("That is too, fast, cool it down!");
            }
            setTimeout(() => resolve(`slept for ${amount}`), amount)
        });
    }
    ```

- You can use `async/await` to make even easier than Promises. Because any code that need to come after the Promise still needs to be in the final `.then(..)` callback. For example:

    ```js
    moveTo(50, 50)
        .then(() => moveTo(20, 100))
        .then(() => moveTo(100, 200))
        .then(() => moveTo(2, 10));

    // becomes

    async function animate() {
        await moveTo(50, 50);
        await moveTo(20, 100);
        await moveTo(100, 200);
        await moveTo(2, 10);
    }
    ```

    It's like synchronous code, without the wait.
- You can handle your Errors with `try/catch` in `async` functions. For example:

    ```js
    async function displayData() {
        try {
            const wes = axios.get("https://api.github.com/users/wesbos");
            console.log(data); // work with data
        } catch (err) {
            console.log(err); // Handle Error
        }
    }
    ```

    Or you can add `catch(..)` function to the end of a Promise. For example:

    ```js
    async function loadData() {
        const wes = await axios.get("..");
    }

    loadData().catch(dealWithErrors);
    ```
