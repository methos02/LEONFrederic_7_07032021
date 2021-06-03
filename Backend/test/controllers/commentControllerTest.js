const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const typePost = require("../../helpers/postType");
const {Comment, Post} = require('../../config/database');
const {Op} = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);
let commentTestId, admin, admin_token, user, user_token;

describe('GET Comments', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login").send({email: "admin@groupomania.com", password: "123123"}).end((err, res) => {
            admin = res.body.user;
            admin_token = res.body.user.token;
        });

        chai.request(app).post("/api/auth/login").send({email: "user2@groupomania.com", password: "123123"}).end((err, res) => {
            user = res.body.user;
            user_token = res.body.user.token;
            done();
        });
    });

    it('create comment', (done) => {
        Post.findOne({where: {type: typePost.ARTICLE.id}}).then(post => {
            const create_comment = {
                PostId: post.id,
                UserId: admin.id,
                content: 'Nouveau contenu'
            };

            chai.request(app).post("/api/comments").set('Authorization', 'Bearer ' + admin_token).send(create_comment).end((err, res) => {
                assert.equal(res.status, 201);
                assert.equal(res.body.message, 'Commentaire posté.');
                assert.notEqual(res.body.comment.id, undefined);

                Comment.findByPk(res.body.comment.id).then(comment => {
                    commentTestId = comment.id;
                    assert.equal(comment.content, create_comment.content);
                    assert.equal(comment.title, create_comment.title);
                    done();
                }).catch(err => { console.log(err); done() });
            });
        });
    });

    it('create comment unexisting post', (done) => {
        const create_comment = {
            PostId: 255,
            UserId: admin.id,
            content: 'Nouveau contenu'
        };

        chai.request(app).post("/api/comments")
            .set('Authorization', 'Bearer ' + admin_token)
            .send(create_comment)
            .end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Post introuvable!');
                done()
            })
        ;
    });


    describe('UPDATE test', () => {
        it('update specific comment', (done) => {
            const updated_comment = { content: 'Contenu modifié!' };

            chai.request(app).put("/api/comments/" + commentTestId).set('Authorization', 'Bearer ' + admin_token).send(updated_comment).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Commentaire modifié.');

                Comment.findByPk(commentTestId).then(comment => {
                    assert.equal(comment.content, updated_comment.content);
                    done();
                }).catch(err => { console.log(err); done() });
            });
        });

        it('update specific comment has admin', (done) => {
            const updated_comment = { content: "Contenu modifié par l'admin!" };

            Comment.findOne({ where : {UserId : {[Op.ne]: admin.id}}}).then( comment => {
                chai.request(app).put("/api/comments/" + comment.id).set('Authorization', 'Bearer ' + admin_token).send(updated_comment).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Commentaire modifié.');

                    Comment.findByPk(comment.id).then(comment => {
                        assert.equal(comment.content, updated_comment.content);
                        done();
                    }).catch(err => { console.log(err); done() });
                });
            }).catch(err => { console.log(err); done() })
        });

        it('update comment from other', (done) => {
            const updated_comment = { content: 'Contenu modifié!' };

            Comment.findOne({ where : {UserId : {[Op.ne]: user.id}}}).then( comment => {
                chai.request(app).put("/api/comments/" + comment.id).set('Authorization', 'Bearer ' + user_token).send(updated_comment).end((err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Le commentaire est introuvable.');
                    done();
                });
            }).catch(err => { console.log(err); done() });
        });

        it('update unexist comment', (done) => {
            const updated_comment = {
                content: 'Contenu modifié!'
            };

            chai.request(app).put("/api/comments/875").set('Authorization', 'Bearer ' + admin_token).send(updated_comment).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le commentaire est introuvable.');
                done();
            });
        });
    });

    describe('DELETE comment', () => {
        it('delete specific comment', (done) => {
            chai.request(app).delete("/api/comments/" + commentTestId).set('Authorization', 'Bearer ' + admin_token).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Commentaire supprimé.');
                done();
            });
        });

        it('supp comment has admin', (done) => {
            chai.request(app).delete("/api/comments/2").set('Authorization', 'Bearer ' + admin_token).send({ UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Commentaire supprimé.');
                done();
            });
        });

        it('supp unexist comment', (done) => {
            chai.request(app).delete("/api/comments/451").set('Authorization', 'Bearer ' + admin_token).send({ UserId: 1}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le commentaire est introuvable.');
                done();
            });
        });

        it('supp comment from other', (done) => {
            Comment.findOne({ where: { UserId : {[Op.ne]: user.id}}}).then( comment => {
                chai.request(app).delete("/api/comments/" + comment.id)
                    .set('Authorization', 'Bearer ' + user_token)
                    .end((err, res) => {
                        assert.equal(res.status, 404);
                        assert.equal(res.body.error, 'Le commentaire est introuvable.');
                        done();
                    });
            }).catch( done );
        });
    })
})
