jest.setTimeout(500000);

const request = require("supertest");
const server = "http://localhost:5000";
const authToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjdkZWVhNzRlZTc4YWVlYWVjNzBjNiIsImlhdCI6MTY0OTY4MzUwNCwiZXhwIjoxNjQ5NzY5OTA0fQ.RNqtoHNnZj1Rjk1ZOqVwZGC5glwxAoWjdDwfAYTQnP4";

module.exports = { request, server, authToken };
