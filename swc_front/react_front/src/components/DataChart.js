import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Plugin } from 'chart.js';
import { Title, Tooltip } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    } from 'chart.js';
import Chart from 'chart.js/auto';
import "../styles/chart.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

    
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Legend
);

Chart.register(Title, Tooltip);

    
function DataChart() {
    const [detectionData, setDetectionData] = useState(null);

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/detection/latest/');
            setDetectionData([response.data]);
            console.log(chartData.scorecore[0])
        } catch (error) {
            console.log(error);
        }
    };

    if (!detectionData) {
        return <div>Loading...</div>;
    }

    const formatDate = date => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const formattedDate = new Date(date).toLocaleDateString(undefined, options);
      return formattedDate;
    };  

    const totalDetectionCount = detectionData.reduce((total, data) => total + data.lookingCenter + data.lookingOther + data.sleeping + data.noPerson, 0);

      // 차트에 필요한 데이터 구성
    const chartData = {
        labels: detectionData.map(data => data.start_time), // 날짜를 레이블로 사용
        datasets: [
          {
            label: 'Looking Center',
            data: detectionData.map(data => (data.lookingCenter/ totalDetectionCount) * 100),
            borderColor: 'rgba(255,206,86,0.2)',
            backgroundColor: 'rgba(255,206,86,1)',      
          },
          {
            label: 'Looking Other',
            data: detectionData.map(data => (data.lookingOther/ totalDetectionCount) * 100),
            backgroundColor: "rgba(153,102,255,0.2)",
            borderColor: 'rgba(153,102,255,1)',
          },

          {
            label: 'Sleeping',
            data: detectionData.map(data => (data.sleeping/ totalDetectionCount) * 100),
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: "rgba(255,99,132,1)",    
          },
          {
            label: 'Empty',
            data: detectionData.map(data => (data.noPerson/ totalDetectionCount) * 100),
            borderColor: 'rgba(153,102,255,0.2)',
            backgroundColor: 'rgba(153,102,255,1)',
          },

          // 추가적인 데이터셋들
        ],
        score: detectionData.map(data => (
          ((1 * data.lookingCenter) / (data.lookingCenter + data.lookingOther + data.sleeping + data.noPerson)) * 100 +
          ((0.7 * data.lookingOther) / (data.lookingCenter + data.lookingOther + data.sleeping + data.noPerson)) * 100 +
          ((0.5 * data.sleeping) / (data.lookingCenter + data.lookingOther + data.sleeping + data.noPerson)) * 100 +
          ((0.3 * data.noPerson) / (data.lookingCenter + data.lookingOther + data.sleeping + data.noPerson)) * 100
        )),
    
      };

      const options = {
        plugins: {
        //   legend: {
        //     display: false, // 범례 숨김
        //   },
          title: {
            display: true, // title 표시
            text: `${formatDate(detectionData[0].start_time)}의 기록은 ${Math.floor(chartData.score[0])}점 입니다`,
            font: { size: 16, weight: '900' },
            padding: {
              top: 10,
              bottom: 5,
            },
            color: "#8871e6",
          },
    
        },
        scales: {
          y: {
            // display: false, // 눈금 숨김
            ticks: {
              stepSize: 10,
              callback: value => `${value}%`, // 퍼센트 표시
            },
          },
          x: {
            display: false,
          }
        },
      };
        
    
      
    // const score = Math.floor(chartData.score[0]);

    return (
    <div>
      <div className='container-chart'>
        <div className="rectangle3-chart"></div>
        <div className="icon-chart"><img className="icon-image-calendar" src="icon1.PNG"></img></div>
        <div className="lookAtMe-chart">Look At Me!</div>
        <div className="unnamed-chart">당신의 집중도를 기록해보세요.</div>
        <div className="calendarIcon-chart">
          <Link to="/calendar">
            <FontAwesomeIcon icon={faCalendar} style={{color: "#8871e6", fontSize:"25px"}} />
          </Link>
        </div>        
        <div>
          <Bar className='bar' data={chartData} options={options}/>
        </div>
        {/* <div className='score'>Score: {Math.floor(chartData.score[0])}</div> */}
      </div>
      <div className="bottom-bar-chart">
          <button className="go-to-webcam-chart"><Link to="/" style={{ color:"white", textDecoration: "none" }}>Back to Webcam</Link></button>
        </div>
    </div>
    )
}

export default DataChart;