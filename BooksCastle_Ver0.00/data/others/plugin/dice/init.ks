
/*

■公式プラグイン
ダイスロール 
ゲーム中でダイスを振ることができるようになります。
対応ダイスは 2,3,4,6,8,10,12,20,100面ダイスです。

結果は予め指定しておくことも可能ですし、ダイスを振った後に変数に格納してゲームで使用することもできます。

copyright:STRIKEWORKS

[dice]タグ

■パラメータ
roll=実際にふるダイスを指定します（必須）。複数指定する場合は「,」カンマで区切ってください。例えば６面ダイス２個と3面ダイス１個を振りたい場合は「6,6,3」と指定できます。また「2d6,1d3」のような書き方も可能です。
result=ダイス結果を指定できます。例えばrollで「6,6,6」と指定してresultに「1,2,3」とした場合ダイス目がそのとおりになり合計6になります。指定しない場合はランダムな数字になります。
output=ダイス結果を格納する変数を指定できます。例えば「f.dice_result」のようにしておくことで結果を変数に格納することができます。
output_array=ダイス結果について、個々のダイス目を格納する変数を指定できます。例えば3d6を降った場合に4,2,6 といった感じの配列が格納されます。
layer=ダイスを表示するレイヤを指定できます。デフォルトは０
scale=ダイスの大きさを指定できます。デフォルトは1.5。ゲームの画面サイズによって適切な値は変わってきますので適宜調整をお願いします。
skiproll=trueを指定するとダイスをふる演出をスキップできます。結果だけが変数に格納されます。デフォルトはfalse。
min_left=ダイスが転がる範囲の左端を指定します。中央からの相対距離を指定します。デフォルトは-450。
max_left=ダイスが転がる範囲の右端を指定します。中央からの相対距離を指定します。デフォルトは150。
min_top=ダイスが転がる範囲の上端を指定します。中央からの相対距離を指定します。デフォルトは-150。
max_top=ダイスが転がる範囲の下端を指定します。中央からの相対距離を指定します。デフォルトは50。

■サンプル
;プラグインの読み込み
[plugin name="dice"]

;レイヤの表示
[layopt layer=0 visible=true]

６面ダイスを３個振ります。[p]
[dice roll=6,6,6 output="tf.test" output_array="tf.test_array" ]

[wait time=1000]
ダイスの目の合計は[emb exp="tf.test"]です。[r]
ダイスの目は[emb exp="tf.test_array"]です。[p]

[dice_hide]

６面ダイスを２個と８面ダイスを２個振ります。[p]
[dice roll=6,6,8,8 output="tf.test" output_array="tf.test_array" ]

[wait time=1000]
ダイスの目の合計は[emb exp="tf.test"]です。[r]
ダイスの目は[emb exp="tf.test_array"]です。[p]

[dice_hide]

６面ダイスを３個を結果を指定してふります（全部１）[p]
[dice roll="3d6" result="1,1,1" output="tf.test" output_array="tf.test_array" ]

[wait time=1000]
ダイスの目の合計は[emb exp="tf.test"]です。[r]
ダイスの目は[emb exp="tf.test_array"]です。[p]

*/

[loadcss file="./data/others/plugin/dice/dice.css"]

[macro name="dice"]

[layopt layer=%layer|0 visible="true" ]

[iscript]

//[dice array_dice="6,6" array_result="3,3" ]

var j_viewDiceArea = $('<div class="viewDiceArea" ></div>');


//スケールの調整
let scale=1.5;
if(mp.scale){
    scale=parseFloat(mp.scale);
}
j_viewDiceArea.css("transform","scale("+scale+","+scale+")");

j_viewDiceArea.css("z-index",999999);

var frame_width = 499 ;
var frame_height = 400 ;
    
let min_left = parseInt(mp.min_left||-450)/scale;
let max_left = parseInt(mp.max_left||150)/scale;

let min_top = parseInt(mp.min_top||-150)/scale;
let max_top = parseInt(mp.max_top||50)/scale;


if(!mp.roll){
    alert("パラメータrollは必須です");
}

var flag_result = true;

if(!mp.result){
    //resultが指定されてない場合は生成する必要がある
    flag_result = false;
}

var output_var = "";
if(mp.output){
    output_var = mp.output;
}

var output_array="";
if(mp.output_array){
    output_array = mp.output_array;
}

var array_dice = mp.roll.split(",");
var new_array_dice = [];

for(var i in array_dice){
    
    var d = array_dice[i];
    if(d.indexOf("d")!=-1){
        var array_tmp = d.split("d");
        var tmp1 = parseInt(array_tmp[0]); //3
        var tmp2 = parseInt(array_tmp[1]); //d6
        
        for(var j=0;j<tmp1;j++){
            
            new_array_dice.push(tmp2);
        
        }
        
    }else{
        new_array_dice.push(d);
    }

}

array_dice = new_array_dice;

var array_result = [];

if(flag_result==true){
    array_result = mp.result.split(",");
}

var timerID = 0;

//this.j_viewDiceArea.empty();

var dice_eye_html = {
    2:"<i></i>",
    3:"<i></i>",
    4:"<i></i><i></i>",
    6:"<i></i><i></i><i></i>",
    8:"<i></i><i></i><i></i>",
    10:"<i></i><i></i><i></i><i></i>",
    12:"<i></i><i></i><i></i><i></i><i></i><i></i>",
    20:"<i></i><i></i><i></i><i></i>",
    100:"<i></i><i></i><i></i><i></i>"
};


function rand(max_number,min_number){

    var fix_number = Math.floor( Math.random() * (max_number + 1 - min_number) ) + min_number ;
    return fix_number;    

}

var result_sum = 0;

//ダイスを投げる
for(var i in array_dice){
    
    var left = rand(min_left,max_left); 
    var top = rand(min_top,max_top); 

    var d = parseInt(array_dice[i]);
    var result = 1;
    
    if(flag_result){
        result = parseInt(array_result[i]);
    }else{
        result = rand(d,1);
        array_result.push(result);
    }
    
    result_sum += result;
    
    var html = '';

    if(d ==100){
        
        var result_one = "";
        var result_two = "";
        
        result = parseInt(result);
        
        if(result < 10){
            result_two = "00";
            result_one = result;
        }else if(result==100){
            result_two = "00";
            result_one = "0";
        }else{
            var sep = (""+result).split("");
            result_two = sep[0]+"0";
            result_one = sep[1];
        }
        
        //10のくらい
        html += '<div class="diceFigWrap" style="margin-left: '+left+'px; margin-top: '+top+'px">';
	    html +=    '<div class="diceFig dice'+100+' current'+result_two+'">'+dice_eye_html[100]+'</div>'
        html += '</div>';    
        j_viewDiceArea.append($(html));
    
        //１のくらい
        html += '<div class="diceFigWrap" style="margin-left: '+(left+50)+'px; margin-top: '+top+'px">';
	    html +=    '<div class="diceFig dice'+10+' current'+result_one+'">'+dice_eye_html[10]+'</div>'
        html += '</div>';    
        j_viewDiceArea.append($(html));
        
        
    }else{
        
        //current0 対策
        if(d==10 && result==10){
            result=0;
        }
        
        html += '<div class="diceFigWrap" style="margin-left: '+left+'px; margin-top: '+top+'px">';
	    html +=    '<div class="diceFig dice'+d+' current'+result+'">'+dice_eye_html[d]+'</div>'
        html += '</div>';    
        
        j_viewDiceArea.append($(html));
        
    }
    
    
}

if(output_var!=""){
    TYRANO.kag.evalScript(output_var+"="+result_sum);
}

if(output_array!=""){
    TYRANO.kag.evalScript(output_array+"=["+array_result.join(",")+"]");
}


//サイコロの効果音は自分でつけて
let layer = "0";
if(mp.layer){
    layer=mp.layer;
}

//nameがあるならそれをつける
if(mp.name){
    $.setName(j_viewDiceArea,mp.name);
}

let skiproll=false;

if(typeof mp.skiproll != "undefined" && mp.skiproll=="true"){
    skiproll = true;
}

if(skiproll==false){

    var j_layer = TYRANO.kag.layer.getLayer(layer, "fore");
    j_layer.append(j_viewDiceArea);

}


[endscript]

[endmacro]


/*

■
[dice_hide]タグ
画面上のダイスを非表示にします。
timeパラメータは消える時間をミリ秒で指定できます。

*/


[macro name="dice_hide"]
    
    [iscript]
    
    let time=1000;
    
    if(!mp.time){
        time=mp.time;
    }
    
    let j_viewDiceArea = $(".tyrano_base").find(".viewDiceArea");
    j_viewDiceArea.fadeOut(parseInt(time),function(){
        j_viewDiceArea.empty();
        j_viewDiceArea.hide();
        j_viewDiceArea.remove();
    });
    
    [endscript]
    
[endmacro]


[return]
