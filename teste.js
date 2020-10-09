const axios = require("axios");
const nuvemshop = require("nuvemshop");
const dotenv = require('dotenv')

dotenv.config()

const app = async () => {
    try {
      nuvemshop.config({
        store_id: process.env.STORE_ID,
        access_token: process.env.ACCESS_TOKEN,
        user_agent: process.env.USER_AGENT
      });
      let order = []
      order.push(await nuvemshop.getOrder(304430247));
      console.log(order)
      //
      orders.forEach((obj) => {
        /*
        pending_orders.push({
          "event_type": "CONVERSION",
          "event_family":"CDP",
          "payload": {
            "conversion_identifier": "Nuvemshop Lead",
            "name": obj.name,
            "email": obj.email,
            "job_title": "",
            "state": obj.default_address.province,
            "city": obj.default_address.city,
            "country": obj.default_address.country,
            "personal_phone": "",
            "mobile_phone": obj.phone,
            "twitter": "",
            "facebook": "",
            "linkedin": "",
            "website": "",
            "cf_custom_field_api_identifier": JSON.stringify(obj.identification),
            "company_name": "",
            "company_site": "",
            "company_address": "",
            "client_tracking_id": JSON.stringify(obj.id),
            "traffic_source": "Nuvemshop",
            "traffic_medium": "",
            "traffic_campaign": "",
            "traffic_value": "",
            "tags": ["nuvemshop", "api", "nani"],
            "available_for_mailing": true,
            "legal_bases": [
              {
                "category": "data_processing",
                "type": "pre_existent_contract"
              },
              {
                "category": "communications",
                "type": "consent",
                "status": "granted"
              }
            ]
          }
        });
        */
      });
      console.log(cont)

      object.forEach(async (item) => {
        console.log(item)
        let request = await axios({ method: 'POST', url: process.env.URL_RD,
          headers: {
            Authorization: process.env.TOKEN_RD
          },
          data: item
        });
        console.log(request.data);
      });
      
    } catch (error) {
        console.log(error.response.data);
    }    
}
//
app();