"use strict";
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
exports.__esModule = true;
var PublicAccount_1 = require("../account/PublicAccount");
/**
 * Nodes are the entities that perform communication in the network like sending and receiving data.
 * A node has an identity which is tied to an account through which the node can identify itself to the network.
 * The communication is done through the endpoint of the node. Additionally a node provides meta data information.
 */
var Node = /** @class */ (function () {
    /**
     * @internal
     * @param metaData
     * @param endpoint
     * @param identity
     */
    function Node(metaData, endpoint, identity) {
        this.metaData = metaData;
        this.endpoint = endpoint;
        this.identity = identity;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeDTO}
     */
    Node.createFromNodeDTO = function (dto) {
        return new Node(NodeMetaData.createFromNodeMetaDataDTO(dto.metaData), NodeEndpoint.createFromNodeEndpointDTO(dto.endpoint), NodeIdentity.createFromNodeIdentityDTO(dto.identity));
    };
    return Node;
}());
exports.Node = Node;
/**
 * Node meta data
 */
var NodeMetaData = /** @class */ (function () {
    /**
     * @internal
     * @param features
     * @param network
     * @param application
     * @param version
     * @param platform
     */
    function NodeMetaData(features, network, application, version, platform) {
        this.features = features;
        this.network = network;
        this.application = application;
        this.version = version;
        this.platform = platform;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeMetaDataDTO}
     */
    NodeMetaData.createFromNodeMetaDataDTO = function (dto) {
        return new NodeMetaData(dto.features, dto.networkId, dto.application, dto.version, dto.platform);
    };
    return NodeMetaData;
}());
exports.NodeMetaData = NodeMetaData;
/**
 * Node endpoint
 */
var NodeEndpoint = /** @class */ (function () {
    /**
     * @internal
     * @param protocol
     * @param port
     * @param host
     */
    function NodeEndpoint(protocol, port, host) {
        this.protocol = protocol;
        this.port = port;
        this.host = host;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeEndpointDTO}
     */
    NodeEndpoint.createFromNodeEndpointDTO = function (dto) {
        return new NodeEndpoint(dto.protocol, dto.port, dto.host);
    };
    return NodeEndpoint;
}());
exports.NodeEndpoint = NodeEndpoint;
/**
 * Node identity
 */
var NodeIdentity = /** @class */ (function () {
    /**
     * @internal
     * @param name
     * @param publickey
     */
    function NodeIdentity(name, publicAccount) {
        this.name = name;
        this.publicAccount = publicAccount;
    }
    /**
     * @internal
     * @param dto
     * @returns {NodeIdentityDTO}
     */
    NodeIdentity.createFromNodeIdentityDTO = function (dto) {
        return new NodeIdentity(dto.name, dto.publickey === undefined ? undefined : PublicAccount_1.PublicAccount.createWithPublicKey(dto.publickey));
    };
    return NodeIdentity;
}());
exports.NodeIdentity = NodeIdentity;
