jest.setTimeout(500000);

const request = require("supertest");
const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjdkZWVhNzRlZTc4YWVlYWVjNzBjNiIsImlhdCI6MTY0OTc2OTUxMCwiZXhwIjoxNjQ5ODU1OTEwfQ.6NhHn23V1tUb8S4rJa-yEEtQCrVGjcnRx9R0vCv19e8";

module.exports = { request, server, authToken };
