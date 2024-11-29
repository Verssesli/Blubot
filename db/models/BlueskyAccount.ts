import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

class BlueskyAccount extends Model {
    declare DID: string;
    declare handle: string;
    declare displayName?: string;
    declare avatarURL?: string;
}

BlueskyAccount.init(
    {
        DID: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        displayName: {
            type: DataTypes.STRING,
        },
        avatarURL: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,
        modelName: "BlueskyAccount",
    }
);

export default BlueskyAccount;
