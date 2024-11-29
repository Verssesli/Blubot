import {Sequelize} from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/db_files/guilds.sqlite',
    logging: false,
});

export default sequelize;