import { DataTypes, Model, Optional , Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

sequelize

export type StudentSubmitAttributes = {
    submitId: string
    studentId: string
    valid: boolean
}

type StudentSubmitCreationAttributes = Optional<StudentSubmitAttributes, 'submitId'>

export class StudentSubmit extends Model<StudentSubmitAttributes, StudentSubmitCreationAttributes> {
    declare submitId: string
    declare studentId: string
    declare valid: boolean
}

StudentSubmit.init(
    {
        submitId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        studentId: {
            type: DataTypes.STRING,
        },
        valid: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize: sequelize,
        tableName: 'student_submits',
        paranoid: true
    },
)
