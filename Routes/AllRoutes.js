import express from "express";
import {
  AddFollowUp,
  ConfirmMeeting,
  CreateAllMeeting,
  CreateMeeting,
  DeleteAllMeeting,
  DeleteMeeting,
  GetAllMeetingId,
  GetAllUserMeeting,
  GetMeeting,
  GetMeetingId,
  RescheduleMeeting,
  updateAllMeeting,
  updateMeeting,
} from "../API/MeetingApi.js";
import {
  createLead,
  deleteAllLead,
  deleteLead,
  GetAllLeadId,
  GetAllUserLead,
  GetLead,
  GetLeadId,
  updateAllLead,
  updateLead,
} from "../API/LeadApi.js";
import {
  getAllUser,
  getUserProfile,
  Login,
  Logout,
  Registration,
} from "../API/Login/LoginApi.js";
import AuthMiddleware from "../API/Login/AuthMiddleware.js";
import { createArea, GetAllArea } from "../API/AreaApi.js";

const Route = express.Router();

/* .........................
Area Route
.......................... */
Route.post("/addarea", createArea);
Route.get("/getallarea", GetAllArea);

/* .........................
Lead Route
.......................... */
Route.post("/addlead", AuthMiddleware, createLead);
Route.get("/getalllead", AuthMiddleware, GetLead);
Route.get("/getbyidlead/:id", AuthMiddleware, GetLeadId);
Route.put("/updatelead/:id", AuthMiddleware, updateLead);
Route.delete("/deletelead/:id", AuthMiddleware, deleteLead);

// all client data
Route.get("/getalluserlead", GetAllUserLead);
Route.get("/getallleadid/:id",  GetAllLeadId);
Route.put("/updatealllead/:id", updateAllLead);
Route.delete("/deletealllead/:id", deleteAllLead);

/* .........................
Meeting Route
.......................... */
Route.post("/addmeeting", AuthMiddleware, CreateMeeting);
Route.get("/getallmeeting", AuthMiddleware, GetMeeting);
Route.get("/getbyidmeeting/:id", AuthMiddleware, GetMeetingId);
Route.put("/updatemeeting/:id", AuthMiddleware, updateMeeting);
Route.delete("/deletemeeting/:id", AuthMiddleware, DeleteMeeting);

// all meeting data 
Route.post("/addallmeeting", CreateAllMeeting);
Route.get("/getallusermeeting", GetAllUserMeeting);
Route.get("/getallmeetingid/:id", GetAllMeetingId);
Route.put("/updateallmeeting/:id", updateAllMeeting);
Route.delete("/deleteallmeeting/:id", DeleteAllMeeting);


Route.put("/reschedule-meeting/:id", RescheduleMeeting);
Route.put("/followup-meeting/:id", AddFollowUp);
Route.put("/confirm-meeting/:id", ConfirmMeeting)

Route.post("/register", Registration);
Route.post("/login", Login);
Route.post("/logout", AuthMiddleware, Logout);
Route.get("/getuser", AuthMiddleware, getUserProfile);
Route.get("/getalluser", getAllUser);

export default Route;
