"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const transactionService = __importStar(require("../services/transaction.service"));
exports.createTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const transaction = await transactionService.createTransaction(req.user.id, req.body);
    res.status(201).json({ success: true, data: { transaction } });
});
exports.updateTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const transaction = await transactionService.updateTransaction(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data: { transaction } });
});
exports.deleteTransaction = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await transactionService.deleteTransaction(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
});
exports.getTransactions = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await transactionService.getTransactions(req.user.id, req.query);
    res.status(200).json({ success: true, data: result });
});
