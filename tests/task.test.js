const request = require('supertest')

const app = require('../src/app')
const db = require('../tests/fixtures/db')

const Task = require('../src/models/task')

beforeAll(async () => {
    await db.setup()
})

test('Should create task for a user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send({ description: 'Learn Node.js' })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should get two tasks for a user', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send()
        .expect(200)

    expect(response.body.length).toBe(2)
})

test('Should delete task for a user', async () => {
    const response = await request(app)
        .delete('/tasks/' + db.task._id)
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send()
        .expect(200)

    const task = await Task.findById(response.body._id)
    expect(task).toBeNull()
})