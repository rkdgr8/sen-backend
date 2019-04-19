const request = require('supertest');
const app = require('../app');

//Models required
const Admin = require('../models/administrators');
const College = require('../models/colleges');
const Faculty = require('../models/faculty');

beforeEach(async () => {
  await Admin.deleteMany();
  await College.deleteMany();
  await Faculty.deleteMany();
});

test('Adding new college', async () => {
  await request(app)
    .post('/api/college/add')
    .send({
      college: {
        name: 'DA-IICT',
        location: {
          country: 'India',
          city: 'Gandhinagar'
        }
      },
      admin: {
        name: 'Ramesh',
        username: 'Ramesh',
        password: '1234',
        type: 'college'
      }
    })
    .expect(200);
});

const adminInstance1 = {
  name: 'suresh',
  username: 'suresh',
  password: '1234',
  type: 'college'
};

test('Updating existing college', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.find({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const updatedCollegeData = {
    college: {
      name: 'Nirma',
      location: {
        country: 'India',
        city: 'Ahmedabad'
      }
    },
    admin: {
      name: 'Suresh',
      username: 'new_admin',
      password: '12345678',
      type: 'college'
    },
    id: college._id
  };
  request(app)
    .put('/api/college/update')
    .send(updatedCollegeData)
    .expect(200);
});

test('Delete exisiting college', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  request(app)
    .delete(`/api/college/${college._id}`)
    .expect(200);
});

test('Get college by id', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  request(app)
    .get(`/api/college/${college._id}`)
    .expect(200);
});

test('Search college by query', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const query = 'Gandhinagar';
  request(app)
    .get(`/api/college/search/${query}`)
    .expect(200);
});

const facultyInstance1 = {
  name: 'Suman Mitra',
  college: {
    name: 'DA-IICT'
  },
  department: 'computerScience',
  contactDetails: {
    emailId: 'sumanmitra@daiict.ac.in',
    phoneNo: {
      countryCode: '91',
      Number: '9876543210'
    }
  }
};

test('Get faculty by id', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const faculty = await Faculty.create(facultyInstance1);
  request(app)
    .get(`/api/faculty/${faculty._id}`)
    .expect(200);
});

test('Search faculty by query', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const faculty = await Faculty.create(facultyInstance1);
  const query = 'CNN';
  request(app)
    .get(`/api/faculty/search/${query}`)
    .expect(200);
});

test('Add new faculty', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const facultyObj = {
    name: 'Suman Mitra',
    aoi: [{ name: 'CS' }],
    college: {
      name: 'DA-IICT',
      id: college._id
    },
    department: 'computerScience'
  };
  request(app)
    .post('/api/faculty/add/')
    .send(facultyObj)
    .expect(200);
});

test('Update existing faculty', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const faculty = await Faculty.create(facultyInstance1);
  const newFacultyObj = {
    faculty: {
      name: 'Suman S Mitra',
      department: 'computerScience',
      contactDetails: {
        emailId: 'sumanmitra@pdpu.ac.in',
        phoneNo: {
          countryCode: 91,
          Number: 9876543210
        }
      }
    },
    id: faculty._id
  };
  request(app)
    .put('/api/faculty/update')
    .send(newFacultyObj)
    .expect(200);
});

test('Delete existing faculty', async () => {
  const admin = await Admin.create(adminInstance1);
  const college = await College.create({
    name: 'DA-IICT',
    location: {
      country: 'India',
      city: 'Gandhinagar'
    },
    administrator: admin._id
  });
  const faculty = await Faculty.create(facultyInstance1);
  request(app)
    .delete(`/api/faculty/${faculty._id}`)
    .expect(200);
});

test('Test signin', async () => {
  admin = await Admin.create(adminInstance1);
  const adminInstanceTest = {
    username: 'suresh',
    password: '1234'
  };
  request(app)
    .post('/api/signin/')
    .send(adminInstanceTest)
    .expect(200)
    .end(err => {
      if (err) throw err;
    });
});
