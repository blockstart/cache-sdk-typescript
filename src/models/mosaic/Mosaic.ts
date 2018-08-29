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

import {MosaicDTO} from "../../infrastructure/mosaic/MosaicDTO";
import { MosaicHttp } from '../../infrastructure/MosaicHttp';
import {MosaicId} from "./MosaicId";
import { MosaicTransferable } from './MosaicTransferable';
import { XEM } from './XEM';
import '../../utilities/Number.extenstion';

/**
 * A mosaic describes an instance of a mosaic definition. Mosaics can be transferred by means of a transfer transaction.
 */
export class Mosaic {

  /**
   * The mosaic id
   */
  public readonly mosaicId: MosaicId;

  /**
   * The mosaic quantity. The quantity is always given in smallest units for the mosaic, i.e. if it has a divisibility of 3 the quantity is given in millis.
   */
  public readonly quantity: number;

  /**
   * constructor
   * @param mosaicId
   * @param quantity
   */
  constructor(
    mosaicId: MosaicId,
    quantity: number,
  ) {
    this.mosaicId = mosaicId;
    this.quantity = quantity;
  }
  /**
   * returns mosaic transferable
   * @returns {Promise<MosaicTransferable>}
   */
  public getMosaicDetails = (): Promise<MosaicTransferable> => {
    return new Promise<MosaicTransferable>(async (resolve, reject) => {
      try {
        if (this.mosaicId.namespaceId === 'nem' && this.mosaicId.name === 'xem') {
          resolve(new XEM(this.quantity / 1e6));
        } else {
          const subscriber = new MosaicHttp().getMosaicDefinition(this.mosaicId).subscribe((mosaicDefinition) => {
            const divisibility = mosaicDefinition.properties.divisibility;
            const amount = (this.quantity / Math.pow(10, divisibility)).toFixedNumber(divisibility);
            subscriber.unsubscribe();
            resolve(MosaicTransferable.createWithMosaicDefinition(mosaicDefinition, amount));
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * @internal
   * @param dto
   * @returns {Mosaic}
   */
  public static createFromMosaicDTO(dto: MosaicDTO): Mosaic {
    return new Mosaic(
      MosaicId.createFromMosaicIdDTO(dto.mosaicId),
      dto.quantity);
  }

}
