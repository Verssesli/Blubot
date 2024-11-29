import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class DiscordServer extends Model {
    declare guildID: string;
    declare guildName: string;
    declare guildOwner?: string;
    declare guildJoined?: string;
}

DiscordServer.init(
    {
        guildID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        guildName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        guildOwner: DataTypes.STRING,
        guildJoined: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: "DiscordServer",
    }
);

export default DiscordServer;
