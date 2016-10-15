import Rx from 'rx/dist/rx.all'
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
    let x = {};
    x[name] = 'Data Unavailable';
    this.injectError(x);
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
      let x = {};
      x[name] = 'Data Undefined';
      this.injectError(x);
    }
  }

  dispose() {} // we have no subscriptions to dispose
}

class IntervalData extends ReactiveData {
  constructor(_id, name, intervalSec) { // interval in seconds
    super(_id, name);
    this.type = "interval";
    if (! ((intervalSec) && (_.isNumber(intervalSec)) && (intervalSec >= 1))) {
      let x = {};
      x[name] = 'Invalid interval value: ' + interval;
      this.injectError(x);
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
        let y = _.filter(latestArgs, arg => ! arg.isData).map(a => a.error);
        let z = {};
        z[self.name] = 'Transform function inputs contain error(s)';
        let x = angular.merge({}, ...y, z);
        self.injectError(x);
      }
      else try {
        // inputs seem ok. We will try applying the transformFunction now.
        let data = undefined;
        if (stateEnabled) {
          // the transformFunction can do what it wants to the state
          // the transformFunction can return any result based on inputs and state
          data = transformFunction(...(latestArgs.map((x) => x.data), self.state));
        } else {
          data = transformFunction(...(latestArgs.map((x) => x.data)));
        }
        if (data) self.injectData(data);
        else { // got no data
          let z = {};
          z[self.name] = 'Transform function evaluation did not yield data';
          self.injectError(z);
        }
      } catch (e) { // ran into errors during transformFunction application
        let z = {};
        z[self.name] = e.message;
        self.injectError(z);
      }
    }

    this.combiner = Rx.Observable.combineLatest(...reactiveStreams)
    .doOnNext((latestArgs) => {injectSomething(latestArgs);}).subscribe(new Rx.ReplaySubject(0));
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
        console.log(validate.errors);
        throw new Error('Schema validation failure (limiting to 5 errors)- '.concat(myjv.errorsText(_.first(validate.errors, 5))));
      }
      else throw new Error('Schema validation failure - '.concat(myjv.errorsText(validate.errors)));
    });
  }

  constructor(_id, name, reactiveData, jsonSchema) {
    super(_id, name, [reactiveData], ValidatedData.getValidator(jsonSchema));
    this.type = 'jsonschema';
  }
}

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
          }, (response) => {
            let x = {};
            x[name] = "Error during HTTP with status: " + response.status + " and statusText: " + response.statusText;
            self.injectError(x);
          })
        } catch (e) {
          let x = {};
          x[name] = "Error during HTTP: " + e.message;
          self.injectError(x);
        }
      };

      if (! intervalSec) {
        reactiveData.stream.doOnNext(x => {
          if (x.isData) injectSomething(x.data);
          else console.log('reactiveData in ExtendedHTTP has error');
        }).subscribe();
      } else if (! ((_.isNumber(intervalSec)) && (intervalSec >= 1))) {
        let x = {};
        x[name] = 'Invalid interval value: ' + interval;
        self.injectError(x);
      } else {
        self.intervalGen = Rx.Observable.merge(Rx.Observable.just(0), Rx.Observable.interval(intervalSec*1000));
        self.intervalSubscription = Rx.Observable.combineLatest(reactiveData.stream, self.intervalGen, (x, y) => {
          return x;
        }).doOnNext(x => {
          if (x.isData) injectSomething(x.data);
          if (! x.isData) {
            let err = {};
            err[name] = "Error in HTTP Config stream";
            self.injectError(err);
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

  return myFactory;
}];
