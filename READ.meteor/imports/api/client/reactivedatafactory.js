import Rx from 'rx/dist/rx.all';
import {DOM} from 'rx-dom';
import ajv from 'ajv';
import _ from 'underscore/underscore';

// define the various reactive classes here...
class Message {
  constructor(msg, isData) {
    this.isData = isData;
    if (isData) this.data = msg;
    else this.error = msg;
  }
}

class ReactiveData {
  // reactive must have _id, and must implement all the methods / properties referred to in reactivepipeline
  // We should for now get rid of the reset methods -- too complex... simply have new constructions each time for now
  constructor(_id, name) {
    this._id = _id;
    this.name = name;
    this.type = "abstract";
    this.stream = new Rx.ReplaySubject(1);
    this.injectError('Data Unavailable');
  }

  injectData(data) {
    this.stream.onNext(new Message(data, true));
  }

  injectError(errorObj) {
    this.stream.onNext(new Message(errorObj, false));
  }

  dispose() { // dispose my subscriptions
    throw new Error("dispose unsupported on ReactiveData of type 'abstract'");
  }

  getReactiveStream() {
    return this.stream;
  }

  resetReactiveStream(newStream) { // this makes sense only if there are no subscribers to the current stream
    let self = this;
    this.stream.doOnNext(msg => {
      self.stream = newStream;
      self.stream.onNext(msg);
    }).subscribe();
  }

}

class RawData extends ReactiveData {
  constructor(_id, name, data) {
    super(_id, name);
    this.type = "raw";
    if (data) this.injectData(data);
    else {
      this.injectError('Data Undefined');
    }
  }

  dispose() {} // we have no subscriptions to dispose
}

class IntervalData extends ReactiveData {
  constructor(_id, name, intervalSec) { // interval in seconds
    super(_id, name);
    this.type = "interval";
    if (! ((intervalSec) && (_.isNumber(intervalSec)) && (intervalSec >= 1))) {
      this.injectError('Invalid interval value: ' + interval);
    } else {
      let self = this;
      this.intervalSubscription = Rx.Observable.interval(intervalSec*1000).timeInterval().doOnNext(x => {
        self.injectData(x);
      }).subscribe(new Rx.ReplaySubject(0));
    }
  }

  dispose() {
    this.intervalSubscription.dispose();
  }
}

// reactiveDataArray (array of parent reactives)
// stateParams: is this stateful + initial state
class TransformedData extends ReactiveData {
  constructor(_id, name, reactiveDataArray, transformFunction, state) {
    super(_id, name);
    this.type = "transformed";
    let self = this;

    let stateEnabled = state ? true: false;
    if (stateEnabled) this.state = state;

    let reactiveStreams = _.pluck(reactiveDataArray, 'stream');

    let injectSomething = (latestArgs) => {
      // one or more of the input streams contain error(s)
      if (_.some(latestArgs, (arg) => ! arg.isData)) {
        self.injectError('Transform function inputs contain error(s)');
      }
      else try {
        // inputs seem ok. We will try applying the transformFunction now.
        let data = undefined;
        let transformFunctionArgs = latestArgs.map((x) => x.data);
        if (stateEnabled) transformFunctionArgs.push(self.state);
        data = transformFunction(...transformFunctionArgs);
        if (! (_.isUndefined(data) || _.isNull(data))) self.injectData(data);
        else self.injectError('Transform function evaluation did not yield data');
      } catch (e) { // ran into errors during transformFunction application
        self.injectError('Error during transform function evaluation: ' + e.message);
      }
    }

    if (reactiveStreams.length > 0) {
      self.combiner = Rx.Observable.combineLatest(...reactiveStreams)
      .doOnNext((latestArgs) => {injectSomething(latestArgs);}).subscribe(new Rx.ReplaySubject(0));
    } else {
      self.combiner = Rx.Observable.just([]).doOnNext((latestArgs) => {injectSomething(latestArgs);}).subscribe(new Rx.ReplaySubject(0));
    }
  }

  dispose() {
    this.combiner.dispose();
  }
}

class ValidatedData extends TransformedData {
  static getValidator(jsonSchema) {
    let myjv = (new ajv({
      allErrors: true
    }));
    let validate = undefined;
    try {
      validate = myjv.compile(jsonSchema);
    }
    catch (e) {
      throw new Error('JSON Schema Compilation Error during ValidatedData construction');
    }

    return ((data) => {
      if (validate(data)) return data;
      if (validate.errors.length > 5) {
        throw new Error('Schema validation failure (limiting to 5 errors)- '.concat(myjv.errorsText(_.first(validate.errors, 5))));
      }
      else {
        throw new Error('Schema validation failure - '.concat(myjv.errorsText(validate.errors)))
      };
    });
  }

  constructor(_id, name, reactiveData, jsonSchema) {
    super(_id, name, [reactiveData], ValidatedData.getValidator(jsonSchema));
    this.type = 'jsonschema';
  }
}

class WebsocketData extends ReactiveData {
  constructor(_id, name, url) {
     super(_id, name);
     this.type = "websocket";
     let self = this;

    var openObserver = Rx.Observer.create(function(e) {
      console.info('socket open');

      // Now it is safe to send a message
      self.socket.onNext('test');
    });

    // an observer for when the socket is about to close
    var closingObserver = Rx.Observer.create(function() {
      console.log('socket is about to close');
    });

    self.socket = DOM.fromWebSocket(
        url,
        null, // no protocol
        openObserver,
        closingObserver);

    self.latestOne = new Rx.ReplaySubject(1); // create a replay subject which stores its latest data value

    self.socket.subscribe(self.latestOne);
    self.latestOne.onNext(x => {
       console.log('Data Received by ReplaySubject!');
       //if (x.isData) self.injectData(x.data);
       if (!x.isData) {
         self.injectError("Websocket dataset has error");
       }
     });
    self.socket.subscribe(
        function(e) {
          self.injectData(JSON.parse(e.data));
          console.log('Data received by function: %s', e.data);
        },
        function(e) {
          // errors and "unclean" closes land here
          console.error('error: %s', e);
        },
        function() {
          // the socket has been closed
          console.info('socket closed');
        }
    );

}
 dispose() {
   self.socket.dispose();
 }
}

// class WebsocketData extends ReactiveData {
//   constructor(_id, name, url) {
//     super(_id, name);
//     this.type = "websocket";
//     let self = this;
//
//     /* Code to initialize the socket -- uses socket.io events; */
//     self.ws = new WebSocket(url);
//
//
//
//     /* A thin wrapper to convert socket.io events to Rx events */
//     /* This piece of code ensures that when there is new data on the socket, that data gets pushed as a new message onto the dataStream,
//      which is really an Rx.Observable */
//     /* dataStream responds to 'data' events on the socket */
//
//     let dataStream = Rx.Observable.fromEventPattern(
//         function addHandler(dataHandler) {
//           self.ws.onmessage = dataHandler;
//         },
//         function removeHandler(dataHandler) {
//           self.ws.onmessage = null;
//         }
//     ).doOnCompleted(function () {
//       console.log("socket stream is completed");
//     })
//     /* Subscribe a new Rx.Observable to dataStream */
//     self.latestOne = new Rx.ReplaySubject(2); // create a replay subject which stores its latest data value
//     self.latestOne.doOnNext(x => {
//       console.log('Data Received!');
//       if (x.isData) self.injectData(x.data);
//       if (!x.isData) {
//         self.injectError("Websocket dataset has error");
//       }
//     });
//
//
//
//     //self.subscription = dataStream.subscribe(x => console.log(x));
//     self.subscription = dataStream.subscribe(x=> {console.log(JSON.parse(x.data));self.injectData(JSON.parse(x.data))});
//
//     // subscribes latestOne to dataStream. The latest value from dataStream is now stored in latestOne
//   }
//
//   dispose() {
//
//     if (self.subscription) this.self.subscription.dispose();
//     self.ws = null;
//   }
// }

export const reactiveDataFactory = ['$http', function ($http) {
  // SimpleHTTPData and ExtendedHTTPData implementations below; other implementations above;
  class ExtendedHTTPData extends ReactiveData { // HTTP GET method
    constructor(_id, name, reactiveData, intervalSec) { // interval in seconds // reactiveData provides the config
      super(_id, name);
      this.type = "extendedHTTP";
      let self = this;

      let injectSomething = (httpConfig) => {
        try {
          $http(httpConfig).then(response => {
            self.injectData(response.data);
        }, response => {
            self.injectError("Error during HTTP with status: " + response.status + " and statusText: " + response.statusText);
          })
        } catch (e) {
          self.injectError("Error during HTTP: " + e.message);
        }
      };

      if (! intervalSec) {
        reactiveData.stream.doOnNext(x => {
          if (x.isData) injectSomething(x.data);
      else self.injectError("ExtendedHTTP parent dataset has error");
      }).subscribe();
      } else if (! ((_.isNumber(intervalSec)) && (intervalSec >= 1))) {
        self.injectError('Invalid interval value: ' + interval);
      } else {
        self.intervalGen = Rx.Observable.merge(Rx.Observable.just(0), Rx.Observable.interval(intervalSec*1000));
        self.intervalSubscription = Rx.Observable.combineLatest(reactiveData.stream, self.intervalGen, (x, y) => {
              return x;
      }).doOnNext(x => {
          if (x.isData) injectSomething(x.data);
        if (! x.isData) {
          self.injectError("ExtendedHTTP parent dataset has error");
        }
      }).subscribe(new Rx.ReplaySubject(0));
      }
    }

    dispose() {
      if (this.intervalSubscription) this.intervalSubscription.dispose();
    }
  }

  class SimpleHTTPData extends ExtendedHTTPData { // HTTP GET method
    constructor(_id, name, url, intervalSec) { // interval in seconds
      super(_id, name, new RawData(_id + '-part', name + '-part', {
        method: 'GET',
        url: url
      }), intervalSec);
      this.type = "simpleHTTP";
    }
  }


  let myFactory = {};
  myFactory.rawData = (_id, name, data) => new RawData(_id, name, data);
  myFactory.intervalData = (_id, name, intervalSec) => new IntervalData(_id, name, intervalSec);
  myFactory.transformedData = (_id, name, reactives, transformFunction, state) => new TransformedData(_id, name, reactives, transformFunction, state);
  myFactory.validatedData = (_id, name, reactiveData, schema) => new ValidatedData(_id, name, reactiveData, schema);
  myFactory.extendedHTTPData = (_id, name, reactiveData, intervalSec) => new ExtendedHTTPData(_id, name, reactiveData, intervalSec);
  myFactory.simpleHTTPData = (_id, name, url, intervalSec) => new SimpleHTTPData(_id, name, url, intervalSec);
  myFactory.websocketData = (_id, name, url) => new WebsocketData(_id, name, url);

  return myFactory;
}];
