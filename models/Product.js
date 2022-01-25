'use strict';

module.exports= (sequelize, DataTypes)=>{
    const Product= sequelize.define('product', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING
        },
        price: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        category: {
            allowNull: false,
            type: DataTypes.ARRAY(DataTypes.ENUM('combo','main', 'side', 'sauce', 'protein', 'soup', 'keto')) //because boiled plantain can 
                                                                                                   //be both main and side, salad: keto and side
        },
        description: {
            allowNull: true,
            type: DataTypes.STRING
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    })

    return Product;
};