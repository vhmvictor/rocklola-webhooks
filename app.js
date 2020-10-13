const axios = require('axios');
const nuvemshop = require("nuvemshop");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
app.use(cors());

//TESTE DO SERVIDOR
app.get("/hello", (request, response) => {
    response.json({ message: 'Hello Rocklola' })
});
//
app.post("/order_created_hook", async (req, res, next) => {
  try {
    nuvemshop.config({
      store_id: process.env.STORE_ID,
      access_token: process.env.ACCESS_TOKEN,
      user_agent: process.env.USER_AGENT
    });
    let order = [];
    order.push(await nuvemshop.getOrder(req.body.id));
    let created_lead = [];
    let lead_payment_event = [];
    order.forEach((obj) => {
      created_lead.push({
        "event_type": "CONVERSION",
        "event_family":"CDP",
        "payload": {
          "conversion_identifier": "Pagamento-Pendente",
          "name": obj.customer.name,
          "email": obj.customer.email,
          "job_title": "",
          "state": obj.customer.billing_province,
          "city": obj.customer.billing_city,
          "country": obj.customer.billing_country,
          "personal_phone": "",
          "mobile_phone": obj.customer.phone,
          "twitter": "",
          "facebook": "",
          "linkedin": "",
          "website": "",
          "cf_custom_field_api_identifier": JSON.stringify(obj.customer.identification),
          "company_name": "",
          "company_site": "",
          "company_address": "",
          "client_tracking_id": JSON.stringify(obj.customer.id),
          "traffic_source": "Nuvemshop",
          "traffic_medium": "",
          "traffic_campaign": "",
          "traffic_value": "",
          "tags": ["nuvemshop", "pagamento-pendente", "rocklola"],
          "available_for_mailing": true,
        }
      });
      lead_payment_event.push({
        "event_type": "ORDER_PLACED",
        "event_family":"CDP",
        "payload": {
          "name": obj.customer.name,
          "email": obj.customer.email,
          "cf_order_id": JSON.stringify(obj.id),
          "cf_order_total_items": parseInt(obj.products.length),
          "cf_order_status": obj.payment_status,
          "cf_order_payment_method": "",
          "cf_order_payment_amount": parseFloat(obj.total),
        }
      });
      if(obj.payment_details.method == "credit_card") lead_payment_event[0].payload.cf_order_payment_method = "Credit Card"
      else lead_payment_event[0].payload.cf_order_payment_method = "Others"
    });
    //
    console.log(created_lead);
    console.log(lead_payment_event);
    //
    let authentication = await axios({ method: 'POST', url: process.env.RD_AUTH_URL,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        "client_id": process.env.RD_CLIENT_ID,
        "client_secret": process.env.RD_CLIENT_SECRET,
        "refresh_token": process.env.RD_REFLESH_TOKEN
      }
    });
    //
    created_lead.forEach(async (item) => {
      console.log(item)
      let req = await axios({ method: 'POST', url: process.env.RD_LEAD_URL,
        headers: {
          "Authorization": "Bearer " + authentication.data.access_token,
          "Content-Type": "application/json"
        },
        data: item
      });
    });
    lead_payment_event.forEach(async (item) => {
      console.log(item)
      let req = await axios({ method: 'POST', url: process.env.RD_LEAD_URL,
        headers: {
          "Authorization": "Bearer " + authentication.data.access_token,
          "Content-Type": "application/json"
        },
        data: item
      });
    });
    return res.status(200).send('Lead criada com sucesso.');
  } catch (error) {
      return res.status(500).send('Erro ao criar a lead.');
  }
})
//
app.post("/order_paid_hook", async (req, res, next) => {
  try {
    nuvemshop.config({
      store_id: process.env.STORE_ID,
      access_token: process.env.ACCESS_TOKEN,
      user_agent: process.env.USER_AGENT
    });
    let order = [];
    order.push(await nuvemshop.getOrder(req.body.id));
    let created_lead = [];
    order.forEach((obj) => {
      created_lead.push({
          "event_type": "CONVERSION",
          "event_family":"CDP",
          "payload": {
            "conversion_identifier": "Pagamento-Finalizado",
            "name": obj.customer.name,
            "email": obj.customer.email,
            "job_title": "",
            "state": obj.customer.billing_province,
            "city": obj.customer.billing_city,
            "country": obj.customer.billing_country,
            "personal_phone": "",
            "mobile_phone": obj.customer.phone,
            "twitter": "",
            "facebook": "",
            "linkedin": "",
            "website": "",
            "cf_custom_field_api_identifier": JSON.stringify(obj.customer.identification),
            "company_name": "",
            "company_site": "",
            "company_address": "",
            "client_tracking_id": JSON.stringify(obj.customer.id),
            "traffic_source": "Nuvemshop",
            "traffic_medium": "",
            "traffic_campaign": "",
            "traffic_value": "",
            "tags": ["nuvemshop", "pagamento-finalizado", "rocklola"],
            "available_for_mailing": true,
          }
        });
    });
    let authentication = await axios({ method: 'POST', url: process.env.RD_AUTH_URL,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        "client_id": process.env.RD_CLIENT_ID,
        "client_secret": process.env.RD_CLIENT_SECRET,
        "refresh_token": process.env.RD_REFLESH_TOKEN
      }
    });
    //
    console.log(created_lead);
    //
    created_lead.forEach(async (item) => {
        console.log(item)
        let request = await axios({ method: 'POST', url: process.env.RD_LEAD_URL,
          headers: {
            "Authorization": "Bearer " + authentication.data.access_token,
            "Content-Type": "application/json"
          },
          data: item
        });
      });
    return res.status(200).send('Lead criada com sucesso.');
  } catch (error) {
      return res.status(500).send('Erro ao criar a lead.');
  }
})
//
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor iniciado!");
});