import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import BlueskyAccount from "./BlueskyAccount";
import DiscordServer from "./DiscordServer";

class AccountToServerMapping extends Model {
    declare channelID: string;
    declare roleID: string | null;
    declare allowRT: boolean;
    declare allowRE: boolean;
    declare isActive: boolean;
    declare useFX: boolean;
    declare useWebhook: boolean;

    declare BlueskyAccount: BlueskyAccount;
    declare BlueskyAccountDID: string;
    declare DiscordServerGuildID: string;
}

AccountToServerMapping.init(
    {
        channelID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        roleID: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        allowRT: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        allowRE: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        useFX: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        useWebhook: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        modelName: "AccountToServerMapping",
    }
);

// Define associations
BlueskyAccount.hasMany(AccountToServerMapping);
DiscordServer.hasMany(AccountToServerMapping);
AccountToServerMapping.belongsTo(BlueskyAccount, {foreignKey: 'BlueskyAccountDID'});
AccountToServerMapping.belongsTo(DiscordServer, {foreignKey: 'DiscordServerGuildID'});

export default AccountToServerMapping;
