class Connect {
  constructor() {
    this.handlers = {};
  }

  addHandler(id, handler) {
    this.handlers[id] = handler;
  }

  msg(id, data) {
    console.log('send', data);
    if(this.handlers[id]) {
      setTimeout(() => {
        console.log('sending', data);
        this.handlers[id](data);
      }, 1);
    }
  }
}

const connect = new Connect();

export default connect;