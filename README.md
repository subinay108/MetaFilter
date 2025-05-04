# Meta Filter

A repo for what I studies about filters and convolutions in computer vision.

Welcome to the universe of filters

- When we load an image in the web browser through a file upload input, we can read the image file using a **FileReader()** object. We can get the fileObjectURL from this object and we can set the url to the **Image()** object.
- After the image is loaded, we have to draw the image in canvas and from canvas we can get the image data using a method called ctx.getImageData(x, y, width, height)
- This image data has 4 channels **RGBA - Red, Green, Blue & Alpha**, so for an example if an image has size of 200x100, then the size of the image array will be 200\*100\*4 = 80000 and these array elements are stored in a UInt8 datatype