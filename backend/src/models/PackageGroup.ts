import { DataTypes, Model, Optional, Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

sequelize

export type PackageGroupAttributes = {
    packageGroupId: number
    groupName: string
}

type PackageCreationAttributes = Optional<PackageGroupAttributes, 'packageGroupId'>

export class PackageGroup extends Model<PackageGroupAttributes, PackageCreationAttributes> {
    declare packageGroupId: number
    declare groupName: string
}

PackageGroup.init(
    {
        packageGroupId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        groupName: {
            type: DataTypes.STRING(126),
        },
    },
    {
        sequelize: sequelize,
        tableName: 'package_groups',
        paranoid: true
    },
)
