import { Student } from '../models/Student';
import { PackageGroup } from '../models/PackageGroup';
import { Package } from '../models/Packages';
import { StudentGrant } from '../models/StudentGranted';
import { StudentSubmit } from '../models/StudentSubmit';
import { Op } from 'sequelize';
import { Request, Response } from 'express';

/**
 * This function is used to fetch the student profile.
 * @param {Request} req - Request
 * @param {Response} res - The response object.
 */
export async function fetchStudent(req: Request, res: Response) {
    try {
        if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
            throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง');
        }
        if (!req.body.identityNumber ||
            !req.body.identityNumber.match(new RegExp(/[0-9]{13}/i))) {
            throw new Error('ข้อมูลบัตรประชาชนไม่ถูกต้อง');
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
        });
        if (!student)
            throw new Error('ไม่พบข้อมูลนักเรียน');

        const alreadySubmit = await StudentSubmit.findOne({
            where: {
                studentId: student.studentId,
                valid: true,
            },
            order: [['createdAt', 'DESC']],
        });

        const studentGrant = await StudentGrant.findOne({
            attributes: ['allow', 'intensive_sci', 'intensive_math', 'intensive_eng'],
            where: {
                studentId: student.studentId,
            },
        });

        if (!studentGrant)
            throw new Error('ไม่พบข้อมูลสิทธิในการลงทะเบียน');

        const whereOperate = [];

        if (!studentGrant.intensive_sci) {
            whereOperate.push({
                packageName: {
                    [Op.ne]: 'Intensive วิทยาศาสตร์-คณิตศาสตร์',
                },
            });
        }

        if (!studentGrant.intensive_math) {
            whereOperate.push({
                packageName: {
                    [Op.ne]: 'Intensive คณิตศาสตร์-ภาษาอังกฤษ',
                },
            });
        }

        if (!studentGrant.intensive_eng) {
            whereOperate.push({
                packageName: {
                    [Op.ne]: 'Intensive ภาษาต่างประเทศที่ 2',
                },
            });
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
            : undefined;

        res.json({
            alreadyRegister: alreadySubmit ? true : false,
            profile: student,
            granted: studentGrant,
            avaliablePackage: packages,
        });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
