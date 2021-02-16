const request = require('supertest')

const app = require('../src/app')
const db = require('../tests/fixtures/db')

const User = require('../src/models/user')

beforeAll(async () => {
    await db.setup()
})

test('Should sign up a user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Test user',
            email: 'test@test.com',
            password: 'whoops000@@@'
        })
        .expect(201)
    
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('Should login a user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: 'adnan.hebibovic@gmail.com',
            password: 'reactjs12345!!'
        })
        .expect(200)

    const user = await User.findById(response.body.user._id)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login a user with bad password', async () => {
    await request(app).post('/users/login').send({
        email: 'adnan.hebibovic@gmail.com',
        password: 'this is not my password'
    }).expect(400)
})

test('Should get user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send({ name: 'Adnan Hebibovic', age: 41 })
        .expect(200)

    const user = await User.findById(db.user._id)
    expect(user.name).toBe('Adnan Hebibovic')
    expect(user.age).toBe(41)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send({ location: 'Sarajevo, Bosnia and Herzegovina' })
        .expect(500)
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + db.user.tokens[0].token)
        .send()
        .expect(200)

    const user = await User.findById(db.user._id)

    expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


