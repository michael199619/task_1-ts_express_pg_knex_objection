import { NextFunction, Request, Response, Router } from 'express';
import * as lessons from './controllers/lessons';
import { LessonsGetSchema, LessonsSaveSchema } from './validators/lessonsRequest';
import { createValidator } from 'express-joi-validation';

const router: Router = Router();

const validator = createValidator({
    passError: true
})

/**
 * @swagger
 * /:
 *   get:
 *     summary: метод осуществляет поиск по данным и возвращает массив объектов - занятий
 *     parameters:
 *      - in: query
 *        name: date
 *        schema:
 *          type: string
 *          pattern: '^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2}|)$'
 *        description:
 *          дата в формате YYYY-MM-DD, либо две в таком же формате через запятую (например, «2019-01-01,2019-09-01».
 *          Если указана одна дата, выбираются занятия на эту дату. Если указаны 2 даты, то выбираются занятия за период, включая указанные даты.
 *      - in: query
 *        name: status
 *        schema:
 *          type: integer
 *          enum: [0, 1]
 *          default: 0
 *        description: Статус занятия. принимается либо 0 (не проведено), либо 1 (проведено)
 *      - in: query
 *        name: teacherIds
 *        schema:
 *          type: array
 *          items:
 *            type: integer
 *        description: id учителей через запятую. Выбираются все занятия, которые ведет хотя бы один из указанных учителей
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: Номер возвращаемой страницы. первая страница - 1
 *      - in: query
 *        name: lessonsPerPage
 *        schema:
 *          type: integer
 *          minimum: 1
 *          default: 5
 *        description: Количество занятий на странице. По-умолчанию - 5 занятий
 *      - in: query
 *        name: studentsCount
 *        schema:
 *          type: string
 *          pattern: '^\d+(,\d+|)$'
 *        description:
 *          количество записанных на занятия учеников. либо одно число (тогда выбирается занятие с точным числом записанных),
 *          либо 2 числа через запятую, тогда они рассматриваются как диапазон и выбираются занятия с количеством записанных, попадающих в диапазон включительно
 *     responses:
 *       '200':
 *          description: OK
 *       '404':
 *          description: not found
 *       '400':
 *          description: invalid data
 */
router.get('/', validator.query(LessonsGetSchema), lessons.get);


/**
 * @swagger
 * /lessons:
 *   post:
 *     summary: метод создает одно или несколько занятий
 *     requestBody:
 *      content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                firstDate:
 *                  type: string
 *                  format: date
 *                lastDate:
 *                  type: string
 *                  format: date
 *                days:
 *                  type: array
 *                  items:
 *                    type: integer
 *                    minimum: 0
 *                    maximum: 6
 *                teacherIds:
 *                  type: array
 *                  items:
 *                    type: integer
 *                    minimum: 1
 *                    example: 1
 *                lessonsCount:
 *                  type: integer
 *                  minimum: 1
 *                  maximum: 300
 *     responses:
 *       '200':
 *          description: OK
 *       '400':
 *          description: invalid data
 */
router.post('/lessons', validator.body(LessonsSaveSchema), lessons.save);

export { router };