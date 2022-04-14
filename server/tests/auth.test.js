const { request, server, authToken } = require("./setup");

let testUser = {
  username: "sbob",
  password: "patrickstar",
  email: "SundayMarketApp@gmail.com",
  fullname: "Spongebob Squarepants",
  address_line1: "Bikini Bottom",
};

test("Register, verify, login, and delete user", async () => {
  await request(server)
    .post("/api/auth/register")
    .send(testUser)
    .expect(201)
    .then((data) => {
      testUser = { ...testUser, ...data.body.user };
    });

  await request(server)
    .put(`/api/auth/verify/${testUser.verification_code}`)
    .expect(200);

  await request(server)
    .post(`/api/auth/login/`)
    .send({ email: "SundayMarketApp@gmail.com", password: "patrickstar" })
    .expect(200);

  await request(server)
    .delete(`/api/user/${testUser._id}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Login unverified user should return 401 response", async () => {
  await request(server).post("/api/auth/login").send(testUser).expect(401);
});

test("Invalid Login should return 401", async () => {
  await request(server)
    .post("/api/auth/login")
    .send({
      email: "dtib201@mywhitecliffe.com",
      password: "abcdefghijklmnopqrstuvwxyz",
    })
    .expect(401);
});

test("Register duplicate user should return 400", async () => {
  await request(server)
    .post("/api/auth/register")
    .send({
      email: "dtibbotts@outlook.com",
      username: "dtibbotts",
      password: "987654321",
      fullname: "Daniel Tibbotts",
    })
    .expect(400);
});

test("Register, verify, forget password, reset password and delete user", async () => {
  // Register User
  await request(server)
    .post("/api/auth/register")
    .send(testUser)
    .expect(201)
    .then((data) => {
      testUser = { ...testUser, ...data.body.user };
    });

  // Verify User
  await request(server)
    .put(`/api/auth/verify/${testUser.verification_code}`)
    .expect(200);

  let resetToken;
  let newPassword = "NewPassword2022";

  // Forgot Password
  await request(server)
    .post(`/api/auth/forgotpassword`)
    .send(testUser)
    .expect(200)
    .then((data) => {
      resetToken = data.body.resetToken;
    });

  // Reset Password
  await request(server)
    .put(`/api/auth/resetpassword/${resetToken}`)
    .send({ password: newPassword })
    .expect(201);

  // Login with new password
  await request(server)
    .post("/api/auth/login")
    .send({
      email: testUser.email,
      password: newPassword,
    })
    .expect(200);

  // Delete User
  await request(server)
    .delete(`/api/user/${testUser._id}`)
    .set("Authorization", authToken)
    .expect(200);
});

test("Change User Password", async () => {
  let user = {
    username: "sbob",
    password: "patrickstar",
    email: "SundayMarketApp@gmail.com",
    fullname: "Spongebob Squarepants",
    address_line1: "Bikini Bottom",
  };

  await request(server)
    .post("/api/auth/register")
    .send(user)
    .expect(201)
    .then((data) => {
      user = { ...user, ...data.body.user };
    });

  await request(server)
    .put(`/api/auth/verify/${user.verification_code}`)
    .expect(200);

  await request(server)
    .post(`/api/auth/login/`)
    .send({ email: "SundayMarketApp@gmail.com", password: "patrickstar" })
    .expect(200);

  //Change Password
  await request(server)
    .put(`/api/auth/changepassword/`)
    .set("Authorization", authToken)
    .send({
      userId: user._id,
      existingPassword: "patrickstar",
      newPassword: "Th15Is@n3wPassw0rd",
    })
    .expect(200);

  await request(server)
    .delete(`/api/user/${user._id}`)
    .set("Authorization", authToken)
    .expect(200);
});
