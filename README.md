
#### Usage

```js
const e = new EventSRC('/events');
e.bind('open', console.log);
e.bind('test-event', console.log);
e.bind('ping', console.log);
e.bind('error', console.error);
```

#### Misc

```sh
# list processes
ps
ps aux

# kill process
sudo kill -9 PID

# run as admin
sudo node index.js
```