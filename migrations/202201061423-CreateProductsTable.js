'use strict';

module.exports= {
    up: (queryInterface, Sequelize)=> {
        return queryInterface.createTable('products', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                allowNull: false,
                unique: true,
                type: Sequelize.STRING
            },
            price: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            category: {
                allowNull: false,
                type: Sequelize.ARRAY(Sequelize.ENUM('combo','main', 'side', 'sauce', 'protein', 'soup', 'keto'))
            },
            description: {
                allowNull: true,
                type: Sequelize.STRING
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
    down: (queryInterface, Sequelize)=>{
        return queryInterface.dropTable('Products');
    }
};