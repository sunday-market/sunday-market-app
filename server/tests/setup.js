jest.setTimeout(500000);

const request = require("supertest");
const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjdkZWVhNzRlZTc4YWVlYWVjNzBjNiIsImlhdCI6MTY0OTg1NjA3NSwiZXhwIjoxNjQ5OTQyNDc1fQ.HVgSMQWlMam2hjL-Jwobat-mefjVy75bytFFIme3VOU";

module.exports = { request, server, authToken };
