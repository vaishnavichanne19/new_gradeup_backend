import express from "express";
import {
  AddFollowUp,
  CreateMeeting,
  DeleteMeeting,
  GetAllUserMeeting,
  GetMeeting,
  GetMeetingId,
  RescheduleMeeting,
  updateMeeting,
} from "../API/MeetingApi.js";
import {
  createLead,
  deleteLead,
  GetAllUserLead,
  GetLead,
  GetLeadId,
  updateLead,
} from "../API/LeadApi.js";
import { Subscription } from "../API/subscriptionApi.js";
import { getUserProfile, Login, Registration } from "../API/Login/LoginApi.js";
import AuthMiddleware from "../API/Login/AuthMiddleware.js";

const Route = express.Router();
/* .........................
Lead Route
.......................... */
Route.post("/addlead", AuthMiddleware, createLead);
Route.get("/getalllead", AuthMiddleware, GetLead);
Route.get("/getalluserlead", GetAllUserLead);
Route.get("/getbyidlead/:id", AuthMiddleware, GetLeadId);
Route.put("/updatelead/:id", AuthMiddleware, updateLead);
Route.delete("/deletelead/:id", AuthMiddleware, deleteLead);

/* .........................
Meeting Route
.......................... */
Route.post("/addmeeting", AuthMiddleware,  CreateMeeting);
Route.get("/getallmeeting", AuthMiddleware, GetMeeting);
Route.get("/getallusermeeting", GetAllUserMeeting);
Route.get("/getbyidmeeting/:id", AuthMiddleware, GetMeetingId);
Route.put("/updatemeeting/:id", AuthMiddleware, updateMeeting);
Route.delete("/deletemeeting/:id", AuthMiddleware, DeleteMeeting);

/* .........................
Subscription Route
.......................... */
Route.post("/save-subscription", Subscription);

Route.put("/reschedule-meeting/:id", RescheduleMeeting);
Route.put("/followup-meeting/:id", AddFollowUp);

Route.post("/register", Registration);
Route.post("/login", Login);
Route.get("/getuser", AuthMiddleware, getUserProfile);


export default Route;
