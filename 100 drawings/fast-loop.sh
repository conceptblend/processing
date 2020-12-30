# Grab every 10th frame and scale up to 1080px
# -> output_fast.mp4
ffmpeg -r 30 -f image2 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p -filter:v "scale=1080:-2" output_fast2.mp4

# Create a copy of the sped up version in REVERSE
# -> output_fast_rev.mp4
ffmpeg -i output_fast2.mp4 -vf reverse output_fast_rev2.mp4

# Concatenate the two files so it can loop nicely
# -> output_looped.mp4
echo "file 'output_fast2.mp4'" > list.txt
echo "file 'output_fast_rev2.mp4'" >> list.txt
ffmpeg -f concat -i list.txt -c copy output_loop2.mp4


