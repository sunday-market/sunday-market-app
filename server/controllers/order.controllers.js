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

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });

    if (!order) {
      return next(new ErrorResponse("No order found", 400));
    }

    res.status(200).json(order);
  } catch (error) {
    return next(error);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "customer.id": req.params.userId });

    res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

exports.getStallOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "stall.id": req.params.stallId });

    res.status(200).json(orders);
  } catch (error) {
    return next(error);
  }
};

// POST: Create a new Order
exports.createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    // Email the Order to the Stall
    await sendEmail({
      to: order.stall.email,
      subject: `New Order Received (${order._id})`,
      text: emailOrderStallMessage(order),
    });

    // Send Order Confirmation Email to Buyer
    await sendEmail({
      to: order.customer.email,
      subject: `Order Confirmation (${order._id})`,
      text: emailOrderCustomerMessage(order),
    });

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

    tfoot {
      text-align: right;
    }

    .center-text {
      text-align: center;
    }

    .right-align-text {
      text-align: right;
    }

    ul {
      list-style: none;
    }

  </style>


  <h1>New Order for ${order.stall.name}</h1>

  <p>
    You have received a new online order from ${order.customer.name}
    <strong>Please contact the customer to arrange payment and delivery options.</strong>
  </p>

  <table id="order-table">
    <thead>
      <th class="center-text">Order Ref</th>
      <th class="center-text">Order Date</th>
      <th class="center-text">Customer</th>
      <th class="center-text">Customer Email</th>
      <th class="center-text">Customer Phone</th>
    </thead>
    <tbody class="center-text">
      <tr>
        <td>${order._id}</td>
        <td>
          ${new Date(order.createdAt).toDateString()}
        </td>
        <td>${order.customer.name}</td>
        <td>${order.customer.email}</td>
        <td>${order.customer.phone || ""}</td>
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
      <th class="center-text">Product Name</th>
      <th class="center-text">Product Description</th>
      <th class="center-text">Qty</th>
      <th class="right-align-text">Price</th>
      <th class="right-align-text">Line Total</th>
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
          <td class="center-text">${product.quantity}</td>
          <td class="right-align-text">${product.price}</td>
          <td class="right-align-text">${product.quantity * product.price}</td>
        </tr>`;
      })}

    </tbody>

    <tfoot style="font-weight="bold"> 
      <tr>
        <td colspan="3">Total Price</td>
        <td colspan="3">${order.total_order_price}</td>
      </tr>
    </tfoot>
  </table>
  `;
};

const emailOrderCustomerMessage = (order) => {
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

    tfoot {
      text-align: right;
    }

    .center-text {
      text-align: center;
    }

    .right-align-text {
      text-align: right;
    }

    .bold-text {
      font-weight: bold;
    }

    ul {
      list-style: none;
    }

  </style>


  <h1>Order Confirmation from ${order.stall.name}</h1>

  <p>
    You have successfully placed an order from ${order.stall.name}
    <strong>Please contact the stall to arrange payment and delivery options.</strong>
  </p>

  <div>
    <h4>Ordered From</h4>
    <p>
      <div>
        <span class="bold-text">Stall: </span>
        <span>${order.stall.name}</span>
      <div>
      <div>
        <span class="bold-text">Email: </span>
        <span>${order.stall.email}</span>
      <div>
      <div>
        <span class="bold-text">Phone: </span>
        <span>${order.stall.phone}</span>
      <div>
      <div>
        <span class="bold-text">Stall Location: </span>
        <span>${order.stall.location}</span>
      <div>    
    </p>
  </div>

  <h4>Order Details</h4>
  <table id="order-table">
    <thead>
      <th class="center-text">Order Ref</th>
      <th class="center-text">Order Date</th>
      <th class="center-text">Customer</th>
      <th class="center-text">Customer Email</th>
      <th class="center-text">Customer Phone</th>
    </thead>
    <tbody class="center-text">
      <tr>
        <td>${order._id}</td>
        <td>
          ${new Date(order.createdAt).toDateString()}
        </td>
        <td>${order.customer.name}</td>
        <td>${order.customer.email}</td>
        <td>${order.customer.phone || ""}</td>
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
      <th class="center-text">Product Name</th>
      <th class="center-text">Product Description</th>
      <th class="center-text">Qty</th>
      <th class="right-align-text">Price</th>
      <th class="right-align-text">Line Total</th>
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
          <td class="center-text">${product.quantity}</td>
          <td class="right-align-text">${product.price}</td>
          <td class="right-align-text">${product.quantity * product.price}</td>
        </tr>`;
      })}

    </tbody>

    <tfoot style="font-weight="bold"> 
      <tr>
        <td colspan="3">Total Price</td>
        <td colspan="3">${order.total_order_price}</td>
      </tr>
    </tfoot>
  </table>
  `;
};
