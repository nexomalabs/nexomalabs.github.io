The App Store link works, and the Hundy page now uses the official "Download on the App Store" badge. The Google Play badge is in the page but hidden until you have the Play Store link.

**The link:** it opens a live listing for "Hundy: Push-Up Counter", sold by Nexoma Labs LLC. It's free, in Health & Fitness, rated 4+, and needs iOS 16.4 or later.

**The badges** are Apple's and Google's own artwork, saved in [hundy/assets/badges/](hundy/assets/badges/). I didn't redraw them, because both companies require the original images. The only change I made was trimming the empty transparent border off Google's PNG, so both badges line up at the same height.

**Changes to [hundy/index.html](hundy/index.html):** the page still read as if the app hadn't launched, so I updated these spots:
- **Hero:** "Coming to the App Store" is now the App Store badge.
- **Closing section:** "Tell me when it launches" is now the App Store badge too.
- **Top menu:** "Get notified" is now "Download" and goes to the App Store.
- **Small text under the badges:** now reads "Free on iPhone. No account. No ads. Android coming soon."

I checked it in screenshots at desktop and phone width. With Google Play turned on, both badges fit side by side, even on a narrow phone.

**To turn on Google Play** when the app goes live, edit the two places marked with a `<!-- Google Play -->` comment (one in the hero, one in the closing section):
1. Replace `PACKAGE_NAME` in the link with the Android app ID, e.g. `com.nexomalabs.hundy`.
2. Delete the word `hidden`.

If you tell me the app ID now, I can fill it in so that turning it on is just step 2.

I haven't committed anything. You're on the `kidiverse-public-documents` branch, which has nothing to do with Hundy, so you might want these changes on their own branch.

Two more things I can do if you'd like:
- **A Safari banner:** add one line so iPhone visitors get Apple's "Open in App Store" banner at the top of the page.
- **Homepage card:** update the Hundy card on the main nexomalabs.com page, which still only says "Visit site".