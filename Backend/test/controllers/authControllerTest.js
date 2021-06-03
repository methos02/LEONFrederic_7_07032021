const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');

const assert = chai.assert;
chai.use(chaiHttp);

describe('test auth controller', () => {
    it('signup', (done) => {
        const signup_data = {
            lastname: "Methos",
            firstname: "Sengien",
            email: 'methos@groupomania.com',
            password: "123123",
            confirm: "123123"
        }

        chai.request(app).post("/api/auth/signup").send(signup_data).end((err, res) => {
            assert.equal(res.status, 201);
            done();
        });
    });

    it('signup existing email', (done) => {
        const duplicate_user = {
            lastname:  "LEON",
            firstname: "Frédéric",
            email: 'admin@groupomania.com',
            password: "123123",
            confirm: "123123"
        }

        chai.request(app).post("/api/auth/signup").send(duplicate_user).end((err, res) => {
            assert.equal(res.status, 400);
            assert.hasAllKeys(res.body, 'email');
            done();
        });
    });

    it('login', (done) => {
        const login_data = {
            email: 'admin@groupomania.com',
            password: '123123'
        }

        chai.request(app).post("/api/auth/login").send(login_data).end((err, res) => {
            assert.equal(res.status, 200);
            assert.exists(res.body.user);
            assert.hasAllKeys(res.body.user, ['id', 'lastname', 'firstname', 'name', 'avatarPath', 'email', 'roles', 'likes', 'token']);
            done();
        });
    });
})
