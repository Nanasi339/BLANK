//199/212
//0414

//変数の宣言

//ボールを扱う数
var BALL_MAX = 6;

//中心座標
var ballX = new Array(BALL_MAX);
var ballY = new Array(BALL_MAX);
//速さ
var ballVx = new Array(BALL_MAX);
var ballVy = new Array(BALL_MAX);

var cursor = new Array(BALL_MAX);//カーソル
var life = new Array(BALL_MAX)//体力

//演出管理変数
var eff_col = new Array(BALL_MAX);//色
var eff_tmr = new Array(BALL_MAX);//表示時間

//各ボール初期位置
var BALLX = [350,450,550,850,750,650];
var BALLY = [350,250,150,450,550,650];

var LIFE = [160,100,80,200,120,100]//体力最大値
var POWER = [30,20,10,40,20,30]//攻撃力
var CURE = [30,0,0,10,0,0];//味方回復
var G_OR_B = [0,0,0,1,1,1]//チーム分け 0=girls,1=boys
var TEAM_COL = ["#ff80c0", "#40c0ff"];

var drag = 0;
var bnum = 0;//操作するボールの番号
var team = 0;//プレイヤー選択チーム
var ally = 0;//味方を判定するための変数
var victory = 0;//どちらのチームが勝ったか 0=girls,1=boys

var idx = 0;
var tmr = 0;

//起動時の処理
function setup() {
    canvasSize(1200, 800);
    loadImg(0, "Image/bg.png");
    for(var i=0;i<BALL_MAX;i++) loadImg(1+i, "Image/ball"+i+".png");
    var SND = ["bgm", "win", "lose", "se_shot", "se_hit", "se_recover"]
    for(var i=0; i<SND.length; i++) loadSound(i, "sound/"+SND[i]+".m4a");
    initVar();
    setFPS(60);
}

//メインループ
function mainloop() {
    var i,n,x,y;
    tmr++;
    drawImg(0,0,0);//背景画像
    drawBall();//ボールを描く変数
    switch(idx) {
        case 0://タイトル画面
        fText("Dragon",400,320,100,"red");
        fText("Marbles",800,320,100,"blue");
        if(tmr%40 < 20) fText("TAP TO START.",600,540,50,"lime");
        if(tapC > 0) {
            initVar();
            idx = 1;
            tmr = 0;
        }
        break;

        case 1://チーム選択
        sRect(300,100,298,600,TEAM_COL[0]);
        fText("Girls",450,380,80,TEAM_COL[0]);
        sRect(602,100,298,600,TEAM_COL[1]);
        fText("Boys",750,380,80,TEAM_COL[1]);
        if(tmr%40 < 20) fText("SELECT TEAM", 600, 480, 40, "ORANGE");
        if(tapC>0 && tmr > 30) {
            team = 0;
            if(tapX > 600) team = 1;
            bnum = team*3-1;
            if(rnd(100) < 50) bnum = (1-team)*3-1;//COMの先攻
            idx = 2;
            tmr = 0;
            playBgm(0);
        }
        break;

        case 2://動かす順番を決める
        bnum = bnum + 1;
        if(bnum == BALL_MAX) bnum = 0;
        if(life[bnum] > 0) {
            if(G_OR_B[bnum] == team) {
                ally = team;
                drag = 0;
                idx = 3;
                tmr = 0;
            }
            else {//COMのボール
                ally = 1 - team;
                idx = 4;
                tmr = 0;
            }
        }
        break;

        case 3://プレイヤーチームの操作
        fText("Your Turn",600,400,50,"white");
        if(tmr%20 < 10) cursor[bnum] = "white";
        if(myball() == true) idx = 5;
        break;

        case 4://COMチームの操作(ゲーム用のAI)
        fText("Com's Turn.",600,400,50,"white");
        if(tmr%20 < 10) cursor[bnum] = "yellow";
        if(tmr >= 90) {
            var etapX = rnd(1200);
            var etapY = rnd(800);
            for(i=0; i<10; i++) {
                n = rnd(BALL_MAX);
                if(life[n] > 0 && G_OR_B[n] == team) {
                    x = ballX[bnum] - (ballX[n] - ballX[bnum]);
                    y = ballY[bnum] - (ballY[n] - ballY[bnum]);
                    if(0 < x && x < 1200 && 0 < y && y < 800) {
                        etapX = x;
                        etapY = y;
                        break;
                    }
                }
            }
            playSE(3);
            ballVx[bnum] = (ballX[bnum] - etapX)/8;
            ballVy[bnum] = (ballY[bnum] - etapY)/8;
            idx = 5;
        }
        break;

        case 5://ボールを動かす
        if(moveBall() == BALL_MAX) {
            idx = 2;
            tmr = 0;
            if(life[0]+life[1]+life[2] == 0) {//Girlsチーム全滅？
                victory = 1;
                idx = 6;
            }
            if(life[3]+life[4]+life[5] == 0) {//Boysチーム全滅？
                victory = 0;
                idx = 6;
            }
        }
        break;

        case 6://ゲーム結果の表示
        if(tmr == 1) stopBgm();
        if(victory == team) {
            fText("You Win!",600,400,80,"cyan");
            if(tmr == 2) playSE(1);//勝利ジングル
        }
        else {
            fText("Com Wins.", 600, 400, 80, "gold");
            if(tmr == 2) playSE(2)//敗北ジングル
        }
        if(tmr == 30*8) idx = 0;
        break;
    }
    //for(var i=0;i<BALL_MAX;i++) drawImgC(1+i,ballX[i],ballY[i]);
    // myball();
    // moveBall();
}

//ボールを描画する関数
/*cursor[]に値が入っているなら、固形を描く命令でカーソルを表示し、cursor[]の値をクリアする */
function drawBall() {
    for(var i=0; i<BALL_MAX; i++) {//ボールを描く
        if(life[i] == 0) {
            fText("lost", ballX[i], ballY[i], 40, "silver");//体力0でlostと表示
        }
        else {
            drawImgC(i+1, ballX[i], ballY[i]);
            fText(life[i],ballX[i], ballY[i]+24,24,"lime");
        }
        
        if(cursor[i] != "") {//カーソル
            lineW(4);
            sRect(ballX[i]-40, ballY[i]-40,80,80,cursor[i]);
            cursor[i] = "";
        }
        if(eff_tmr[i] > 0) {//エフェクト
            eff_tmr[i]--;
            setAlp(50);//描画処理を半透明に
            fCir(ballX[i], ballY[i], 50, eff_col[i]);
            setAlp(100);//不透明に戻す
        }
    }
}

//ボールを動かす関数
function moveBall() {
    var cnt = 0;
    for(var i=0; i<BALL_MAX;i++){
        ballX[i] = ballX[i] + ballVx[i];
        ballY[i] = ballY[i] + ballVy[i];
        if(ballX[i]< 300 && ballVx[i]<0) ballVx[i] = -ballVx[i];
        if(ballX[i]> 860 && ballVx[i]>0) ballVx[i] = -ballVx[i];
        if(ballY[i]< 140 && ballVy[i]<0) ballVy[i] = -ballVy[i];
        if(ballY[i]> 660 && ballVy[i]>0) ballVy[i] = -ballVy[i];
        ballVx[i] = ballVx[i] * 0.95;
        ballVy[i] = ballVy[i] * 0.95;
        if(abs(ballVx[i])<1 && abs(ballVy[i])<1) {//長時間動き続けないように
            ballVx[i] = 0;
            ballVy[i] = 0;
            cnt = cnt + 1;//止まっているボールの数を数える
        }
        // 他のボールとの衝突判定
        for(var j=0; j<BALL_MAX; j++) {
            if(i == j) continue;
            if(life[j] > 0 && getDis(ballX[i], ballY[i], ballX[j], ballY[j]) <= 80) {
                var sp0 = Math.sqrt(ballVx[i]*ballVx[i]+ballVy[i]*ballVy[i]);
                var sp1 = Math.sqrt(ballVx[j]*ballVx[j]+ballVy[j]*ballVy[j]);
                var spa = (sp0+sp1)/2;
                var dx = ballX[i] - ballX[j];
                var dy = ballY[i] - ballY[j];
                var ang = Math.atan2(dy, dx);
                ballVx[i] = spa * Math.cos(ang);
                ballVy[i] = spa * Math.sin(ang);
                ballVx[j] = -ballVx[i];
                ballVy[j] = -ballVy[i];
                if(i == bnum)
                    hitBall(i, j);//操作中のボールがいずれかのボールに当たる
                else if(j == bnum)
                    hitBall(j, i);//いずれかのボールが操作中のボールに当たる
            }
        }
    }
    return cnt;
    /*if(getDis(ballX[0],ballY[0],ballX[1],ballY[1]) <= 80){
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
        ballVx[1] = -ballVx[0];
        ballVy[1] = -ballVy[0];
    }
    */
}

//ボール操作関数
function myball() {//ボールを引っ張って飛ばす関数
    cursor[bnum] = "white";
    if(drag == 0) {//つかむ
        if(tapC == 1 && getDis(tapX, tapY, ballX[bnum], ballY[bnum],) < 60) drag = 1;
    }
    if(drag == 1) {//引っ張る
        //引く強さが分かるように多角形を表示
        lineW(3);
        sPol([tapX-30, tapY, tapX+30, tapY, ballX[bnum], ballY[bnum]], "silver");
        sPol([tapX, tapY-30, tapX, tapY+30, ballX[bnum], ballY[bnum]], "lightgray");
        sPol([tapX-30, tapY, tapX, tapY+30, tapX+30, tapY, tapX, tapY-30], "white");
        //どの向きに飛ぶか分かるように線を表示
        var dx = ballX[bnum] - tapX;
        var dy = ballY[bnum] - tapY;
        line(ballX[bnum], ballY[bnum], ballX[bnum]+dx, ballY[bnum]+dy, "white");
        //line(tapX, tapY, ballX, ballY, "white");
        if(tapC == 0) {//離した時
            if(tapX < 10 || 1190 < tapX || tapY < 10 || 790 < tapY){
                drag = 0;   //やり直し
            }
            else if(getDis(tapX, tapY, ballX[bnum], ballY[bnum]) < 60) {
                drag = 0;   //やり直し
            }
            else {
                ballVx[bnum] = (ballX[bnum] - tapX)/8;
                ballVy[bnum] = (ballY[bnum] - tapY)/8;
                return true;//飛ばしたらtrueを返す
                // drag = 0;   //やり直し
                //操作するボールの順番操作
                // bnum = bnum + 1;
                // if(bnum == BALL_MAX) bnum = 0;
            }
        }
    }
    return false;
}

function hitBall(n1, n2) {//ボールの衝突時に耐力計算を行う関数
    if(G_OR_B[n2] == ally) {//味方に当てた
        if(CURE[n1] > 0) {
            life[n2] += CURE[n1];
            if(life[n2] > LIFE[n2]) life[n2] = LIFE[n2];
            setEffect(n2,"lime", 10);
            playSE(5);
        }
    }
    else {//敵に当てた
        life[n2] -= POWER[n1];
        if(life[n2] < 0) life[n2] = 0;
        setEffect(n2, "red", 10);
        playSE(4);
    }

}

function initVar() {//配列に初期値を代入
    for(var i=0;i<BALL_MAX;i++){
        ballX[i] = BALLX[i];
        ballY[i] = BALLY[i];
        ballVx[i] = 0;
        ballVy[i] = 0;
        cursor[i] = "";
        life[i] = LIFE[i];
        /*
        ballX[i] = 400+i*80;
        ballY[i] = 200+i*80;
        ballVx[i] = rnd(80)-40;//確認用に乱数の値を代入
        ballVy[i] = rnd(80)-40;
        */
    }
}

function setEffect(n, c, t) {
    eff_col[n] = c;
    eff_tmr[n] = t;
}