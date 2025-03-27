import nodemailer from 'nodemailer';
import { ObjectId } from "mongodb";
import dbCon from '../dbConfig.js';
import * as helper from '../helper.js';

// const print =(...args) => console.log(args);
const table = await dbCon();
const login = async (req, res, next) => {
  const { userName, password } = req.body;
  try {
    // print({ userName, password });
    const fetchUser = await table.find({ email: userName }).toArray();
    if (fetchUser.length > 0) {
      const user = fetchUser[0];
      // console.log(user.password , password);
      
      if (user.password === password) {
        const jwt = helper.jwtSign({ userName: user.name, email: user.email, _id: user._id });
        res.status(200).json({ status: 200, message: "Login successful", body: { jwt } });
      } else {
        throw { status: 400, message: "Wrong password" };
      }
    } else {
      throw { status: 400, message: "You are not a part of our journey!!!" };
    }
  } catch (err) {
    next(err, res);
  }
};

const addLoans = async (req, res, next) => {
  let request = req.body;
  try {
    request = helper.addCreatedAndUpdated(request);
    request.type = "loans";
    request.loanAmount = Number(request.loanAmount);
    request.dueAmount = Number(request.dueAmount);
    request.pendingAmount = Number(request.loanAmount);
    await table.insertOne({ ...request });
    res.status(200).json({ status: 200, message: "Added successfully" });
  } catch (err) {
    next(err, res);
  }
};

const fetchLoans = async (req, res, next) => {
  try {
    let fetchData = await table.find({ type: "loans" }).toArray();
    fetchData = fetchData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    res.status(200).json({ status: 200, body: { results: fetchData } });
  } catch (err) {
    next(err, res);
  }
};

const fetchHistories = async (req, res, next) => {
  try {
    let fetchData = await table.find({ type: "histories" }).toArray();
    fetchData = fetchData.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    res.status(200).json({ status: 200, body: { results: fetchData } });
  } catch (err) {
    next(err, res);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { user, name, email } = req.body;
    await validatedEmail({ email , _id: user._id });
    const updatedData = { name, email, updatedAt: new Date().toISOString() };
    await table.updateOne({ _id: new ObjectId(user._id) }, { $set: updatedData });
    const jwt = helper.jwtSign({ userName: name, email, _id: user._id });
    res.status(200).json({ status: 200, message: "Profile updated successfully", body: { jwt } });
  } catch (err) {
    next(err, res);
  }
};

const addDue = async (req, res, next) => {
  try {
    const request = req.body;
    request.updateData.pendingAmount = Number(request.updateData.pendingAmount) - Number(request.dueAmount);
    if (request.updateData.pendingAmount <= 0) request.updateData.status = false;
    const cleanData = {name: request.updateData.name,place:request.updateData.place,contactNumber: request.updateData.contactNumber, pendingAmount: request.updateData.pendingAmount}; 
    console.log(cleanData);
    
    await table.updateOne({ _id: new ObjectId(request.updateId) }, { $set: cleanData });
    let history = {
      authorId: request.user._id,
      authorName: request.user.userName,
      loanId: request.updateId,
      loanerName: request.updateData.name,
      type: "histories",
      loanAmount: request.updateData.loanAmount,
      pendingAmount: request.updateData.pendingAmount,
      paidDue: request.dueAmount,
    };
    history = helper.addCreatedAndUpdated(history);
    await table.insertOne({ ...history });
    res.status(200).json({ status: 200, message: "Success" });
  } catch (err) {
    next(err, res);
  }
};

const addProfile = async (req, res, next) => {
  try {
    let request = req.body;
    request = helper.addCreatedAndUpdated(request);
    await validatedEmail(request);
    await table.insertOne(request);
    res.status(200).json({ status: 200, message: "Successfully updated" });
  } catch (err) {
    next(err, res);
  }
};

//write function for check duplicate mail or not  
const validatedEmail = async (request) => {
  try {
    const fetchUser = await table.find({ email: request.email }).toArray();
    if (fetchUser.length > 0) {
      if(fetchUser[0]._id.toString() === request._id) return;
      console.log("Email already exists");
      
      throw { status: 400, message: "Email already exists" };
    }
  } catch (err) {
    throw err;
  }
};


export default { login, addLoans, fetchLoans, addDue, fetchHistories, addProfile, updateProfile };