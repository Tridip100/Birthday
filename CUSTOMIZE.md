# Make It Yours

Everything personal is deliberately kept apart from the design code.

## 1. Write your words

Open `assets/js/content.js`. Replace only the words inside the quotes.

| Moment | What to change |
| --- | --- |
| Secret envelope | `envelope` |
| Years and their captions | `memoryYears` |
| Quiz questions and answers | `quiz` |
| Flower reasons | `reasons` and `bouquet` |
| Three surprise gifts | `gifts` |
| Future wishes | `wishes` |
| Long letter | `letter` |
| Last birthday message | `final` |
| Four “open when” notes, secret word, and final promise | `afterglow` |
| Endless photo-gallery captions and scenes | `endlessGallery` |

For a gift button that opens a playlist, Google Drive note, or private video, paste its full URL into that gift's `link: ""` value. Leave it empty if you do not want a link. Change `linkLabel` to the words she should see on the button.

Inside `afterglow`, personalise each note's `label`, `title`, and `body`. Set `secretWord` to a word only the two of you know (matching ignores capital letters), then replace the lines in `promise` with a final personal promise. You can also tailor `secretPrompt` and `incorrect`.

Inside `endlessGallery`, change each scene's `image`, `eyebrow`, `title`, and `body`. Optional `palette` values are `blush`, `pearl`, `violet`, `peach`, `rose`, and `night`; optional `motion` values are `float-left`, `float-right`, `bloom`, `polaroid`, `orbit`, and `rise`. You can add, remove, or reorder scene objects without touching the design code.

## 2. Add your photos

Each selected year displays **six** scrapbook Polaroids. Paste the photos into the matching folder and name them exactly like this:

```text
assets/images/memories/2024/
  01.jpg
  02.jpg
  03.jpg
  04.jpg
  05.jpg
  06.jpg
```

Use the same `01.jpg` to `06.jpg` pattern for every year. The available year folders already match the starter years in `content.js`. Replace a year name in `content.js` if you want a different timeline. Before photos are added, the page shows a clean “Place photo here” card instead of a broken image.

### Endless final gallery

Put up to **twelve** portrait or landscape photos of her here. Name them exactly `01.jpg` through `12.jpg`; the final chapter repeats the story gently as she keeps scrolling.

```text
assets/images/forever/
  01.jpg
  02.jpg
  03.jpg
  ...
  12.jpg
```

Use only the numbers you have configured in `endlessGallery` inside `assets/js/content.js`. Missing photos show a polished placeholder instead of a broken image. The default twelve scenes repeat forever as she scrolls; for a thirteenth photo, add another scene object and set its image path to `assets/images/forever/13.jpg`.

## 3. Add the song

Put one MP3 file here and name it exactly `song.mp3`:

```text
assets/audio/song.mp3
```

She taps the music button herself, so browsers will allow it to play. Small music notes rise when it starts.

## 4. Preview it

Open `index.html` in a browser. `mou-universe-preview.html` is only a shortcut and automatically opens the same finished page.

To preview a chapter directly, add one of these to the end of the file URL:

```text
?chapter=4   flower garden
?chapter=5   three mystery gifts
?chapter=6   wish constellation
?chapter=7   long letter
?chapter=8   cake finale
?chapter=9   four “open when” notes
?chapter=10  secret promise finale
?chapter=11  endless photo finale
```

Do not edit `assets/js/app.js` or `assets/css/masterpiece.css` for personal words or photos; they contain the interactions and the completed design.
