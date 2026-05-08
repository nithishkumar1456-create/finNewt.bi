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
exports.getGoals = exports.deleteGoal = exports.addFunds = exports.updateGoal = exports.createGoal = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const goalService = __importStar(require("../services/goal.service"));
exports.createGoal = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const goal = await goalService.createGoal(req.user.id, req.body);
    res.status(201).json({ success: true, data: { goal } });
});
exports.updateGoal = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const goal = await goalService.updateGoal(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data: { goal } });
});
exports.addFunds = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const goal = await goalService.addFunds(req.user.id, req.params.id, req.body.amount);
    res.status(200).json({ success: true, data: { goal } });
});
exports.deleteGoal = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await goalService.deleteGoal(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Goal deleted successfully' });
});
exports.getGoals = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const goals = await goalService.getGoals(req.user.id);
    res.status(200).json({ success: true, data: { goals } });
});
