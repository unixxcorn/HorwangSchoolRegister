import { logger } from '../util';
import { Student } from '../models/Student';
import { StudentGrant } from '../models/StudentGranted';
import { StudentSelect, StudentSelectAttributes } from '../models/StudentSelect';
import { StudentSubmit } from '../models/StudentSubmit';
import { Request, Response } from 'express';

/**
 * It submit the form to the database.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export async function submitForm(req: Request, res: Response) {
    try {
        if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
            throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง');
        }
        if (!req.body.preferredPackages ||
            req.body.preferredPackages.some((i: any) => !Number.isInteger(i))) {
            throw new Error('ข้อมูลหลักสูตรที่ลงทะเบียนไม่ถูกต้อง');
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

        const preferredPackages: Array<number> = req.body.preferredPackages;

        const alreadySubmit = await StudentSubmit.findOne({
            where: {
                studentId: student.studentId,
                valid: true,
            },
            order: [['createdAt', 'DESC']],
        });

        if (alreadySubmit)
            throw new Error('นักเรียนได้มีการลงทะเบียนไปแล้ว');

        const notAllow: number[] = [];

        const student_grant = await StudentGrant.findByPk(student.studentId);
        if (!student_grant)
            throw new Error(
                'นักเรียนยังไม่ได้ถูกกำหนดสิทธิในการลงทะเบียน กรุณาติดต่อผู้ดูแลระบบ'
            );

        if (!student_grant.allow)
            throw new Error('นักเรียนไม่มีสิทธิสมัครเรียนต่อระดับมัธยมศึกษาตอนปลาย');

        if (!student_grant.intensive_sci) {
            notAllow.push(1);
        }

        if (!student_grant.intensive_math) {
            notAllow.push(2);
        }

        if (!student_grant.intensive_eng) {
            notAllow.push(3);
        }

        if (preferredPackages.some((item) => notAllow.includes(item))) {
            logger.log('Student try to hack', req.body.studentId);
            throw new Error(
                'ฮั่นแน่! จะแฮกหยอ น่ารักจัง คิคิ พี่บอกให้จารย์ทำ log ไว้แล้ว ไปขอโทษที่หมวดคอมนะ ♥'
            );
        }

        const submit = await StudentSubmit.create({
            studentId: student.studentId,
            valid: true,
        });

        const selected = preferredPackages.map((pack, index) => {
            return {
                submitId: submit.submitId,
                packageId: pack,
                order: index,
            } as unknown as StudentSelectAttributes;
        });
        const selectedObj = await StudentSelect.bulkCreate(selected);

        res.json({ profile: student, submit: { ...submit.toJSON(), selected: selectedObj } });
    } catch (error: any) {
        console.log(error);
        if (error.name == 'SequelizeUniqueConstraintError') {
            res.status(400).json({ error: 'นักเรียนได้มีการลงทะเบียนไปแล้ว' });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}
