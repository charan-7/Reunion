const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const server = require('../index');

dotenv.config();

chai.use(chaiHttp);
chai.should();

function getToken(body){
    const { email, password } = body;
    const token = jwt.sign({
        email: email,
        password: password,
    }, process.env.TOKEN_SECRET, { 
        expiresIn: '1800s' 
    });
    return token;
}

const body = {
    email: 'ram@gmail.com',
    password: 'password@123'
}
const token = getToken(body);

describe('testing all api endpoints', function(){
    //login api
    describe('testing user login', function(){
        it('POST request for login user', (done) => {
            chai.request(server)
            .post('/api/authenticate/')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                done();
            });
        }).timeout(10000);
    });

    // fetch user profile
    describe('testing user profile', function(){
        it('GET request to fetch user profile', (done) => {
            chai.request(server)
            .get('/api/user/')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('email');
                res.body.should.have.property('followers');
                res.body.should.have.property('following');
                done();
            });
        }).timeout(10000);
    });

    // post api for creating a new post
    describe('testing post creation api', function(){
        // post request for successfull post creation
        it('POST request to create a post', (done) => {
            const postBody = {
                title: 'cricket',
                description: 'invented by england'
            }
            chai.request(server)
            .post('/api/posts/')
            .auth(token, { type: 'bearer' })
            .send(postBody)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('postId');
                res.body.should.have.property('title');
                res.body.should.have.property('description');
                res.body.should.have.property('createdTime');
                done();
            });
        }).timeout(10000);

        // any errors at the time of creating a post
        it('POST request if creation of post is failed', (done) => {
            const postBody = {
                title: 'cricket',
                description: 'invented by england'
            }
            chai.request(server)
            .post('/api/post/')
            .auth(token, { type: 'bearer' })
            .send(postBody)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    // post request for creating a comment for post
    describe('testing comment creation api', function(){
        it('POST request to create a comment for post', (done) => {
            const postId = '63766d3636aa40b71d0faf84';
            const commentBody = {
                message: 'nice game to play with friends'
            }
            chai.request(server)
            .post('/api/comment/' + postId)
            .auth(token, { type: 'bearer' })
            .send(commentBody)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('commentId');
                done();
            });
        }).timeout(10000);

        it('POST request for creating a comment which doesnot have proper post id', (done) => {
            const postId = '1';
            const commentBody = {
                message: 'nice game to play with friends'
            }
            chai.request(server)
            .post('/api/comment/' + postId)
            .auth(token, { type: 'bearer' })
            .send(commentBody)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });

    // get request for post by specific post id
    describe('testing post api by post id', function(){
        it('GET request for getting post by postId', (done) => {
            const postId = '63766d3636aa40b71d0faf84';
            chai.request(server)
            .get('/api/posts/' + postId)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('id');
                res.body.should.have.property('likeCount');
                res.body.should.have.property('commentCount');
                done();
            });
        }).timeout(10000);

        it('GET request for not getting post by postId if no proper postId is provided', (done) => {
            const postId = '1';
            chai.request(server)
            .get('/api/posts/' + postId)
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
        });
    });
})