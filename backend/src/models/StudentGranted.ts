import { DataTypes, Model , Sequelize } from 'sequelize'
import { sequelize } from "../configuration"

sequelize

export type StudentGrantAttributes = {
    studentId: string
    allow: boolean
    intensive_sci: boolean
    intensive_math: boolean
    intensive_eng: boolean
}

export class StudentGrant extends Model<StudentGrantAttributes> {
    declare studentId: string
    declare allow: boolean
    declare intensive_sci: boolean
    declare intensive_math: boolean
    declare intensive_eng: boolean
    static intensive_sci: any
    static intensive_math: any
    static intensive_eng: any
}

StudentGrant.init(
    {
        studentId: {
            type: DataTypes.STRING(126),
            primaryKey: true,
        },
        allow: {
            type: DataTypes.BOOLEAN
        },
        intensive_sci: {
            type: DataTypes.BOOLEAN
        },
        intensive_math: {
            type: DataTypes.BOOLEAN
        },
        intensive_eng: {
            type: DataTypes.BOOLEAN
        },
    },
    {
        sequelize: sequelize,
        tableName: 'student_grants',
        paranoid: true
    },
)
