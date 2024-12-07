; 2018.10.25 v100
; 2018.11.01 v101  内訳表示追加、ダイス画像版追加、ダイス画像消去追加、一時変数をmp変数に置換、その他微調整

;===============================================================================

; ダイス

;===============================================================================
[macro name="dice_ko10panda"]

	[iscript]

	var rand = [],                                           // 取得したランダム値を格納しておく配列変数
			rand_copy,                                           // randのコピー
			rand_result,                                         // 取得したランダム値の合計
			dice_side     = mp.dice_side          || '6',        // ダイスの面数（初期値6,最小値2,最大値1000）
			dice_num      = mp.dice_num           || '1',        // ダイスの個数（初期値1,最小値1,最大値999）
			var_name      = mp.var_name           || 'tf.dice',  // 取得した値を代入する変数（指定がなければ「tf.dice」）
			tweak         = mp.tweak              || '0',        // 補正値
			show_detail   = mp.show_detail        || 'false',    // 詳細表示の有無
			detail_length = mp.show_detail_length || '10'        // 詳細表示の長さ
			show_log      = mp.show_log           || 'true',     // 結果を履歴に残すか
			show_style    = mp.show_style         || 'style_a',  // 結果表示のスタイル
			show_result   = mp.show_result        || 'true';     // 結果表示の有無

			/* 数値変換 */
			dice_side     = parseInt( dice_side );
			dice_num      = parseInt( dice_num );
			tweak         = parseInt( tweak );
			detail_length = parseInt( detail_length );

			/* ランダム値取得 */
			rand = (function(dice_num, dice_side){
				var ary = [];
				for( var i=0; i < dice_num; i++ ){
					var rnd = Math.floor( Math.random() * ( dice_side + 1 - 1 )) + 1;
					ary.push( rnd );
				}
				return ary;
			})( dice_num, dice_side );

			/* 結果コピー */
			rand_copy = [].concat( rand );

			/* 詳細用のテキスト作成 */
			if( rand_copy.length > detail_length ){
				rand_copy.length = detail_length;
				rand_copy.push('...');
			}

			rand_copy = '[' + rand_copy.join("][") + ']';		
			mp.txt_detail = '内訳：' + rand_copy;

			/* 合計値取得 */
			rand_result = (function( ary ){
				return ary.reduce(function( prev, current, i, ary ){
				return prev + current;
				})
			})( rand );

			/* 補正値 */
			rand_result += tweak;

			/* 結果を変数に代入 */
			TYRANO.kag.evalScript( var_name + '=' + rand_result + ';' );

			/* 結果表示のスタイル */
			if( show_style == 'style_b' ){
				mp.txt_result = dice_num + 'D' + dice_side + '→【' + rand_result + '】';
			} else if( show_style == 'style_c' ){
				mp.txt_result = '結果は' + rand_result + 'です';
			} else {
				mp.txt_result = rand_result;
			}

	[endscript]

	[nowait]

;		詳細
		[if exp="mp.show_detail == 'true'"]
		[nolog]
		[emb exp="mp.txt_detail"][r]
		[endnolog]
		[endif]

;		結果	
		[if exp="mp.show_result == 'true'"]
		[nolog]
		[emb exp="mp.txt_result"]
		[endnolog]
		[endif]


;		履歴
		[iscript]
		if( mp.show_log == "log_1" ){
				tf.system.backlog.push(mp.txt_detail);
				tf.system.backlog.push(mp.txt_result);
		} else if( mp.show_log == "log_2" ){
				tf.system.backlog.push(mp.txt_result);
		} else if(mp.show_log == "log_3"){
				tf.system.backlog.push(mp.txt_detail);
		}
		[endscript]

	[endnowait]

[endmacro]

;===============================================================================

; ダイス（画像版）

;===============================================================================
[macro name="dice_img_ko10panda"]

	[iscript]

	var rand = [],                                                            // 取得したランダム値を格納しておく配列
			rand_result,                                                           // 取得したランダム値の合計
			dice_num         = mp.dice_num                         || '5',        // ダイスの個数（初期値1,最小値1,最大値5）
			dice_side        = mp.dice_side                        || '6',        // ダイスの面数（初期値6,最小値2,最大値100）
			dice_layer       = mp.dice_layer                       || '1',        // ダイスを表示するレイヤ番号（たぶんビルダーなら1で画面の一番前にくる）
			var_name         = mp.var_name                         || 'tf.dice',  // 取得した値を代入する変数（def=tf.dice）
			tweak            = mp.tweak                            || '0',        // 補正値（def=0,最小値-100,最大値100）
			show_result      = mp.show_result                      || 'true',     // 結果表示の有無
			show_log         = mp.show_log                         || 'true',     // 結果を履歴に残すか
			show_style       = mp.show_style                       || 'style_a',  // 結果表示のスタイル		
			dice_img_size    = mp.dice_img_size                    || '130',      // ダイスのサイズ(def=130px)
			dice_font_color  = mp.dice_font_color                  || '0xEEEEEE', // ダイスの文字色(def=0xEEEEEE)
			dice_bgcolor     = mp.dice_bgcolor                     || '0x333333', // ダイスの背景色(def="0x333333")
			dice_posx        = mp.dice_left                        || '0',        // ダイスのX座標
			dice_posy        = mp.dice_top                         || '0',        // ダイスのY座標
			dice_posx_auto   = mp.dice_posx_auto                   || 'true',     // ダイスのX座標を自動取得するか（def=true）
			dice_posy_auto   = mp.dice_posy_auto                   || 'true',     // ダイスのY座標を自動取得するか（def=true）
			screen_width     = parseInt( TG.config.scWidth ),                     // 画面サイズの幅
			screen_height    = parseInt( TG.config.scHeight ),                    // 画面サイズの高さ
			dice_posx_center = (screen_width - dice_img_size) / 2,                // 画面中央に配置するダイスのX座標
			dice_image       = mp.dice_image                       || "",         // ダイスの背景画像
			use_dice_image   = mp.use_dice_image                   || 'false',    // 背景画像を使用するか否かのチェック
			roll_dice_time   = mp.roll_dice_time                   || '500';      // ダイスロールにかける時間（def=700）


			/* 数値変換 */
			dice_num        = parseInt( dice_num );
			dice_side       = parseInt( dice_side );
			tweak           = parseInt( tweak, 10 );
			dice_img_size   = parseInt( dice_img_size );
			dice_posx       = parseInt( dice_posx, 10 );
			dice_posy       = parseInt( dice_posy, 10 );
			roll_dice_time  = parseInt( roll_dice_time, 10 );


			/* ランダム値取得 */
			rand = (function(count, max){
				var ary = [];
					for( var i=0; i < count; i++ ){
						var rnd = Math.floor( Math.random() * ( max + 1 - 1 )) + 1;
						ary.push( rnd );
					}
				return ary;
			})( dice_num, dice_side );


			/* 内訳表示用 */
			mp.rand_copy = [].concat( rand );
			mp.txt_detail = '内訳：[' + mp.rand_copy.join("][") + ']';		


			/* ランダム値の合計 */
			rand_result = (function( ary ){
				return ary.reduce(function( prev, current, i, ary ){
					return prev + current;
				})
			})( rand );


			/* 補正値 */
			rand_result += tweak;


			/* 結果の代入 */
			TYRANO.kag.evalScript( var_name + '=' + rand_result + ';' );


			/* 結果表示のテキスト */
			mp.txt_result = rand_result;
			
			if( show_style == 'style_b' ){
				mp.txt_result = dice_num + 'D' + dice_side + '→【'+ rand_result + '】';
			} else if( show_style == 'style_c' ){
				mp.txt_result = '結果は' + rand_result + 'です';
			} else {
				mp.txt_result = rand_result;
			}


			/* ダイスのX座標取得 */
			if( dice_posx_auto == "true" ){

				mp.list_dice_posx = [
					[dice_posx_center],
					[dice_posx_center - (dice_img_size / 2) - 5, dice_posx_center + (dice_img_size / 2) + 5],
					[dice_posx_center - dice_img_size - 10, dice_posx_center, dice_posx_center + dice_img_size + 10],
					[dice_posx_center - (dice_img_size * 1.5) - 15, dice_posx_center - (dice_img_size / 2) - 5, dice_posx_center + (dice_img_size / 2) + 5, dice_posx_center + (dice_img_size * 1.5) + 15],
					[dice_posx_center - (dice_img_size * 2) - 20, dice_posx_center - dice_img_size - 10, dice_posx_center, dice_posx_center + dice_img_size + 10, dice_posx_center + (dice_img_size * 2) + 20]
				];

			} else {

				mp.list_dice_posx = [
					[dice_posx],
					[dice_posx, dice_posx + 10 + dice_img_size],
					[dice_posx, dice_posx + 10 + dice_img_size, dice_posx + 20 + (dice_img_size * 2)],
					[dice_posx, dice_posx + 10 + dice_img_size, dice_posx + 20 + (dice_img_size * 2), dice_posx + 30 + (dice_img_size * 3)],
					[dice_posx, dice_posx + 10 + dice_img_size, dice_posx + 20 + (dice_img_size * 2), dice_posx + 30 + (dice_img_size * 3), dice_posx + 40 + (dice_img_size * 4)]
				];
			}

			/* ダイスのY座標取得 */
			if( dice_posy_auto == "true" ){
				mp.list_dice_posy = (screen_height - dice_img_size) / 2;
			} else {
				mp.list_dice_posy = String( dice_posy ); // 0を指定した時にエラー吐くので文字列に再変換
			}

			mp.dice_num        = dice_num;
			mp.dice_side       = dice_side;
			mp.dice_layer      = dice_layer;
			mp.rand_result     = rand_result;
			mp.dice_img_size   = dice_img_size;
			mp.dice_font_color = dice_font_color.replace("0x", "#");
			mp.dice_bgcolor    = dice_bgcolor.replace("0x", "#");
			mp.roll_dice_time  = roll_dice_time;

			/* 画像があるときは背景色と角丸を消す */
			if(mp.use_dice_image == "true"){
				mp.dice_bgcolor = "none";
				mp.dice_bgcolor = "url(./data/fgimage/" + mp.dice_image + ")";
				mp.border_radius = "none";
			} else {
				mp.dice_bgcolor = dice_bgcolor.replace("0x", "#");
				mp.border_radius = "10px";
			}

		
	[endscript]

	[layopt layer="&mp.dice_layer" visible="true"]

	[ptext name="dice1,dice" layer="&mp.dice_layer" text="" x="&String(mp.list_dice_posx[mp.dice_num - 1][0])" y="&mp.list_dice_posy" overwrite="true"]

	[if exp="mp.dice_num > 1"]
	[ptext name="dice2,dice" layer="&mp.dice_layer" text="" x="&String(mp.list_dice_posx[mp.dice_num - 1][1])" y="&mp.list_dice_posy" overwrite="true"]
	[endif]

	[if exp="mp.dice_num > 2"]
	[ptext name="dice3,dice" layer="&mp.dice_layer" text="" x="&String(mp.list_dice_posx[mp.dice_num - 1][2])" y="&mp.list_dice_posy" overwrite="true"]
	[endif]

	[if exp="mp.dice_num > 3"]
	[ptext name="dice4,dice" layer="&mp.dice_layer" text="" x="&String(mp.list_dice_posx[mp.dice_num - 1][3])" y="&mp.list_dice_posy" overwrite="true"]
	[endif]

	[if exp="mp.dice_num > 4"]
	[ptext name="dice5,dice" layer="&mp.dice_layer" text="" x="&String(mp.list_dice_posx[mp.dice_num - 1][4])" y="&mp.list_dice_posy" overwrite="true"]
	[endif]

	[iscript]

	$(".dice1, .dice2, .dice3, .dice4, .dice5").css({
		"display"          : "flex",
		"align-items"      : "center",
		"justify-content"  : "center",
		"width"            : mp.dice_img_size + "px",
		"height"           : mp.dice_img_size + "px",
		"font-size"        : mp.dice_font_size + "px",
		"color"            : mp.dice_font_color,
		"background"       : mp.dice_bgcolor,
		"background-size"  : "cover",
		"border-radius"    : mp.border_radius,
		"box-sizing"       : "border-box"
	});

		var getNumber = function(){
			var rnd = Math.floor( Math.random() * ( mp.dice_side + 1 - 1 )) + 1;
			return rnd;
		}

		var drawNumber = function(){
			var num = [];
				for( var i = 0; i < mp.dice_num; i++){
					num[i] = getNumber();
				}

			$(".dice1").html(num[0]);
			$(".dice2").html(num[1]);
			$(".dice3").html(num[2]);
			$(".dice4").html(num[3]);
			$(".dice5").html(num[4]);

		}

		var setTimer = setInterval(drawNumber, 20);

		var stopTimer = function(){
			clearInterval(setTimer);

			$(".dice1").html(mp.rand_copy[0]);
			$(".dice2").html(mp.rand_copy[1]);
			$(".dice3").html(mp.rand_copy[2]);
			$(".dice4").html(mp.rand_copy[3]);
			$(".dice5").html(mp.rand_copy[4]);

		}
		
		setTimeout(stopTimer, mp.roll_dice_time);

[endscript]

	[skipstop]
	[p]

;		結果	
		[if exp="mp.show_result == 'true'"]
		[nolog]
		[emb exp="mp.txt_result"]
		[endnolog]
		[endif]

;		詳細をログに残すとき
		[if exp="mp.show_detail"]
		[iscript]
		tf.system.backlog.push(mp.txt_detail);
		[endscript]
		[endif]


;		履歴
		[iscript]
		if( mp.show_log == "log_1" ){
				tf.system.backlog.push(mp.txt_detail);
				tf.system.backlog.push(mp.txt_result);

		} else if( mp.show_log == "log_2" ){
				tf.system.backlog.push(mp.txt_result);

		} else if(mp.show_log == "log_3"){
				tf.system.backlog.push(mp.txt_detail);
		}
		[endscript]

[endmacro]

;===============================================================================

; ダイス消去

;===============================================================================
[macro name="hide_dice_img_ko10panda"]
	[free layer="1" name="dice" time="&mp.time|300" wait="true"]
	[endmacro]


;===============================================================================

; ランダム値取得

;===============================================================================

[macro name="intrandom_ko10panda"]

	[iscript]

	var rand = [],                                     // 取得したランダム値を格納しておく配列変数
			rand_result,                                   // 結果（ユーザーが指定した変数にこれを代入）
			min           = mp.min           || '1',       // 範囲の最小値（指定がなければ「1」）
			max           = mp.max           || '6',       // 範囲の最大値（指定がなければ「6」）
			count         = mp.count         || '1',       // 実行回数（指定がなければ「1」）
			var_name      = mp.var_name      || 'tf.rand', // 取得した値を代入する変数（指定がなければ「tf.rand」）
			tweak         = mp.tweak         || '0',       // 補正値
			show_log      = mp.show_log      || 'true',    // 結果を履歴に残すか（デフォルトでは残す）		
			show_style    = mp.show_style    || 'style_a', // 結果表示のスタイル（デフォルトは数字のみ）
			show_result   = mp.show_result   || 'true',    // 結果を表示するかどうか
			show_detail   = mp.show_detail   || 'false',
			detail_length = mp.detail_length || '10';

			/* 数値変換 */
			min           = parseInt( min );
			max           = parseInt( max );
			count         = parseInt( count );
			tweak         = parseInt( tweak )
			detail_length = parseInt( detail_length );

			if( min > max ){
				min = [max, max = min][0]; // 最小値が最大値よりも大きいときは数値を入れ換える
			}

			/* ランダム値取得 */
			rand = (function(count, min, max){
				var ary = [];
					for( var i=0; i < count; i++ ){
						var rnd = Math.floor( Math.random() * ( max + 1 - min )) + min;
						ary.push( rnd );
					}
				return ary;
			})( count, min, max );


			/* 詳細表示用にコピー */
			rand_copy = [].concat( rand );

			if( rand_copy.length > detail_length ){
				rand_copy.length = detail_length;
				rand_copy.push('...');
			}

			rand_copy = '[' + rand_copy.join("][") + ']';

			/* 合計 */
			rand_result = (function( ary ){
				return ary.reduce(function( prev, current, i, ary ){
					return prev + current;
				})
			})( rand );

			/* 補正値 */	
			rand_result += tweak;

			/* 結果を代入 */
			TYRANO.kag.evalScript( var_name + '=' + rand_result + ';' );

			/* 結果表示のスタイル */
			if( show_style == 'style_b' ){
				mp.txt_result = '結果：【' + rand_result + '】';
			} else if( show_style == 'style_c' ){
				mp.txt_result = '結果は' + rand_result + 'です';
			} else {
				mp.txt_result = rand_result;		
			}

			/* 詳細 */
			mp.txt_detail = '内訳：' + rand_copy;

	[endscript]

	[nowait]

;		詳細
		[if exp="mp.show_detail == 'true'"]
		[nolog]
		[emb exp="mp.txt_detail"][r]
		[endnolog]
		[endif]	

;		結果
		[if exp="mp.show_result == 'true'"]
		[nolog]
		[emb exp="mp.txt_result"]
		[endnolog]
		[endif]

;		履歴
		[iscript]
		if( mp.show_log == "log_1" ){
				tf.system.backlog.push(mp.txt_detail);
				tf.system.backlog.push(mp.txt_result);
		} else if( mp.show_log == "log_2" ){
				tf.system.backlog.push(mp.txt_result);
		} else if(mp.show_log == "log_3"){
				tf.system.backlog.push(mp.txt_detail);
		}
		[endscript]

	[endnowait]

[endmacro]


[return]