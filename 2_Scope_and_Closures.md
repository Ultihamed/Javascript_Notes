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
