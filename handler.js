import express from "express";
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());


import services from "./services/index.js";
import * as helper from './helper.js'


app.post('/login', services.common.login);
app.post('/addLoans',helper.validateToken,services.common.addLoans);
app.post('/fetchLoans',helper.validateToken,services.common.fetchLoans);
app.post('/fetchHistories',helper.validateToken,services.common.fetchHistories);
app.post('/addDue',helper.validateToken,services.common.addDue);
app.post('/updateProfile',helper.validateToken,services.common.updateProfile);
app.post('/addProfile',helper.validateToken,services.common.addProfile);
app.post('/validateToken',helper.validateToken,(req,res)=> res.status(200).json({message:"successfully validated"}))

//write function generate llm modal
//write function to add due




app.use((err ,req,res,next) => {
    // console.log({err,res});
    
    const response = {
        status:err?.status || 500,
        message:err?.message || "unknown error",
    };
    
    err?.body ? response["body"] = err.body : "";
    res.status(response.status).json(response);
})

app.use((req,res,next) => {
    next({status:404,message:"not found"})
})      //404 handler       //404 handler           //404 handler

app.listen(process.env.PORT || 3400, async () => {
    console.log("Server running at http://localhost:3400");
  });