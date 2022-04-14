jest.setTimeout(500000);

const request = require("supertest");
const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMzE1MjUzMjRlNzA4MTQyZDAwMTVkYyIsImlhdCI6MTY0OTg4OTE5OSwiZXhwIjoxNjQ5OTc1NTk5fQ.43o7mfBfxq9epoNgodQNa2rIgQdDToVoe9IbJDKLTVw";

module.exports = { request, server, authToken };
