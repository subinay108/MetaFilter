# Meta Filter

A repo for what I studies about filters and convolutions in computer vision.

Welcome to the universe of filters

- When we load an image in the web browser through a file upload input, we can read the image file using a **FileReader()** object. We can get the fileObjectURL from this object and we can set the url to the **Image()** object.
- After the image is loaded, we have to draw the image in canvas and from canvas we can get the image data using a method called ctx.getImageData(x, y, width, height)
- This image data has 4 channels **RGBA - Red, Green, Blue & Alpha**, so for an example if an image has size of 200x100, then the size of the image array will be 200\*100\*4 = 80000 and these array elements are stored in a UInt8 datatype

## Filters:
- **Sobel Filter**: This is an edge detection filter and it can only detect edges in any specific orientation, so there are 4 variations of this filter Sobel Left, Sobel Right, Sobel Up, Sobel Down. Sobel filters are more robust to noise. It also gives smoother edge detection.
```
Sobel Left:
| 1  0  -1 |
| 2  0  -2 |
| 1  0  -1 |

Sobel Right:
| -1  0  1 | 
| -2  0  2 |
| -1  0  1 |

Sobel Up:
|  1   2   1 | 
|  0   0   0 |
| -1  -2  -1 |

Sobel Down:
| -1  -2  -1 | 
|  0   0   0 |
|  1   2   1 |

```

- **Prewitt Filter**: This is a simplified alternative to Sobel.
```
Prewitt Left: 
| 1  0  -1 | 
| 1  0  -1 | 
| 1  0  -1 |

Prewitt Right: 
| -1  0  1 | 
| -1  0  1 | 
| -1  0  1 |

And so on ...

```

- **Laplacian Filter**: This filter is created by using the approximation of second derivative. Unlike Sobel and Prewitt, this filter detects edges from each direction.
```
laplacian-edge:
| 0   1  0 |
| 1  -4  1 |
| 0   1  0 |
```

- **Blur**: This filter blur the image and its also used in denoising
```
Blur:
| 0.0625  0.125  0.0625 |
| 0.125   0.25   0.125  |
| 0.0625  0.125  0.0625 |
```

- **Sharpen**: This filter sharpen the image, here one thing note is that unlike any edge detection filter specially Laplacian the sum of all the numbers is not 0.
```
Sharpen:
|  0  -1   0 |
| -1   5  -1 |
|  0  -1   0 |
``` 
