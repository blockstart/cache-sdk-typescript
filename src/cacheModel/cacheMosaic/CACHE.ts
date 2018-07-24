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


import { MosaicProperties } from "../../models/mosaic/MosaicDefinition";
import { MosaicId } from "../../models/mosaic/MosaicId";
import { MosaicTransferable } from "../../models/mosaic/MosaicTransferable";

/**
 * XEM mosaic transferable
 */
export class CACHE extends MosaicTransferable {
  /**
   * Divisiblity
   * @type {number}
   */
  public static DIVISIBILITY = 6;

  /**
   * Initial supply
   * @type {number}
   */
  public static INITIALSUPPLY= 1000000000;

  /**
   * Is tranferable
   * @type {boolean}
   */
  public static TRANSFERABLE = true;

  /**
   * Is mutable
   * @type {boolean}
   */
  public static SUPPLYMUTABLE = false;

  /**
   * mosaicId
   * @type {MosaicId}
   */
  public static MOSAICID = new MosaicId("cache", "cache");

  /**
   * constructor
   * @param amount
   */
  constructor(amount: number) {
    super(CACHE.MOSAICID, new MosaicProperties(CACHE.DIVISIBILITY, CACHE.INITIALSUPPLY, CACHE.TRANSFERABLE, CACHE.SUPPLYMUTABLE), amount);
  }

}
