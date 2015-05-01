import Kefir from '../kefir';
import {inherit} from './objects';
import Stream from '../stream';
import {rest} from './collections';


export default function withInterval(name, mixin) {

  function AnonymousStream(wait, args) {
    Stream.call(this);
    this._wait = wait;
    this._intervalId = null;
    var $ = this;
    this._$onTick = function() {
      $._onTick();
    };
    this._init(args);
  }

  inherit(AnonymousStream, Stream, {

    _name: name,

    _init(args) {},
    _free() {},

    _onTick() {},

    _onActivation() {
      this._intervalId = setInterval(this._$onTick, this._wait);
    },
    _onDeactivation() {
      if (this._intervalId !== null) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },

    _clear() {
      Stream.prototype._clear.call(this);
      this._$onTick = null;
      this._free();
    }

  }, mixin);

  Kefir[name] = function(wait) {
    return new AnonymousStream(wait, rest(arguments, 1, []));
  };
}
