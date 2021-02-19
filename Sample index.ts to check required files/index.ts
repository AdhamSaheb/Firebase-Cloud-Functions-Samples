
import * as admin from "firebase-admin";
admin.initializeApp();

const createUserFile = require("./modules/createUser");
const updateUserFile = require("./modules/updateUser");
const createAnnouncementFile = require("./modules/createAnnouncement");

exports.createUser = createUserFile.createUser;
exports.updatePassword = updateUserFile.updatePassword;
exports.updateUser = updateUserFile.updateUser;
exports.createAnnouncement = createAnnouncementFile.createAnnouncement;