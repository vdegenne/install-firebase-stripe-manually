# install-firebase-stripe-manually

This is a fork of [firestore-stripe-payments](https://github.com/stripe/stripe-firebase-extensions/tree/master/firestore-stripe-payments).
It was modified so you can deploy the functions manually and have more control over the implementation.

Few things have been modified:

### webhook handler to normal function

```typescript
export const handleWebhookEvents = functions.handler.https.onRequest(
```
to
```typescript
export const handleWebhookEvents = functions.https.onRequest(
```

### env file

There is a `.env` file at the root where you can add your secrets.

### one-time payment custom claims

to have more control over the custom claims, check the `fcc` branch on this repository.


# Stripe/Firebase snippets

### Open new checkout session

```typescript
// TODO: check if a session is already opened
const sessionRef = addDoc(collection(firestore, 'user', uid, 'checkout_sessions'), {
  // mode: 'payment',
  price: '...',
  success_url: `${window.location.origin}#checkout_success`,
  cancel_url: `${window.location.origin}#checkout_cancel`,
  // billing_address_collection: 'auto'
} as Stripe.Checkout.SessionCreateParams)

const unsubscribe = onSnapshot(sessionRef, (snap) => {
  const {url} = snap.data();
  if (url) {
    unsubscribe();
    window.location.href = url;
  }
})
```

### Open a billing portal

```typescript
import {getFunctions, httpsCallable} from 'firebase/functions';

const functions = getFunctions();

// User needs to be authenticated
const createPortalLink = httpsCallable(functions, 'createPortalLink');

createPortalLink({returnUrl: window.location.origin}).then(
  ({data}: {data: Stripe.BillingPortal.Session}) => {
    if (data.url) {
      window.open(data.url, '_blank');
    }
  }
);
```

### Provide the receipt

```typescript
async function getReceiptUrl(uid: string) {
	// This will just get the receipt of the last succeeded payment
	const q = query(
		collection(firestore, 'customers', uid, 'payments'),
		where('status', '==', 'succeeded'),
		orderBy('created', 'desc'),
		limit(1)
	);
	const paymentsSnap = await getDocs(q);
	if (paymentsSnap.size !== 1) {
		return;
	}
	const {charges} = paymentsSnap.docs[0].data() as Stripe.PaymentIntent;

	return charges.data[0].receipt_url;
}
```

### Disconnect a user from a firebase function

In case you want to logout a user if his subscription was revoked.

```typescript
admin.auth().revokeRefreshTokens(uid);
```
