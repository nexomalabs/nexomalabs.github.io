# Privacy Policy

Last updated: June 1, 2026

## 1. Information We Collect

When you use Fitly, we collect the following types of information:

- **Account Information:** Name, email address, date of birth, gender, and password (hashed).
- **Profile Information:** Height, weight, fitness level, fitness goals, bio, profile photo, and city.
- **Activity Data:** Gym schedules, match requests, messages, game participation, workout/nutrition preferences, and onboarding completion status.
- **Shared Game Link Data:** Public game IDs and shareable game URLs used to access individual game details pages.
- **Location Data:** When you grant permission, your device's geolocation is used to find nearby gyms and parks. This data is processed in real-time and only stored when explicitly saved by you.
- **Authentication Data:** If using a third-party sign-in (Google, Facebook), we store the provider ID and email address; no third-party passwords are stored.

## 2. How We Use Your Information

We use collected information to:

- Provide and maintain the App's features (matching, scheduling, games)
- Calculate and display health metrics (BMI, BMR, TDEE)
- Generate personalized exercise and nutrition plans
- Facilitate communication between matched users and show invited, pending, and accepted workout sessions
- Send notifications about match requests, game updates, and messages
- Make your saved availability visible to compatible users so they can discover and invite you

## 3. Data Storage & Security

Your data is stored securely in MongoDB Atlas. Passwords are hashed using bcrypt. Authentication uses JSON Web Tokens (JWT) with server-configured expiry.

## 4. Third-Party Services

We use the following third-party services:

- **MongoDB Atlas:** Cloud database storage with encryption at rest and in transit.
- **Google / Facebook OAuth:** Optional sign-in methods. We only store the provider ID and email address for authentication purposes.
- **OpenStreetMap / Nominatim:** Map display and location search (city autocomplete). Search queries are not stored.
- **Expo / Push providers:** For push notifications via the mobile app.

## 5. Data Sharing

We do not sell, trade, or rent your personal information to third parties. Your data may be shared:

- With other users as part of the App's features (e.g., your photo, name, fitness level, bio, city, and workout schedule may be visible to potential gym buddies)
- When required by law or legal process

## 6. Cookies

The App stores your authentication token in memory for session management. We do not use tracking cookies for advertising.

## 7. Your Rights

You have the right to:

- **Access:** View your personal data on your profile
- **Update:** Edit your personal information at any time
- **Delete:** Permanently delete your account and associated data (see [Data Deletion](data-deletion))

## 8. Data Retention

Your data is retained as long as your account is active. When you delete your account, personal data, schedules, matches, messages, and game participation records are deleted or anonymized according to our retention policy.

## 9. Children's Privacy

The App is not intended for users under 18 years of age. We do not knowingly collect personal information from anyone under 18. If discovered, such data will be promptly deleted.

## Push Notifications & Local Notification Storage

We use push notifications to keep you informed about match requests, game updates, and messages. To deliver push notifications we rely on Expo's push service and the `expo-notifications` library in the mobile app.

We store a user's Expo push token on the user's profile exclusively for delivering push messages. If you do not wish to receive push notifications, you can disable them in your device settings or revoke notification permissions in the app. To stop server-side delivery for your account, remove the push token in Settings or contact support@fitly.live.

## 10. Changes to This Policy

We may update this Privacy Policy periodically. Changes will be reflected on this page with an updated "Last updated" date. Continued use of the App constitutes acceptance of the updated policy.

## 11. Contact

For privacy-related questions or data requests, contact us at [support@fitly.live](mailto:support@fitly.live) or visit [https://www.fitly.live](https://www.fitly.live).
