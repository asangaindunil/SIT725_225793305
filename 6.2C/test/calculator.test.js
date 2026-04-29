const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Calculator API Tests", () => {

    // Valid Behaviour Test - Addition
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

    // Valid Behaviour Test - Subtraction
    it("should subtract two numbers correctly", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=sub")
            .end((err, res) => {
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.equal(5);
                done();
            });
    });

    // Valid Behaviour Test - Multiplication
    it("should multiply two numbers correctly", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=mul")
            .end((err, res) => {
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.equal(50);
                done();
            });
    });

    // Valid Behaviour Test - Division
    it("should divide two numbers correctly", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=div")
            .end((err, res) => {
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.equal(2);
                done();
            });
    });

    // Invalid Behaviour Test - Invalid Numbers
    it("should return error for invalid numbers", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=abc&num2=5&operation=add")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid numbers");
                done();
            });
    });

    // Invalid Behaviour Test - Missing num1
    it("should return error when num1 is missing", (done) => {
        chai.request(app)
            .get("/api/calculator?num2=5&operation=add")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid numbers");
                done();
            });
    });

    // Invalid Behaviour Test - Missing num2
    it("should return error when num2 is missing", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&operation=add")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid numbers");
                done();
            });
    });

    // Edge Case Test - Invalid Operation
    it("should return error for invalid operation", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=5&operation=power")
            .end((err, res) => {
                expect(res.body.status).to.equal("error");
                expect(res.body.message).to.equal("Invalid operation");
                done();
            });
    });

    // Edge Case Test - Division by Zero
    it("should handle division by zero", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10&num2=0&operation=div")
            .end((err, res) => {
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.satisfy(val => val === Infinity || val === null);
                done();
            });
    });

    // Edge Case Test - Decimal Numbers
    it("should correctly handle decimal numbers", (done) => {
        chai.request(app)
            .get("/api/calculator?num1=10.5&num2=2.5&operation=add")
            .end((err, res) => {
                expect(res.body.status).to.equal("success");
                expect(res.body.result).to.equal(13);
                done();
            });
    });

});