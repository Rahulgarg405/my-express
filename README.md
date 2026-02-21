# Minimalist - A Custom HTTP Middleware Engine

A first-principles implementation of a Node.js web framework built to master the core mechanics of backend engineering. Instead of relying on Express.js, this project implements the request-response lifecycle, routing, and the middleware pattern from scratch using the Node.js `http` module.

## Design Philosophy

Minimalist is built on three core architectural pillars:

- **Zero Dependencies:** Optimized for performance by utilizing Node.js core modules.
- **Predictable Execution:** A strictly ordered middleware pipeline using the Chain of Responsibility pattern.
- **Type-First Development:** Full TypeScript integration providing robust compile-time safety for request and response handling.

## Key Features

- **Custom Router:** $O(1)$ route lookup using a method-path dictionary.
- **Global & Route-specific Middleware:** Chainable functions to handle Auth, Logging, and Validation.
- **Native TS Support:** Built with TypeScript 5.x for strict type safety.
- **Performance Focused:** Minimal overhead, utilizing Node.js core modules.

## Technical Architecture

The framework manages the request lifecycle through a linear execution stack and follows a **Chain of Responsibility** design pattern :

1. **Normalization:** The incoming URI is parsed into distinct `pathname` and `query` objects.
2. **Buffering:** Asynchronous data streams are collected and parsed into a JSON `req.body`.
3. **Pipeline Assembly:** Global and route-specific handlers are aggregated into a single execution array.
4. **Resolution:** The recursive `next()` function ensures sequential execution, allowing for early termination (e.g., for Authorization).

## Usage Example

```typescript
import MyExpress from "./lib/app";

const app = new MyExpress();

// Middleware: Logger
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Route
app.get("/welcome", (req, res) => {
  res.end("Hello from the custom engine!");
});

app.listen(3000, () => console.log("Server started on port 3000"));
```
