import { DataTypes, Model, Optional , Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

export type PackageAttributes = {
    packageId: number
    packageName: string
    packageGroupId: number
}

type PackageCreationAttributes = Optional<PackageAttributes, 'packageId'>

export class Package extends Model<PackageAttributes, PackageCreationAttributes> {
    declare packageId: number
    declare packageName: string
    declare packageGroupId: number
}

Package.init(
    {
        packageId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        packageName: {
            type: DataTypes.STRING,
        },
        packageGroupId: {
            type: DataTypes.INTEGER.UNSIGNED
        },
    },
    {
        sequelize: sequelize,
        tableName: 'packages',
        paranoid: true
    },
)
