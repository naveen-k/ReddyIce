// import * as global from 'global';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalState {

  private _data = new Subject<Object>();
  private _dataStream$ = this._data.asObservable();

  private _subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this._dataStream$.subscribe((data) => this._onEvent(data));
  }

  notifyDataChanged(event, value) {

    let current = this._data[event];
    if (current !== value) {
      this._data[event] = value;

      this._data.next({
        event: event,
        data: this._data[event]
      });
    }
  }

  subscribe(event: string, callback: Function) {
    let subscribers = this._subscriptions.get(event) || [];
    subscribers.push(callback);

    this._subscriptions.set(event, subscribers);
  }

  _onEvent(data: any) {
    let subscribers = this._subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}

/*
 * We are creating a common method to perform the arithmetic calculation precisely
 */
declare global {
  interface Number {
    /**
     * Returns a number representing output of operation being performed.
     * @param op represents the operation being performed on the operands
     * @param x represents second operand
     */
    fpArithmetic(op: string, x: number): number;
  }
}

Number.prototype.fpArithmetic = function (op, x): number {
  
  var n = {
    '*': this * x,
    '-': this - x,
    '+': this + x,
    '/': this / x
  }[op];
  return Math.round(n * 100000) / 100000;
}