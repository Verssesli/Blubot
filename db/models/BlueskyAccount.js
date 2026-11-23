"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class BlueskyAccount extends sequelize_1.Model {
}
BlueskyAccount.init({
    DID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    handle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    displayName: {
        type: sequelize_1.DataTypes.STRING,
    },
    avatarURL: {
        type: sequelize_1.DataTypes.STRING,
    }
}, {
    sequelize: database_1.default,
    modelName: "BlueskyAccount",
});
exports.default = BlueskyAccount;
