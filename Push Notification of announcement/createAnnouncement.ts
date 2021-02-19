import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

exports.createAnnouncement = functions.firestore.document("Announcements/{orderId}").onCreate(
    async (snapshot, context) => {
        console.log("Just to remove the context not used error" + context.eventId); // the question mark in typescript is usually used to mark parameter as optional
        var message = {
            notification: {
              title: snapshot.data().title,
              body: snapshot.data().description
            },
            // android: {
            //   notification: {
            //     icon: 'stock_ticker_update',
            //     color: '#7e55c3'
            //   }
            // },
            topic: "All",
          };
          
        await admin.messaging().send(message)
    }
);