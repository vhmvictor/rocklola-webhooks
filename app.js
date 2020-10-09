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
app.post("order_created_hook", async (req, res, next) => {
    try {
        nuvemshop.config({
          store_id: process.env.STORE_ID,
          access_token: process.env.ACCESS_TOKEN,
          user_agent: process.env.USER_AGENT
        });
        let order = await nuvemshop.getOrder(req.body.id);
        console.log(order);
        res.send(order);
    } catch (error) {
        console.log(error.response.data);
    }
})
//
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor iniciado!");
});