//328/328
//6-17

// 6-3:通路定義
// 6-4:背景と敵の出現位置定義
// 6-5:手動で敵を動かす
// 6-6:自動で敵を動かす
// 6-7:複数の敵を同時に動かす
// 6-8:敵の種類を増やす
// 6-9:城(防衛対象)設置
//6-10:自軍カードの表示と選択
//6-11:自軍の配置
//6-12:敵を自動攻撃する
//6-13:攻撃範囲、速度、向きを組み込む
//6-14:自軍体力設定
//6-15:回復能力の実装
//6/16:魔力(コスト)の実装
//6-17:完成

//起動時の処理
function setup() {
    canvasSize(1080, 1264);
    var IMG = ["bg1", "enemy", "castle", "card", "soldier", "mcircle"];//一括で読み込むために配列に格納
    for(var i=0; i<IMG.length; i++) loadImg(i, "image/" + IMG[i] + ".png");
    var SND = ["battle", "win", "lose", "victory"];
    for(var i=0; i<SND.length; i++) loadSound(i, "sound/" + SND[i] + ".m4a");
    // loadImg(0, "image/bg1.png");
    // loadImg(1, "image/enemy.png");
    //initVar();
    //setEnemy();
}

//メインループ
function mainloop() {
    tmr++;
    if(idx > 0) drawBG();
    drawCard();

    switch(idx) {
        case 0://タイトル
        fRect(0,0,1080,864,"black");
        drawImgR(5,540,400,tmr);//魔法陣
        fText("Tower Deffence", 540, 280, 50, "skyblue");
        fText("Saint Quartet", 540, 400, 120, "white");
        if(tmr%60 < 30) fText("Click to Start!", 540, 754, 50, "skyblue");
        if(tapC > 0) {
            season = 1;
            initVar();
            idx = 1;
            tmr = 0;
        }
        break;

        case 1://ゲーム中
        if(tmr == 1) playBgm(0);
        if(tmr < 90) fText("SEASON "+season+" START", 540, 400, 60, "white");
        if(tmr%10 < 5) card_power[rnd(CARD_MAX)] += 1;
        if(tapC == 1 && tapY > 864) {//カードをクリックしたか
            tapC = 0;
            var c = int(tapX/270);
            if(0<=c && c<CARD_MAX) sel_card = c;
        }
        var x = int(tapX/SIZE);//マウスポインタのマス
        var y = int(tapY/SIZE);
        if(0<=x && x<15 && 0<=y && y<12) {//盤面上
            var cx = x*SIZE+SIZE/2;
            var cy = y*SIZE+SIZE/2;
            if(card_power[sel_card] >= 100) {//配置する兵
                setAlp(50);
                fCir(cx,cy,CARD_RADIUS[sel_card], "cyan");
                drawSoldier(cx-SIZE/2, cy-SIZE/2, sel_card+1, 1, 0);
                setAlp(100);
            }
            var n = troop[y][x];//その位置の兵
            if(n > 0) {
                lineW(3);
                sCir(cx,cy,CARD_RADIUS[n-1], "cyan");
            }
            if(tapC == 1) {//クリックしたとき
                tapC = 0;
                if(n == 0 && stage[y][x] == 0) {//兵がおらず配置可能な場所なら
                    if(card_power[sel_card] >= 100) {//カードの魔力が満タンなら
                        troop[y][x] = sel_card+1;//兵を配置
                        tr_life[y][x] = CARD_LIFE[sel_card];//体力値を代入
                        card_power[sel_card] = 0;
                    }
                }
                if(n > 0) {//兵がいる場合
                    card_power[n-1] += 50;
                    troop[y][x] = 0;//兵を回収
                }
            }
        }
        for(var i=0;i<CARD_MAX;i++) {//魔力が上限を超えていないか
            if(card_power[i] > 100) card_power[i] = 100;
        }
        action();
        //if(tmr%30 == 0) setEnemy();
        if(gtime>30*10 && gtime%45==0) setEnemy();
        if(gtime>30*10 && gtime<30*60 && gtime%10==0) setEnemy();//総攻撃
        castle_x = 7*SIZE;
        castle_y = 10*SIZE;
        moveEnemy();
        var cp = 0;//城のパターン
        if(damage >= 30) cp = 1;
        if(damage >= 60) cp = 2;
        if(damage >= 90) cp = 3;
        drawImgTS(2, cp*96, 0, 96, 96, castle_x-12, castle_y-24, 96, 96);
        fText("DMG "+damage, 540, 820,30, "white");
        gtime--;
        fText("TIME "+int(gtime/30/60)+":"+digit0(int(gtime/30)%60,2),920,30,40,"white");
        if(damage >= 100) {//城破壊(ゲームオーバー)
            idx = 2;
            tmr = 0;
        }
        if(gtime == 0) {//シーズンクリア
            idx = 3;
            tmr = 0;
        }
        break;

        case 2://ゲームオーバー
        if(tmr == 1) stopBgm();
        if(tmr == 2) playSE(2);
        fText("GAME OVER", 540, 350, 50, "red");
        if(tmr > 30*10) idx = 0;
        break;

        case 3://シーズンクリア
        if(tmr == 1)stopBgm();
        if(tmr == 2)playSE(1);
        fText("SEASON CLEAR", 540, 360, 0, "cyan");
        if(tmr > 30*8) {
            if(season == 4) {
                idx = 4;
                tmr = 0;
            }
            else {
                season++;
                initVar();
                idx = 1;
                tmr = 0;
            }
        }
        break;

        case 4://エンディング
        if(tmr == 1) playSE(3);
        fText("ALL SEASON CLEAR!", 540, 360, 60, "pink");
        if(tmr > 30*12) {
            idx = 0;
            tmr = 0;
        }
        break;
    }
}

var SIZE = 72;
var XP = [0,0,0,-1,1]//上下左右の各方向の座標変化の基本地
var YP = [0,-1,1,0,0]
var CHR_ANIMA = [0,1,0,2];//キャラクターのアニメーション
var FLASH = ["#2040ff", "#4080ff", "#80c0ff", "#c0e0ff", "#80c0ff", "4080ff"];//明滅色
var stage = [
    [0,0,0,0,2,0,0,0,0,0,2,0,0,0,0],
    [4,2,0,0,4,4,2,0,0,2,3,0,0,2,3],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,2,0,0,0,0,2,0,0,2,0,0,0,2,0],
    [0,4,4,2,0,2,3,0,0,4,2,0,0,2,0],
    [0,0,0,2,0,2,0,0,0,0,4,2,0,2,0],
    [0,2,3,3,0,4,4,2,0,0,0,2,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,3,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,2,0,0,0,0,0,2,0,0,2,0,0,2,0],
    [0,4,4,4,4,4,4,5,3,3,3,3,3,3,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
//var arrow = ["", "↑", "↓", "←", "→", "C"];
var ESET_X = [0,4,10,14];//敵が出現するマス
var ESET_Y = [1,0,0,1];//敵が出現するマス

var idx = 0;
var tmr = 0;
var castle_x = 0;
var castle_y = 0;
var damage = 0;
var season = 1;
var gtime = 0;

function drawBG() {//ゲーム画面描画
    //fill("navy");//背景を紺色で塗りつぶす
    drawImg(0,0,0);
    lineW(1);
    for(var y=0;y<12;y++) {
        for(var x=0;x<15;x++) {
            var cx = x*SIZE;
            var cy = y*SIZE;
            if(stage[y][x] > 0) {
                setAlp(50);
                fRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4000c0");
                setAlp(100);
                sRect(cx+1, cy+1, SIZE-3, SIZE-3, "#4060ff");
                //fText(arrow[stage[y][x]], cx+SIZE/2, cy+SIZE/2, 30, "cyan");
            }
            var n = troop[y][x];
            if(n > 0) {
                var a = 3;//アニメーション用
                var lif = tr_life[y][x];
                if(lif > 0) a = CHR_ANIMA[int(tmr/4)%4];
                drawSoldier(cx, cy, n, tr_dir[y][x], a/*CHR_ANIMA[int(tmr/4)%4*]*/);
                fText(lif, cx+SIZE/2, cy+56, 24, "white");
            }
            /*
            sRect(cx, cy, SIZE-2, SIZE-2, "silver");
            var c = stage[y][x];
            if(c > 0) {
                fRect(cx, cy, SIZE-2, SIZE-2, "white");
                fText(arrow[c], cx+SIZE/2,cy+SIZE/2, 30, "cyan");
            }
            */
        }
    }
    /*
    for(var i=0; i<4; i++) {
        var cx = ESET_X[i]*SIZE+SIZE/2;
        var cy = ESET_Y[i]*SIZE+SIZE/2;
        sCir(cx, cy, 30, "yellow");
    }
    */
}

//敵の管理
/*// var emy_x = 4*SIZE+SIZE/2;
// var emy_y = 8*SIZE+SIZE/2;
var emy_x = 0;
var emy_y = 0;
// var emy_d = 2;
var emy_d = 0;
var emy_s = 4;
var emy_t = 0;
*/

//敵の管理
var EMAX = 100;
var emy_x = new Array(EMAX)
var emy_y = new Array(EMAX)
var emy_d = new Array(EMAX)//向き
var emy_s = new Array(EMAX)//移動速度
var emy_t = new Array(EMAX)//速度調整用
var emy_life = new Array(EMAX)//体力
var emy_species = new Array(EMAX)//敵の種類
var emy_dmg = new Array(EMAX)

function setEnemy() {//敵を出現させる
    var r = rnd(4);
    var sp = rnd(3);
    for(var i=0;i<EMAX;i++) {
        if(emy_life[i] == 0) {
            emy_x[i] = ESET_X[r]*SIZE+SIZE/2;
            emy_y[i] = ESET_Y[r]*SIZE+SIZE/2;
            emy_d[i] = 0;
            emy_s[i] = 1+sp+int(season/2);
            emy_t[i] = 0;
            emy_life[i] = 1+season*2+sp*3;
            emy_species[i] = sp;
            emy_dmg[i] = 0;
            break;
        }
    }
}


function moveEnemy() {//敵を動かす(表示も行う)
    for(var i=0; i<EMAX; i++) {
        if(emy_life[i] > 0) {
            if(emy_t[i] == 0) {
                var d = stage[int(emy_y[i]/SIZE)][int(emy_x[i]/SIZE)];
                if(d == 5) {
                    castle_x = castle_x + rnd(11)-5;
                    castle_y = castle_y + rnd(11)-5;
                    damage = damage + emy_life[i];
                    emy_life[i] = 0;
                    //setEnemy();
                }
                else {
                    emy_d[i] = d;//向き
                    emy_t[i] = int(SIZE/emy_s[i]);
                }
            }
            if(emy_t[i] > 0) {
                emy_x[i] += emy_s[i]*XP[emy_d[i]];
                emy_y[i] += emy_s[i]*YP[emy_d[i]];
                emy_t[i]--;
            }
            var sx = emy_species[i]*216 + CHR_ANIMA[int(tmr/4)%4]*72;
            var sy = (emy_d[i]-1)*72 + (season-1)*288;
            drawImgTS(1,sx,sy,72,72,emy_x[i]-SIZE/2,emy_y[i]-SIZE/2,72,72);
            fText(emy_life[i], emy_x[i], emy_y[i]-48, 24, "white");
            if(emy_dmg[i] > 0) {
                emy_dmg[i]--;
                if(emy_dmg[i]%2 == 1) fCir(emy_x[i], int(SIZE*0.6), "white");
                if(emy_dmg[i] == 0) emy_life[i]--;
            }
        }
    }

        /*キー操作
        if(inkey == 38 && emy_y > 36) {
            emy_d = 1;
            emy_t = int(SIZE/emy_s);
        }
        if(inkey == 40 && emy_y < 828) {
            emy_d = 2;
            emy_t = int(SIZE/emy_s);
        }
        if(inkey == 37 && emy_y > 36) {
            emy_d = 3;
            emy_t = int(SIZE/emy_s);
        }
        if(inkey == 39 && emy_x < 1044) {
            emy_d = 4;
            emy_t = int(SIZE/emy_s);
        }
        */
    //fText("emy_x="+emy_x+"emy_y="+emy_y,540,828,30,"white");
}

function initVar() {//配列、変数に初期値を代入
    var i, x, y;
    for(var i=0; i<EMAX; i++) emy_life[i] = 0;
    for(i=0; i<CARD_MAX; i++) card_power[i] = 90;
    for(y=0;y<12;y++) {
        for(x=0;x<15;x++) {
            troop[y][x] = 0;
            tr_dir[y][x] = 1;
            tr_life[y][x] = 0;
        }
    }
    damage = 0;
    gtime = 3*60*30;
    loadImg(0, "image/bg"+season+".png");
}

//自軍の管理
var CARD_MAX = 4;
var CARD_NAME = ["warrior", "priest", "archor", "witch"];
var CARD_LIFE = [200, 80, 160, 120];//体力
var CARD_CURE = [0,1,0,0]//回復能力の有無
var CARD_RADIUS = [108, 108, 144, 100];//攻撃範囲(半径)
var CARD_SPEED = [1,6,2,3];
var card_power = [0,0,0,0];
var sel_card = 0;
var troop = new Array(12);
var tr_dir = new Array(12);
var tr_life = new Array(12);
for(var y=0;y<12;y++) {
    troop[y] = new Array(15);
    tr_dir[y] = new Array(15);
    tr_life[y] = new Array(15); 
}

function drawCard(){
    drawImg(3,0,864);
    lineW(6);
    for(var i=0; i<CARD_MAX; i++) {
        var x = 270*i;
        var y = 864;
        var c = "#0040c0";//魔力バーの色
        fText(CARD_NAME[i], x+135, y+320, 36, "white");
        setAlp(50);
        if(card_power[i] < 100) fRect(x,y,270,400,"black");
        else c = FLASH[tmr%6];
        fRect(x+34, y+349, 202, 18, "black");
        fRect(x+35, y+350, card_power[i]*2, 16, c);
        if(i == sel_card) sRect(x+3, y+3, 270-6, 400-6, "cyan");
        setAlp(100);
    }
}
    
function drawSoldier(x,y,n,d,a) {//兵を置く
    var sx = (n-1)*288 + a*72;
    var sy = (d-1)*72;
    drawImgTS(4, sx, sy, 72, 72, x, y, 72, 72);
    lineW(1);//線の太さを指定
    sCir(x+SIZE/2, y+SIZE/2, CARD_RADIUS[n-1], "cyan");//攻撃できる半径の円を表示
}

function action() {//兵の行動
    for(var y=0;y<12;y++) {
        for(x=0;x<15;x++) {
            var n = troop[y][x];
            var l = tr_life[y][x];
            if(n>0 && l>0 && tmr%CARD_SPEED[n-1]==0) {
                var a = attack(x, y, n);
                if(a == true) tr_life[y][x]--;//攻撃するとライフが減る
                else if(CARD_CURE[n-1] > 0) recover(x,y,n);
            }
        }
    }    
}

function attack(x, y) {//敵を攻撃する
    var cx = x*SIZE + SIZE/2;//兵の中心座標
    var cy = y*SIZE + SIZE/2;//兵の中心座標
    lineW (10);
    for(var i=0;i<EMAX;i++) {
        if(emy_life[i]>0 && emy_dmg[i]==0) {
            if(getDis(emy_x[i], emy_y[i], cx, cy) <= 100) {
                line(emy_x[i], emy_y[i], cx, cy, "white");
                emy_dmg[i] = 2;
                if(emy_y[i] < cy) tr_dir[y][x] = 1;
                if(emy_y[i] > cy) tr_dir[y][x] = 2;
                if(emy_x[i] < cy) tr_dir[y][x] = 3;
                if(emy_x[i] > cy) tr_dir[y][x] = 4;
                return true;//trueを返す
            }
        }
    }
    return false;
}

function recover(x,y,n) {//仲間を回復する
    var d = 1+rnd(4);
    var tx = x + XP[d];
    var ty = y + YP[d];
    if(0<=tx && tx<15 && 0<=ty && ty<12) {
        var tr = troop[ty][tx];
        if(tr > 0) {
            if(tr_life[ty][tx] < CARD_LIFE[tr-1]) {
                tr_life[ty][tx] += CARD_CURE[n-1];
                if(tr_life[ty][tx] > CARD_LIFE[tr-1]) tr_life[ty][tx] = CARD_LIFE[tr-1];
                tr_dir[y][x] = d;
                lineW(8);
                sCir(tx*SIZE+SIZE/2, ty*SIZE+SIZE/2, int(SIZE*0.5, "blue"));
            }
        }
    }
}