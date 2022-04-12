const { request, server, authToken } = require("./setup");

test("get all products", async () => {
  await request(server).get(`/api/product`).expect(200);
});

test("add, delete product", async () => {
  let product = {
    product_name: "Lego",
    product_description: "Assorted Lego",
    product_user: "6231525324e708142d0015dc",
    product_stall: "624dfa4e99717551e4350214",
    product_subcategory: "62413ed6507ee81b57633707",
    product_price: 50,
    quantity_in_stock: 1,
  };

  // Add product
  await request(server)
    .post(`/api/product`)
    .set("Authorization", authToken)
    .send(product)
    .expect(201)
    .then((result) => {
      product = { ...product, ...result.body.data };
    });

  // Delete Product
  await request(server)
    .delete(`/api/product/${product._id}`)
    .set("Authorization", authToken)
    .expect(200);
});


test("get active products", async()=> {
  await request(server)
  .get(`/api/product/active`)
  .expect(200)
  .then(result => {
    result.body.map(product => {
      return expect(product.product_stall.activated).toBe(true)
    })
  })
})

test("get stall products", async()=> {
  const stallId = "62364038dd0cdb49d7e980e7"
  await request(server)
  .get(`/api/product/stall/${stallId}`)
  .set("Authorization", authToken)
  .expect(200)
  .then(result => {
    console.log(result.body)
  })
})

