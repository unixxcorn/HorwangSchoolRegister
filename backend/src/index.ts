import { configuration } from './configuration'
import { WebApplication } from './app'
import { logger } from './util'
import { Student } from './models/Student'
import { PackageGroup } from './models/PackageGroup'
import { Package } from './models/Packages'
import { StudentGrant } from './models/StudentGranted'
import { StudentSelect, StudentSelectAttributes } from './models/StudentSelect'
import { StudentSubmit } from './models/StudentSubmit'
import { Op } from 'sequelize'
import ejs from 'ejs'
import pdf from 'html-pdf'
import path from 'path'

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

    app.express.use(async (req, res, next) => {
        logger.log(`Student id ${req.body.studentId} request ${req.path}`)
        next()
    })

    app.express.post('/student', async (req, res) => {
        try {
            if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
                throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง')
            }
            if (
                !req.body.identityNumber ||
                !req.body.identityNumber.match(new RegExp(/[0-9]{13}/i))
            ) {
                throw new Error('ข้อมูลบัตรประชาชนไม่ถูกต้อง')
            }

            const student = await Student.findOne({
                attributes: [
                    'studentId',
                    'identityNumber',
                    'title',
                    'firstName',
                    'lastName',
                    'class',
                    'room',
                    'roomId',
                ],
                where: {
                    studentId: req.body.studentId,
                    identityNumber: req.body.identityNumber,
                },
            })
            if (!student) throw new Error('ไม่พบข้อมูลนักเรียน')

            const alreadySubmit = await StudentSubmit.findOne({
                where: {
                    studentId: student.studentId,
                    valid: true,
                },
                order: [['createdAt', 'DESC']],
            })

            const studentGrant = await StudentGrant.findOne({
                attributes: ['allow', 'intensive_sci', 'intensive_math', 'intensive_eng'],
                where: {
                    studentId: student.studentId,
                },
            })

            if (!studentGrant) throw new Error('ไม่พบข้อมูลสิทธิในการลงทะเบียน')

            const whereOperate = []

            if (!studentGrant.intensive_sci) {
                whereOperate.push({
                    packageName: {
                        [Op.ne]: 'Intensive วิทยาศาสตร์-คณิตศาสตร์',
                    },
                })
            }

            if (!studentGrant.intensive_math) {
                whereOperate.push({
                    packageName: {
                        [Op.ne]: 'Intensive คณิตศาสตร์-ภาษาอังกฤษ',
                    },
                })
            }

            if (!studentGrant.intensive_eng) {
                whereOperate.push({
                    packageName: {
                        [Op.ne]: 'Intensive ภาษาต่างประเทศที่ 2',
                    },
                })
            }

            const packages = studentGrant.allow
                ? await PackageGroup.findAll({
                      attributes: ['packageGroupId', 'groupName'],
                      order: ['packageGroupId'],
                      include: [
                          {
                              model: Package,
                              attributes: ['packageId', 'packageName'],
                              as: 'packages',
                              where: {
                                  [Op.and]: whereOperate,
                              },
                          },
                      ],
                  })
                : undefined

            res.json({
                alreadyRegister: alreadySubmit ? true : false,
                profile: student,
                granted: studentGrant,
                avaliablePackage: packages,
            })
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    })

    app.express.post('/submit', async (req, res) => {
        try {
            if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
                throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง')
            }
            if (
                !req.body.preferredPackages ||
                req.body.preferredPackages.some((i: any) => !Number.isInteger(i))
            ) {
                throw new Error('ข้อมูลหลักสูตรที่ลงทะเบียนไม่ถูกต้อง')
            }
            if (
                !req.body.identityNumber ||
                !req.body.identityNumber.match(new RegExp(/[0-9]{13}/i))
            ) {
                throw new Error('ข้อมูลบัตรประชาชนไม่ถูกต้อง')
            }
            const student = await Student.findOne({
                attributes: [
                    'studentId',
                    'identityNumber',
                    'title',
                    'firstName',
                    'lastName',
                    'class',
                    'room',
                    'roomId',
                ],
                where: {
                    studentId: req.body.studentId,
                    identityNumber: req.body.identityNumber,
                },
            })
            if (!student) throw new Error('ไม่พบข้อมูลนักเรียน')

            const preferredPackages: Array<number> = req.body.preferredPackages

            const alreadySubmit = await StudentSubmit.findOne({
                where: {
                    studentId: student.studentId,
                    valid: true,
                },
                order: [['createdAt', 'DESC']],
            })

            if (alreadySubmit) throw new Error('นักเรียนได้มีการลงทะเบียนไปแล้ว')

            const notAllow: number[] = []

            const student_grant = await StudentGrant.findByPk(student.studentId)
            if (!student_grant)
                throw new Error(
                    'นักเรียนยังไม่ได้ถูกกำหนดสิทธิในการลงทะเบียน กรุณาติดต่อผู้ดูแลระบบ',
                )

            if (!student_grant.allow)
                throw new Error('นักเรียนไม่มีสิทธิสมัครเรียนต่อระดับมัธยมศึกษาตอนปลาย')

            if (!student_grant.intensive_sci) {
                notAllow.push(1)
            }

            if (!student_grant.intensive_math) {
                notAllow.push(2)
            }

            if (!student_grant.intensive_eng) {
                notAllow.push(3)
            }

            if (preferredPackages.some((item) => notAllow.includes(item))) {
                logger.log('Student try to hack', req.body.studentId)
                throw new Error(
                    'ฮั่นแน่! จะแฮกหยอ น่ารักจัง คิคิ พี่บอกให้จารย์ทำ log ไว้แล้ว ไปขอโทษที่หมวดคอมนะ ♥',
                )
            }

            const submit = await StudentSubmit.create({
                studentId: student.studentId,
                valid: true,
            })

            const selected = preferredPackages.map((pack, index) => {
                return {
                    submitId: submit.submitId,
                    packageId: pack,
                    order: index,
                } as unknown as StudentSelectAttributes
            })
            const selectedObj = await StudentSelect.bulkCreate(selected)

            res.json({ profile: student, submit: { ...submit.toJSON(), selected: selectedObj } })
        } catch (error: any) {
            console.log(error)
            if (error.name == 'SequelizeUniqueConstraintError') {
                res.status(400).json({ error: 'นักเรียนได้มีการลงทะเบียนไปแล้ว' })
            } else {
                res.status(400).json({ error: error.message })
            }
        }
    })

    app.express.post('/pdf', async (req, res) => {
        try {
            if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
                throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง')
            }
            if (
                !req.body.identityNumber ||
                !req.body.identityNumber.match(new RegExp(/[0-9]{13}/i))
            ) {
                throw new Error('ข้อมูลบัตรประชาชนไม่ถูกต้อง')
            }

            const student = await Student.findOne({
                attributes: [
                    'studentId',
                    'identityNumber',
                    'title',
                    'firstName',
                    'lastName',
                    'class',
                    'room',
                    'roomId',
                ],
                where: {
                    studentId: req.body.studentId,
                    identityNumber: req.body.identityNumber,
                },
            })
            if (!student) throw new Error('ไม่พบข้อมูลนักเรียน')

            const submit = await StudentSubmit.findOne({
                where: {
                    studentId: student.studentId,
                    valid: true,
                },
                include: {
                    model: StudentSelect,
                    order: [['order', 'ASC']],
                    include: [Package],
                },
                order: [['submitId', 'DESC']],
            })

            if (!submit) throw new Error('ไม่พบข้อมูลการลงทะเบียนของนักเรียน')

            // console.log(student.toJSON(), submit.toJSON())

            ejs.renderFile(
                path.join(__dirname, '../views/', 'agreementTemplate.ejs'),
                { student: student.toJSON(), submit: submit.toJSON() },
                (err, data) => {
                    if (err) throw err
                    logger.log(`render pdf for ${student.studentId}`)
                    pdf.create(data, {
                        height: '11.7in',
                        width: '8.3in',
                        header: {
                            height: '10mm',
                        },
                        footer: {
                            height: '10mm',
                        },
                    }).toStream((err, read) => {
                        if (err) throw err
                        res.setHeader('Content-Type', 'application/pdf')
                        res.setHeader(
                            'Content-Disposition',
                            `attachment; filename=agreement_${student.studentId}.pdf`,
                        )
                        read.pipe(res)
                        read.on('end', () => res.end())
                    })
                },
            )
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    })

    await app.waitForReady()
    await app.start()
}

main()
