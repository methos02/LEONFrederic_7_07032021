const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const User = require('../../models').User;
const fs = require('fs');

const assert = chai.assert;
chai.use(chaiHttp);
let admin_token, admin, user_2_token, user_2, user_3_token, user_3;

describe('USER test', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login").send({email: "leonfrederic@gmx.fr", password: "123123"}).end((err, res) => {
            admin_token = res.body.user.token;
            admin = res.body.user;
        });

        chai.request(app).post("/api/auth/login").send({email: "user2@gmx.fr", password: "123123"}).end((err, res) => {
            user_2_token = res.body.user.token;
            user_2 = res.body.user;
        });

        chai.request(app).post("/api/auth/login").send({email: "user3@gmx.fr", password: "123123"}).end((err, res) => {
            user_3_token = res.body.user.token;
            user_3 = res.body.user;
            done();
        });

    });

    describe('UPDATE Profil test', () => {
        it('update profil', (done) => {
            const updated_profil = {
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/" + admin.id)
                .set('Authorization', 'Bearer ' + admin_token)
                .send(updated_profil)
                .end((err, res) => {
                    console.log(res.body);
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(admin.id).then(user => {
                        assert.equal(user.name, updated_profil.name);
                        assert.equal(user.email, updated_profil.email);
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update profil with avatar', (done) => {
            const updated_profil = {
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/" + admin.id)
                .set('Authorization', 'Bearer ' + admin_token)
                .field('user', JSON.stringify(updated_profil))
                .attach('avatar', fs.readFileSync('./test/images/image_test.jpg'), 'image_test.jpg')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(admin.id).then(user => {
                        assert.equal(user.name, updated_profil.name);
                        assert.equal(user.email, updated_profil.email);
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update profil from other has admin', (done) => {
            const updated_profil = {
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/" + user_2.id).set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur incompatible.');
                done();
            });
        });

        it('update profil from other not has admin', (done) => {
            const updated_profil = {
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/" + admin.id).set('Authorization', 'Bearer ' + user_2_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur incompatible.');
                done();
            });
        });

        it('update profil with existing email', (done) => {
            const updated_profil = {
                name: 'superAdmin',
                email: 'methos@gmx.fr'
            };

            chai.request(app).put("/api/profil/" + user_2.id).set('Authorization', 'Bearer ' + user_2_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 422);
                assert.equal(res.body.error, 'Adresse email déjà utilisée.');
                done();
            });
        });
    });

    describe('UPDATE password test', () => {
        it('update password', (done) => {
            const updated_profil = {
                old: '123123',
                password: '234567',
                confirm: '234567',
            };

            chai.request(app).put("/api/profil/" + admin.id + "/password").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Mot de passe modifié.');

                chai.request(app).post("/api/auth/login").send({email: 'leonfrederic@gmx.com', password: "234567"}).end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
            });
        });

        it('update password from other', (done) => {
            const updated_profil = {
                old: '123123',
                password: '234567',
                confirm: '234567',
            };

            chai.request(app).put("/api/profil/" + user_2.id +"/password").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur incompatible.');
                done();
            });
        });
    });

    describe('DELETE user', () => {
        it('delete profil', (done) => {
            chai.request(app).delete("/api/profil/" + user_3.id).set('Authorization', 'Bearer ' + user_3_token).send({UserId: 3}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Votre profil a été supprimé.');
                done();
            });
        });

        it('supp profil from other has admin', (done) => {
            chai.request(app).delete("/api/profil/" + user_2.id).set('Authorization', 'Bearer ' + admin_token).send({ UserId: 1}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur introuvable.');
                done();
            });
        });
    });
})
