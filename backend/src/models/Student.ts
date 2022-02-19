import { DataTypes, Model , Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

sequelize

export type StudentAttributes = {
    studentId: string
    identityNumber: string
    title: string
    firstName: string
    lastName: string
    class: number
    room: number
    roomId: number
}

export class Student extends Model<StudentAttributes> {
    declare studentId: string
    declare identityNumber: string
    declare title: string
    declare firstName: string
    declare lastName: string
    declare class: number
    declare room: number
    declare roomId: number
}

Student.init(
    {
        studentId: {
            type: DataTypes.STRING(126),
            primaryKey: true,
        },
        identityNumber: {
            type: DataTypes.STRING(126),
        },
        title: {
            type: DataTypes.STRING(126),
        },
        firstName: {
            type: DataTypes.STRING(126),
        },
        lastName: {
            type: DataTypes.STRING(126),
        },
        class: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        room: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        roomId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
    },
    {
        sequelize: sequelize,
        tableName: 'students',
        paranoid: true
    },
)
