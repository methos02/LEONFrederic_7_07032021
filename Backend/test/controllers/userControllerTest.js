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
                lastname: 'super',
                firstname: 'admin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil")
                .set('Authorization', 'Bearer ' + admin_token)
                .send(updated_profil)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(admin.id).then(user => {
                        assert.equal(user.name, updated_profil.lastname.toUpperCase() + ' ' + updated_profil.firstname[0].toUpperCase() + updated_profil.firstname.substring(1));
                        assert.equal(user.email, updated_profil.email);
                        done();
                    }).catch(err => { console.log(err); done() });
                })
            ;
        });

        it('update profil with avatar', (done) => {
            const updated_profil = {
                lastname: 'super',
                firstname: 'admin',
                email: 'leonfrederic@gmx.com'
            };

            chai.request(app).put("/api/profil")
                .set('Authorization', 'Bearer ' + admin_token)
                .field('user', JSON.stringify(updated_profil))
                .attach('avatar', fs.readFileSync('./test/images/image_test.jpg'), 'image_test.jpg')
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Profil modifié.');

                    User.findByPk(admin.id).then(user => {
                        assert.equal(user.name, updated_profil.lastname.toUpperCase() + ' ' + updated_profil.firstname[0].toUpperCase() + updated_profil.firstname.substring(1));
                        assert.equal(user.email, updated_profil.email);
                        done();
                    }).catch(err => { console.log(err); done() });
                })
            ;
        });

        it('update profil with existing email', (done) => {
            User.findByPk(6).then( user => {
                const updated_profil = {
                    lastname: 'super',
                    firstname: 'admin',
                    email: user.email
                };

                chai.request(app).put("/api/profil").set('Authorization', 'Bearer ' + user_2_token)
                    .send(updated_profil)
                    .end((err, res) => {
                    assert.equal(res.status, 422);
                    assert.equal(res.body.error, 'Adresse email déjà utilisée.');
                    done();
                });

            }).catch(err => { console.log(err); done() });
        });
    });

    describe('UPDATE password test', () => {
        it('update password', (done) => {
            const updated_profil = {
                old: '123123',
                password: '234567',
                confirm: '234567',
            };

            chai.request(app).put("/api/profil/password").set('Authorization', 'Bearer ' + admin_token).send(updated_profil).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Mot de passe modifié.');

                chai.request(app).post("/api/auth/login").send({email: 'leonfrederic@gmx.com', password: "234567"}).end((err, res) => {
                    assert.equal(res.status, 200);
                    done();
                });
            });
        });
    });

    describe('DELETE user', () => {
        it('delete profil', (done) => {
            chai.request(app).delete("/api/profil/").set('Authorization', 'Bearer ' + user_3_token).send({UserId: 3}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Votre profil a été supprimé.');
                done();
            });
        });
    });
})
