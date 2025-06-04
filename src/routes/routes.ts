import express from "express";
import { registerUser, loginUser } from "../auth/auth";

import { getLocation, createLocation } from "../logic/location"
import { getSportType } from "../logic/sport_type"
import { 
    getActivity, 
    createActivity, 
    updateActivity,
    deleteActivity,
    joinActivity, 
    startActivity,
    stopActivity,
    deleteActivityParticipant,
    getMyActivity,
} from "../logic/activity"
import { getChatSystem } from "../logic/chat";
import { getStretch } from "../logic/stretch"
import { 
    createPlanningDay,
    getPlanningDay, 
    deletePlanningDay, 
    updateWorkoutStatus 
} from "../logic/planning_day"
import {
    createPlanningWeek, 
    getPlanningWeek, 
    updateCurrentProgress
} from "../logic/planning_week"
import {
    getUser,
    updateUser
} from "../logic/user"


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// User Sys
router.post("/user.get", getUser);
router.post("/user.update", updateUser)

// Location
router.post("/location.get", getLocation);
router.post("/create_location.post", createLocation);


// Sport Type
router.post("/sport_type.get", getSportType);


// Activity
router.post("/activity.get", getActivity)
router.post("/create_activity.post", createActivity)
router.post("/activity.update", updateActivity)
router.post("/activity.delete", deleteActivity)
router.post("/activity.join", joinActivity)
router.post("/activity.start", startActivity)
router.post("/activity.stop", stopActivity)
router.post("/activity.cancel", deleteActivityParticipant)
router.post("/activity.my.get", getMyActivity)

// Chat System
router.post("/chat.get", getChatSystem)

// Stretch
router.post("/stretch.get", getStretch)

//Planningday
router.post("/planningday.create", createPlanningDay);
router.post("/planningday.get", getPlanningDay);
router.post("/planningday.delete", deletePlanningDay);
router.post("/planningday.updateStatus", updateWorkoutStatus);

//Planningweek
router.post("/planningweek.create", createPlanningWeek);
router.post("/planningweek.get", getPlanningWeek);
router.post("/planningweek.updateProgress", updateCurrentProgress);
export default router;
