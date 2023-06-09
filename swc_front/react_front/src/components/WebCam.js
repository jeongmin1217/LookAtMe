// Import dependencies
import React, { useRef, useEffect, useState} from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
// import { drawRect } from "./utilities";
import "../App.css";
import html2canvas from "html2canvas";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import Modal from "react-modal";

function WebCam() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  let photoRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [detectionStarted, setDetectionStarted] = useState(false);
  const [score, setScore] = useState(0); // 추가: score 상태 변수
  // const [startNotification, setStartNotification] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertEnd, setShowAlertEnd] = useState(false);

  let intervalId = useRef(null);
  const navigate = useNavigate();

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load();
    // let interval;
    if (capturing && detectionStarted) {
      intervalId.current = setInterval(()=> {detect(net);}, 2000) //3초마다 이미지 캡처
    } else {
      clearInterval(intervalId.current);
    }
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;
    
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const obj = await net.detect(video);
      // console.log(obj)

      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx);

      if (capturing && obj.length > 0) {
        const hasPerson = obj.some((prediction) => prediction.class === "person");
        if (hasPerson) {
          const photo = await html2canvas(document.getElementById("webcamId"), {
            backgroundColor: '#342D2D',
            allowTaint: true
          })
          const imageSrc = photo.toDataURL('image/jpeg');
          setImageUrl(imageSrc)
          
          await sendImageToServer(imageSrc, 'person');

          await axios
          .get("http://127.0.0.1:8000/api/detection/latest/")
          .then(function (response) {
            const detectionData = response.data;
            const latestScore = detectionData.score;
            setScore(latestScore);
          })
          .catch(function (error) {
            console.log(error);
          });

        }
        
      }
    }
  };
  
  const sendImageToServer = async(imageData, result) => {
    const formData = new FormData();
    formData.append("data", imageData)
    formData.append("result", result)

    await axios.post('http://127.0.0.1:8000/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(function (response) {
        console.log(response)
    }).catch(function (error) {
        console.log(error)
    })

    await axios
    .get("http://127.0.0.1:8000/api/detection/latest/")
    .then(function (response) {
      const detectionData = response.data;
      const latestScore = detectionData.score;
      setScore(latestScore);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  

  const drawRect = async (detections, ctx) => {
    let personDetected = false; // person detected flag

    detections.forEach((prediction) => {
        // Get prediction results
        const [x,y,width,height] = prediction['bbox'];
        const text = prediction['class'];

        if (text === 'person') {
            // set styling
            const color = 'green'
            ctx.strokeStyle = color
            ctx.font = '18px Arial'
            ctx.fillStyle = color
    
            // draw rectangles and text
            ctx.beginPath()
            ctx.fillText(text, x, y)
            ctx.rect(x, y, width, height)
            ctx.stroke()
            personDetected = true; // person detected, update the flag
        }
    });
    if (!personDetected) {
        // If no person is detected, send the image data to the server
        const photo = await html2canvas(document.getElementById('webcamId'), {
          backgroundColor: '#342D2D',
          allowTaint: true,
        });
    
        const imageSrc = photo.toDataURL('image/jpeg');
        await sendImageToServer(imageSrc, 'no person');
      }
    
  }

  
  const handleStart = async () => {
    setCapturing(true);
    setDetectionStarted(true);
    setImageUrl("");
    try {
      await axios.post('http://127.0.0.1:8000/start_detection/')
      setShowAlert(true);
      // alert("학습을 시작합니다! 오로지 학습에 집중해주세요 :)")      
    } catch(error) {
      console.log(error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleCloseAlertEnd = () => {
    setShowAlertEnd(false);
  }
  
  const handleStop = async () => {
    setCapturing(false);
    setDetectionStarted(false);
    setImageUrl("");
    setShowAlertEnd(true);
    
    await axios.post('http://127.0.0.1:8000/end_detection/')
    .then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
    })

    clearInterval(intervalId.current);
    setTimeout(() => {
      navigate("/chart");
    }, 2000);
  };

  const AlertModal = ({ isOpen, message, onClose }) => {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Alert Modal"
        className="alert-modal"
        overlayClassName="alert-modal-overlay"
      >
        <div className="alert-message">{message}</div>
        <button className="alert-close-button" onClick={onClose}>
          닫기
        </button>
      </Modal>
    );
  };  
  
  useEffect(() => {
    runCoco();
    return () => {
      clearInterval(intervalId.current);
    };
  }, [capturing, detectionStarted]);
  
  return (
    <div className="App">
      <div className="webcam-container">
        <Webcam
          id="webcamId"
          ref={webcamRef}
          muted={true}
        />
        <canvas
          ref={canvasRef}
        />
      </div>
      <div className="rectangle3-main"></div>
      <div className="icon-main"><img className="icon-image" src="icon1.PNG"></img></div>
      <div className="lookAtMe-main">Look At Me!</div>
      <div className="unnamed-main">당신의 집중도를 기록해보세요.</div>
      <div className="calendarIcon">
        <Link to="/calendar">
          <FontAwesomeIcon icon={faCalendar} style={{color: "#8871e6", fontSize:"25px"}} />
        </Link>
      </div>
      <div className="rectangle32"></div>
      <div className="button-control">
        {/* {startNotification && <p>{startNotification}</p>} 알림 표시 */}
        <button onClick={handleStart} className="start-button">시작</button>
        <AlertModal
        isOpen={showAlert}
        message={"학습을 시작합니다. 집중해주세요!"}
        onClose={handleCloseAlert}
        />
        <div className="score"><p>Score : {score}</p></div>
        <button onClick={handleStop} className="end-button">종료</button>
        <AlertModal
        isOpen={showAlertEnd}
        message={"수고하셨습니다! 통계를 보여드립니다!"}
        onClose={handleCloseAlertEnd}
        />

      </div>
      

    </div>
  );
}

export default WebCam;