const { DataTypes } = require('sequelize');
const db = require("../db");

const Log = db.define("log", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    // owner_id: {
    //     type: DataTypes.INTEGER
    // },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }

});

module.exports = Log;