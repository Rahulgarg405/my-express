import MyExpress from "../lib/app.js";

const app = new MyExpress();

// Global Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// A dummy "Auth" Middleware
app.use((req, res, next) => {
  const isAdmin = true;
  if (isAdmin) {
    next();
  } else {
    res.end("Access Denied!");
  }
});

app.get("/", (req, res) => {
  res.end("Success! You reached the home page.");
});

app.get('/search', (req: any, res) => {
  const searchTerm = req.query.q;
  res.end(`You are searching for: ${searchTerm}`);
});

app.post('/login', (req: any, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for: ${username}`);
  res.end(`Hello ${username}, you are now logged in!`);
});

app.listen(3000, () => {
  console.log("Server is live on http://localhost:3000");
});
