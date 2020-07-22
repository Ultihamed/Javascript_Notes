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
