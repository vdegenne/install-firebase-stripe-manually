import admin from 'firebase-admin';
import {initializeApp} from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};

// Uncomment the following to use with the emulator.
// process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

/**
 * PARAMS */
const UID = '5YxTDXUlChw1q4vwoft2PDlJTn7s';
const CUSTOM_CLAIMS_TO_ADD = {
	// stripeRole: null,
	CUSTOMCLAIM: 'test',
};

initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

try {
	const {customClaims} = await admin.auth().getUser(UID);

	await admin.auth().setCustomUserClaims(UID, {...customClaims, ...CUSTOM_CLAIMS_TO_ADD});

	console.log('CUSTOM CLAIMS ADDED SUCCESSFULLY');
} catch (err) {
	console.log(err.message);
	console.error('USER NOT FOUND');
	process.exit(1);
}
