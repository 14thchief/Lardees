
'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true
            },
            password: {
                allowNull: true,
                type: Sequelize.STRING                
            },
            full_name: {
                allowNull: true,
                type: Sequelize.STRING
            },
            phone: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            address: {
                allowNull: true,
                type: Sequelize.STRING
            },
            is_admin: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};