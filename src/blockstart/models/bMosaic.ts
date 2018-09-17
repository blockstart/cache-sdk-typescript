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

import { MosaicHttp } from '../../infrastructure/MosaicHttp';
import { Mosaic } from '../../models/mosaic/Mosaic';
import { MosaicId } from '../../models/mosaic/MosaicId';
import { MosaicTransferable } from '../../models/mosaic/MosaicTransferable';
import { XEM } from '../../models/mosaic/XEM';

export class BMosaic extends Mosaic {
  /**
   * constructor
   * @param mosaicId
   * @param quantity
   */
  constructor(mosaicId: MosaicId, quantity: number) {
    super(mosaicId, quantity)
  }
  /**
   * returns mosaic transferable
   * @returns {Promise<MosaicTransferable>}
   */
  public getMosaicDetails = (): Promise<MosaicTransferable> => {
    return new Promise<MosaicTransferable>(async (resolve, reject) => {
      try {
        if (this.mosaicId.namespaceId === 'nem' && this.mosaicId.name === 'xem') {
          resolve(XEM.fromAbsolute(this.quantity));
        } else {
          new MosaicHttp().getMosaicDefinition(this.mosaicId).subscribe((mosaicDefinition) => {
            resolve(MosaicTransferable.createAbsolute(this.mosaicId, mosaicDefinition.properties, this.quantity, mosaicDefinition.levy));
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  };
}