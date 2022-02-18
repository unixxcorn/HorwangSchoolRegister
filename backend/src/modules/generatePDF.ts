import { logger } from '../util';
import { Student } from '../models/Student';
import { Package } from '../models/Packages';
import { StudentSelect } from '../models/StudentSelect';
import { StudentSubmit } from '../models/StudentSubmit';
import ejs from 'ejs';
import pdf from 'html-pdf';
import path from 'path';
import { Request, Response } from 'express';

/**
 * It generates a PDF file for the student.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export async function generatePDF(req: Request, res: Response) {
    try {
        if (!req.body.studentId || !req.body.studentId.match(new RegExp(/[0-9]{5}/i))) {
            throw new Error('ข้อมูลรหัสนักเรียนไม่ถูกต้อง');
        }
        if (!req.body.identityNumber || !req.body.identityNumber.match(new RegExp(/[0-9]{13}/i))) {
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
        });

        if (!submit)
            throw new Error('ไม่พบข้อมูลการลงทะเบียนของนักเรียน');

        ejs.renderFile(
            path.join(__dirname, '../../views/', 'agreementTemplate.ejs'),
            { student: student.toJSON(), submit: submit.toJSON() },
            (err, data) => {
                if (err)
                    throw err;
                logger.log(`render pdf for ${student.studentId}`);
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
                    if (err)
                        throw err;
                    res.setHeader('Content-Type', 'application/pdf');
                    res.setHeader(
                        'Content-Disposition',
                        `attachment; filename=agreement_${student.studentId}.pdf`
                    );
                    read.pipe(res);
                    read.on('end', () => res.end());
                });
            }
        );
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}
