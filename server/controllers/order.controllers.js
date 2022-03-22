const { Product } = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

const { Order } = require("../models/Order");

// GET: Get all Orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    if (orders.length === 0) {
      return next(new ErrorResponse("No orders exist"));
    }
    res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// POST: Create a new Order
exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    // Email the order to the Stall
    await sendEmail({
      to: order.stall.email,
      subject: `New Order Received (${order.stall.name})`,
      text: emailOrderStallMessage(order),
    });

    // Send Order Email to Buyer

    // Send Server Response
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return next(error);
  }
};

const emailOrderStallMessage = (order) => {
  return `
  <style>
    * {
      font-family: Arial, Helvetica, sans-serif;
    }

    #order-table {
      border-collapse: collapse;
      width: 100%;
    }
    
    td, th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    
    tr:nth-child(even){background-color: #f2f2f2;}
    
    tr:hover {background-color: #ddd;}
    
    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #04AA6D;
      color: white;
    }

    ul {
      list-style: none;
    }

  </style>


  <h1>New Order for ${order.stall.name}</h1>

  <p>
    You have received a new online order from ${order.customer.name}
    Please contact the customer to arrange payment and delivery options.
  </p>

  <table id="order-table">
    <thead>
      <th>Order Ref</th>
      <th>Order Date</th>
      <th>Customer</th>
      <th>Customer Email</th>
      <th>Customer Phone</th>
    </thead>
    <tbody>
      <tr>
        <td>${order._id}</td>
        <td>
          ${Date(order.createdAt)}
        </td>
        <td>${order.customer.name}</td>
        <td>${order.customer.email}</td>
        <td>${order.customer.phone || null}</td>
      <tr>
      <tr>
        <td colspan="5">
          <strong>Order Notes: </strong> 
          <br/>
          ${order.order_notes}
        </td>
      </tr>
    </tbody>
  </table>

  <table id="order-table">
    <thead>
      <th>Product Id</th>
      <th style="">Product Name</th>
      <th style="">Product Description</th>
      <th style="">Qty</th>
      <th style="">Price</th>
      <th style="">Line Total</th>
    </thead>

    <tbody>

      ${order.products.map((product) => {
        return `
        <tr>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 20ch;">
            ${product.description}
          </td>
          <td style="">${product.quantity}</td>
          <td style="">${product.price}</td>
          <td style="">${product.quantity * product.price}</td>
        </tr>`;
      })}

    </tbody>

    <tfoot style=""> 
      <tr>
        <td colspan="3">Total Price</td>
        <td colspan="3">${order.total_order_price}</td>
      </tr>
    </tfoot>
  </table>
  `;
};
