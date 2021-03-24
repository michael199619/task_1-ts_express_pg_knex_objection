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
 *     summary: Method «/», which is used to search lessons and return the array of objects
 *     parameters:
 *      - in: query
 *        name: date
 *        schema:
 *          type: string
 *          pattern: '^\d{4}-\d{2}-\d{2}(,\d{4}-\d{2}-\d{2}|)$'
 *        description:
 *          Date of lesson. format YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD (example 2019-01-01,2019-09-01).
 *          If there is one date, then it’s needed to select lessons for this date.
 *          If there are two dates, then select lessons for the period, using these dates
 *      - in: query
 *        name: status
 *        schema:
 *          type: integer
 *          enum: [0, 1]
 *          default: 0
 *        description: Status of lesson. values are 0 (not passed), 1 (passed)
 *      - in: query
 *        name: teacherIds
 *        schema:
 *          type: array
 *          items:
 *            type: integer
 *        description: Id of teachers through comma. All lessons, which at least one of these teachers conduct are selected
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: Number of page. First page - 1
 *      - in: query
 *        name: lessonsPerPage
 *        schema:
 *          type: integer
 *          minimum: 1
 *          default: 5
 *        description: Count of lessons at page. Default — 5
 *      - in: query
 *        name: studentsCount
 *        schema:
 *          type: string
 *          pattern: '^\d+(,\d+|)$'
 *        description:
 *          Count of students.
 *          If there is one number then lessons with the exact count of students are selected,
 *          if there are two numbers (through comma) then they are considered as range.
 *          Lessons with count in the range inclusive are selected
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
 *     summary: Method creates one or any lessons
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