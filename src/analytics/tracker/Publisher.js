class Publisher {
  constructor() {
    this.listener = [];
  }

  subscribe(handler) {
    this.listener.push(handler);
  }

  unsubscribeAll() {
    this.listener = [];
  }

  on(action, payload) {
    this.listener.forEach(handler => {
      handler(action, payload);
    });
  }
}

export default Publisher;
