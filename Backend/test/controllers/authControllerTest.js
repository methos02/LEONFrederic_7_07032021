const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');

const assert = chai.assert;
chai.use(chaiHttp);

describe('test auth controller', () => {
    it('signup', (done) => {
        const signup_data = {
            name: "Methos Sengien",
            email: 'methos@gmx.fr',
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
            name: "LEON Frédéric",
            email: 'leonfrederic@gmx.fr',
            password: "123123",
            confirm: "123123"
        }

        chai.request(app).post("/api/auth/signup").send(duplicate_user).end((err, res) => {
            assert.equal(res.status, 400);
            done();
        });
    });

    it('login', (done) => {
        const login_data = {
            email: 'leonfrederic@gmx.fr',
            password: '123123'
        }

        chai.request(app).post("/api/auth/login").send(login_data).end((err, res) => {
            assert.equal(res.status, 200);
            assert.exists(res.body.user);
            assert.hasAllKeys(res.body.user, ['id', 'name', 'avatarPath', 'email', 'roles', 'likes', 'token']);
            done();
        });
    });
})
