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
var capture = document.getElementById('capture');
var canvas = document.getElementById('draw');

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


// async function app() {
//   console.log('Loading mobilenet..');

//   // mobilenetのモデル読み込み
//   net = await mobilenet.load();
//   console.log('Successfully loaded model');

//   // ウェブカメラの映像をキャプチャし、テンソルとして格納
//   //onst webcam = await tf.data.webcam(webcamElement, WEBCAM_CONFIG);
// };

// async function sample_settime() { 
//     if (classifier.getNumClasses() > 0) {
//       canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
//       // //キャプチャした画像をfetch(Json)で送信できる形式に変更
//       img_bytes = canvas.toDataURL()
//       //fetchによるview.py(Resとの送受信)
//       //await fetch("http://127.0.0.1:8007/resindex/", {
//      // await fetch("https://murmuring-island-89148.herokuapp.com/resindex/", {
//       await fetch("/resindex/", {
//           method: "POST",
//           headers: {
//               "Content-Type": "application/json",
//               "Access-Control-Allow-Origin": "*",
//               "X-CSRFToken": Cookies.get('csrftoken')
//           },
//           body: img_bytes // ← 画像を送信
//           })
//           .then((res) => res.json())
//           .then((res) => {
//               console.log("受信", res);
//               console.log("body", res['image']);
//               //受信した画像を上記(newImg)に表示
//               document.getElementById("newImg2").src = res['image'];
//           });

//       let inputTensor2 = tf.browser.fromPixels(newImg2, 3);
//       //document.getElementById("pred_tensor_obj").innerHTML = inputTensor2;

//       // ウェブカメラの映像をキャプチャし、推論を行う
//       const activation = net.infer(inputTensor2, 'conv_preds');

//       const result = await classifier.predictClass(activation);

//       // 推論から予測される結果を確率と共に表示
//       const classes = ['Class_1', 'Class_2', 'Class_3', 'Class_4', 'Class_5'];
//       let probability;
//       probability = Math.floor(result.confidences[result.label] * 100);
//       document.getElementById('result').innerText = `${classes[result.label]}    確率: ${probability}%`;

//     }

//     // 画面更新の度にこの関数を動かす
//     await tf.nextFrame();
// }

document.getElementById('SAVE').addEventListener('click', () => save());
async function save() {
  let dataset = classifier.getClassifierDataset()
  console.log(dataset);
  var datasetObj = {0:'A'}
  Object.keys(dataset).forEach((key) => {
    let data = dataset[key].dataSync();
    // use Array.from() so when JSON.stringify() it covert to an array string e.g [0.1,-0.2...] 
    // instead of object e.g {0:"0.1", 1:"-0.2"...}
    // console.log(data);
    datasetObj[key] = Array.from(data); 
  });
  // console.log(datasetObj);
  let jsonStr = JSON.stringify(datasetObj)
  //can be change to other source
  const blob = new Blob([jsonStr], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  let fname = document.getElementById('fname').value;
  // a.download = 'save_model.txt';
  a.download = fname + ".txt";
  a.href = url;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function load(fileReader) {
  //can be change to other source
 let dataset = fileReader.result;
//  console.log(dataset);
 let tensorObj = JSON.parse(dataset);
//  console.log(tensorObj); 
 //covert back to tensor
 Object.keys(tensorObj).forEach((key) => {
  // console.log(tensorObj[key].length); 
  tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024]);
  // tensorObj[key] = tf.tensor(tensorObj[key])
  // console.log(tensorObj[key]); 

  // tensorObj[key] = tensorObj[key].reshape([3, 1024])
 })
 console.log(tensorObj);
 classifier.setClassifierDataset(tensorObj);
}

let fileInput = document.getElementById('file');
let fileReader = new FileReader();
fileInput.onchange = () => {
  let file = fileInput.files[0];
  // console.log(file.name);
  // console.log(file.size);
  // console.log(file.type);
  fileReader.readAsText(file);
};

fileReader.onload = () => load(fileReader);

//app();

//setInterval("sample_settime()", 10000);

var n_num = new Array(0, 0, 0, 0, 0);

const buttonClick = async classId => {
  var canvas2 = document.getElementById('draw2');
  //var canvas2 = document.createElement('draw2')

  if (classifier.getNumClasses() == 0) {
    // mobilenetのモデル読み込み
    net = await mobilenet.load();
  }

  console.log(classId);
  var n_str = new Array("num_1", "num_2", "num_3", "num_4", "num_5");
  n_num[classId] ++
  document.getElementById(n_str[classId]).innerHTML = n_num[classId];

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
    body: img_bytes // ← 画像を送信
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data);
      //console.log("body", data['image']);
      //受信した画像を上記(newImg)に表示
      document.getElementById("newImg").src = data['image'];

      img.src = data['image']

      //var a = tf.io.decode_base64(data['image']);

      //let inputTensor3 = tf.browser.fromPixels(img, 3);
      //document.getElementById('time').innerText = String(img)
    })
    .catch(error => {
      console.log("失敗しました");
      document.getElementById('time').innerText = "失敗しました";
    });

    //console.log(img);
    //document.getElementById('time').innerText = typeof(img);

    // const ctx = canvas2.getContext('2d')
    // ctx.clearRect(0, 0, newImg.width, newImg.height);
    // ctx.drawImage(img, 0, 0, 28, 28);

    //ctx.drawImage(newImg, 0, 0, newImg.width, newImg.height);
    //document.getElementById('time').innerText = typeof(canvas2);

    // var c = canvas2.getContext('2d');
    // // 画像読み込み終了してから描画
    // img.onload = function(){
    //     c.drawImage(img, 640, 480);
    // }


    let inputTensor3 = await tf.browser.fromPixels(img, 3);
    //let inputTensor3 = await tf.browser.fromPixels(canvas2, 3);
    console.log(String(inputTensor3));
    document.getElementById('time').innerText = String(inputTensor3);

    // mobilenetの学習モデルの出力層にKNN分類器を接続(転移学習)
    const activation = await net.infer(inputTensor3, true);
    classifier.addExample(activation, classId);

    console.log("classifier.getNumClasses()", classifier.getNumClasses());

};

async function doPred() {

  if (classifier.getNumClasses() == 0) {
    // mobilenetのモデル読み込み
    alert("AAAAAAAAA")
  }

  if (classifier.getNumClasses() > 0) {
    canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
    // //キャプチャした画像をfetch(Json)で送信できる形式に変更
    img_bytes = canvas.toDataURL()

    //fetchによるview.py(Resとの送受信)
    await fetch("/resindex/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-CSRFToken": Cookies.get('csrftoken')
        },
        body: img_bytes // ← 画像を送信
        })
        .then((res) => res.json())
        .then((res) => {
            console.log("受信", res);
            //console.log("body", res['image']);
            //受信した画像を上記(newImg)に表示
            document.getElementById("newImg2").src = res['image'];
        });

    let inputTensor2 = tf.browser.fromPixels(newImg2, 3);
    document.getElementById("time").innerHTML = inputTensor2;

    // ウェブカメラの映像をキャプチャし、推論を行う
    const activation = net.infer(inputTensor2, 'conv_preds');

    const result = await classifier.predictClass(activation);

    // 推論から予測される結果を確率と共に表示
    const classes = ['Class_1', 'Class_2', 'Class_3', 'Class_4', 'Class_5'];
    let probability;
    probability = Math.floor(result.confidences[result.label] * 100);
    document.getElementById('result').innerText = `${classes[result.label]}    確率: ${probability}%`;
    document.getElementById('time').innerText = classifier.getClassifierDataset()
  }
};
