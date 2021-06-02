const chai = require('chai');
const chaiHttp= require('chai-http');
const fs = require('fs');
const app = require('../../app');
const {Post} = require('../../config/database');
const typePost = require('../../helpers/postType');
const {Op} = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);
let articleTest, admin, admin_token, user, user_token;

describe('GET posts', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login")
            .send({email: "leonfrederic@gmx.fr", password: "123123"})
            .end((err, res) => {
                admin = res.body.user;
                admin_token = res.body.user.token;
            })
        ;

        chai.request(app).post("/api/auth/login")
            .send({email: "user2@gmx.fr", password: "123123"})
            .end((err, res) => {
                user = res.body.user;
                user_token = res.body.user.token;
                done();
            })
        ;
    });

    it('get all posts', (done) => {
        chai.request(app).get("/api/posts")
            .set('Authorization', 'Bearer ' + admin_token)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body.rows, 'array');
                assert.notEqual(res.body.paginate, 'object');
                done();
            })
        ;
    });

    it('get specific post', (done) => {
        Post.findOne({ where : { type : typePost.ARTICLE.id}}).then( post => {
            chai.request(app).get("/api/posts/" + post.slug)
                .set('Authorization', 'Bearer ' + admin_token)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.notEqual(res.body.User, undefined);
                    assert.isUndefined(res.body.User.password);
                    assert.equal(res.body.title, post.title);
                    done();
                })
        }).catch(err => { console.log(err); done() })
        ;
    });

    describe('STORE post test', () => {
        it('create article post', (done) => {
            const create_post = {
                title : 'Nouveau post',
                content: 'Nouveau contenu',
                type: typePost.ARTICLE.id.toString()
            };

            chai.request(app).post("/api/posts")
                .set('Authorization', 'Bearer ' + admin_token)
                .send(create_post)
                .end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Post enregistré !');

                    Post.findByPk(res.body.post.id).then(article => {
                        articleTest = article;
                        assert.equal(create_post.content, article.content);
                        assert.equal(create_post.title, article.title);
                        done();
                    }).catch(err => { console.log(err); done() });
                })
            ;
        });

        it('create image post', (done) => {
            const post_data = { type: typePost.IMAGE.id.toString() }
            chai.request(app).post("/api/posts")
                .set('Authorization', 'Bearer ' + admin_token)
                .field('post', JSON.stringify(post_data))
                .attach('image', fs.readFileSync('./test/images/image_test.jpg'), 'image_test.jpg')
                .end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Post enregistré !');

                    Post.findByPk(res.body.post.id).then(post => {
                        assert.equal(null, post.title);
                        assert.equal(null, post.content);
                        done();
                    }).catch(err => { console.log(err); done() });
                })
            ;
        });

        it('update specific post', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!',
                type: articleTest.type.toString()
            };

            chai.request(app).put("/api/posts/" + articleTest.id)
                .set('Authorization', 'Bearer ' + admin_token)
                .send(updated_post)
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Post modifié !');

                    Post.findByPk(articleTest.id).then(post => {
                        assert.equal(post.content, updated_post.content);
                        assert.equal(post.title, updated_post.title);
                        done();
                    }).catch(err => { console.log(err); done() });
                });
        });

        it('update specific post has admin', (done) => {
            const updated_post = {
                title : "Post de john doe modifié par l'admin",
                content: "Contenu de modifié par l'admin!",
                type : articleTest.type.toString()
            };

            Post.findOne({where: {UserId : {[Op.ne]: admin.id, type: typePost.ARTICLE.id}}}).then( post => {
                chai.request(app).put("/api/posts/" + articleTest.id)
                    .set('Authorization', 'Bearer ' + admin_token)
                    .send(updated_post)
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.message, 'Post modifié !');

                        Post.findByPk(articleTest.id).then(post => {
                            assert.equal(post.content, updated_post.content);
                            assert.equal(post.title, updated_post.title);
                            done();
                        }).catch(err => { console.log(err); done() });
                    });
            }).catch(err => { console.log(err); done() });
        });

        it('update post from other', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!',
                type: articleTest.type.toString()
            };

            Post.findOne({where: {UserId : {[Op.ne]: user.id}}}).then( post => {
                chai.request(app)
                    .put("/api/posts/" + post.id).set('Authorization', 'Bearer ' + user_token)
                    .send(updated_post)
                    .end((err, res) => {
                        assert.equal(res.status, 404);
                        assert.equal(res.body.error, 'Le post est introuvable.');
                        done();
                    });
            }).catch(err => { console.log(err); done() });
        });

        it('update unexist post', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!',
                type: articleTest.type.toString()
            };

            chai.request(app).put("/api/posts/14557").set('Authorization', 'Bearer ' + admin_token).send(updated_post).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });
    })

    describe('DELETE test', () => {
        it('delete specific post', (done) => {
            chai.request(app).delete("/api/posts/" + articleTest.id).set('Authorization', 'Bearer ' + admin_token).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Post supprimé !');
                done();
            });
        });

        it('supp specific as admin', (done) => {
            Post.findOne({where: {type: typePost.ARTICLE.id}}).then(post => {
                chai.request(app).delete("/api/posts/" + post.id).set('Authorization', 'Bearer ' + admin_token).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Post supprimé !');
                    done();
                });
            });
        });

        it('delete unexist specific post', (done) => {
            chai.request(app).delete("/api/posts/1231").set('Authorization', 'Bearer ' + admin_token).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });

        it('supp specific post from other', (done) => {
            chai.request(app).delete("/api/posts/1").set('Authorization', 'Bearer ' + user_token).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });
    })

    describe('LIKE test', () => {
        it('like post', (done) => {
            Post.findOne({where: {type: typePost.ARTICLE.id}}).then(post => {
                articleTest = post;
                chai.request(app).post("/api/posts/" + articleTest.id + "/like").set('Authorization', 'Bearer ' + admin_token).send({like: 1}).end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Like enregistré !');

                    Post.findByPk( articleTest.id ).then(post => {
                        assert.equal(post.likes, articleTest.likes + 1);
                        done();
                    }).catch(err => { console.log(err); done() });
                });
            });
        });

        it('change like', (done) => {
            chai.request(app).post("/api/posts/" + articleTest.id + "/like").set('Authorization', 'Bearer ' + admin_token).send({ like: -1 }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(articleTest.id).then(post => {
                    assert.equal(post.likes, articleTest.likes);
                    assert.equal(post.dislikes, articleTest.dislikes + 1);
                    done();
                }).catch(err => { console.log(err); done() });
            });
        });

        it('remove like', (done) => {
            chai.request(app).post("/api/posts/" + articleTest.id + "/like").set('Authorization', 'Bearer ' + admin_token).send({ like: -1 }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(articleTest.id).then(post => {
                    assert.equal(post.dislikes, articleTest.dislikes);
                    done();
                }).catch(err => { console.log(err); done() });
            });
        });

        it('like unexist post', (done) => {
            chai.request(app).post("/api/posts/245/like").set('Authorization', 'Bearer ' + admin_token).send({ like: 1 }).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Post introuvable');
                done();
            });
        });
    });
})
