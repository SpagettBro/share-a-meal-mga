const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
let database = []

chai.should()
chai.use(chaiHttp)

describe('Manage users', ()=>{
    describe('UC-201 add movies /api/user',() => {
        beforeEach((done)=>{
            database = []
            done()
        })

        it('When a required input is missing, a valid error should be returned', (done)=>{
            chai.request(server).post('/api/user').send({
                //firstName ontbreekt
                lastName: "Doe",
                street: "Lovensdijkstraat 61",
                city: "Breda",
                password: "secret",
                emailAddress: "j.doe@server.com",
                phoneNumber: "0626822666"
            })
            .end((err, res)=>{
                res.should.be.an('object')
                let {status,result} = res.body
                status.should.equals(400)
                result.should.be.a('string').that.equals('firstName must be a string.')
            })
            done()
        })
    })
})