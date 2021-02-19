/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
//import { user } from "firebase-functions/lib/providers/auth";
const db = admin.firestore();
/**
 * Run once a day at 12 pm, to wish user a happy birthday
 * Manually run the task here https://console.cloud.google.com/cloudscheduler
 */


exports.notifyBirthday = functions.pubsub.schedule("every day 02:00").onRun(async context => {
    //use context 
    console.log("Called By : " + context.auth?.uid.toString());
    // Fetch all user details.
    const usersWithBirthday = await getUsersWithBirthday();
    var tokens: string[] = [];
    console.log("Length = " + usersWithBirthday.length);
    //usersWithBirthday.forEach((user) => tokens.push(user.data().deviceToken));
    var message = {
        notification: {
            title: "Happy Birthday",
            body: "Happy Birthday From Sprantans Fitness !"
        },
        tokens: tokens,
    };
    await admin.messaging().sendMulticast(message)


    console.log("User Notify finished");

});



/**
* Returns the list of birthday users
*/
async function getUsersWithBirthday(users: any[] = []) {

    const today = new Date();
    // console.log("today object : " + today);
    // console.log("today expanded : " + today.getUTCDate() + "=" + today.getUTCMonth());
    const result = await db
        .collection("Users")
        .get();
    //console.log("Today = " + today.getDate() + " - " + today.getMonth());
    // Find users that have birthday today
    result.docs.forEach(

        user => {
            const bdate = new Date(Date.parse(user.data().birthday.toDate()));

            //check if today and birthday are identical
            if (bdate.getUTCDate() == today.getUTCDate() && bdate.getUTCMonth() == today.getUTCMonth()) {
                users.push(user);
            }
        }
    );
    console.log("Number of Birthdays Today : " + users.length);

    return users;
}


