import * as functions from 'firebase-functions';
import * as admin from'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firestore-grafica-15bf5.firebaseio.com"
});

const db = admin.firestore();
const app = express();
app.use(cors({origin :true}));

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

app.get('/games', async(req,res)=>{

    const games = db.collection("games");
    const docsSnap = await games.get();
    const listGames = docsSnap.docs.map(doc => doc.data());
    res.json(listGames);
});

app.post("/games/:id",async(req,res)=>{
    const id = req.params.id;
    const gameRef = db.collection("games").doc(id);
    const gamesSnap = await gameRef.get();
    if(!gamesSnap.exists){
        res.status(404).json({
            ok:false,
            message : 'The game not exists'
        });
    }else {
        const last = gamesSnap.data() || {votes : 0}
        await gameRef .update({
            votes : last.votes + 1
        });
        res.json({
            ok:true,
            message : `your vote went to ${last.name}`
        });
    }
});

export const api = functions.https.onRequest(app);



