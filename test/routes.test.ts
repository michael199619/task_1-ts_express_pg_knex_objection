import app from '../src/app';

const supertest = require('supertest');

describe('Endpoints', () => {
    const request = supertest(app);

    it('get', async () => {
        await request.get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    });

    it('post', async () => {
        await request.post('/lessons')
            .expect('Content-Type', /json/)
            .expect(200)
    });
})
