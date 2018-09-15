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
var Address_1 = require("../../models/account/Address");
var PublicAccount_1 = require("../../models/account/PublicAccount");
var Mosaic_1 = require("../../models/mosaic/Mosaic");
var MosaicDefinition_1 = require("../../models/mosaic/MosaicDefinition");
var MosaicId_1 = require("../../models/mosaic/MosaicId");
var MosaicLevy_1 = require("../../models/mosaic/MosaicLevy");
var XEM_1 = require("../../models/mosaic/XEM");
var EncryptedMessage_1 = require("../../models/transaction/EncryptedMessage");
var ImportanceTransferTransaction_1 = require("../../models/transaction/ImportanceTransferTransaction");
var MosaicDefinitionCreationTransaction_1 = require("../../models/transaction/MosaicDefinitionCreationTransaction");
var MosaicSupplyChangeTransaction_1 = require("../../models/transaction/MosaicSupplyChangeTransaction");
var MultisigAggregateModificationTransaction_1 = require("../../models/transaction/MultisigAggregateModificationTransaction");
var MultisigSignatureTransaction_1 = require("../../models/transaction/MultisigSignatureTransaction");
var MultisigTransaction_1 = require("../../models/transaction/MultisigTransaction");
var PlainMessage_1 = require("../../models/transaction/PlainMessage");
var ProvisionNamespaceTransaction_1 = require("../../models/transaction/ProvisionNamespaceTransaction");
var TimeWindow_1 = require("../../models/transaction/TimeWindow");
var TransactionInfo_1 = require("../../models/transaction/TransactionInfo");
var TransactionTypes_1 = require("../../models/transaction/TransactionTypes");
var TransferTransaction_1 = require("../../models/transaction/TransferTransaction");
/**
 * @internal
 * @param dto
 * @returns {any}
 * @constructor
 */
exports.CreateTransactionFromDTO = function (dto) {
    if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MULTISIG) {
        var transaction = dto.transaction;
        return new MultisigTransaction_1.MultisigTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, exports.CreateTransactionFromDTO({
            meta: {
                height: dto.meta.height,
                id: dto.meta.id,
                hash: dto.meta.hash,
                innerHash: {}
            },
            transaction: transaction.otherTrans
        }), transaction.fee, transaction.signatures.map(function (signature) {
            return new MultisigSignatureTransaction_1.MultisigSignatureTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(signature.timeStamp, signature.deadline), signature.version, new Address_1.Address(signature.otherAccount), new TransactionInfo_1.HashData(signature.otherHash.data), signature.fee, signature.signature, PublicAccount_1.PublicAccount.createWithPublicKey(signature.signer));
        }), transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.MultisigTransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data), new TransactionInfo_1.HashData(dto.meta.innerHash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
        var transaction = dto.transaction;
        var message = void 0;
        if (transaction.message.type == 1) {
            message = PlainMessage_1.PlainMessage.createFromDTO(transaction.message.payload);
        }
        else if (transaction.message.type == 2) {
            message = EncryptedMessage_1.EncryptedMessage.createFromDTO(transaction.message.payload);
        }
        else {
            message = PlainMessage_1.EmptyMessage;
        }
        return new TransferTransaction_1.TransferTransaction(new Address_1.Address(transaction.recipient), XEM_1.XEM.fromAbsolute(transaction.amount), TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.fee, message, transaction.signature, transaction.mosaics === undefined ? undefined : transaction.mosaics.map(function (mosaicDTO) { return Mosaic_1.Mosaic.createFromMosaicDTO(mosaicDTO); }), PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.IMPORTANCE_TRANSFER) {
        var transaction = dto.transaction;
        return new ImportanceTransferTransaction_1.ImportanceTransferTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.mode, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.remoteAccount), transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE) {
        var transaction = dto.transaction;
        return new ProvisionNamespaceTransaction_1.ProvisionNamespaceTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new Address_1.Address(transaction.rentalFeeSink), transaction.rentalFee, transaction.newPart, transaction.fee, transaction.signature, transaction.parent == null ? undefined : transaction.parent, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION) {
        var transaction = dto.transaction;
        return new MultisigAggregateModificationTransaction_1.MultisigAggregateModificationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.modifications.map(function (modification) {
            return new MultisigAggregateModificationTransaction_1.CosignatoryModification(PublicAccount_1.PublicAccount.createWithPublicKey(modification.cosignatoryAccount), modification.modificationType);
        }), transaction.fee, transaction.signature, transaction.minCosignatories === undefined ? undefined : transaction.minCosignatories.relativeChange, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION) {
        var transaction = dto.transaction;
        var levy = transaction.mosaicDefinition.levy.mosaicId === undefined ?
            undefined : MosaicLevy_1.MosaicLevy.createFromMosaicLevyDTO(transaction.mosaicDefinition.levy);
        var mosaicDefinition = new MosaicDefinition_1.MosaicDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(transaction.mosaicDefinition.creator), new MosaicId_1.MosaicId(transaction.mosaicDefinition.id.namespaceId, transaction.mosaicDefinition.id.name), transaction.mosaicDefinition.description, MosaicDefinition_1.MosaicProperties.createFromMosaicProperties(transaction.mosaicDefinition.properties), levy);
        return new MosaicDefinitionCreationTransaction_1.MosaicDefinitionCreationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.creationFee, new Address_1.Address(transaction.creationFeeSink), mosaicDefinition, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    else if (dto.transaction.type == TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE) {
        var transaction = dto.transaction;
        return new MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new MosaicId_1.MosaicId(transaction.mosaicId.namespaceId, transaction.mosaicId.name), transaction.supplyType, transaction.delta, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), new TransactionInfo_1.TransactionInfo(dto.meta.height, dto.meta.id, new TransactionInfo_1.HashData(dto.meta.hash.data)));
    }
    throw new Error("Unimplemented transaction with type " + dto.transaction.type);
};
/**
 * @internal
 * @param dto
 * @returns {any}
 * @constructor
 */
exports.CreateSimpleTransactionFromDTO = function (dto) {
    if (dto.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
        var transaction = dto;
        var message = void 0;
        if (transaction.message.type == 1) {
            message = PlainMessage_1.PlainMessage.createFromDTO(transaction.message.payload);
        }
        else if (transaction.message.type == 2) {
            message = EncryptedMessage_1.EncryptedMessage.createFromDTO(transaction.message.payload);
        }
        else {
            message = PlainMessage_1.EmptyMessage;
        }
        return new TransferTransaction_1.TransferTransaction(new Address_1.Address(transaction.recipient), XEM_1.XEM.fromAbsolute(transaction.amount), TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.fee, message, transaction.signature, transaction.mosaics === undefined ? undefined : transaction.mosaics.map(function (mosaicDTO) { return Mosaic_1.Mosaic.createFromMosaicDTO(mosaicDTO); }), PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer), undefined);
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.IMPORTANCE_TRANSFER) {
        var transaction = dto;
        return new ImportanceTransferTransaction_1.ImportanceTransferTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.mode, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.remoteAccount), transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION) {
        var transaction = dto;
        return new MultisigAggregateModificationTransaction_1.MultisigAggregateModificationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.modifications.map(function (modification) {
            return new MultisigAggregateModificationTransaction_1.CosignatoryModification(PublicAccount_1.PublicAccount.createWithPublicKey(modification.cosignatoryAccount), modification.modificationType);
        }), transaction.fee, transaction.signature, transaction.minCosignatories === undefined ? undefined : transaction.minCosignatories.relativeChange, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE) {
        var transaction = dto;
        return new ProvisionNamespaceTransaction_1.ProvisionNamespaceTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new Address_1.Address(transaction.rentalFeeSink), transaction.rentalFee, transaction.newPart, transaction.fee, transaction.signature, transaction.parent == null ? undefined : transaction.parent, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION) {
        var transaction = dto;
        var levy = transaction.mosaicDefinition.levy.mosaicId === undefined ?
            undefined : MosaicLevy_1.MosaicLevy.createFromMosaicLevyDTO(transaction.mosaicDefinition.levy);
        var mosaicDefinition = new MosaicDefinition_1.MosaicDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(transaction.mosaicDefinition.creator), new MosaicId_1.MosaicId(transaction.mosaicDefinition.id.namespaceId, transaction.mosaicDefinition.id.name), transaction.mosaicDefinition.description, MosaicDefinition_1.MosaicProperties.createFromMosaicProperties(transaction.mosaicDefinition.properties), levy);
        return new MosaicDefinitionCreationTransaction_1.MosaicDefinitionCreationTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, transaction.creationFee, new Address_1.Address(transaction.creationFeeSink), mosaicDefinition, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE) {
        var transaction = dto;
        return new MosaicSupplyChangeTransaction_1.MosaicSupplyChangeTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, new MosaicId_1.MosaicId(transaction.mosaicId.namespaceId, transaction.mosaicId.name), transaction.supplyType, transaction.delta, transaction.fee, transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    else if (dto.type == TransactionTypes_1.TransactionTypes.MULTISIG) {
        var transaction = dto;
        return new MultisigTransaction_1.MultisigTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(transaction.timeStamp, transaction.deadline), transaction.version, exports.CreateSimpleTransactionFromDTO(transaction.otherTrans), transaction.fee, transaction.signatures.map(function (signature) {
            return new MultisigSignatureTransaction_1.MultisigSignatureTransaction(TimeWindow_1.TimeWindow.createFromDTOInfo(signature.timeStamp, signature.deadline), signature.version, new Address_1.Address(signature.otherAccount), new TransactionInfo_1.HashData(signature.otherHash.data), signature.fee, signature.signature, PublicAccount_1.PublicAccount.createWithPublicKey(signature.signer));
        }), transaction.signature, PublicAccount_1.PublicAccount.createWithPublicKey(transaction.signer));
    }
    throw new Error("Unimplemented other transaction with type " + dto.type);
};
