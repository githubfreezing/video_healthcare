// 初期化
/* 
net           : mobilenetの学習済みモデルを格納
classifier    : 分類器を格納(knn分類器)
webcamElement : webcamの要素を格納
WEBCAM_CONFIG : フロントカメラ(user)・リアカメラ(environment)切り替え
*/

let net;
const classifier = knnClassifier.create();

////var webcamElement = document.getElementById('webcam');
//var deviceid;

////const WEBCAM_CONFIG = {facingMode: "environment"};

// const WEBCAM_CONFIG = {facingMode: "user"};

//remgb用カメラの設定
const video = document.getElementById("video");
// var capture = document.getElementById('capture');
var canvas = document.getElementById('draw');
canvas.style.visibility ="hidden";

// getUserMediaの設定
navigator.mediaDevices.getUserMedia({
  //video: {facingMode: { exact: "environment" }},
  video: true,
  audio: false,
}).then(stream => {
  video.srcObject = stream;
  video.play()
  
}).catch(e => {
console.log(e)
})

const buttonClick = async classId => {
  // var canvas2 = document.getElementById('draw2');

  canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
  // //キャプチャした画像をfetch(Json)で送信できる形式に変更
  img_bytes = canvas.toDataURL()

  var img = new Image();

  await fetch("/resindex/",{
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get('csrftoken')
    },
    body: img_bytes
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      document.getElementById("newImg").src = data['image'];

      img.src = data['image']
    })
    .catch(error => {
      console.log("失敗しました");
      document.getElementById('time').innerText = "失敗しました";
    });

    // let inputTensor3 = await tf.browser.fromPixels(img, 3);
    // console.log(String(inputTensor3));
    // document.getElementById('time').innerText = String(inputTensor3);

    // const activation = await net.infer(inputTensor3, true);
    // classifier.addExample(activation, classId);

    // console.log("classifier.getNumClasses()", classifier.getNumClasses());

};



$(document).ready( function(){
  // ページ読み込み時に実行したい処理
  buttonClick(0);
});

setInterval(() => {
  // testinter();
  buttonClick(0);
}, 50000);
