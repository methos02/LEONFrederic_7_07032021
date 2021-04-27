const chai = require('chai');
const chaiHttp= require('chai-http');
const fs = require('fs');
const app = require('../../app');
const Post = require('../../models').Post;
const typePost = require('../../helpers/postType');
const {Op} = require("sequelize");

const assert = chai.assert;
chai.use(chaiHttp);
let postTestId, admin, admin_token, user, user_token;

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
        chai.request(app).get("/api/posts/1")
            .set('Authorization', 'Bearer ' + admin_token)
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.notEqual(res.body.User, undefined);
                assert.isUndefined(res.body.User.password);

                Post.findByPk(1).then(post => {
                    assert.equal(res.body.title, post.title);
                    done();
                }).catch(done);
            })
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
                    console.log(res.body)
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Post enregistré !');

                    Post.findByPk(res.body.post.id).then(post => {
                        postTestId = post.id;
                        assert.equal(create_post.content, post.content);
                        assert.equal(create_post.title, post.title);
                        done();
                    }).catch(done);
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
                        // assert.isTrue(fs.existsSync(path.resolve(__dirname, './../..' + post.image)));
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update specific post', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!'
            };

            chai.request(app).put("/api/posts/" + postTestId).set('Authorization', 'Bearer ' + admin_token).send(updated_post).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Post modifié !');

                Post.findByPk(postTestId).then(post => {
                    assert.equal(post.content, updated_post.content);
                    assert.equal(post.title, updated_post.title);
                    done();
                }).catch(done);
            });
        });

        it('update specific post has admin', (done) => {
            const updated_post = {
                title : "Post de john doe modifié par l'admin",
                content: "Contenu de modifié par l'admin!"
            };

            Post.findOne({where: {UserId : {[Op.ne]: admin.id, type: typePost.ARTICLE.id}}}).then( post => {
                chai.request(app).put("/api/posts/" + post.id).set('Authorization', 'Bearer ' + admin_token).send(updated_post).end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.message, 'Post modifié !');

                    Post.findByPk(post.id).then(post => {
                        assert.equal(post.content, updated_post.content);
                        assert.equal(post.title, updated_post.title);
                        done();
                    }).catch(done);
                }).catch(err => { console.log(err); done() });
            }).catch(err => { console.log(err); done() });
        });

        it('update post from other', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!'
            };

            Post.findOne({where: {UserId : {[Op.ne]: user.id}}}).then( post => {
                console.log(post.UserId, user.id);
                chai.request(app).put("/api/posts/" + post.id).set('Authorization', 'Bearer ' + user_token).send(updated_post).end((err, res) => {
                    assert.equal(res.status, 404);
                    assert.equal(res.body.error, 'Le post est introuvable.');
                    done();
                });
            }).catch(err => { console.log(err); done() });
        });

        it('update unexist post', (done) => {
            const updated_post = {
                title : 'Premier post modifié',
                content: 'Contenu modifié!'
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
            chai.request(app).delete("/api/posts/" + postTestId).set('Authorization', 'Bearer ' + admin_token).end((err, res) => {
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
                postTestId = post.id;
                chai.request(app).post("/api/posts/" + postTestId + "/like").set('Authorization', 'Bearer ' + admin_token).send({like: 1}).end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Like enregistré !');

                    Post.findByPk( postTestId ).then(post => {
                        assert.equal(post.likes, 1);
                        done();
                    }).catch(done);
                });
            });
        });

        it('change like', (done) => {
            chai.request(app).post("/api/posts/" + postTestId + "/like").set('Authorization', 'Bearer ' + admin_token).send({ like: -1 }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(postTestId).then(post => {
                    assert.equal(post.likes, 0);
                    assert.equal(post.dislikes, 1);
                    done();
                }).catch(done);
            });
        });

        it('remove like', (done) => {
            chai.request(app).post("/api/posts/" + postTestId + "/like").set('Authorization', 'Bearer ' + admin_token).send({ like: -1 }).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(postTestId).then(post => {
                    assert.equal(post.dislikes, 0);
                    done();
                }).catch(done);
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
