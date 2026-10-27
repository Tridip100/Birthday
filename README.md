# A Little Universe Made for You

An eleven-chapter, mobile-friendly birthday experience with a blush scrapbook look, a moonlit wish-constellation, a full-screen bouquet reveal, and an endless photo finale. No build tools are required: open `index.html` in a browser, or upload this whole folder to Netlify, Vercel, or GitHub Pages.

## Personalise it

1. Open `assets/js/content.js` and replace the placeholder words. This is the only file you need to edit for names, letters, quiz questions, flower reasons, gifts, bucket-list wishes, the four little notes, secret word, final promise, birthday message, and endless gallery captions.
2. Put six photos for each year in `assets/images/memories/YEAR/`, named `01.jpg` through `06.jpg`. For example, your 2021 photos go in `assets/images/memories/2021/01.jpg` to `06.jpg`. The years shown are configured in `assets/js/content.js`; missing photos deliberately show a polished placeholder until you add them.
3. Put the twelve default ending-gallery photos in `assets/images/forever/`, named `01.jpg` through `12.jpg`. They appear in the soft endless-scroll finale; add more scene objects in `assets/js/content.js` if you want more photos.
4. Put your music file in `assets/audio/song.mp3`. It starts only when she presses the music button, which avoids browser autoplay blocking.
5. To test a particular part, open `index.html?chapter=6` (use any chapter number from `0` to `11`). The site normally remembers progress in the browser automatically.

For a complete, no-code personalisation checklist, see `CUSTOMIZE.md`.

## Project map

- `index.html` — page structure only
- `assets/css/masterpiece.css` — final visual direction, contrast, responsive layout, and animations
- `assets/css/styles.css` — small shared foundation styles
- `assets/js/content.js` — every personal word and image path; customise this
- `assets/js/app.js` — interactions and progress saving; normally leave this alone
- `assets/images/` — personal photos
- `assets/audio/` — optional music

## Privacy

Personal photos and letters are not protected merely because a hosted URL is unlisted. Use password protection or a private host if that matters. The website does not upload photos or contact any external service (apart from loading the three displayed fonts from Google).
