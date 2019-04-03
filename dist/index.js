"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Form_1 = __importDefault(require("./lib/Form"));
const Post_1 = __importDefault(require("./lib/Post"));
exports.Post = Post_1.default;
exports.default = Form_1.default;
