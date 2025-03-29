//257//257
//5-12

// 5-3:マップデータ
// 5-4:地形生成とスクロール
// 5-5:移動と壁・床の処理
// 5-6:左右移動とジャンプ
// 5-7:完成とジャンプ長さ・アニメーション
// 5-8:キャラ移動とスクロール
// 5-9:地面に穴を配置
//5-10:敵とアイテム配置
//5-11:ステージが進むほど難易度上昇
//5-12:完成

//起動時の処理
function setup() {
    //setFPS(60)
    canvasSize(1080,720);//描画エリア
    loadImg(0, "image/bg.png");//背景画像
    for(var i=1; i<=6; i++) loadImg(i, "image/chip"+i+".png");//マップチップ
    for(var i=0; i<=5; i++) loadImg(10+i, "image/mgirl"+i+".png");//主人公キャラ画像
    loadImg(20, "image/mg_illust.png")//タイトル画面イラスト
    loadImg(21, "image/title.png")//タイトル画面ロゴ
    var SOUND = ["bgm", "jump", "pearl", "clear", "miss", "gameover"];
    for(var i=0; i<SOUND.length; i++) loadSound(i, "sound/"+SOUND[i]+".m4a");
    //loadImg(10, "image/mgirl0.png");//主人公キャラ画像
    setStage();
}

//メインループ
function mainloop() {
    tmr++;//タイマー用の変数を常時カウントしておく
    //inkeyはWWS.jsの関数
    //以下の処理はすべてmoveplayerに纏められた
    //if(inkey == 37 && scroll > 0) scroll -= 12;//左キー
    //if(inkey == 39 && scroll < SIZE*135) scroll += 12;//右キー
    /*var dots = 12
    if(inkey == 38 && plY > 36) {//上キー
        if(chkWall(plX, plY-dots) == false)plY -= dots;
    }
    if(inkey == 40 && plY < 684) {//下キー
        if(chkWall(plX, plY+dots) == false)plY += dots;
    }
    if(inkey == 37 && plX > 36) {//左キー
        if(chkWall(plX-dots, plY) == false)plX -= dots;
    }
    if(inkey == 39 && plX< 1044) {//右キー
        if(chkWall(plX+dots, plY) == false)plX += dots;
    }*/
   /*
   if(key[38] == 1 || key[38]>4) {
    if(stage > 1) { stage--; setStage(); initVar(); }
    key[38]++;
   }
   if(key[40] == 1 || key[40]>4) {
    if(stage < 20) { stage++; setStage(); initVar(); }
    key[40]++;
   }
    movePlayer();
    */
    drawGame();
    var col = "yellow";
    if(gtime<30*5 && gtime%10<5) col = "red";
    fText("TIME "+gtime, 150, 30, 36, col);
    fText("SCORE "+score, 540, 30, 36, "white");
    fText("STAGE "+stage, 930, 30, 36, "cyan");
    lineW(3);
    fRect(855+int(plX/SIZE), 60, 4, 16, "pink");
    sRect(855, 60, 154, 16, "white");

    switch(idx) {
        case 0://タイトル画面
        drawImg(20, -200, 0);//イラスト
        drawImg(21, 300, 60);//タイトルロゴ
        if(tmr%30 < 15) fText("PRESS[SPACE] TO START!", 540, 520, 40, "gold");
        if(inkey == 32) {
            stage = 1;
            score = 0;
            idx = 1;
            tmr = 0;
        }
        break;

        case 1://マップデータをセット、変数に初期値を代入
        if(tmr == 1) {
            setStage();
            initVar();
        }
        if(tmr > 10) fText("STAGE "+stage+" START!", 540, 240, tmr, "cyan");
        if(tmr > 80) {
            playBgm(0);
            idx = 2;
        }
        break;

        case 2://ゲームプレイ
        gtime--;
        var mp = movePlayer();
        if(mp == 1) { idx = 4; tmr = 0; }
        if(mp == -1 || gtime == 0) {idx = 3; tmr = 0; }
        break;

        case 3://ゲームオーバー
        if(tmr == 1) stopBgm();
        if(tmr == 2) playSE(4);
        if(tmr == 90) playSE(5);
        if(tmr > 100) {
            fText("GAME OVER", 540, 240, 60, "red");
            fText("Retry? [Y]or[N]", 540, 400, 40, "lime");
            if(inkey == 89) {
                idx = 1;
                tmr = 0;
            }
            if(inkey == 78) idx = 0;
        }
        break;

        case 4://ゲームクリア
        if(tmr == 1) stopBgm();
        if(tmr < 9) {//クリスタルを手に入れる演出
            mapdata[8-tmr][149] = 6;
            mapdata[9-tmr][149] = 0;
        }
        if(tmr == 10) playSE(3);
        if(tmr > 10) fText("STAGE CLEAR!", 540, 240, 60, "cyan");
        if(tmr > 200) {
            stage++;
            idx = 1;
            tmr = 0;
        }
        if(gtime > 0) {
            gtime = (int(gtime/20)-1)*20;
            score +=20;
        }
        break;
    }
    /*
    fText("↑", 930, 30, 36, "white")
    fText("STAGE "+stage, 930, 80, 36, "cyan")
    fText("↓", 930, 130, 36, "white")
    */
}

//ゲーム振興を管理する変数
var idx = 0;
var tmr = 0;
var stage = 1;
var score = 0;
var gtime = 0;

//プレイヤーキャラを管理する関数
/*
var plX = 36;
var plY = 36;
*/
/*
var plX = 108;//ステージ全体でのプレイヤー位置
var plY = 36;
*/
var plX = 0;//ステージ全体でのプレイヤー位置
var plY = 0;
var plXp = 0;
var plYp = 0;
//var plJump = 2;
var plJump = 0;
var plDir = 0;
var plAni = 0
var MG_ANIMA = [0, 0, 1, 1, 0, 0, 2, 2]//主人公アニメパターン

function initVar() {
    plX = SIZE*2;
    plY = int(SIZE*8.5);
    plXp = 0;
    plYp = 0;
    plJump = 0;
    plDir = 0;
    plAni = 0;
    gtime = 1200;
}

//マップデータ
var mapdata = new Array(10);
for(var y=0; y<10; y++) mapdata[y] = new Array(150);

function setStage() {//地形を用意する
    var i,n,x,y;
    for(y=0; y<10; y++){//データをクリア
        for(x=0; x<150; x++) mapdata[y][x] = 0;
    }
    n = 21-stage;//最下段の地面の幅
    if(n < 6) n = 6;//最も短くなると6マス
    for(x=0; x<150; x++) {//地面を配置する
        if(x%20 < n) {
            mapdata[9][x] = 1;
            if(stage%2==0 && x>20 && x%4==0 && rnd(100)<5*stage) mapdata[8][x] = 3;//針
        }
        /*
        mapdata[9][x] = 1;//一番下の地面
        if(x%30 <= 2) mapdata[9][x] = 0;//確認用の穴
        if(x%30 == 15) mapdata[9][x] = 0;//確認用の穴
        if(rnd(100)<5) mapdata[8][x] = 3;//針
        */
    }
    for(i=1;i<9;i++) {//ゴールドパールの設置
        x = 15*i+rnd(15);
        y = 1+rnd(7);
        mapdata[y][x] = 5;
        mapdata[y-1][x] = 5;
        mapdata[y+1][x] = 5;
        mapdata[y][x-1] = 5;
        mapdata[y][x+1] = 5;
    }
    //x = 0;
    x = 14;
    y = 8;
    n = 5;
    do {//ランダムにブロックを配置
        for(i=0; i<n; i++){
            mapdata[y][x] = 2;
            //if(rnd(100)<5) mapdata[y-1][x] = 4;//食虫植物
            if(x>20 && x%3==0 && rnd(100)<5*stage) mapdata[y-1][x] = 4;//食虫植物
            x++;
        }
        y = 2+rnd(7);
        n = 2+rnd(3);
    }
    while(x < 140);

    mapdata[8][149] = 6;//ゴールのクリスタル

}

var SIZE = 72;
var scroll = 0;
function drawGame() {//ゲーム画面描画
    var c,x,y,cx,cy;
    var cl = int(scroll/SIZE);
    var ofsx = scroll%SIZE;
    drawImg(0, 0, 0);//背景画像
    for(y=0;y<10;y++) {//マップチップの表示
        for(x=0;x<16;x++) {
            c = mapdata[y][x+cl];
            if(c==4 && tmr%30<15) {//食虫植物のアニメーション
                drawImgLR(c, x*SIZE-ofsx, y*SIZE);
                continue;
            }
            if(c > 0) drawImg(c, x*SIZE-ofsx, y*SIZE);
            //sRect(x*SIZE, y*SIZE, SIZE, SIZE, "white");//確認用の格子
        }
    }

    //5-8のスクロールしない範囲の確認用
    //(仮)遊びの範囲を表示する
    /*
    setAlp(50);
    fRect(SIZE*4.5, 0, SIZE*6, SIZE*10, "white");
    setAlp(100);
    */

    cx = plX - scroll;//プレイヤーのキャンバス上表示位置(cx,cy)
    cy = plY;

    //スクロールする座標を管理する変数の値を計算
    if(cx<SIZE*5) {
        scroll = plX - SIZE*5;
        if(scroll<0) scroll = 0;
    }
    if(cx>SIZE*10) {
        scroll = plX - SIZE*10;
        if(scroll>SIZE*135) scroll = SIZE*135;
    }
    if(idx == 3) {//ゲームオーバー
        drawImgC(14+int(tmr/10)%2, cx, cy);
        if(plY > 680) plY -= 2;//穴に落ちた時、イラストを表示する
    }
    else if(idx > 0) {
        if(plDir == -1) drawImgLR(11+MG_ANIMA[plAni%8], cx-SIZE/2, cy-SIZE/2);//左向き
        if(plDir == 0) drawImg(10, cx-SIZE/2, cy-SIZE/2);//正面向き
        if(plDir == 1) drawImg(11+MG_ANIMA[plAni%8], cx-SIZE/2, cy-SIZE/2);//左向き
    }
    //drawImg(10,plX-SIZE/2, plY-SIZE/2);
    //fText("scroll="+scroll, 144, 72, 30, "cyan");//scrollの値を表示
}

//var CXP = [-36, 35, -36, 35];//四隅の座標の定義
var CXP = [-28, 27, -28, 27];//四隅の座標の定義
var CYP = [-36, -36, 35, 35];
var WALL = [0, 1, 1, 0, 0, 0, 0];
function chkWall(cx, cy) {//壁があるか確認
    var c = 0;
    if(cx < 0 || 150*SIZE < cx) c++;//ステージの左端と右端
    for(var i=0;i<4;i++) {//四隅を調べる
        var x = int((cx+CXP[i])/SIZE)
        var y = int((cy+CYP[i])/SIZE)
        if(0 <= x && x <=149 && 0<=y && y<=9) {
            if(WALL[mapdata[y][x]] == 1) c++;
        }
    }
    return c;
}

function movePlayer(){

    //X軸方向の移動
    if(key[37] > 0) {
        if(plXp > -32) plXp -= 2;
        plDir = -1;
        plAni++;
    }
    else if(key[39] > 0) {
        if(plXp < 32) plXp += 2;
        plDir = 1;
        plAni++;
    }
    else {
        plXp = int(plXp*0.7);
    }

    //壁にめり込まない限りX軸座標を変化させる
    var lr = Math.sign(plXp);
    var loop = Math.abs(plXp);
    while(loop > 0) {
        if(chkWall(plX+lr, plY) != 0) {
            plXp = 0;
            break;
        }
        plX += lr;
        loop--;
    }

    /*if(chkWall(plX+plXp, plY)!= 0) {
        plXp = 0;
    }
    plX += plXp;*/

    //Y軸方向の移動(ジャンプと落下の処理)
    if(plJump == 0) {//床にいる
        if(chkWall(plX, plY+1) == 0) {//床が無いと落下
            plJump = 2;
        }
        else if(key[32] == 1) {
            plYp = -60;
            plJump = 1;
        }
    }
    else if(plJump == 1) {//ジャンプ中
        if(key[32]  > 0)
            plYp += 6;
        else
            plYp += 18;
        //plYp += 12;
        if(plYp > 0) plJump = 2;
    }
    else {//落下中
        if(key[32] > 0)
            plYp += 6;
        else
            plYp += 12;
        if(plYp > 48) plYp = 48;
    }

    //壁にめり込まない限りY座標を変化させる
    var ud = Math.sign(plYp);
    loop = Math.abs(plYp);
    while(loop > 0) {
        if(chkWall(plX, plY+ud) != 0) {
            plYp = 0;
            if(plJump == 1) {//ジャンプ中壁に当たったか
                plJump = 2;    
            }
            else if(plJump == 2) {//落下中床についたか
                plJump = 0;
                if(key[32] == 1) key[32] = 2;//キーを押し続けたり連打した時、着地の瞬間にはねるのを防ぐ    
            }
            break;
        }
        plY += ud;
        loop--;
    }

    //プレイヤーの位置に何があるか調べる
    var cx = int(plX/SIZE);
    var cy = int(plY/SIZE);
    var chip = 0;
    if(0 <=cx && cx < 150 && 0 <= cy && cy < 9) chip = mapdata[cy][cx];
    if(chip == 3 || chip == 4) return -1;//敵に触れる
    if(chip == 5) {//ゴールドパールを取る
        mapdata[cy][cx] = 0;
        score += 100;
        gtime += 20;
        playSE(2);
    }
    if(plY > 800) return -1;//穴に落ちた
    if(plX > SIZE*149) return 1;//ゴールした
    return 0;

    //Y座標が800(キャンバスサイズ)を超えたら0(最上部)に座標を戻す
    //if(plY > 800) plY = 0;//(仮)穴に落ちた時に画面上から出現

    /*if(chkWall(plX, plY+plYp) != 0) {
        plYp = 0;
        if(plJump == 2) {//落下中→床についたか
            plJump = 0;    
        }
    }
    plY += plYp;
    */
}