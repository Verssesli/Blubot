"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class DiscordServer extends sequelize_1.Model {
}
DiscordServer.init({
    guildID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    guildName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    guildOwner: sequelize_1.DataTypes.STRING,
    guildJoined: sequelize_1.DataTypes.STRING,
}, {
    sequelize: database_1.default,
    modelName: "DiscordServer",
});
exports.default = DiscordServer;
