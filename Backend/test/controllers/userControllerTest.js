const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const User = require('../../models').User;
const fs = require('fs');
const path = require('path');

const assert = chai.assert;
chai.use(chaiHttp);
let admin_token, doe_token, methos_token;

describe('USER test', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login").send({email: "leonfrederic@gmx.fr", password: "123123"}).end((err, res) => {
            admin_token = res.body.token;
        });

        chai.request(app).post("/api/auth/login").send({email: "johndoe@gmx.fr", password: "123123"}).end((err, res) => {
            doe_token = res.body.token;
        });

        chai.request(app).post("/api/auth/login").send({email: "methos@gmx.fr", password: "123123"}).end((err, res) => {
            methos_token = res.body.token;
            done();
        });

    });

    describe('UPDATE Profil test', () => {
        it('update profil', (done) => {
            const updated_profil = {
                UserId: 1,
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/1")
                .set('Authorization', 'Bearer ' + admin_token)
                .send(updated_profil)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(1).then(user => {
                        assert.equal(user.name, updated_profil.name);
                        assert.equal(user.mail, updated_profil.mail);
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update profil with avatar', (done) => {
            const updated_profil = {
                UserId: 1,
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/1")
                .set('Authorization', 'Bearer ' + admin_token)
                .field('user', JSON.stringify(updated_profil))
                .attach('avatar', fs.readFileSync('./test/images/image_test.jpg'), 'image_test.jpg')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(1).then(user => {
                        assert.equal(user.name, updated_profil.name);
                        assert.equal(user.email, updated_profil.email);
                        // console.log(fs.readdirSync(path.resolve(__dirname, './../../images/avatar')));
                        // assert.isTrue(fs.existsSync(path.resolve(__dirname, '../' + user.avatar)));
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update profil from other has admin', (done) => {
            const updated_profil = {
                UserId: 1,
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/2").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur incompatible.');
                done();
            });
        });

        it('update profil from other not has admin', (done) => {
            const updated_profil = {
                UserId: 2,
                name: 'superAdmin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil/1").set('Authorization', 'Bearer ' + doe_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur incompatible.');
                done();
            });
        });

        it('update profil with existing email', (done) => {
            const updated_profil = {
                UserId: 2,
                name: 'superAdmin',
                email: 'methos@gmx.fr'
            };

            chai.request(app).put("/api/profil/2").set('Authorization', 'Bearer ' + doe_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 422);
                assert.equal(res.body.error, 'Adresse email déjà utilisée.');
                done();
            });
        });
    });

    describe('UPDATE password test', () => {
        it('update password', (done) => {
            const updated_profil = {
                UserId: 1,
                password: '234567',
                confirm: '234567',
            };

            chai.request(app).put("/api/profil/1/password").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
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
                UserId: 1,
                password: '234567',
                confirm: '234567',
            };

            chai.request(app).put("/api/profil/2/password").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur introuvable.');
                done();
            });
        });
    });

    describe('DELETE user', () => {
        it('delete profil', (done) => {
            chai.request(app).delete("/api/profil/3").set('Authorization', 'Bearer ' + methos_token).send({UserId: 3}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Votre profil a été supprimé.');
                done();
            });
        });

        it('supp profil from other has admin', (done) => {
            chai.request(app).delete("/api/profil/2").set('Authorization', 'Bearer ' + admin_token).send({ UserId: 1}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Utilisateur introuvable.');
                done();
            });
        });
    });
})
