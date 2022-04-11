const { request, server, authToken } = require("./setup");

const shoppingProduct = {
  _id: "62392944e19f8bbe842ce3a6",
  product_name: "The Great Controversy",
  product_description: "The battle between Christ and Satan",
  product_price: 12,
  quantity: 1,
};

test("Create a new shopping cart and delete it", async () => {
  let shoppingcart;
  await request(server)
    .post("/api/cart/")
    .expect(200)
    .then((data) => {
      shoppingcart = data.body;
    });
  console.log(shoppingcart);
});
