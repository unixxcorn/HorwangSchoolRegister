import { DataTypes, Model , Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

sequelize

export type StudentSelectAttributes = {
    submitId: string
    packageId: string
    order: boolean
}

export class StudentSelect extends Model<StudentSelectAttributes> {
    declare submitId: string
    declare packageId: string
    declare order: boolean
}

StudentSelect.init(
    {
        submitId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        packageId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        order: {
            type: DataTypes.INTEGER.UNSIGNED
        },
    },
    {
        sequelize: sequelize,
        tableName: 'student_selects',
        paranoid: true
    },
)
