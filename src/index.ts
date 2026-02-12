import http from "http";

type Handler = (req : http.IncomingMessage, res : http.ServerResponse) => void;

class MyExpress {
    // Dictionary where Key is METHOD:PATH and value is Handler function
    private routes : {[key: string] : Handler} = {};

    get(path: string, handler: Handler){
        this.routes[`GET:${path}`] = handler;
    }

    post(path: string, handler: Handler){
        this.routes[`POST:${path}`] = handler;
    }

    handle(req : http.IncomingMessage, res : http.ServerResponse) {
        const {method, url} = req;
        const key = `${method}:${url}`;

        const handler = this.routes[key];
        if(handler){
            handler(req, res);
        }
        else{
            res.writeHead(404);
            res.end(`Cannot ${method} ${url}`);
        }
    }

    listen(port: number, cb: () => void) {
        const server = http.createServer((req, res) => this.handle(req, res));
        server.listen(port, cb);
    }
}

const app  = new MyExpress();

app.get('/', (req, res) => {
    res.end('Welcome to Home Page!!!');
});

app.get('/about', (req, res) => {
    res.end('Welcome to About Page!!!');
});

app.listen(3000, () => {
    console.log('Router is Active!!!');
});