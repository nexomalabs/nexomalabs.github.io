# FAQ

_The questions people ask about camera-based rep counting._

**Last updated:** 2026-08-24

## Does Hundy record or upload video?

No. Frames are analysed as they arrive and discarded immediately. Nothing is written to storage, nothing is sent anywhere, and Hundy has no server to send it to.

## Do I need an account?

No. Hundy works fully offline with no sign-in. Accounts will only ever be needed for features that genuinely require a server, such as cloud backup and leaderboards, and counting will never be behind one.

## What is the dashed figure doing push-ups on my screen?

That is the setup guide, and it appears before you press Start. It shows the placement and the depth Hundy is looking for, so you can line yourself up with it rather than guess. It follows the camera-view switch, it only ever demonstrates a repetition that would count, and it disappears once the countdown starts. It is never counted and never recorded.

## Why did a rep not count?

Almost always depth or body line. Open the workout in Progress and look at the rep-by-rep list — each rep says exactly what was missing. If Hundy could not see you properly, the reps around it will say "stay in frame".

## Why does my phone show "Demo" during a workout?

On-device pose detection needs a native model that is only present in a development or release build of the app. In Expo Go, on a simulator, or in a build without the model, Hundy runs a synthetic athlete through exactly the same counting pipeline so you can see the product work. It is always labelled, and those sessions are stored with their source recorded so they never masquerade as real training.

## How much history is kept?

Session totals, records and streaks are kept indefinitely — losing training history is the most common complaint about apps in this category and Hundy does not do it. Per-rep form detail is much larger, so it is kept for a window you choose in Settings, twelve weeks by default.

## Does it work with the phone flat on the floor?

It needs to see your body, so a lens pointing at the ceiling will not work. Lean the phone against something so the camera looks at you from the side. Hundy tells you when the view is unusable rather than counting badly.

## Can I put the phone in front of me instead of beside me?

Yes. A low, head-on placement — phone propped in front of you with the lens pointing at your face — is fully supported, and Hundy detects it automatically. It counts depth and lockout normally and judges even pushing more strictly than a side view can, because both arms are visible. The one thing it cannot do head-on is judge your body line, since sagging hips move straight away from the lens; Hundy says so on the setup card instead of guessing.

## Can I choose the camera angle myself?

Yes. The workout screen has an Auto / Side view / Front view switch above the start button, before anything is counted. Auto is the default and is right in the ordinary case, so most people never touch it — but pinning a view is there if auto ever gets it wrong, or if you simply want to know which rules will be applied before you get into position. Your choice is remembered, and it is also in Settings under Workout.

## Do I have to look at the camera?

No. Look down naturally. Hundy tracks your shoulders, elbows, wrists and hips — it never needs your face, and it does not care where you are looking.

## Can I use the back camera?

The workout screen uses the front camera so you can see yourself and the tracking lines while you set up. Back-camera support is on the roadmap for people who prefer to prop the phone facing away.

## How do I delete everything?

Settings → Data and privacy → Delete all data. It clears every workout, rep and setting from the device immediately. Deleting the app does the same thing.

## How do I get help, or send feedback?

Both live at the bottom of Settings. "Contact us" under Help opens an email to support@nexomalabs.com for anything that is broken or confusing. "Share feedback and suggestions" opens an email to hundy@nexomalabs.com for ideas about what Hundy should do next.

Neither sends anything automatically. Each one opens your own mail app with the address filled in, so nothing leaves your phone until you press send.
