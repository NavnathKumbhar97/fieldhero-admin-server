import chai from 'chai';
import chaiHttp from 'chai-http';
import { describe, it } from 'mocha';
import { Request, Response } from 'express';
// import app from './app';
import { expect } from 'chai';

const app = "http://localhost:3636"
chai.use(chaiHttp);
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwM2VmNDE5OC0xOGE5LTQyNTUtYTJhNC1iMDM0ZTZlZDYwNGYiLCJyb2xlIjoiZTBjNjQ0ZTktNmRmOS00Y2UxLTk4ZGItMWM4YTQ0MmQ4NjE4IiwiaWF0IjoxNjg5MjI5ODk2LCJleHAiOjE2ODkyNTg2OTZ9.udOyeWMUBZrMdfl1MOZAB2j5pjdDJn335PnNna5xse4"

describe('GET/POST/PUT /all-candidates data', () => {
  it('should return all candidates with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates?limit=10&page=0')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return all passive candidates with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates/passive')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return all single candidates with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates/14797')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return all get candidates work history with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates/14797/work-history')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return all get candidates work history with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates/14797/work-history')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);

  it('should return all get get candidates training/certificate with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidates/14797/training-history')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);

  it('should add data with correct status code and response', (done) => {
    const requestData = {
      fullName: "test while writing test cases",
      dob: null,
      gender: "MALE",
      permAddress: "test for the test cases",
      permCity: "Pune",
      permState: "Maharashtra",
      permCountry: "India",
      permZip: "411048",
      currAddress: "",
      curr_city: "Pune",
      currState: "MH",
      currCountry: "India",
      currZip: "",
      email1: "snayak@apasasdexaglobal.com",
      email2: "",
      contactNo1: "8989889090",
      contactNo2: "",
      aadharNo: "898988909089",
      preferLocation1: null,
      preferLocation2: null,
      skill1: null,
      skill2: null,
      profImgPath: "",
      primaryLanguage: null,
      secondaryLanguage: null,
      thirdLanguage: null,
      education: null,
      status: "INACTIVE",
      isActive: true,
    };
  
    chai
      .request(app)
      .post('/api/v1/candidates')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);
  it('should add data with correct status code and response for the work history', (done) => {
    const requestData = {
      startDate: '2023-07-06T10:50:05.531Z',
      endDate: '2023-07-06T10:50:05.531Z',
      description: 'test description',
      companyId: 6,
      skillId: [5, 3, 2],
      workHistoryId: 5,
      candidate: 1     
    };
  
    chai
      .request(app)
      .post('/api/v1/candidates/14797/work-history')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);
  it('should update data with correct status code and response', (done) => {
    const requestData = {
      aadharNo: "898988909089",
      approvedBy: 1,
approvedOn: "2023-07-06T05:40:54.000Z",
candidateRawid: null,
contactNo1: "8989889090",
contactNo2: "",
costToAgent: 0,
createdBy: null,
createdOn: "2023-07-06T03:57:00.583Z",
currAddress: "",
currCity: "Pune",
currCountry: "India",
currState: "MH",
currZip: "",
dlNo: null,
dob: null,
education: null,
email1: "snayak@aasasdexaglobal.com",
email2: "",
expYears: null,
fullName: "test whil writing test cases",
gender: "MALE",
id: 37431,
isActive: true,
modifiedBy: 1,
modifiedOn: "2023-07-06T05:40:54.095Z",
note: null,
panNo: null,
passwordHash: null,
permAddress: "test for the test cases",
permCity: "Pune",
permCountry: "India",
permState: "Maharashtra",
permZip: "411048",
preferLocation1: null,
preferLocation2: null,
primaryLanguage: null,
profImgPath: "",
secondaryLanguage: null,
skill1: null,
skill2: null,
status: "INACTIVE",
thirdLanguage: null,
    };
  
    chai
      .request(app)
      .put(`/api/v1/candidates/${37431}`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204); // Check the expected status code
        expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        // expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);
  it('should add data with correct status code and response for training and certificate', (done) => {
    const requestData = {
      issuedBy:"tesst",
      title:"test whil adding new",
      candidateId:"14797",
      skillId:2
    }
  
    chai
      .request(app)
      .post(`/api/v1/candidates/14797/training-cert`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000);

  it('should update data with correct status code and response', (done) => {
    const requestData = {
      startDate: '2023-07-06T10:50:05.531Z',
      endDate: '2023-07-06T10:50:05.531Z',
      description: 'test description',
      companyId: 6,
      skillId: [1, 2, 3],
      workHistoryId: 5,
      candidateId: 14797
    }
  
    chai
      .request(app)
      .put(`/api/v1/candidates/14797/work-history/18662`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204); // Check the expected status code
        // expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        // expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);
  it('should update data with correct status code and response', (done) => {
    const requestData = {
      candidateId: 14797,
      description: null,
      id: 17,
      issueDate: null,
      issuedBy: "tesst ",
      skillId: 2,
      title: "test whil adding new ",
      type: "OTHER"
    }
  
    chai
      .request(app)
      .put(`/api/v1/candidates/14797/training-history/17`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204); // Check the expected status code
        // expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        // expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);

});

describe('GET/POST/PUT /all-candidate upload batch data', () => {
it('should return all candidate upload bacth with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/candidate-upload-batches')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should return all candidate upload batch for admin with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/admin/candidate-upload-batches')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should return candidate upload batch for admin of passive with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/admin/candidate-upload-batches/passive-create')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should return candidate upload batch for admin of stats with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/admin/candidate-upload-batches/42/stats')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should return Download rejection summary for candidate uploaded batch for curent user with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/candidate-upload-batches/224/download-rejection-summary')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should return Download rejection summary for candidate uploaded batch for any user by admin with correct status code and response', (done) => {
  chai
    .request(app)
    .get('/api/v1/admin/candidate-upload-batches/224/download-rejection-summary')
    .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200); // Check the expected status code
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('code');
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000)
it('should change pricing template data with correct status code and response', (done) => {
  const requestData = {
    templateId:6
  };
  chai
    .request(app)
    .post('/api/v1/admin/candidate-upload-batches/42/change-pricing-template')
    .set('Authorization', `Bearer ${token}`)
    .send(requestData)
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(204); // Check the expected status code
      // expect(res.body).to.be.an('object');
      // expect(res.body).to.have.property('code');
      // expect(res.body).to.have.property('message');
      // expect(res.body).to.have.property('data');
      // Add more assertions for the specific response data if needed
      done();
    });
}).timeout(5000);


})

describe('GET/POST/PUT /all-agents data', () => {
  it('should return all agents with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/agents?take=10&skip=0')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return single agents with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/agents/4')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)

  it('should add data with correct status code and response', (done) => {
    const requestData = {
agentNo: "ABC-123125",
contactNo: "8668437165",
currAddress: "Writing test cases",
currCity: "Solapur",
currCountry: "",
currState: "Maharashtra",
currZip: "413203",
email: "kumbharnr77sdf@gmasdfil.com",
fullName: "Writing test cases to POST method c",
gender: "MALE",
isActive: true
    };
  
    chai
      .request(app)
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);

  it('should update data with correct status code and response', (done) => {
    const requestData = {
      agentNo: "ABC-123124",
      id: 20,
contactNo: "8668437166",
currAddress: "Writing test cases",
currCity: "Solapur",
currCountry: "INDIA",
currState: "Maharashtra",
currZip: "413203",
email: "kumbharnr77sf@gsdfsdmail.com",
fullName: "Writing test cases to POST method",
gender: "MALE",
isActive: true
    }
  
    chai
      .request(app)
      .put(`/api/v1/agents/20`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204); // Check the expected status code
        // expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        // expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);
});

describe('GET/POST/PUT /all-candidate verification data', () => {
  it('should return all candidate verification with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidate-verifications?take=10&skip=0')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return single candidate verification with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/candidate-verifications/34560')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000)

//   it('should add data with correct status code and response', (done) => {
//     const requestData = {

//     };
  
//     chai
//       .request(app)
//       .post('/api/v1/agents')
//       .set('Authorization', `Bearer ${token}`)
//       .send(requestData)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(201); // Check the expected status code
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('code');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000);

//   it('should update data with correct status code and response', (done) => {
//     const requestData = {
//       agentNo: "ABC-123124",
//       id: 20,
// contactNo: "8668437166",
// currAddress: "Writing test cases",
// currCity: "Solapur",
// currCountry: "INDIA",
// currState: "Maharashtra",
// currZip: "413203",
// email: "kumbharnr77sf@gsdfsdmail.com",
// fullName: "Writing test cases to POST method",
// gender: "MALE",
// isActive: true
//     }
  
//     chai
//       .request(app)
//       .put(`/api/v1/agents/20`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(requestData)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(204); // Check the expected status code
//         // expect(res.body).to.be.an('object');
//         // expect(res.body).to.have.property('code');
//         // expect(res.body).to.have.property('message');
//         // expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000);


});

describe('GET/POST/PUT /all-agent pricing template data', () => {
  it('should return all agent pricing template with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/agent-pricing-templates')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return single agent pricing template with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/agent-pricing-templates/8')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000)

  it('should add data with correct status code and response', (done) => {
    const requestData = {
      approvalRemarks: null,
category: 0,
contactNo1: 0,
currCity: 0,
currZip: 0,
description: "",
designation: 0,
dob: 0,
education: 0,
email1: 0,
expYears: 0,
fullName: 0,
id: 8,
industry: 0,
isActive: true,
lastCompany: 0,
preferLocation1: 0,
preferLocation2: 0,
primaryLanguage: 0,
secondaryLanguage: 0,
skill1: 0,
skill2: 0,
templateName: "Changing update approach 2",
totalAmount: 0
    };
  
    chai
      .request(app)
      .post('/api/v1/agent-pricing-templates')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);

//   it('should update data with correct status code and response', (done) => {
//     const requestData = {
//       agentNo: "ABC-123124",
//       id: 20,
// contactNo: "8668437166",
// currAddress: "Writing test cases",
// currCity: "Solapur",
// currCountry: "INDIA",
// currState: "Maharashtra",
// currZip: "413203",
// email: "kumbharnr77sf@gsdfsdmail.com",
// fullName: "Writing test cases to POST method",
// gender: "MALE",
// isActive: true
//     }
  
//     chai
//       .request(app)
//       .put(`/api/v1/agents/20`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(requestData)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(204); // Check the expected status code
//         // expect(res.body).to.be.an('object');
//         // expect(res.body).to.have.property('code');
//         // expect(res.body).to.have.property('message');
//         // expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000);


});

describe('GET/POST/PUT /all-batch priority data', () => {
  it('should return all batch priority with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/batch-priorities')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return passive batch priority with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/batch-priorities/passive-create')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
//   it('should return single agent pricing template with correct status code and response', (done) => {
//     chai
//       .request(app)
//       .get('/api/v1/agent-pricing-templates/8')
//       .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200); // Check the expected status code
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('code');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000)

//   it('should add data with correct status code and response', (done) => {
//     const requestData = {
//       approvalRemarks: null,
// category: 0,
// contactNo1: 0,
// currCity: 0,
// currZip: 0,
// description: "",
// designation: 0,
// dob: 0,
// education: 0,
// email1: 0,
// expYears: 0,
// fullName: 0,
// id: 8,
// industry: 0,
// isActive: true,
// lastCompany: 0,
// preferLocation1: 0,
// preferLocation2: 0,
// primaryLanguage: 0,
// secondaryLanguage: 0,
// skill1: 0,
// skill2: 0,
// templateName: "Changing update approach 2",
// totalAmount: 0
//     };
  
//     chai
//       .request(app)
//       .post('/api/v1/agent-pricing-templates')
//       .set('Authorization', `Bearer ${token}`)
//       .send(requestData)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(201); // Check the expected status code
//         expect(res.body).to.be.an('object');
//         expect(res.body).to.have.property('code');
//         expect(res.body).to.have.property('message');
//         expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000);

//   it('should update data with correct status code and response', (done) => {
//     const requestData = {
//       agentNo: "ABC-123124",
//       id: 20,
// contactNo: "8668437166",
// currAddress: "Writing test cases",
// currCity: "Solapur",
// currCountry: "INDIA",
// currState: "Maharashtra",
// currZip: "413203",
// email: "kumbharnr77sf@gsdfsdmail.com",
// fullName: "Writing test cases to POST method",
// gender: "MALE",
// isActive: true
//     }
  
//     chai
//       .request(app)
//       .put(`/api/v1/agents/20`)
//       .set('Authorization', `Bearer ${token}`)
//       .send(requestData)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(204); // Check the expected status code
//         // expect(res.body).to.be.an('object');
//         // expect(res.body).to.have.property('code');
//         // expect(res.body).to.have.property('message');
//         // expect(res.body).to.have.property('data');
//         // Add more assertions for the specific response data if needed
//         done();
//       });
//   }).timeout(10000);


});

describe('GET/POST/PUT /all-other industry category data', () => {
  it('should return all other industry category with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin/other-industries-categories')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return passive batch priority with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin/other-industries-categories/passive')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should add data with correct status code and response', (done) => {
        const requestData = {
          candidateId: 20947,
          description: "",
          id: 20,
          itemIdtoUpdate: 17601,
          mode: "Existing",
          text: " SALES SUPPORT EXECUTIVE",
          type: "INDUSTRY",
        };
      
        chai
          .request(app)
          .post('/api/v1/admin/other-industries-categories')
          .set('Authorization', `Bearer ${token}`)
          .send(requestData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200); // Check the expected status code
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            // Add more assertions for the specific response data if needed
            done();
          });
      }).timeout(10000);
});

describe('GET/POST/PUT /all-other industry category data', () => {
  it('should return all other industry category with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin/other-industries-categories')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return passive batch priority with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin/other-industries-categories/passive')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should add data with correct status code and response', (done) => {
        const requestData = {
          candidateId: 20947,
          description: "",
          id: 20,
          itemIdtoUpdate: 17601,
          mode: "Existing",
          text: " SALES SUPPORT EXECUTIVE",
          type: "INDUSTRY",
        };
      
        chai
          .request(app)
          .post('/api/v1/admin/other-industries-categories')
          .set('Authorization', `Bearer ${token}`)
          .send(requestData)
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200); // Check the expected status code
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('code');
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            // Add more assertions for the specific response data if needed
            done();
          });
      }).timeout(10000);
});


describe('GET/POST/PUT /all-user activity data', () => {
  it('should return all user activity with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin-userActivity/15')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
});
describe('GET/POST/PUT /all-user login activity data', () => {
  it('should return all user activity with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin-user-activity/15')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
});

describe('GET/POST/PUT /all-other master - category data', () => {
  it('should return all category with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/categories?take=10&skip=0')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)
  it('should return single agents with correct status code and response', (done) => {
    chai
      .request(app)
      .get('/api/v1/categories/466')
      .set({'Authorization':`Bearer ${token}`}) // Include the Bearer token in the request headers
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(5000)

  it('should add data with correct status code and response', (done) => {
    const requestData = {
      title:"Adding date while writing test cases",
      description:"Adding date while writing test cases",
      isActive:true
    };
  
    chai
      .request(app)
      .post('/api/v1/agents')
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(201); // Check the expected status code
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code');
        expect(res.body).to.have.property('message');
        expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);

  it('should update data with correct status code and response', (done) => {
    const requestData = {
      agentNo: "ABC-123124",
      id: 20,
contactNo: "8668437166",
currAddress: "Writing test cases",
currCity: "Solapur",
currCountry: "INDIA",
currState: "Maharashtra",
currZip: "413203",
email: "kumbharnr77sf@gsdfsdmail.com",
fullName: "Writing test cases to POST method",
gender: "MALE",
isActive: true
    }
  
    chai
      .request(app)
      .put(`/api/v1/agents/20`)
      .set('Authorization', `Bearer ${token}`)
      .send(requestData)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(204); // Check the expected status code
        // expect(res.body).to.be.an('object');
        // expect(res.body).to.have.property('code');
        // expect(res.body).to.have.property('message');
        // expect(res.body).to.have.property('data');
        // Add more assertions for the specific response data if needed
        done();
      });
  }).timeout(10000);
});


