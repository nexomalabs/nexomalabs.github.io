# FAQ

_The questions people ask about camera-based rep counting._

**Last updated:** 2026-11-04

## Does Hundy record or upload video?

No. Frames are analysed as they arrive and discarded immediately. No image or video is ever written to storage or sent anywhere — not even if you join the weekly challenge, which only sends your name, country and workout totals.

## Do I need an account?

No. Hundy works fully offline with no sign-in. The optional weekly challenge does not need an account either: there is no email and no password, just a private key your phone keeps in its secure storage. Counting will never be behind a sign-in.

## What is the dashed figure doing push-ups on my screen?

That is the setup guide, and it appears before you press Start. It shows the placement and the depth Hundy is looking for, so you can line yourself up with it rather than guess. It follows the camera-view switch, it only ever demonstrates a repetition that would count, and it disappears once the countdown starts. It is never counted and never recorded.

## Why did a rep not count?

Hundy tells you the moment it happens, on screen and out loud if the voice coach is on. Usually it is depth or lockout — your hips and even pushing are coached, never a reason to refuse a rep. "Lost you at the bottom" is different: the camera lost sight of you before it could see how deep you went, so it is about the camera, not your form. With the phone in front of you, a rep like that counts, so you only hear this if a hand left the floor; with the phone beside you, you hear it every time. "Stay in frame" means it could not see you for more than two seconds.

When the same reason stops two reps in a row, Hundy says what to change, out loud once and on screen until a rep counts. A set that ends with nothing counted shows what was seen and why instead of closing.

With strict mode off, imperfect reps still count, and the rep-by-rep list for the workout in Progress shows what each one missed.

## Why does my phone show "Demo" during a workout?

On-device pose detection needs a native model that is only present in a development or release build of the app. In Expo Go, on a simulator, or in a build without the model, Hundy runs a synthetic athlete through exactly the same counting pipeline so you can see the product work. It is always labelled, and those sessions are stored with their source recorded so they never masquerade as real training.

## How much history is kept?

Session totals, records and streaks are kept indefinitely — losing training history is the most common complaint about apps in this category and Hundy does not do it. Per-rep form detail is much larger, so it is kept for a window you choose in Settings, twelve weeks by default.

## Why did I not get a reminder today?

The daily reminder is skipped on any day you have already trained — it only exists to nudge you on days you have not. It also stops after two weeks without opening Hundy, and it needs notifications allowed for Hundy in your phone's settings. Open the app and it plans the next two weeks again.

## Does it work with the phone flat on the floor?

It needs to see your body, so a lens pointing at the ceiling will not work. Lean the phone against something so the camera looks at you from the side. Hundy tells you when the view is unusable rather than counting badly.

## Can I put the phone in front of me instead of beside me?

Yes. A low, head-on placement — phone propped in front of you with the lens pointing at your face — is fully supported, and Hundy detects it automatically. It counts depth and lockout normally and judges even pushing, which a side view cannot, because both arms are visible. The one thing it cannot do head-on is judge your body line, since sagging hips move straight away from the lens; Hundy says so on the setup card instead of guessing.

## Can I choose the camera angle myself?

Yes. The workout screen has an Auto / Side view / Front view switch above the start button, before anything is counted. Auto is the default and is right in the ordinary case, so most people never touch it — but pinning a view is there if auto ever gets it wrong, or if you simply want to know which rules will be applied before you get into position. Your choice is remembered, and it is also in Settings under Workout.

## Do I have to look at the camera?

No. Look down naturally. Hundy tracks your shoulders, elbows, wrists and hips — it never needs your face, and it does not care where you are looking.

## Why can I not hear the voice coach?

Check that the voice coach is on in Settings, and turn up your phone's media volume — the one music and videos use. The coach speaks with your iPhone on silent too, and plays over any music rather than stopping it. To work out in silence, turn the voice coach off; every rep still pulses.

## Can I use the back camera?

The workout screen uses the front camera so you can see yourself and the tracking lines while you set up. Back-camera support is on the roadmap for people who prefer to prop the phone facing away.

## What is the weekly challenge?

An optional, free competition between people in the same country. Every strict rep you do on camera after joining counts toward your country's board for the week, which resets every Monday at 00:00 UTC. Hundy offers it once at the end of the welcome screens; you can also join from the workout summary, the Compete tab or Settings.

## Why is my name "Player" and a number?

Hundy suggests a name like "Player 4821" when you first open the app, so nobody has to invent one. Keep it if you would rather not show anything personal on the boards, or change it: before you join, in Settings; after you join, from your name at the top of Settings, once every 30 days.

## Where do I see my rank?

On the workout summary, right after each camera workout once it has uploaded: your place this week in your country and in the world, and how many places the workout moved you up. The Compete tab has the full picture — your league, both boards, this week and all time.

## How do leagues work?

Your first camera workout of the week puts you in a league of up to 30 people in your tier. When the week ends, the top five move up a tier and the bottom five move down — Bronze, Silver, Gold, Platinum, Diamond, Hundy. A league is only people who worked out that week, so you never race empty profiles. Leagues are free for everyone.

## When does the week end?

Monday at 00:00 UTC, for everyone in the world at once. The Compete tab counts down in your own time zone — for example Sunday 8:00 PM in New York, or Monday 2:00 AM in Cairo.

## My workout uploaded late. Why did my league place not change?

League places are decided the moment the week ends, so they are the same for everyone and never change afterwards. A workout that reaches the server later — within two days of the week ending — still counts toward that week's board and your all-time total.

## What does "Free during early access" mean?

The world boards and the all-time boards are free while Hundy is new. Later they may become part of Hundy Plus, an optional subscription. Your league and your country's weekly board will always be free, and so will counting, your history, records and streaks.

## What does "Top 18%" mean?

That you are ahead of at least 82% of the people on that board. On a big board a percentage says more than a place like 4,312th, so the Compete tab shows both when it can.

## What does joining the weekly challenge share?

Your display name, your country, and a summary of each camera workout from the moment you join: when it happened, how long it took, rep counts and the form score. That is all. Never video, images, your email, your location or your contacts — and nothing from before you joined.

## Why did a workout not count toward the challenge?

Hundy tells you on the workout summary. The usual reasons: it was a demo workout rather than a camera one, it happened before you joined, it uploaded more than two days after its week ended, or its numbers did not add up. Only strict reps count, so a workout with strict mode off adds its strict reps and leaves out the ones marked "needs work".

## How do I leave the weekly challenge?

Settings → your name at the top → Leave the challenge. Everything the challenge holds about you is deleted at once. If you are offline, your phone remembers and sends the deletion the next time it can. Your workouts stay on your phone, and you can join again any time.

## How do I delete everything?

Settings → Data and privacy → Delete all data. It clears every workout, rep and setting from the device immediately, and if you joined the weekly challenge it deletes your challenge profile too. Deleting the app clears the device the same way, but does not reach the challenge — leave it first, or it is deleted automatically after a year without workouts. The only other place your history can exist is a device backup of your own, in your iCloud or Google account.

## How do I get help, or send feedback?

Both live at the bottom of Settings. "Contact us" under Help opens an email to support@nexomalabs.com for anything that is broken or confusing. "Share feedback and suggestions" opens an email to hundy@nexomalabs.com for ideas about what Hundy should do next.

Neither sends anything automatically. Each one opens your own mail app with the address filled in, so nothing leaves your phone until you press send.

## Why did Hundy ask me to rate it?

After a new personal best, or when you move up a league, Hundy may show your phone's own rating sheet. It only does this once you have done at least three camera workouts, never for a demo workout, and at most once per version of the app. Apple and Google also limit how often the sheet can appear, and may decide not to show it at all.

Close it and nothing happens. Hundy is never told whether you rated it, or how. To leave a rating or a review at any time, tap Rate Hundy in Settings, which opens Hundy's store page.
