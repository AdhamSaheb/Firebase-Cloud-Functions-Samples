import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();


// Callable funciton to create a user 
exports.createUser = functions.https.onCall(async (data, context) => {

    var firebaseError = "";
    console.log("function was called by user with id  : " + context.auth?.uid || null); // the question mark in typescript is usually used to mark parameter as optional
    if (!data.email || !data.password) return { "status": "failure", "message": "email or password not provided" }
    const email = data.email;
    const password = data.password;
    const placeholder = "https://firebasestorage.googleapis.com/v0/b/spartans-fitness.appspot.com/o/profile_placeholder.png?alt=media&token=8679b63d-43ab-430b-adeb-03ca0eb79f80";
    //craete user using firebase auth
    const firebaseUser = await admin.auth().createUser({ email: email, password: password, displayName: data.firstName, photoURL: placeholder }).catch((err) => {
        console.log("Firebase user creation error " + err);
        firebaseError = err;
    });
    if (firebaseUser) {

        //if user is created, save it to Users collection for custom user
        await db
            .collection("Users")
            .doc(firebaseUser.uid)
            .set(
                {
                    uid: firebaseUser.uid,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    height: data.height,
                    weight: data.weight,
                    gender: data.gender,
                    userRole: data.userRole,
                    //Membership related fields 
                    memStart: new Date(data.memStart),
                    memEnd: new Date(data.memEnd),
                    days: data.days,
                    sessionStart: data.sessionStart,
                    sessionEnd: data.sessionEnd,
                    birthday: new Date(data.birthday),
                    sessionsLeft: data.sessionsLeft,
                    //Constants :
                    firstLogIn: true,
                    profilePicURL: placeholder,
                    planId: "notSet",
                    deviceToken: "0",
                    SessionsIds: [],




                },
                { merge: true }
            )
            .then(() => {
                console.log("User Created");
                return {
                    "status": "success",
                    "uid": firebaseUser.uid
                };
            })
            .catch((err) => {
                console.log("Error Creating user : " + err);
                return {
                    "status": "failure",
                    "message": "User Creation Error"
                };
            });
    }
    else return { "status": "failure", "message": "User Creation Error : " + firebaseError };
    return {
        "status": "success",
        "uid": firebaseUser.uid
    };

});

module.exports.createUser = exports.createUser;