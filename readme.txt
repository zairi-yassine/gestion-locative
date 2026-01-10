
Firebase integration notes
- Backend:
	- Add a Firebase service account and set one of these environment variables in `backend/.env`:
		- `FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json`
		- or `FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'` (full JSON string)
	- The backend now initializes Firebase Admin at `backend/src/firebaseAdmin.js` and uses `backend/src/middleware/firebaseAuthMiddleware.js` to verify ID tokens for protected routes.
	- Ensure `MONGODB_URI` is set in `.env`.

- Mobile (Expo):
	- Install Firebase web SDK in the `mobile` package:
		```bash
		cd mobile
		npm install firebase
		```
	- Fill `mobile/services/firebase.ts` with your Firebase config values or provide them via Expo public env vars (`EXPO_PUBLIC_FIREBASE_*`).
	- The mobile app uses Firebase Auth to sign in/register and stores the Firebase ID token via the existing `mobile/utils/auth.ts` utilities. API requests include the ID token in `Authorization: Bearer <idToken>` and the backend verifies it.

Security notes
- Never commit service account JSON to source control. Use secrets manager or store it outside the repo and reference via `FIREBASE_SERVICE_ACCOUNT_PATH`.

