## 100 Drawings
This sub-project uses p5.js and are just being composed using the online editor at [https://editor.p5js.org/](https://editor.p5js.org/).

### ffmpeg reminder cheatcodes

```shell
# 1024x1024 @ 30 fps
ffmpeg -r 30 -f image2 -i "%07d.png" -vf scale=1024:-2 -vcodec libx264 -crf 17 -pix_fmt yuv420p output-1024.mp4

# 500x500 @ 30 fps
ffmpeg -r 30 -f image2 -i "%07d.png" -vf scale=500:-2 -vcodec libx264 -crf 17 -pix_fmt yuv420p output-500.mp4

# No resize @ 8 fps
ffmpeg -r 8 -f image2 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4

# Grab every 10th frame and scale up to 1080px
# -> output_fast.mp4
ffmpeg -r 24 -f image2 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p -filter:v "setpts=0.1*PTS,scale=1080:-2" output_fast.mp4

# Create a copy of the sped up version in REVERSE
# -> output_fast_rev.mp4
ffmpeg -i output_fast.mp4 -vf reverse output_fast_rev.mp4

# Concatenate the two files so it can loop nicely
# -> output_loop.mp4
echo "file 'output_fast.mp4'" > list.txt
echo "file 'output_fast_rev.mp4'" >> list.txt
ffmpeg -f concat -i list.txt -c copy output_loop.mp4
```