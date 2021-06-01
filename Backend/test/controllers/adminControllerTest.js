const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const {addWeek, formatDate} = require("../../helpers/dateHelper");
const User = require('../../models').User;

const assert = chai.assert;
chai.use(chaiHttp);
let admin_token, doe_token;

describe('ADMIN test', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login")
            .send({email: "leonfrederic@gmx.fr", password: "123123"})
            .end((err, res) => {
                admin_token = res.body.user.token;
            });

        chai.request(app).post("/api/auth/login")
            .send({email: "user2@gmx.fr", password: "123123"})
            .end((err, res) => {
                doe_token = res.body.user.token;
                done();
            });
    });

    describe('GET USERS', () => {
        it('get all users has admin', (done) => {
            chai.request(app).get("/api/admin/users")
                .set('Authorization', 'Bearer ' + admin_token)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.typeOf(res.body.rows, 'array');
                    assert.typeOf(res.body.paginate, 'object');
                    assert.isUndefined(res.body.rows[0].password);
                    done();
                });
        });

        it('get all users not admin', (done) => {
            chai.request(app).get("/api/admin/users")
                .set('Authorization', 'Bearer ' + doe_token)
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Requête inconnue.');
                    done();
                });
        });
    });

    describe('BAN user', () => {
        it('ban profil has admin', (done) => {
            chai.request(app).put("/api/admin/users/10/ban")
                .set('Authorization', 'Bearer ' + admin_token)
                .send({ UserId: 1, message : 'Parceque.'})
                .end((err, res) => {
                    assert.equal(res.status, 200);

                    User.findByPk(10).then(user => {
                        assert.equal(user.formatBanUntil, formatDate( addWeek(new Date())));
                        done();
                    }).catch(err => { console.log(err); done() });
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
            chai.request(app).get("/api/admin/comments")
                .set('Authorization', 'Bearer ' + admin_token)
                .send({UserId: 1})
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.typeOf(res.body.rows, 'array');
                    assert.typeOf(res.body.paginate, 'object');
                    done();
                });
        });

        it('get all comment not admin', (done) => {
            chai.request(app).get("/api/admin/comments")
                .set('Authorization', 'Bearer ' + doe_token)
                .send({UserId: 2})
                .end((err, res) => {
                    assert.equal(res.status, 401);
                    assert.equal(res.body.error, 'Requête inconnue.');
                    done();
                });
        });
    });
})
