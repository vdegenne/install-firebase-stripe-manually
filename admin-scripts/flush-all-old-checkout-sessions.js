import admin from 'firebase-admin';
import {initializeApp, cert} from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

// Uncomment the following to use with the emulator.
// process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

initializeApp({
	credential: cert(serviceAccount),
	databaseURL: 'http://localhost:8080',
});

/**
 * BEFORE_AGO
 * How many milliseconds from now you want to delete checkout sessions
 * older than this time.
 */
const BEFORE_AGO = 1000 * 60 * 60 * 24 * 1; // 1 day

const currentTime = new Date();
const pointInTime = new Date(currentTime);
pointInTime.setTime(pointInTime.getTime() - BEFORE_AGO);

const firestore = admin.firestore();

// TODO: should also delete checkout with errors?
const checkoutsSnap = await firestore
	.collectionGroup('checkout_sessions')
	.where('created', '<', pointInTime)
	.select('created')
	.get();

checkoutsSnap.forEach((snap) => snap.ref.delete());
