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
            type: DataTypes.STRING,
            primaryKey: true,
        },
        identityNumber: {
            type: DataTypes.STRING,
        },
        title: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
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
