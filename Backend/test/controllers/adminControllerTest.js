const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const User = require('../../models').User;
const Comment = require('../../models').Comment;

const assert = chai.assert;
chai.use(chaiHttp);
let admin_token, doe_token;

describe('ADMIN test', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login").send({email: "leonfrederic@gmx.fr", password: "123123"}).end((err, res) => {
            admin_token = res.body.token;
        });

        chai.request(app).post("/api/auth/login").send({email: "johndoe@gmx.fr", password: "123123"}).end((err, res) => {
            doe_token = res.body.token;
            done();
        });
    });

    describe('GET USERS', () => {
        it('get all users has admin', (done) => {
            chai.request(app).get("/api/admin/users").set('Authorization', 'Bearer ' + admin_token).send({UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                assert.isUndefined(res.body[0].password);

                User.count().then(count => {
                    assert.equal(res.body.length, count);
                    done();
                }).catch(done);
            });
        });

        it('get all users not admin', (done) => {
            chai.request(app).get("/api/admin/users").set('Authorization', 'Bearer ' + doe_token).send({UserId: 2}).end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Requête inconnue.');
                done();
            });
        });
    });

    describe('BAN user', () => {
        it('ban profil has admin', (done) => {
            const date_ban = new Date();

            chai.request(app).put("/api/admin/users/2/ban").set('Authorization', 'Bearer ' + admin_token).send({ UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, "Le profil est banni jusqu'au " + date_ban.getDate() + ".");
                done();
            });
        });

        it('ban profil has not admin', (done) => {
            chai.request(app).put("/api/admin/users/1/ban").set('Authorization', 'Bearer ' + doe_token).send({ UserId: 2}).end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Requête inconnue.');
                done();
            });
        });
    })

    describe('GET COMMENTS', () => {
        it('get all comment has admin', (done) => {
            chai.request(app).get("/api/admin/comments").set('Authorization', 'Bearer ' + admin_token).send({UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');

                Comment.count().then(count => {
                    assert.equal(res.body.length, count);
                    done();
                }).catch(done);
            });
        });

        it('get all comment not admin', (done) => {
            chai.request(app).get("/api/admin/comments").set('Authorization', 'Bearer ' + doe_token).send({UserId: 2}).end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Requête inconnue.');
                done();
            });
        });
    });
})
