// export const drawRect = async (detections, ctx) => {
//     let personDetected = false; // person detected flag

//     detections.forEach((prediction) => {
//         // Get prediction results
//         const [x,y,width,height] = prediction['bbox'];
//         const text = prediction['class'];

//         if (text === 'person') {
//             // set styling
//             const color = 'green'
//             ctx.strokeStyle = color
//             ctx.font = '18px Arial'
//             ctx.fillStyle = color
    
//             // draw rectangles and text
//             ctx.beginPath()
//             ctx.fillText(text, x, y)
//             ctx.rect(x, y, width, height)
//             ctx.stroke()
//             personDetected = true; // person detected, update the flag
//         }
//     });
//     if (!personDetected) {
//         // If no person is detected, send the image data to the server
//         const photo = await html2canvas(document.getElementById('webcamId'), {
//           backgroundColor: '#342D2D',
//           allowTaint: true,
//         });
    
//         const imageSrc = photo.toDataURL('image/jpeg');
//         await sendImageToServer(imageSrc, 'no person');
//       }
    
// }
