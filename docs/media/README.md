# Media

Drop screenshots, GIFs and videos for the main README here.

Suggested names: `screenshot-menu.png`, `screenshot-play.png`, `screenshot-mobile.png`, `gameplay.gif`.

Record a GIF with ffmpeg:

```bash
ffmpeg -i capture.mp4 -vf "fps=15,scale=640:-1:flags=neighbor" gameplay.gif
```

Use `neighbor` scaling to keep the pixel art crisp.
