class Connector {
  constructor(log=false) {
    this.handlers = {};
    this.log = log;
  }

  addHandler(id, handler) {
    this.handlers[id] = handler;
  }

  msg(id, data) {
    if(this.log) {
      console.log('send', data);
    }

    if(this.handlers[id]) {
      setTimeout(() => {
        if(this.log) {
          console.log('sending', data);
        }
        this.handlers[id](data);
      }, 1);
    }
  }
}

const connector = new Connector();

export default function getConnector() {
  return connector;
}
