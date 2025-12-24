import express from "express";
import {
  AddFollowUp,
  CreateMeeting,
  DeleteMeeting,
  GetMeeting,
  GetMeetingId,
  RescheduleMeeting,
  updateMeeting,
} from "../API/MeetingApi.js";
import {
  createLead,
  deleteLead,
  GetLead,
  GetLeadId,
  updateLead,
} from "../API/LeadApi.js";
import { Subscription } from "../API/subscriptionApi.js";

const Route = express.Router();
/* .........................
Lead Route
.......................... */
Route.post("/addlead", createLead);
Route.get("/getalllead", GetLead);
Route.get("/getbyidlead/:id", GetLeadId);
Route.put("/updatelead/:id", updateLead);
Route.delete("/deletelead/:id", deleteLead);

/* .........................
Meeting Route
.......................... */
Route.post("/addmeeting", CreateMeeting);
Route.get("/getallmeeting", GetMeeting);
Route.get("/getbyidmeeting/:id", GetMeetingId);
Route.put("/updatemeeting/:id", updateMeeting);
Route.delete("/deletemeeting/:id", DeleteMeeting);

/* .........................
Subscription Route
.......................... */
Route.post("/save-subscription", Subscription);

Route.put("/reschedule-meeting/:id", RescheduleMeeting);
Route.put("/followup-meeting/:id", AddFollowUp);



export default Route;
