const http = require('http');
const fs = require('fs');

const script = fs.readFileSync('./script.js');

const server = http.createServer((req, res) => {
  if (req.url === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    console.log('Client has connected.');
    const interval = setInterval(() => {
      res.write('event:ping\n');
      res.write('data:\n');
      res.write('\n');
    }, 15000);
    /*
      res.write('event: test-event\n');
      res.write('data: test-data\n');
      res.write('id: test-id\n');
    */
    res.socket.on('close', () => {
      clearInterval(interval);
      console.log('Client has disconnected.');
    });
  } else if (req.url === '/script') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'no-cache',
    });
    res.write(script);
    res.end();
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache',
    });
    res.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SSE</title>
        <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
        <meta content="utf-8" http-equiv="encoding">
      </head>
      <body>
        <p>Server-sent events testing.</p>
        <script src="/script" defer></script>
      </body>
      </html>    
    `);
    res.end();
  }
});

server.listen(80, '127.0.0.1');

console.log('Server started.');

