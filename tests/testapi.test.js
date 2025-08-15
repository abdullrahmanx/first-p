const { ExplainVerbosity } = require('mongodb')
const  app =require('../oy')
const request=require('supertest')
const path=require('path')
const fs=require('fs')
const mongoose=require('mongoose')
const User=require('../MongoModel/userModel')


   // Drink routes
describe('Drinks Routes', () => {

    let adminToken 
    beforeAll( async () => {
    const loginRes= await request(app)
        .post('/user/login')
        .send({ email: "hello1@gmail.com", password: "123456"})
    adminToken= loginRes.body.token    
    expect(adminToken).toBeDefined();      
    })

    test('Test for getting all drinks with authorization', async() => {
        const res= await request(app)
         .get('/drinks')
         .set('Authorization', `Bearer ${adminToken}`)
         expect(res.statusCode).toBe(200);
    })
    test('Test for getting all drinks without authorization',  async() => {
        const res=await request(app).get('/drinks')
        expect(res.statusCode).toBe(401)
    })
    
    test('Add a new Drink with authorization', async() => {
        const res= await request(app)
         .post('/drinks')
         .set('Authorization',`Bearer ${adminToken}`)
         .send({name: "Latte", price: 50, inStock: true})
        console.log('Created drink ID:', res.body._id);
        testDrinkId= res.body.newDrink._id
        expect(res.statusCode).toBe(201)
        expect(res.body.newDrink.name).toBe("Latte");
       
    })

    test('Test for getting a specific drink', async () => {
        const res=await request(app).get(`/drinks/${testDrinkId}`)
        expect(res.statusCode).toBe(200)
        expect(res.body.drink._id).toBe(testDrinkId)
    })
    test('Editing a drink', async () => {
        const res= await request(app)
         .put(`/drinks/${testDrinkId}`)
         .set('Authorization', `Bearer ${adminToken}`)
         .send({name: "Black Coffe", price: 60, inStock: true})
        expect(res.statusCode).toBe(200) 
    })
    test('Deleting a drink', async () => {
        const res= await request(app)
         .delete(`/drinks/${testDrinkId}`)
         .set('Authorization', `Bearer ${adminToken}`)
        expect(res.statusCode).toBe(200) 
    })
    test('Add a drink with invalid data should fail', async () => {
    const res = await request(app)
        .post('/drinks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: "", price: -10 }); // invalid name and price

    expect(res.statusCode).toBe(400); 
    expect(res.body.status).toBe("Fail");
    });

    test('Add a drink without token should fail', async () => {
    const res = await request(app)
        .post('/drinks')
        .send({ name: "Espresso", price: 30, inStock: true });

    expect(res.statusCode).toBe(401); // Unauthorized
   });
   test('Edit a drink with invalid ID should fail', async () => {
    const res = await request(app)
        .put('/drinks/12345') // invalid ObjectId
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: "Tea", price: 20 });

    expect(res.statusCode).toBe(400); // Bad request for invalid ID
    });
    test('Edit a drink without token should fail', async () => {
    const res = await request(app)
        .put(`/drinks/${testDrinkId}`)
        .send({ name: "Tea", price: 20 });

    expect(res.statusCode).toBe(401); // Unauthorized
    });
    test('Delete a drink without token should fail', async () => {
    const res = await request(app)
        .delete(`/drinks/${testDrinkId}`);

    expect(res.statusCode).toBe(401); // Unauthorized
    });
    test('Get a drink that does not exist should return 404', async () => {
    const fakeId = "64f123456789abcdef012345"; // valid ObjectId format but not in DB
    const res = await request(app).get(`/drinks/${fakeId}`);
    expect(res.statusCode).toBe(404);
    });
})
describe('User Routes', () => {

    let testEmail = `user${Date.now()}@gmail.com`;
    let userToken;
    let adminToken;
    let resetToken;

    beforeAll(async () => {
        // Signup user first
        await request(app)
            .post('/user/signup')
            .send({ name: 'testname', email: testEmail, password: '123456' });

        // Login normal user to get token
        const loginRes = await request(app)
            .post('/user/login')
            .send({ email: testEmail, password: '123456' });
        userToken = loginRes.body.token;
        expect(userToken).toBeDefined();

        // Login admin user
        const adminLoginRes = await request(app)
            .post('/user/login')
            .send({ email: "hello1@gmail.com", password: "123456" });
        adminToken = adminLoginRes.body.token;
        expect(adminToken).toBeDefined();
    });

    // ---------- Forgot / Reset Password ----------
    test('POST /Forgot password', async () => {
        const res= await request(app)
          .post('/user/forgotpassword')
          .send({email: testEmail})
        resetToken=res.body.resetUrl.split('/').pop()
        expect(resetToken).toBeDefined();  
    })
    test('PUT /Reset password', async () => {
        const res= await request(app)
           .put(`/user/reset-password/${resetToken}`)
           .send({newPassword: '123456789', confirmPassword: '123456789'})
        expect(res.statusCode).toBe(200)   
    })

    // ---------- Protected Routes ----------
    test('GET /profile - get user profile', async () => {
        const res = await request(app)
            .get('/user/profile')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
    });

    test('PUT /profile-edit - edit profile', async () => {
        const imagePath=path.join('uploads',"profile-68a5c63557c0265f92a201e5-1755694648050.jpeg")
        const res = await request(app)
            .put('/user/profile-edit')
            .set('Authorization', `Bearer ${userToken}`)
            .attach('profileImage',imagePath)
            .field('name', 'updatedName');
        expect(res.statusCode).toBe(200);
        expect(res.body.updatedProfile).toHaveProperty('profileImage')
        const uploadedFilePath= res.body.updatedProfile.profileImage
        expect(fs.existsSync(uploadedFilePath)).toBe(true)
        fs.unlinkSync(uploadedFilePath)
    });

    test('PUT /changepassword - change password', async () => {
        const res = await request(app)
            .put('/user/changepassword')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ currentPassword: "123456789", newPassword: "1234567" });
        expect(res.statusCode).toBe(200);

        // Update token after changing password
        const loginRes = await request(app)
            .post('/user/login')
            .send({ email: testEmail, password: '1234567' });
        userToken = loginRes.body.token;
        expect(userToken).toBeDefined();
    });

    test('PUT /user-upload-image - upload profile image', async () => {
        const path = require('path');
        const res = await request(app)
            .put('/user/user-upload-image')
            .set('Authorization', `Bearer ${userToken}`)
            .attach('profileImage', path.join('uploads', 'profile-68a5c63557c0265f92a201e5-1755694648050.jpeg')); // use absolute path
        expect(res.statusCode).toBe(200);
    });

    test('GET / - admin only route', async () => {
       
        const resFail = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${userToken}`);
        expect(resFail.statusCode).toBe(401);

        // Admin should succeed
        const resAdmin = await request(app)
            .get('/user')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(resAdmin.statusCode).toBe(200);
    });
    test('GET/ USERS WITH PAGINATION & LIMIT', async () => {
        const res= await request(app)
         .get('/user?limit=5&&page=2')
         .set('Authorization', `Bearer ${adminToken}`)
        expect(res.statusCode).toBe(200); 
    })
    test('GET/ USERS BASED ON ROLE', async () => {
        const res= await request(app)
         .get('/user?role=user')
         .set('Authorization', `Bearer ${adminToken}`)
        expect(res.statusCode).toBe(200); 
        expect(res.body.users.every(u => u.role === 'user')).toBe(true);
    })
    test('GET. USERS BY SORTING NAME not really imp here', async () => {
        const res= await request(app)
         .get('/user?sort=name')
         .set('Authorization', `Bearer ${adminToken}`)
        expect(res.statusCode).toBe(200)
        const users=res.body.users
        const ascending=true;
        if(users.length>1) {
            for(let i= 1; i <users.length; i++) {
                if(ascending) {
                    expect(users[i-1].name <= users[i].name).toBe(true)
                } else {
                    expect(users[i-1].name>=users[i].name).toBe(true)
                }

            }
        }

    })
});
afterAll(async () => {
  try {
    // Delete all test users created during tests
    await User.deleteMany({ email: /^user.*@gmail\.com$/ });

    console.log('Test users cleaned up');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error cleaning up test users:', err);
  }
});
