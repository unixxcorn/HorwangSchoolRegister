import { configuration } from './configuration'
import { WebApplication } from './app'
import { logger } from './util'
import { Student } from './models/Student'
import { PackageGroup } from './models/PackageGroup'
import { Package } from './models/Packages'
import { StudentGrant } from './models/StudentGranted'
import { StudentSelect } from './models/StudentSelect'
import { StudentSubmit } from './models/StudentSubmit'
import { fetchStudent } from './modules/fetchStudent'
import { submitForm } from './modules/submitForm'
import { generatePDF } from './modules/generatePDF'

/**
 * This function is used to initialize the database and start the server
 */
async function main() {
    const app = new WebApplication(configuration)

    /* Initializing the database. */
    await Promise.all([
        PackageGroup.sync({ alter: true }),
        Package.sync({ alter: true }),
        Student.sync({ alter: true }),
        StudentGrant.sync({ alter: true }),
        StudentSelect.sync({ alter: true }),
        StudentSubmit.sync({ alter: true }),
    ])

    /* Create relationships between tables. */
    await PackageGroup.hasMany(Package, {
        foreignKey: 'packageGroupId',
        sourceKey: 'packageGroupId',
        as: 'packages',
    })
    await StudentSelect.belongsTo(Package, {
        foreignKey: 'packageId',
        targetKey: 'packageId',
    })
    await StudentSubmit.hasMany(StudentSelect, {
        foreignKey: 'submitId',
        sourceKey: 'submitId',
    })
    await Student.hasMany(StudentSubmit, {
        foreignKey: 'studentId',
        sourceKey: 'studentId',
    })
    await Student.hasMany(StudentGrant, {
        foreignKey: 'studentId',
        sourceKey: 'studentId',
    })

    /* Initializing the database. */
    await Promise.all([
        PackageGroup.sync({ alter: true }),
        Package.sync({ alter: true }),
        Student.sync({ alter: true }),
        StudentGrant.sync({ alter: true }),
        StudentSelect.sync({ alter: true }),
        StudentSubmit.sync({ alter: true }),
    ])

    /* This is a middleware that is used to log the student id and the request path. */
    app.express.use(async (req, res, next) => {
        logger.log(`Student id ${req.body.studentId} request ${req.path}`)
        next()
    })

    /* This is a route that is used to fetch the student information from the database. */
    app.express.post('/student', fetchStudent)

    /* This is a route that is used to submit the form. */
    app.express.post('/submit', submitForm)

    /* This is a route that is used to generate the PDF. */
    app.express.post('/pdf', generatePDF)

    /* This is a way to make sure that the server is ready to accept requests. */
    await app.waitForReady()
    await app.start()
}

main()
