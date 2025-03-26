# LookAtMe
A desktop application that records concentration during e-learning based on gaze tracking and helps to maintain focus. <br>
LookAtMe is a personal project.

## Publication:
- [한국정보과학회 2024 한국소프트웨어종합학술대회 논문집 게재 (KSC 2024)](https://uxc.khu.ac.kr/file/ksc2024/KSC2024_%EC%84%9C%EC%A0%95%EB%AF%BC.pdf)

## Project Architecture
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/fc9f7c31-3610-4442-b756-0f912c1312a0" width="80%" height="30%">

## Application
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/0b84dc96-8ac5-458a-9168-f77330285bcc" width="30%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/c8a508a1-c836-4c2e-a600-81b622576b1f" width="30%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/07837f62-f25f-4a09-9485-08421628f097" width="30%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/c5e6fd6a-ef79-4247-8fc7-7299065cbe25" width="25%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/b9438f5a-d135-43f1-8779-c7d198a50a87" width="20%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/aa79cbdc-a511-4dc0-a8b9-c3a09e461f33" width="25%" height="40%">
<img src = "https://github.com/jeongmin1217/LookAtMe/assets/79658037/ac40d15f-c36a-444d-adf4-883bc56beca9" width="25%" height="40%"> <br>

## Demo
[![Video Label](http://img.youtube.com/vi/77s0UEhojYg/0.jpg)](https://youtu.be/77s0UEhojYg)

## Main Functions
- Identifying concentration levels during online lectures through gaze tracking
- The score changes in real-time, and the final score is automatically recorded in the calendar
- Real-time feedback is provided in cases of lack of concentration

**On the client side, face captured images are sent to the server using tensorflow.js, and gaze tracking is performed on those frames using the dlib library.**
