const { request, server } = require("./setup");

test("get all categories", async () => {
  await request(server).get("/api/category/").expect(200);
});

let categoryId = "62413cd4933fba06d7b853b9"; // Kids Toys

test("get sub-categories by category Id", async () => {
  await request(server).get(`/api/category/${categoryId}`).expect(200);
});

test("provide false category Id when getting sub-categories", async () => {
  await request(server)
    .get(`/api/category/62413cd4933fba06d7b81234`)
    .expect(404);
});

test("provide false stall id when geting stall sub-categories", async () => {
  await request(server)
    .get(`/api/category/stall/subcategories/62413cd4933fba0612341234`)
    .expect(404);
});

test("get stall sub-categories", async () => {
  await request(server)
    .get(`/api/category/stall/subcategories/62452f8ad1f760216fb189aa`)
    .expect(200)
    .then((data) => {
      expect(data.body[0].stallName).toBe("Leather 4 Less");
    });
});

test("get category name", async()=> {
  await request(server)
  .get(`/api/category/get/${categoryId}`)
  .expect(200)
  .then(result => {
    expect(result.text).toBe("Kids Toys")
  })
})

test("get invalid category name", async()=> {
  await request(server)
  .get(`/api/category/get/62413cd4933fba06d7b81234`)
  .expect(404)
})