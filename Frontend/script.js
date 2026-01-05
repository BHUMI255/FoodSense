document.addEventListener('DOMContentLoaded', () => {
const video = document.getElementById('video');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    let stream = null;

    // Start camera
    startBtn.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" }, // "environment" for back camera on mobile
          audio: false
        });
        video.srcObject = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Unable to access camera. Please allow permissions.");
      }
      setTimeout(function(){
                 cameraOutput();
                 document.getElementById('camera-con').style.display = 'none';
                 document.querySelector('.output-con').style.display = "block";
        },10000);
    });

    // Stop camera
    stopBtn.addEventListener('click', () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    });
// adding submit button function
 let inputvalue;
 const submit = document.getElementById('submit');
 submit.addEventListener('click',function(){
        document.getElementById('container2').style.display = 'none';
        document.querySelector('.temp').style.display = "none";
        document.querySelector('.temp2').style.display = "none";
        document.querySelector('.output-con').style.display = "block";
        inputvalue = document.getElementById("text").value;
        textOutput(inputvalue);
 })
 


async function cameraOutput(){
  try {
  const response = await fetch("http://localhost:3000/cameraInput");
  const data = await response.json();
  const jsonstring = JSON.stringify(data);
  const dataObject = JSON.parse(jsonstring);
  let para1 = dataObject["Here's what caught my attention"]
  let para2 = dataObject["Why this matters"]
  let para3 = dataObject["What it means for you"]
  document.getElementById('para1').innerHTML += para1;
  document.getElementById('para2').innerHTML += para2;
  document.getElementById('para3').innerHTML += para3;
  //stop the camera here

  console.log(data);
  } catch (error) {
    console.error(error);
  }
}

async function textOutput(inputvalue){
  try {
    console.log(inputvalue)
    const response = await fetch("http://localhost:3000/textInput", {
      method: "POST",
      headers: {
            "Content-Type": "application/json"
      },
      body: JSON.stringify({
            ingredients: inputvalue,
      })
    });

    const dataObject = await response.json();
    // const jsonstring = JSON.stringify(data);
    // const dataObject = JSON.parse(jsonstring);
    let para1 = dataObject["Here's what caught my attention"]
    let para2 = dataObject["Why this matters"]
    let para3 = dataObject["What it means for you"]
    document.getElementById('para1').innerHTML += para1;
    document.getElementById('para2').innerHTML += para2;
    document.getElementById('para3').innerHTML += para3;
  } catch (error) {
    console.error(error);
  }
}
})
const camera = document.getElementById('cam');
 camera.addEventListener('click',function(){
   cam();
 })
function cam(){
        document.getElementById('container2').style.display = 'none';
        document.querySelector('.temp').style.display = "none";
        document.querySelector('.temp2').style.display = "none";
        document.getElementById('camera-con').style.display = "flex";
        
 }
