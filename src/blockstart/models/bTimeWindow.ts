/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { TimeWindow } from '../../models/transaction/TimeWindow';
import nem from 'nem-sdk';

const request = require('request');

export class BTimeWindow extends TimeWindow {
  /**
   * @param deadline - LocalDateTime
   * @param timeStamp - LocalDateTime
   */
  constructor(timeStamp: number, deadline: number) {
    super(TimeWindow.createLocalDateTimeFromNemDate(timeStamp),
      TimeWindow.createLocalDateTimeFromNemDate(deadline))
  }

  public static useNodeToCreateDeadline = (deadline: number = 2): Promise<TimeWindow> => {
    return new Promise<TimeWindow>((resolve, reject) => {
      try {
        request(`${nem.model.nodes.defaultTestnet}:${nem.model.nodes.defaultPort}/node/extended-info`, function (error: any, response: any, body: any) {
          if (error) return reject(error);
          const parsed = JSON.parse(body);
          const timestamp = parsed['nisInfo']['currentTime'];
          resolve(new BTimeWindow(timestamp, timestamp + (60 * deadline)))
        })
      }catch(err) {
        reject(err)
      }
    });
  }
}