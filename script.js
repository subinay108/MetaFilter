const chooseFileBtn = document.getElementById('chooseFileBtn');
const hiddenCanvas = document.getElementById('hiddenCanvas');
const hctx = hiddenCanvas.getContext('2d', {willReadFrequently: true});
const resultCanvas = document.getElementById('resultCanvas');
const ctx = resultCanvas.getContext('2d', {willReadFrequently: true});

const imgSize = 360;

hiddenCanvas.style.display = 'none';

const actualImageData = new ImageData(imgSize, imgSize);

const FILTER = {
    'sobel-left': [
        [1, 0, -1], 
        [2, 0, -2], 
        [1, 0, -1]
    ],
    'sobel-right': [
        [-1, 0, 1], 
        [-2, 0, 2], 
        [-1, 0, 1]
    ],
    'prewitt-left': [
        [1, 0, -1], 
        [1, 0, -1], 
        [1, 0, -1]
    ],
    'prewitt-right': [
        [-1, 0, 1], 
        [-1, 0, 1], 
        [-1, 0, 1]
    ],
    'laplacian-edge': [
        [0, 1, 0],
        [1, -4, 1],
        [0, 1, 0]
    ],
    'top-left-diagonal': [
        [1, 1, 0],
        [1, 0, -1],
        [0, -1, -1]
    ],
    'bottom-right-diagonal': [
        [-1, -1, 0],
        [-1, 0, 1],
        [0, 1, 1]
    ],
    'blur': [
        [0.0625, 0.125, 0.0625],
        [0.125, 0.25, 0.125],
        [0.0625, 0.125, 0.0625]
    ],
    'sharpen': [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0]
    ],
    'custom': [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]

}

const applyBtn = document.getElementById('applyBtn');
const chooseFilter = document.getElementById('chooseFilter');
chooseFilter.addEventListener('change', function(e){
    let filter = [];
    if(chooseFilter.value !== ''){
        filter = FILTER[chooseFilter.value];
    }

    const filterTable = document.getElementById('filterTable');
    const inputArr = filterTable.getElementsByTagName('input');
    for(let i = 0; i < inputArr.length; i++){
        inputArr[i].value = filter[parseInt(i / 3)][i % 3];
    }

});
applyBtn.addEventListener('click', (e)=> {
    // 0 -> sobel left, 1-> sobel right, 2-> Laplacian Edge Detector
    let filter = [Array(3).fill(0), Array(3).fill(0), Array(3).fill(0)];

    const filterTable = document.getElementById('filterTable');
    const inputArr = filterTable.getElementsByTagName('input');
    for(let i = 0; i < inputArr.length; i++){
        filter[parseInt(i / 3)][i % 3] = Number(inputArr[i].value);
    }

    if(actualImageData){
        const resultImageData = applyFilter(actualImageData, filter);
        ctx.putImageData(resultImageData, 0, 0);
    }

})

chooseFileBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const img = new Image();
    img.onload = () => {
        // Resize canvas to image size 
        // canvas.width = img.width;
        // canvas.height = img.height;
        
        // Resize the canvas to size of 360 x 360
        hiddenCanvas.width = imgSize;
        hiddenCanvas.height = imgSize;

        // Draw image on canvas
        hctx.drawImage(img, 0, 0, imgSize, imgSize);

        // Get pixel data
        const imageData = hctx.getImageData(0, 0, imgSize, imgSize);
        let arrSize = imgSize * imgSize * 4;

        for(let i = 0; i < arrSize; i++){
            actualImageData.data[i] = imageData.data[i];
        }
        
        // console.log('ImageData:', imageData);
        convertToGrayscale(actualImageData);

        // Draw grayscale image on result canvas
        ctx.putImageData(actualImageData, 0, 0);

    };

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function convertToGrayscale(imageData){
    const data = imageData.data;
    const height = imageData.height;
    const width = imageData.width;

    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const gray = Math.round((r + g + b) / 3);
            // const gray = Math.round(0.2989 * r + 0.5870 *g + 0.1140 * b); // NTSC
            
            data[index] = gray;
            data[index + 1] = gray;
            data[index + 2] = gray;
        }
    }
}

function applyFilter(imageData, filter){
    const padding = 1;
    const width = imageData.width;
    const height = imageData.height;
    const tempWidth = width + 2 * padding;

    // Creat the resultImageData
    const resultImageData = new ImageData(width, height);

    const imageMatrix = [];
    for(let y = 0; y < height; y++){
        const row = [];
        for(let x = 0; x < width; x++){
            const index = (y * width + x) * 4;
            row.push(imageData.data[index]);
        }
        imageMatrix.push(row);
    }

    // Add padding surrounding of the image
    const tempImage = []; 
    for(let i = 0; i < padding; i++){
        tempImage.push(Array(tempWidth).fill(0)); // first rows padding
    }

    for(const row of imageMatrix){
        let pad = Array(padding).fill(0);
        tempImage.push([...pad, ...row, ...pad]); // first and last cols padding
    }

    for(let i = 0; i < padding; i++){
        tempImage.push(Array(tempWidth).fill(0)); // last rows padding
    }

    for(let row = 0; row < height; row++){
        for(let col = 0; col < width; col++){
            let s = 0;
            for(let i = 0; i < 3; i++){
                for(let j = 0; j < 3; j++){
                    s += tempImage[row + i][col + j] * filter[i][j];
                }
            }
            imageMatrix[row][col] = s;
        }
    }

    // image matrix to ImageData
    for(let y = 0; y < height; y++){
        for(let x = 0; x < width; x++){
            const index = (y * width + x) * 4;
            resultImageData.data[index] = imageMatrix[y][x];
            resultImageData.data[index + 1] = imageMatrix[y][x];
            resultImageData.data[index + 2] = imageMatrix[y][x];
            resultImageData.data[index + 3] = 255;
        }
    }

    return resultImageData;
}