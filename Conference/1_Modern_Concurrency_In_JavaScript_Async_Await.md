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

## Promises
