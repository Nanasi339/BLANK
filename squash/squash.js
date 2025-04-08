//変数の宣言
var ballX = 600;                                                                //ボールのX座標を代入する変数
var ballY = 300;                                                                //ボールのY座標を代入する変数
var ballXp = 10;                                                                //ボールのX軸方向の速さを代入する変数
var ballYp = 8;                                                                 //ボールのY軸方向の速さを代入する変数
var barX = 600;                                                                 //バーのX座標を代入する変数
var barY =700;                                                                  //バーのY座標を代入する変数
var score = 0;                                                                  //スコアを代入する変数
var scene = 0;                                                                  //ゲームの場面を管理するための変数

//起動時の処理
//setup関数
function setup() {
    canvasSize(1200,800);                                                       //画面サイズの指定
    lineW(3);                                                                   //図形の線の太さを指定
    loadImg(0, "image/bg.png")                                                  //背景画像を読み込む
    loadSound(0, "sound/se.m4a");
    // setFPS(60);
}

//メインループ
//mainloop()関数
function mainloop() {
    drawImg(0,0,0);                                                             //背景画像
    setAlp(50);                                                                 //透明度を指定
    fRect(250,50,700,750,"black");                                              //黒で塗りつぶした矩形を描く
    setAlp(100);                                                                //透明度を100%に戻す
    sRect(250,50,700,760,"silver");                                             //灰色の線で矩形を描く
    fText("SCORE "+score,600,25,36,"white");                                    //スコアの表示
    sCir(ballX,ballY,10,"lime");                                                //ボールを描く    
    sRect(barX-50, barY-10, 100, 20, "violet");                                 //バーを描く
    if(scene == 0) {                                                            //タイトル画面の処理
        fText("Squash Game", 600, 200, 48, "cyan");
        fText("Click to Start!", 600, 600, 36, "gold");
        if(tapC == 1) {                                                         //画面をクリックしたら
            ballX = 600;
            ballY = 300;
            ballXp = 12;
            ballYp = 8;
            score = 0;
            scene = 1;
        }                                                                       //sceneを1にしてゲームをスタートする
    }
    else if(scene == 1) {                                                       //ゲームをプレイする画面
        ballX = ballX + ballXp;                                                 //ボールのX座標の値を変化させる
        ballY = ballY + ballYp;                                                 //ボールのY座標の値を変化させる
        if(ballX<=260 || ballX>=940) ballXp = -ballXp;                          //左右の壁にあたったらX軸方向の向きを反転させる
        if(ballY<=60) ballYp = -ballYp;                                         //上の壁に当たったらY軸方向の向きを反転させる
        if(ballY > 800) scene = 2;                                              //下の壁に触れたらsceneを2にしてゲームオーバー処理
        barX =tapX;                                                             //マウスポインターのX座標をbarXに代入
        if(barX < 300) barX = 300;                                              //300より小さな値にはしない(コート左端)
        if(barX > 900) barX = 900;                                              //900より大きな値にはしない(コート右端)
        if(barX-60<ballX && ballX<barX+60 && barY-30<ballY &&ballY<barY-10) {   //バーとボールが接触したか調べる
            ballYp = -8-rnd(8)                                                  //接触したらballYpにマイナスの値を代入
            score = score + 100;                                                //スコアを加算する
            playSE(0);                                                          //効果音の出力
        }
    }
    else if(scene == 2) {                                                       //ゲームオーバー画面の処理
        fText("GAME OVER", 600, 400, 36, "red");
        if(tapC == 1) {
            scene = 0;
            tapC = 0;
        }
    }
}