const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Calculator API Tests", () => {

    // Valid Behaviour Test
    it("should add two numbers correctly", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=add")
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.equal(15);
                done();
            });
    });

    // Valid Behaviour Test
    it("should subtract two numbers correctly", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=sub")
            .end((err, res) => {
                expect(res.body.result).to.equal(5);
                done();
            });
    });

    // Invalid Behaviour Test
    it("should return error for invalid numbers", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=abc&num2=5&operation=add")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid numbers");
                done();
            });
    });

    // Edge Case Test
    it("should return error for invalid operation", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=power")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid operation");
                done();
            });
    });

});