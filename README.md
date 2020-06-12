# processing
Collection of Processing apps

## 100 Drawings
This sub-project uses p5.js and are just being composed using the online editor at [https://editor.p5js.org/](https://editor.p5js.org/).

### ffmpeg reminder cheatcodes

```shell
# 1024x1024 @ 30 fps
ffmpeg -r 30 -f image2 -i "%07d.png" -vf scale=1024:-2 -vcodec libx264 -crf 17 -pix_fmt yuv420p output-1024.mp4

# 500x500 @ 30 fps
ffmpeg -r 30 -f image2 -i "%07d.png" -vf scale=500:-2 -vcodec libx264 -crf 17 -pix_fmt yuv420p output-500.mp4
```