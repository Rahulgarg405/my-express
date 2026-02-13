import http from "http";

type NextFunction = () => void;
type Handler = (req : http.IncomingMessage, res : http.ServerResponse, next: NextFunction) => void;

class MyExpress {
    // Array to store global middlewares
    private middlewares: Handler[] = [];
    // Dictionary where Key is METHOD:PATH and value is Handler function
    private routes : {[key: string] : Handler} = {};

    use(middleware: Handler) {
        this.middlewares.push(middleware);
    }

    get(path: string, handler: Handler){
        this.routes[`GET:${path}`] = handler;
    }

    post(path: string, handler: Handler){
        this.routes[`POST:${path}`] = handler;
    }

    // The logic that executes the chain of functions
    private runChain(req: http.IncomingMessage, res: http.ServerResponse, chain: Handler[]) {
        let index = 0;
        const next: NextFunction = () => {
            // If we have more functions in the chain, run the next one
            if(index < chain.length){
                const currentMiddleware = chain[index];
                index++;
                currentMiddleware(req, res, next);
            }
        }

        // start the chain
        next();
    }

    handle(req : http.IncomingMessage, res : http.ServerResponse) {
        const {method, url} = req;
        const key = `${method}:${url}`;
        const routeHandler = this.routes[key];

        const chain = [...this.middlewares];

        if(routeHandler){
            chain.push(routeHandler);
        }
        else{
            chain.push((req, res) => {
                res.writeHead(404);
                res.end(`Cannot ${method} ${url}`);
            });
        }

        this.runChain(req, res, chain);
    }

    listen(port: number, cb: () => void) {
        const server = http.createServer((req, res) => this.handle(req, res));
        server.listen(port, cb);
    }
}

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
    res.end('Access Denied!');
  }
});

app.get('/', (req, res) => {
  res.end('Success! You reached the home page.');
});

app.listen(3000, () => {
  console.log('Middleware engine is live on http://localhost:3000');
});