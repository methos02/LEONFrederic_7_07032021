const chai = require('chai');
const chaiHttp= require('chai-http');
const app = require('../../app');
const typePost = require("../../helpers/postType");
const Comment = require('../../models').Comment;
const Post = require('../../models').Post;

const assert = chai.assert;
chai.use(chaiHttp);
let commentTestId, admin, admin_token, doe_token;

describe('GET Comments', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login").send({email: "leonfrederic@gmx.fr", password: "123123"}).end((err, res) => {
            admin = res.body.user;
            admin_token = res.body.user.token;
        });

        chai.request(app).post("/api/auth/login").send({email: "user2@gmx.fr", password: "123123"}).end((err, res) => {
            doe_token = res.body.user.token;
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
                }).catch(done);
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
            const updated_comment = {
                content: 'Contenu modifié!',
                UserId: admin.id,
            };

            chai.request(app).put("/api/comments/" + commentTestId).set('Authorization', 'Bearer ' + admin_token).send(updated_comment).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Commentaire modifié.');

                Comment.findByPk(commentTestId).then(comment => {
                    assert.equal(comment.content, updated_comment.content);
                    done();
                }).catch(done);
            });
        });

        it('update specific comment has admin', (done) => {
            const updated_comment = {
                UserId: admin.id,
                content: "Contenu modifié par l'admin!"
            };

            chai.request(app).put("/api/comments/2").set('Authorization', 'Bearer ' + admin_token).send(updated_comment).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Commentaire modifié.');

                Comment.findByPk(2).then(comment => {
                    assert.equal(comment.content, updated_comment.content);
                    done();
                }).catch(done);
            });
        });

        it('update comment from other', (done) => {
            const updated_comment = {
                UserId: admin.id,
                content: 'Contenu modifié!'
            };

            chai.request(app).put("/api/comments/1").set('Authorization', 'Bearer ' + doe_token).send(updated_comment).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le commentaire est introuvable.');
                done();
            });
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
            chai.request(app).delete("/api/comments/1").set('Authorization', 'Bearer ' + doe_token).send({ UserId: 2}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le commentaire est introuvable.');
                done();
            });
        });
    })
})
