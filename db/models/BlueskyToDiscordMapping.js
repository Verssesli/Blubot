"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
const BlueskyAccount_1 = __importDefault(require("./BlueskyAccount"));
const DiscordServer_1 = __importDefault(require("./DiscordServer"));
class AccountToServerMapping extends sequelize_1.Model {
}
AccountToServerMapping.init({
    channelID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    roleID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    allowRT: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    allowRE: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    useFX: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    useWebhook: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: "AccountToServerMapping",
});
// Define associations
BlueskyAccount_1.default.hasMany(AccountToServerMapping);
DiscordServer_1.default.hasMany(AccountToServerMapping);
AccountToServerMapping.belongsTo(BlueskyAccount_1.default, { foreignKey: 'BlueskyAccountDID' });
AccountToServerMapping.belongsTo(DiscordServer_1.default, { foreignKey: 'DiscordServerGuildID' });
exports.default = AccountToServerMapping;
