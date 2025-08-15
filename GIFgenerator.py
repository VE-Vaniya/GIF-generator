import imageio.v3 as iio  #import imageio for reading and writing images

# gif generation function
def create_gif(image_paths, output_path, duration=500):
    """Function for creating a GIF from a list of image paths."""


files  = ['i1.png', 'i2.png', 'i3.png']   #file paths to images
image = []  #list to store images
for filename in files:
    image.append(iio.imread(filename))  #read each image and append to the list

 #output the GIF with specified duration(500 ms time for each image) and loop count
iio.imwrite('output.gif', image, duration=500, loop = 0)