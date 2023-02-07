■2022/07/08
 農アプリrembgによる背景加工プログラムのクローズ
 jsのカメラ画像をpyに送信(fetchによる非同期通信)し、remgbによって加工した画像をjsに送信しなおした後、tensorflow.jsによる学習、予測を行うプログラム

■開発環境:
 Django、Docker、Heroku、javascript、html、css

■herokuデプロイ実行コマンド
heroku container:login
docker build -t registry.heroku.com/still-bayou-20628/web .
docker push registry.heroku.com/still-bayou-20628/web
heroku container:release -a still-bayou-20628 web
heroku open -a still-bayou-20628

■docker実行コマンド
docker build -t web:latest .
docker run -d --name django-heroku2 -e "PORT=8765" -e "DEBUG=0" -p 8000:8765 web:latest

■備考
①jsとpyにて、画像加工のための通信を行う時間が長い
②windows、chromeのPCおよびタブレットにて動作確認完了
③ios、androidでは、index.jsの学習プログラムが不具合を起こす「index.js、225行目が不具合の原因(let inputTensor3 = await tf.browser.fromPixels(img, 3);)」
④不具合調査のためのログおよびinnerTextは残す
