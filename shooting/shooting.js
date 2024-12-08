//Page Task     102/104
//Clear Task    2-13
//起動時の処理
function setup(){                                                   //初期設定
    canvasSize(1200,720);                                           //ゲーム画面描画サイズ指定
    loadImg(0,"image/bg.png");                                      //画像読み込み 画像番号0:背景
    loadImg(1,"image/spaceship.png");                               //画像番号1:自機
    loadImg(2,"image/missile.png");                                 //画像番号2:自機の弾
    loadImg(3,"image/explode.png");                                 //画像番号3:爆発エフェクト
    for(var i=0; i<=4; i++) loadImg(4+i, "image/enemy"+i+".png");   //画像番号1～8に敵機1～4及び障害物の画像を読み込み
    for(var i=0; i<=2; i++) loadImg(9+i, "image/item"+i+".png");    //画像番号9～11にアイテム1～4の画像を読み込み
    loadImg(12, "image/laser.png");                                 //画像番号12:Sレーザー
    loadImg(13, "image/title_ss.png");                              //画像番号13:タイトル画面
    loadSound(0, "sound/bgm.m4a");                                  //音楽ファイル読み込み
    initSShip();                                                    //自機を初期化
    initMissile();                                                  //弾を初期化
    initObject();                                                   //物体を初期化
    initEffect();                                                   //エフェクトを初期化
    setFPS(60);
}

//メインループ　毎フレーム実行する処理
function mainloop(){
    tmr++;
    drawBG(1);                                                                                  //関数呼び出し　背景描画
    switch(idx) {
        case 0://タイトル画面
        drawImg(13, 200, 200);
        if(tmr%40 < 20)fText("Press [SPC] or Click to start.", 600, 540, 40, "cyan")
        if(key[32]>0 || tapC>0) {
            initSShip();
            initObject();
            score = 0;
            stage = 1;
            idx = 1;
            tmr = 0;
            playBgm(0);
        }
        break;
        
        case 1://ゲームプレイ画面
        setEnemy();                                                                                 //敵機配置
        setItem();                                                                                  //アイテム配置
        moveSShip();                                                                                //自機移動
        moveMissile();                                                                              //自機の弾移動
        moveObject();                                                                               //敵機・敵弾移動
        drawEffect();                                                                               //エフェクト描画
        for(i=0; i<10; i++) fRect(20+i*30, 660, 20, 40, "#c00000");
        for(i=0; i<energy; i++) fRect(20+i*30, 660, 20, 40, colorRGB(160-16*i, 240-12*i, 24*i));
        if(tmr < 30*4) fText("STAGE "+stage, 600, 300, 50, "cyen");
        if(30*114 < tmr && tmr < 30*118) fText("STAGE CLEAR", 600, 300, 50, "cyan");
        if(tmr == 30*120) {
            stage++;
            tme = 0;
        }
        break;

        case 2://ゲームオーバー
        if(tmr < 30*2 && tmr%5 == 1) setEffect(ssX+rnd(120)-60, ssY+rnd(80)-40, 9);
        moveMissile();
        moveObject();
        drawEffect();
        fText("GAME OVER", 600, 300, 50, "red");
        if(tmr > 30+5) idx = 0;
        break;
    }
    fText("SCORE "+score, 200, 50, 40, "white");
    fText("HISCORE "+hisco, 600, 50, 40, "yellow");
}

//背景のスクロール
var bgX = 0;                    //背景スクロール位置
function drawBG(spd) {          //drawBG関数定義
    bgX = (bgX + spd)%1200;     //背景位置を速度+の後1200割りで計算
    drawImg(0,-bgX,0);          //1枚目の画像の左端指定
    drawImg(0,1200-bgX,0);      //2枚目の画像の左端指定
    var hy = 580;//地面の地平線のY座標
    var ofsx = bgX%40;//縦のラインを移動させるオフセット値
    lineW(2);
    for(var i=1; i<=30; i++) {//縦のライン
        var tx = i*40-ofsx;
        var bx = i*240-ofsx*6-3000;
        line(tx,hy,bx,720,"sliver");
    }
    for(var i=1; i<12; i++) {//縦のライン
        lineW(1+int(i/3));
        line(0, hy, 1200, hy, "gray");
        hy = hy + i*2;
    }
}

//ゲーム進行管理変数
var idx = 0;    //シーン変数
var tmr = 0;    //タイマー変数

var score = 0;//スコア
var hisco = 10000;//ハイスコア
var stage = 0;//ステージ数

//自機の管理
var ssX = 0;    //自機X軸位置
var ssY = 0;    //自機Y軸位置
var automa = 0; //自動連射
var energy = 0; //エネルギー
var muteki = 0; //無敵状態
var weapon = 0; //武器のパワーアップ
var laser = 0;  //レーザーの使用回数

//自機の初期化
function initSShip() {          //初期座標の指定
    ssX = 400;
    ssY = 360;
    energy = 10;
    muteki = 0;
    weapon = 0;
    laser = 0;
}

//自機の移動処理
function moveSShip() {                              //自機移動
    if(key[37] > 0 && ssX > 60) ssX -= 20;          //左入力[37]受付・移動
    if(key[39] > 0 && ssX < 1000) ssX += 20;        //右入力[39]受付・移動
    if(key[38] > 0 && ssY > 40) ssY -= 20;          //上入力[38]受付・移動
    if(key[40] > 0 && ssY < 680) ssY += 20;         //下入力[40]受付・移動
    if(key[65] == 1) {
        key[65]++;
        automa = 1-automa;
    }
    if(automa == 0 && key[32] == 1) {
        key[32]++;                                  //長押しによる連続押下防止
        setWeapon();                                //スペースキー[32]受付・発射
    }
    if(automa == 1 && tmr%8 == 0) setWeapon();
    var col = "black";
    if(automa == 1) col = "white";
    fRect(900,20,280,60,"blue");
    fText("[A]utoMissile",1040,50,36,col);

    if(tapC > 0) {//タップ操作
        if(900<tapX && tapX<1180 && 20<tapY && tapY<80) {
            tapC = 0;
            automa = 1-automa;
        }
        else {
            ssX = ssX + int((tapX-ssX)/6);
            ssY = ssY + int((tapY-ssY)/6);
        }
    }

    if(muteki%2 == 0) drawImgC(1,ssX,ssY);          //自機描画
    if(muteki > 0) muteki--;
}

function setWeapon() {
    var n = weapon;
    if(n > 8) n = 8;
    for(var i=0; i<=n; i++) setMissile(ssX+40, ssY-n*6+i*12, 40, int((i-n/2)*2));
}

//複数の弾の管理
var MSL_MAX = 100;                  //弾の最大数
var mslX = new Array(MSL_MAX);
var mslY = new Array(MSL_MAX);
var mslXp = new Array(MSL_MAX);
var mslYp = new Array(MSL_MAX);
var mslF = new Array(MSL_MAX);
var mslImg = new Array(MSL_MAX);
var mslNum = 0;

//弾の初期化処理
function initMissile() {
    for(var i=0; i<MSL_MAX; i++) mslF[i] = false;
    mslNum = 0;
}

//弾の作成処理
function setMissile(x,y,xp,yp) {
    mslX[mslNum] = x;
    mslY[mslNum] = y;
    mslXp[mslNum] = xp;
    mslYp[mslNum] = yp;
    mslF[mslNum] = true;
    mslImg[mslNum] = 2;
    if(laser > 0) {//レーザー
        laser--;
        mslImg[mslNum] = 12;
    }
    mslNum = (mslNum+1)%MSL_MAX;
}

//弾の移動処理
function moveMissile() {
    for(var i=0; i<MSL_MAX; i++) {
        if(mslF[i] == true) {
            mslX[i] += mslXp[i];
            mslY[i] += mslYp[i];
            drawImgC(mslImg[i],mslX[i],mslY[i]);
            if(mslX[i] > 1200) mslF[i] = false;
        }    
    }
}

//オブジェクト管理
var OBJ_MAX = 100;
var objType = new Array(OBJ_MAX);   //0=敵の弾　1=敵機
var objImg = new Array(OBJ_MAX);    //物体の画像番号を管理する配列
var objX = new Array(OBJ_MAX);
var objY = new Array(OBJ_MAX);
var objXp = new Array(OBJ_MAX);
var objYp = new Array(OBJ_MAX);
var objLife = new Array(OBJ_MAX);   //敵ライフ管理
var objF = new Array(OBJ_MAX);
var objNum = 0;

//オブジェクトの初期化関数
 function initObject() {
    for(var i=0; i<OBJ_MAX; i++) objF[i] = false;
    objNum = 0;
} 

//オブジェクトセット
function setObject(typ,png,x,y,xp,yp,lif) {
    objType[objNum] = typ;
    objImg[objNum] = png;
    objX[objNum] = x;
    objY[objNum] = y;
    objXp[objNum] = xp;
    objYp[objNum] = yp;
    objLife[objNum] = lif;
    objF[objNum] = true;
    objNum = (objNum+1)%OBJ_MAX;
}

//オブジェクト動作
function moveObject() {
    for(var i=0; i<OBJ_MAX; i++) {
        if(objF[i] == true) {
            objX[i] = objX[i] + objXp[i];
            objY[i] = objY[i] + objYp[i];
            if(objImg[i] == 6) {//敵機2の特殊な動き
                if(objY[i] < 60) objYp[i] = 8;                          //Y座標が60より小さいなら下へ
                if(objY[i] > 660) objYp[i] = -8;                        //Y座標が660より大きいなら上へ
            }
            if(objImg[i] == 7) {//敵機3の特殊な動き
                if(objXp[i] < 0) {                                      //左へ移動しているなら
                    objXp[i] = int(objXp[i]*0.95);                      //減速
                    if(objXp[i] == 0) {                                 //その値が0になったら
                        setObject(0, 4, objX[i], objY[i], -20, 0, 0);   //弾を撃ち
                        objXp[i] = 20;                                  //右へ飛び去らせる
                    }
                }
            }

            drawImgC(objImg[i],objX[i],objY[i]);

            //自機が撃った弾とヒットチェック
            if(objType[i] == 1) {//敵機
                var r = 12+(img[objImg[i]].width+img[objImg[i]].height)/4;
                for(var n=0; n<MSL_MAX; n++) {
                    if(mslF[n] == true) {
                        if(getDis(objX[i], objY[i], mslX[n], mslY[n]) < r) {
                            if(mslImg[n] == 2) mslF[n] = false;
                            objLife[i]--;
                            if(objLife[i] == 0) {
                                objF[i] = false;
                                setEffect(objX[i], objY[i], 9);
                                score = score + 100;
                                if(score > hisco) hisco = score;
                                setEffect(objX[i], objY[i], 9);
                            }
                            else{
                                setEffect(objX[i], objY[i], 3);
                            }
                        }
                    }
                }
            }

            //自機とのヒットチェック
            var r = 30+(img[objImg[i]].width+img[objImg[i]].height)/4;
            if(getDis(objX[i], objY[i], ssX, ssY) < r) {
                if(objType[i] <= 1 && muteki == 0) {//敵の弾と接蝕
                    objF[i] = false;
                    energy--;
                    muteki = 30;
                    if(energy == 0) {//エネルギー0でゲームオーバーへ
                        idx = 2;
                        tmr = 0;
                        stopBgm();
                    }
                }
                if(objType[i] == 2) {//アイテム
                    objF[i] = false;
                    if(objImg[i] ==  9 && energy < 10) energy++;
                    if(objImg[i] == 10) weapon++;
                    if(objImg[i] == 11) laser = laser + 100;
                }
            }
            if(objX[i]<-100 || objX[i]>1300 || objY[i]<-100 || objY[i]>820) objF[i] = false;
        }
    }
}

//エフェクト(爆発演出の管理)
var EFCT_MAX = 100;
var efctX = new Array(EFCT_MAX);
var efctY = new Array(EFCT_MAX);
var efctN = new Array(EFCT_MAX);
var efctNum = 0;

//配列を初期化する関数
function initEffect() {
    for(var i=0; i<EFCT_MAX; i++) efctN[i] = 0;
    efctNum = 0;
}

//エフェクトをセットする関数
function setEffect(x, y, n) {
    efctX[efctNum] = x;
    efctY[efctNum] = y;
    efctN[efctNum] = n;
    efctNum = (efctNum+1)%EFCT_MAX;
}

//エフェクトを表示する関数
function drawEffect() {
    for(var i=0; i<EFCT_MAX; i++) {
        if(efctN[i] > 0) {
            drawImgTS(3, (9-efctN[i])*128, 0, 128, 128, efctX[i]-64, efctY[i]-64, 128, 128);
            efctN[i]--;
        }
    }
}

//敵をセットする関数
function setEnemy() {
var sec = int (tmr/30);//経過秒数
    if(4<= sec && sec <10) {
        if(tmr%60 == 0) setObject(1, 5, 1300, 60+rnd(600), -16, 0, 1*stage);        //敵機1    
    }
    if(14<= sec && sec <20) {
        if(tmr%60 == 0) setObject(1, 6, 1300, 60+rnd(600), -12, 8, 3*stage);        //敵機2    
    }
    if(24<= sec && sec <30) {
        if(tmr%60 == 0) setObject(1, 7, 1300, 360+rnd(300), -48, -10, 5*stage);     //敵機3    
    }
    if(34<= sec && sec <70) {
        if(tmr%60 == 0) setObject(1, 8, 1300, rnd(720-192), -6, 0, 0);              //障害物
    }
    if(54<= sec && sec <70) {
        if(tmr%20 == 0) {
        setObject(1, 5, 1300,  60+rnd(600), -16, 0, 1*stage);                       //敵機1
        setObject(1, 5, 1300, 360+rnd(600), -16, 0, 1*stage);                       //敵機1
        }
    }
    if(74 <= sec && sec <90) {
        if(tmr%20 == 0) setObject(1, 6, 1300, 60+rnd(600), -12, 8, 3*stage);        //敵機2
        if(tmr%45 == 0) setObject(1, 8, 1300, rnd(720-192), -8, 0, 0);              //障害物
    }
    if(94<= sec && sec <110) {
        if(tmr%10 ==  0) setObject(1, 5, 1300, 360, -24, rnd(11)-5, 1*stage);       //敵機1
        if(tmr%20 ==  0) setObject(1, 7, 1300, rnd(300), -56, 4+rnd(12), 5*stage);  //敵機3
    }
    /*    if(tmr%60 ==  0) setObject(1, 5, 1300, 60+rnd(600), -16, 0, 1);     //敵機1
        if(tmr%60 == 10) setObject(1, 6, 1300, 60+rnd(600), -12, 8, 3);     //敵機2
        if(tmr%60 == 20) setObject(1, 7, 1300, 360+rnd(300), -48, -10, 5);  //敵機3
        if(tmr%60 == 30) setObject(1, 8, 1300, rnd(720-192), -6, 0, 0);     //障害物
    */
    }

    function setItem() {
        if(tmr%90 ==  0) setObject(2,  9, 1300, 60+rnd(600), -10, 0, 0);    //Energy
        if(tmr%90 == 30) setObject(2, 10, 1300, 60+rnd(600), -10, 0, 0);    //Missile
        if(tmr%90 == 60) setObject(2, 11, 1300, 60+rnd(600), -10, 0, 0);    //Laser
}