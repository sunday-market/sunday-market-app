jest.setTimeout(300000);

const request = require("supertest");
const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE1MjUzMjRlNzA4MTQyZDAwMTVkYyIsImlhdCI6MTY0OTYyNTI1NSwiZXhwIjoxNjQ5NzExNjU1fQ.kx5udcCi2mkVg3A4JFkLRRAkeZBVLgKYLRQacrcIfwQ";

module.exports = { request, server, authToken };
