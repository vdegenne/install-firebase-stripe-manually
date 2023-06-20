# install-firebase-stripe-manually

This is a fork of [firestore-stripe-payments](https://github.com/stripe/stripe-firebase-extensions/tree/master/firestore-stripe-payments).
It was modified so you can deploy the functions manually and have more control of the implementation.

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

to have more control over the custom claims, check the `fcc` branch of this repository.


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

// User needs to be authenticated
const createPortalLinkFunction = httpsCallable(functions, 'createPortalLink');

createPortalLinkFunction({returnUrl: window.location.origin}).then(
  ({data}: {data: Stripe.BillingPortal.Session}) => {
    if (data.url) {
      window.open(data.url, '_blank');
    }
  }
);

```

### Provide the receipt

### Disconnect a user from a firebase function

In case you want to logout a user if his subscription was revoked.

```typescript
admin.auth().revokeRefreshTokens(uid);
```
