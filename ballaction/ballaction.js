//191/212

//変数の宣言

//ボールを扱う数
var BALL_MAX = 2;

//中心座標
var ballX = new Array(BALL_MAX);
var ballY = new Array(BALL_MAX);
//速さ
var ballVx = new Array(BALL_MAX);
var ballVy = new Array(BALL_MAX);

var drag = 0;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    loadImg(0, "Image/bg.png");
    for(var i=0;i<BALL_MAX;i++) loadImg(1+i, "Image/ball"+i+".png");
    initVar();
    setFPS(60);
}

//メインループ
function mainloop() {
    drawImg(0,0,0);//背景画像
    for(var i=0;i<BALL_MAX;i++) drawImgC(1+i,ballX[i],ballY[i]);
    myball();
    moveBall();
}

//ボールを動かす関数
function moveBall() {
    for(var i=0; i<BALL_MAX;i++){
        ballX[i] = ballX[i] + ballVx[i];
        ballY[i] = ballY[i] + ballVy[i];
        if(ballX[i]< 300 && ballVx[i]<0) ballVx[i] = -ballVx[i];
        if(ballX[i]> 820 && ballVx[i]>0) ballVx[i] = -ballVx[i];
        if(ballY[i]< 100 && ballVy[i]<0) ballVy[i] = -ballVy[i];
        if(ballY[i]> 620 && ballVy[i]>0) ballVy[i] = -ballVy[i];
        ballVx[i] = ballVx[i] * 0.95;
        ballVy[i] = ballVy[i] * 0.95;
    }
    if(getDis(ballX[0],ballY[0],ballX[0],ballY[0]) <= 80){
        var sp0 = Math.sqrt(ballVx[0]*ballVx[0]+ballVy[0]*ballVy[0]);
        var sp1 = Math.sqrt(ballVx[1]*ballVx[1]+ballVy[1]*ballVy[1]);
        var spa = (sp0+sp1)/2;
        var dx = ballX[0] -ballX[1];
        var dy = ballY[0] -ballY[1];
        var ang = Math.atan2(dy,dx);
        //var vx = ballVx[0];
        //var vy = ballVy[0];
        //ballVx[0] = ballVx[1];
        //ballVy[0] = ballVy[1];
        //ballVx[0] = vx;
        //ballVy[0] = vy;
        ballVx[0] = spa * Math.cos(ang);
        ballVy[0] = spa * Math.sin(ang);
        ballVx[0] = -ballVx[0];
        ballVy[0] = -ballVy[0];
    }
}

//ボール操作関数
function myball() {
    if(drag == 0) {//つかむ
        if(tapC == 1 && getDis(tapX, tapY, ballX[0], ballY[0],) < 60) drag = 1;
    }
    if(drag == 1) {//引っ張る
        //引く強さが分かるように多角形を表示
        lineW(3);
        sPol([tapX-30, tapY, tapX+30, tapY, ballX[0], ballY[0]], "silver");
        sPol([tapX, tapY-30, tapX, tapY+30, ballX[0], ballY[0]], "lightgray");
        sPol([tapX-30, tapY, tapX, tapY+30, tapX+30, tapY, tapX, tapY-30], "white");
        //どの向きに飛ぶか分かるように線を表示
        var dx = ballX[0] - tapX;
        var dy = ballY[0] - tapY;
        line(ballX[0], ballY[0], ballX[0]+dx, ballY[0]+dy, "white");
        //line(tapX, tapY, ballX, ballY, "white");
        if(tapC == 0) {//離した時
            if(tapX < 10 || 1190 < tapX || tapY < 10 || 790 < tapY){
                drag = 0;   //やり直し
            }
            else if(getDis(tapX, tapY, ballX[0], ballY[0]) < 60) {
                drag = 0;   //やり直し
            }
            else {
                ballVx[0] = (ballX[0] - tapX)/8;
                ballVy[0] = (ballY[0] - tapY)/8;
                drag = 0;   //やり直し
            }
        }
    }
}

function initVar() {//配列に初期値を代入
    for(var i=0;i<BALL_MAX;i++){
        ballX[i] = 400+i*80;
        ballY[i] = 200+i*80;
        ballVx[i] = rnd(80)-40;//確認用に乱数の値を代入
        ballVy[i] = rnd(80)-40;
    }
}