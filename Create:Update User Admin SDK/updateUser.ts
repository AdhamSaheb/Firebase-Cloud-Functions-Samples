import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();

// Callable function to Update users password 
exports.updatePassword = functions.https.onCall(async (data, context) => {
    var firebaseError = "";
    console.log("function was called by user with id  : " + context.auth?.uid || null); // the question mark in typescript is usually used to mark parameter as optional
    //check if id for user to be updated is proivded 
    if (!data.uid) {
        console.log("UID not provided");
        return { "status": "failure", "message": "uid not provided" }
    }
    const uid = data.uid;

    //update user using firebase auth
    const res = await admin.auth().updateUser(uid,
        {
            password: data.password,
        }

    ).catch((err) => {
        console.log("Firebase password update error " + err);
        firebaseError = err;
    });

    if (res) {
        return {
            "status": "success",
        };
    }
    else return { "status": "failure", "message": "User password update Error : " + firebaseError };


});

// Callable function to Update users password 
exports.updateUser = functions.https.onCall(async (data, context) => {

    var firebaseError = "";
    console.log("function was called by user with id  : " + context.auth?.uid || null); // the question mark in typescript is usually used to mark parameter as optional
    //check if id for user to be updated is proivded 
    if (!data.uid) return { "status": "failure", "message": "uid not provided" }
    const uid = data.uid;

    //update user using firebase auth
    const res = await admin.auth().updateUser(uid,
        {
            email: data.email,
            photoURL: data.profilePicURL,
            displayName: data.firstName
        }

    ).catch((err) => {
        console.log("Firebase user creation error " + err);
        firebaseError = err;
    });

    if (res) {
        //if user is updated , update the other attributes in the collection  uers 
        await db
            .collection("Users")
            .doc(uid)
            .set(
                {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    height: data.height,
                    weight: data.weight,
                    gender: data.gender,
                    userRole: data.userRole,
                    profilePicURL: data.profilePicURL,
                    //Membership related fields 
                    memStart: new Date(data.memStart),
                    memEnd: new Date(data.memEnd),
                    days: data.days,
                    sessionStart: data.sessionStart,
                    sessionEnd: data.sessionEnd,
                    birthday: new Date(data.birthday),
                    sessionsLeft: data.sessionsLeft,
                },
                { merge: true }
            )
            .then(() => {
                console.log("User Updated");
                return {
                    "status": "success",

                };
            })

    }
    else return { "status": "failure", "message": "User Update Error : " + firebaseError };
    return {
        "status": "success",

    };

});

module.exports.updatePassword = exports.updatePassword;
module.exports.updateUser = exports.updateUser;