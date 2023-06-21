import admin from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const user = await admin.auth().getUser('sdf');
console.log(user);
