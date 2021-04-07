const chai = require('chai');
const chaiHttp= require('chai-http');
const fs = require('fs');
const app = require('../../app');
const Post = require('../../models').Post;
const typePost = require('../../helpers/postType');

const assert = chai.assert;
chai.use(chaiHttp);
let postTestId, admin_token, doe_token;

describe('GET posts', () => {
    before((done) => {
        chai.request(app).post("/api/auth/login")
            .send({email: "leonfrederic@gmx.fr", password: "123123"})
            .end((err, res) => {
                admin_token = res.body.token;
            })
        ;

        chai.request(app).post("/api/auth/login")
            .send({email: "johndoe@gmx.fr", password: "123123"})
            .end((err, res) => {
                doe_token = res.body.token;
                done();
            })
        ;
    });

    it('get all posts', (done) => {
        chai.request(app).get("/api/posts")
            .set('Authorization', 'Bearer ' + admin_token)
            .send({UserId: 1})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                assert.notEqual(res.body[0].User, undefined);
                assert.isUndefined(res.body[0].password);

                Post.count().then(count => {
                    assert.equal(res.body.length, count);
                    done();
                }).catch(done);
            })
        ;
    });

    it('get all article', (done) => {
        chai.request(app).get("/api/posts/articles")
            .set('Authorization', 'Bearer ' + admin_token)
            .send({UserId: 1})
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                assert.notEqual(res.body[0].User, undefined);
                assert.isUndefined(res.body[0].password);

                Post.count({where: {type: 1}}).then(count => {
                    assert.equal(res.body.length, count);
                    done();
                }).catch(done);
            })
        ;
    });

    it('get specific post', (done) => {
        chai.request(app).get("/api/posts/1")
            .set('Authorization', 'Bearer ' + admin_token)
            .send({UserId: 1})
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
                UserId: 1,
                title : 'Nouveau post',
                content: 'Nouveau contenu',
                type: typePost.ARTICLE.id
            };

            chai.request(app).post("/api/posts")
                .set('Authorization', 'Bearer ' + admin_token)
                .send(create_post)
                .end((err, res) => {
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
            const post_data = { UserId: 1, type: typePost.IMAGE.id }
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
                        assert.equal(post_data.UserId, post.UserId);
                        // assert.isTrue(fs.existsSync(path.resolve(__dirname, './../..' + post.image)));
                        done();
                    }).catch(done);
                })
            ;
        });

        it('create image post to much info', (done) => {
            const post_data = { UserId: 1, type: typePost.IMAGE.id, title: 'test', content:'contenu test' }
            chai.request(app).post("/api/posts")
                .set('Authorization', 'Bearer ' + admin_token)
                .field('post', JSON.stringify(post_data))
                .attach('image', fs.readFileSync('./test/images/image_test.jpg'), 'image_test.jpg')
                .end((err, res) => {
                    assert.equal(res.status, 201);
                    assert.equal(res.body.message, 'Post enregistré !');

                    Post.findByPk(res.body.post.id).then(post => {
                        assert.equal(null, null);
                        assert.equal(null, null);
                        assert.equal(post_data.UserId, post.UserId);
                        // assert.isTrue(fs.existsSync(path.resolve(__dirname, '../' + post.image)));
                        done();
                    }).catch(done);
                })
            ;
        });

        it('update specific post', (done) => {
            const updated_post = {
                UserId : 1,
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
                UserId : 1,
                title : "Post de john doe modifié par l'admin",
                content: "Contenu de modifié par l'admin!"
            };

            chai.request(app).put("/api/posts/3").set('Authorization', 'Bearer ' + admin_token).send(updated_post).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Post modifié !');

                Post.findByPk(3).then(post => {
                    assert.equal(post.content, updated_post.content);
                    assert.equal(post.title, updated_post.title);
                    done();
                }).catch(done);
            });
        });

        it('update post from other', (done) => {
            const updated_post = {
                UserId : 2,
                title : 'Premier post modifié',
                content: 'Contenu modifié!'
            };

            chai.request(app).put("/api/posts/1").set('Authorization', 'Bearer ' + doe_token).send(updated_post).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });


        it('update unexist post', (done) => {
            const updated_post = {
                UserId: 1,
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
            chai.request(app).delete("/api/posts/" + postTestId).set('Authorization', 'Bearer ' + admin_token).send({UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Post supprimé !');
                done();
            });
        });

        it('supp specific as admin', (done) => {
            chai.request(app).delete("/api/posts/3").set('Authorization', 'Bearer ' + admin_token).send({UserId: 1}).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Post supprimé !');
                done();
            });
        });

        it('delete unexist specific post', (done) => {
            chai.request(app).delete("/api/posts/1231").set('Authorization', 'Bearer ' + admin_token).send({UserId: 1}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });

        it('supp specific post from other', (done) => {
            chai.request(app).delete("/api/posts/1").set('Authorization', 'Bearer ' + doe_token).send({UserId: 2}).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Le post est introuvable.');
                done();
            });
        });
    })

    describe('LIKE test', () => {
        it('like post', (done) => {
            const like = {
                UserId: 1,
                like: 1
            }

            chai.request(app).post("/api/posts/2/like").set('Authorization', 'Bearer ' + admin_token).send(like).end((err, res) => {
                assert.equal(res.status, 201);
                assert.equal(res.body.message, 'Like enregistré !');

                Post.findByPk(2).then(post => {
                    assert.equal(post.like, 1);
                    done();
                }).catch(done);
            });
        });

        it('change like', (done) => {
            const like = {
                UserId: 1,
                like: -1
            }

            chai.request(app).post("/api/posts/2/like").set('Authorization', 'Bearer ' + admin_token).send(like).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(2).then(post => {
                    assert.equal(post.like, 0);
                    assert.equal(post.dislike, 1);
                    done();
                }).catch(done);
            });
        });

        it('remove like', (done) => {
            const like = {
                UserId: 1,
                like: 0
            }

            chai.request(app).post("/api/posts/2/like").set('Authorization', 'Bearer ' + admin_token).send(like).end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.message, 'Like update !');

                Post.findByPk(2).then(post => {
                    assert.equal(post.like, 0);
                    done();
                }).catch(done);
            });
        });

        it('like unexist post', (done) => {
            const like = {
                UserId: 1,
                like: 0
            }

            chai.request(app).post("/api/posts/245/like").set('Authorization', 'Bearer ' + admin_token).send(like).end((err, res) => {
                assert.equal(res.status, 404);
                assert.equal(res.body.error, 'Post introuvable');
                done();
            });
        });

        it('like post two time', (done) => {
            const like = {
                UserId: 1,
                like: 1
            }

            chai.request(app).post("/api/posts/1/like").set('Authorization', 'Bearer ' + admin_token).send(like).end((err, res) => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Vous avez déjà voté!');
                done();
            });
        });
    });
})
