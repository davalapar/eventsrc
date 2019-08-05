class EventSRC {
  constructor (url) {
    if (typeof url !== 'string' || url === '') {
      throw Error('new EventSRC(url): "url" must be a non-empty string.');
    }
    this.src = new EventSource(url);
    this.callbacks = new Map();
  }

  bind (eventType, eventCallback) {
    if (typeof eventType !== 'string' || eventType === '') {
      throw Error('bind(eventType, eventCallback): "eventType" must be a non-empty string.');
    }
    if (typeof eventCallback !== 'function') {
      throw Error('bind(eventType, eventCallback): "eventCallback" must be a function.');
    }
    if (this.callbacks.has(eventType) === true) {
      throw Error(`bind(eventType, eventCallback): "${eventType}" event handler already bound.`);
    }
    switch (eventType) {
      case 'open':
      case 'error': {
        const callback = () => eventCallback(eventType);
        this.src.addEventListener(eventType, callback);
        this.callbacks.set(eventType, callback);
        break;
      }
      case 'close': {
        this.callbacks.set(eventType, eventCallback);
        break;
      }
      default: {
        const callback = ({ data, lastEventId }) => eventCallback(eventType, data, lastEventId);
        this.src.addEventListener(eventType, callback);
        this.callbacks.set(eventType, callback);
        break;
      }
    }
  }

  unbind (eventType) {
    if (typeof eventType !== 'string' || eventType === '') {
      throw Error('bind(eventType, eventCallback): "eventType" must be a non-empty string.');
    }
    if (this.callbacks.has(eventType) === true) {
      this.src.removeEventListener(eventType, this.callbacks.get(eventType));
      this.callbacks.delete(eventType);
    }
  }

  close () {
    this.src.close();
    if (this.callbacks.has('close') === true) {
      this.callbacks.get('close')();
    }
  }

  get url () {
    return this.src.url
  }

  get state () {
    return this.src.readyState;
  }
}

module.exports = EventSRC;
