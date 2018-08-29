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

import * as requestPromise from "request-promise-native";
import {Observable} from "rxjs";
import {MosaicDefinition} from "../models/mosaic/MosaicDefinition";
import {MosaicId} from "../models/mosaic/MosaicId";
import {MosaicTransferable} from "../models/mosaic/MosaicTransferable";
import {HttpEndpoint, ServerConfig} from "./HttpEndpoint";
import {MosaicDefinitionMetaDataPairDTO} from "./mosaic/MosaicDefinitionMetaDataPairDTO";

export class MosaicHttp extends HttpEndpoint {

  constructor(nodes?: ServerConfig[]) {
    super("namespace", nodes);
  }

  /**
   * Gets the mosaic definitions for a given namespace. The request supports paging.
   * @param namespace
   * @param id - The topmost mosaic definition database id up to which root mosaic definitions are returned. The parameter is optional. If not supplied the most recent mosaic definitiona are returned.
   * @param pageSize - The number of mosaic definition objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and hte maximum value is 100.
   * @returns Observable<MosaicDefinition[]>
   */
  public getAllMosaicsGivenNamespace(namespace: string, id?: number, pageSize?: number): Observable<MosaicDefinition[]> {
    const url = "mosaic/definition/page?namespace=" + namespace +
      (id === undefined ? "" : "&id=" + id) +
      (pageSize === undefined ? "" : "&pageSize=" + pageSize);

    return Observable.of(url)
      .flatMap((url) => requestPromise.get(this.nextNode() + url, {json: true}))
      .retryWhen(this.replyWhenRequestError)
      .map((mosaicDefinitionsData) => {
        return mosaicDefinitionsData.data.map((mosaicDefinitionMetaDataPairDTO: MosaicDefinitionMetaDataPairDTO) => {
          return MosaicDefinition.createFromMosaicDefinitionMetaDataPairDTO(mosaicDefinitionMetaDataPairDTO);
        });
      });
  }

  /**
   * Return the Mosaic Definition given a namespace and mosaic. Throw exception if no mosaic is found
   * @param {string} mosaicId
   * @returns {Observable<MosaicDefinition>}
   */
  public getMosaicDefinition(mosaicId: MosaicId): Observable<MosaicDefinition> {
    return this.getAllMosaicsGivenNamespace(mosaicId.namespaceId, undefined, 100)
      .flatMap((_) => _)
      .filter((mosaicDefinition) => mosaicDefinition.id.equals(mosaicId))
      .last();
  }

  /**
   * Return a MosaicTransferable with the xem
   * @param {string} mosaicId
   * @param {number} amount
   * @returns {Observable<MosaicTransferable>}
   */
  public getMosaicTransferableWithAmount(mosaicId: MosaicId, amount: number): Observable<MosaicTransferable> {
    return this.getMosaicDefinition(mosaicId)
      .map((mosaicDefinition) => MosaicTransferable.createWithMosaicDefinition(mosaicDefinition, amount));
  }
}
