/* 2018.10.25 @ko10panda edit

*/

'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        /* TBはティラノビルダーの機能にアクセスするためのインターフェスを提供する */
        this.TB = TB;
        
        /* プラグイン名を格納する */
        this.name= TB.$.s("ランダム値取得プラグイン");
        
        /*プラグインの説明文を格納する*/
        this.plugin_text= TB.$.s("指定した範囲から整数をランダムで取り出します");
        
        /*プラグイン説明用の画像ファイルを指定する。プラグインフォルダに配置してください*/
        this.plugin_img = "plugin_image.png";
        
    }
    
    
    /* プラグインをインストールを実行した時１度だけ走ります。フォルダのコピーなどにご活用ください。*/
    triggerInstall(){
        
    }
        
    /*
        追加するコンポーネントを定義します。
    */
    
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;

        cmp["dice_ko10panda"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("ダイス"),
                "help":TB.$.s("ダイスを振ります。ダイスの個数、面数、補正値などが指定できます"),
                "icon":TB.$.s("s-icon-star-full") /* ここは変更しないでください */
                
            },
            
            "component":{
                
                name : TB.$.s("ダイスを振る"), /* コンポーネント名称 */
                component_type : "Simple", /*タイムラインのコンポーネントタイプ */
                
                /*ビューに渡す値*/
                default_view : {
                    base_img_url : "data/bgimage/",  /*画像選択のベースとなるフォルダを指定*/
                    icon : "s-icon-star-full", /*変更しない*/
                    icon_color : "#FFFF99", /*変更しない*/
                    category : "plugin" /*変更しない*/
                },
                
                /*変更しない*/
                param_view : {
                },
            
                /* コンポーネントのパラメータを定義していきます */
                param:{
                    

                    /* ダイスの個数 */
                    "dice_num" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスの個数", /*パラメータ名*/
                        unit : "個", /*単位を表示できます*/
                        help : TB.$.s("ダイスの数を指定します（範囲：1～10000個）"),
                        
                        default_val : 1, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 1, /*入力の最小値*/
                            max : 10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* ダイスの面数 */
                    "dice_side" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスの面数", /*パラメータ名*/
                        unit : "面", /*単位を表示できます*/
                        help : TB.$.s("ダイスの面数を指定します（範囲：2～10000面）"),
                        
                        default_val : 6, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 2, /*入力の最小値*/
                            max : 10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 補正値 */
                    "tweak" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "補正値", /*パラメータ名*/
                        unit : "", /*単位を表示できます*/
                        help : TB.$.s("出目の合計に補正値を加えます（範囲：-10000～10000）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -10000, /*入力の最小値*/
                            max :  10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 結果表示 */
                    "show_result" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("表示する"),
                            val : "true"
                        }, {
                            name : TB.$.s("表示しない"),
                            val : "false"
                        }],
                        default_val : "true",
                        name : TB.$.s("結果を表示するか"),
                        help : TB.$.s("結果を表示するか指定します"),
                        
                    },

                    /* 結果表示のスタイル */
                    "show_style" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("数値のみ表示する"),
                            val : "style_a"
                        }, {
                            name : TB.$.s("「個数D面数→○○」で表示する"),
                            val : "style_b"
                        }, {
                            name : TB.$.s("「結果は○○です」で表示する"),
                            val : "style_c"
                        }],
                        default_val : "style_a",
                        name : TB.$.s("結果の表示スタイル"),
                        help : TB.$.s("結果をどのように表示するか指定します"),
                        
                    },

                    /* 詳細表示 */
                    "show_detail" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("表示する"),
                            val : "true"
                        }, {
                            name : TB.$.s("表示しない"),
                            val : "false"
                        }],
                        default_val : "false",
                        name : TB.$.s("内訳を表示するか"),
                        help : TB.$.s("結果の内訳を表示するかどうか指定します"),
                        
                    },

                    /* 詳細の数 */
                    "detail_length" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "内訳表示の上限", /*パラメータ名*/
                        unit : "個", /*単位を表示できます*/
                        help : TB.$.s("内訳を何個まで表示するか指定します。あまり大きな数にするとメッセージウィンドウからはみ出すので注意"),
                        
                        default_val : 10, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min :  1, /*入力の最小値*/
                            max :  10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 履歴に残すかどうか */
                    "show_log" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("結果と内訳を残す"),
                            val : "log_1"
                        }, {
                            name : TB.$.s("結果のみ残す"),
                            val : "log_2"
                        }, {
                            name : TB.$.s("内訳のみ残す"),
                            val : "log_3"
                        }, {
                            name : TB.$.s("結果も内訳も残さない"),
                            val : "log_4"
                        }],
                        default_val : "log_1",
                        name : TB.$.s("バックログに残す項目"),
                        help : TB.$.s("結果や内訳をバックログに表示するかどうか指定します"),
                        
                    },

                    /* 結果を格納する変数 */
                    "var_name" : {
                        type : "Text",
                        default_val : 'tf.dice',
                        name : TB.$.s("結果を格納する変数名"),
                        validate : {
                            required : true,
                        },
                        
                        /*
                            onChangeメソッド 
                            テキストが変更されたタイミングで、手動でパラメータを設定する必要があります。
                            Textの場合は必須です。
                        */
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "var_name", val);
                        }
                        
                    },

                    
                    
                },
                
            }
            
        };
        
        
        /* ランダム値取得 */
        cmp["intrandom_ko10panda"] = {
            
            "info":{
                
                "default":true, /*trueを指定するとコンポーネントがデフォルトで配置されます。*/
                "name":TB.$.s("ランダム値取得"), /* コンポーネント名称 */
                "help":TB.$.s("指定した範囲からランダムで整数を取り出します。最小値、最大値、実行回数、補正値などが指定できます"), /* コンポーネントの説明を記述します */ 
                "icon":TB.$.s("s-icon-star-full") /* ここは変更しないでください */
                
            },
            
            /* コンポーネントの情報の詳細を定義します */
            
            "component":{
                
                name : TB.$.s("ランダム値取得"), /* コンポーネント名称 */
                
                /*
                    headerが定義されている場合、タイムライン上のコンポーネントバー部分の文字列を自由に設定できます。
                    以下の例はジャンプ先のシナリオ名とターゲットをバーに表示させて視認性を確保します。
                */
                                
                component_type : "Simple", /*タイムラインのコンポーネントタイプ Simpleはバーのみ */
                
                /*ビューに渡す値*/
                default_view : {
                    base_img_url : "data/fgimage/",  /*画像選択のベースとなるフォルダを指定*/
                    icon : "s-icon-star-full", /*変更しない*/
                    icon_color : "#FFFF99", /*変更しない*/
                    category : "plugin" /*変更しない*/
                },
                
                /*変更しない*/
                param_view : {
                },
            
                /* コンポーネントのパラメータを定義していきます */
                param : {

                    /* 最小値 */
                    "min" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "最小値", /*パラメータ名*/
                        unit : "", /*単位を表示できます*/
                        help : TB.$.s("範囲の最小値を指定します（範囲：-1000000～1000000）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -1000000, /*入力の最小値*/
                            max :  1000000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 最大値 */
                    "max" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "最大値", /*パラメータ名*/
                        unit : "", /*単位を表示できます*/
                        help : TB.$.s("範囲の最大値を指定します（範囲：-1000000～1000000）"),
                        
                        default_val : 10, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -1000000, /*入力の最小値*/
                            max :  1000000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 実行回数 */
                    "count" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "実行回数", /*パラメータ名*/
                        unit : "回", /*単位を表示できます*/
                        help : TB.$.s("実行回数を指定します。結果はすべて合計されます（範囲：1～10000回）"),
                        
                        default_val : 1, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 1, /*入力の最小値*/
                            max : 10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 補正値 */
                    "tweak" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "補正値", /*パラメータ名*/
                        unit : "", /*単位を表示できます*/
                        help : TB.$.s("結果の合計に補正値を加えます（範囲：-10000～10000）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -10000, /*入力の最小値*/
                            max :  10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 結果表示 */
                    "show_result" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("表示する"),
                            val : "true"
                        }, {
                            name : TB.$.s("表示しない"),
                            val : "false"
                        }],
                        default_val : "true",
                        name : TB.$.s("結果を表示するか"),
                        help : TB.$.s("結果を表示するかどうか指定します"),
                        
                    },

                    /* 結果表示のスタイル */
                    "show_style" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("数値のみ表示する"),
                            val : "style_a"
                        }, {
                            name : TB.$.s("「結果：【○○】」で表示する"),
                            val : "style_b"
                        }, {
                            name : TB.$.s("「結果は○○です」で表示する"),
                            val : "style_c"
                        }],
                        default_val : "style_a",
                        name : TB.$.s("結果の表示スタイル"),
                        help : TB.$.s("結果をどのように表示するか指定します"),
                        
                    },

                    /* 詳細表示 */
                    "show_detail" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("表示する"),
                            val : "true"
                        }, {
                            name : TB.$.s("表示しない"),
                            val : "false"
                        }],
                        default_val : "false",
                        name : TB.$.s("内訳を表示するか"),
                        help : TB.$.s("結果の内訳を表示するかどうか指定します"),
                        
                    },

                    /* 詳細の数 */
                    "detail_length" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "内訳表示の上限", /*パラメータ名*/
                        unit : "個", /*単位を表示できます*/
                        help : TB.$.s("内訳を何個まで表示するか指定します。あまり大きな数にするとメッセージウィンドウからはみ出すので注意"),
                        
                        default_val : 10, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min :  1, /*入力の最小値*/
                            max :  10000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },
                    /* 履歴に残すかどうか */
                    "show_log" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("結果と内訳を残す"),
                            val : "log_1"
                        }, {
                            name : TB.$.s("結果のみ残す"),
                            val : "log_2"
                        }, {
                            name : TB.$.s("内訳のみ残す"),
                            val : "log_3"
                        }, {
                            name : TB.$.s("結果も内訳も残さない"),
                            val : "log_4"
                        }],
                        default_val : "log_1",
                        name : TB.$.s("バックログに残す項目"),
                        help : TB.$.s("結果や内訳をバックログに表示するかどうか指定します"),
                        
                    },
                    
                    /* 結果を格納する変数 */
                    "var_name" : {
                        type : "Text",
                        default_val : 'tf.rand',
                        name : TB.$.s("結果を格納する変数名"),
                        validate : {
                            required : true,
                        },
                        
                        /*
                            onChangeメソッド 
                            テキストが変更されたタイミングで、手動でパラメータを設定する必要があります。
                            Textの場合は必須です。
                        */
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "var_name", val);
                        }
                        
                    },
                },
                
            }
            
        };

        /* 画像付きダイス */
        cmp["dice_img_ko10panda"] = {
            
            "info":{
                
                "default":true, /*trueを指定するとコンポーネントがデフォルトで配置されます。*/
                "name":TB.$.s("画像つきダイス"), /* コンポーネント名称 */
                "help":TB.$.s("画像つきダイスを振ります。好きな画像を読み込ませることができます"), /* コンポーネントの説明を記述します */ 
                "icon":TB.$.s("s-icon-star-full") /* ここは変更しないでください */
                
            },
            
            /* コンポーネントの情報の詳細を定義します */
            
            "component":{
                
                name : TB.$.s("画像つきダイス"), /* コンポーネント名称 */
                component_type : "Simple", /*タイムラインのコンポーネントタイプ Simple Movie Image Text Soundが指定可能 */
                
                /*ビューに渡す値*/
                default_view : {
                    base_img_url : "data/fgimage/",  /*画像選択のベースとなるフォルダを指定*/
                    icon : "s-icon-star-full", /*変更しない*/
                    icon_color : "#FFFF99", /*変更しない*/
                    category : "plugin" /*変更しない*/
                },
                
                /*変更しない*/
                param_view : {
                },
            
                /* コンポーネントのパラメータを定義していきます */
                param:{
                    

                    /* ダイスの個数 */
                    "dice_num" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスの個数", /*パラメータ名*/
                        unit : "個", /*単位を表示できます*/
                        help : TB.$.s("ダイスの個数を設定します（範囲：1～5個）"),
                        
                        default_val : 1, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 1, /*入力の最小値*/
                            max : 5, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* ダイスの面数 */
                    "dice_side" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスの面数", /*パラメータ名*/
                        unit : "面", /*単位を表示できます*/
                        help : TB.$.s("ダイスの面数を指定します（範囲：2～100面）"),
                        
                        default_val : 6, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 2, /*入力の最小値*/
                            max : 100, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 補正値 */
                    "tweak" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "補正値", /*パラメータ名*/
                        unit : "", /*単位を表示できます*/
                        help : TB.$.s("出目の合計に補正値を加えます（範囲：-100～100）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -100, /*入力の最小値*/
                            max :  100, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* 結果表示 */
                    "show_result" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("表示する"),
                            val : "true"
                        }, {
                            name : TB.$.s("表示しない"),
                            val : "false"
                        }],
                        default_val : "true",
                        name : TB.$.s("結果を表示するか"),
                        help : TB.$.s("結果を表示するかどうか指定します"),
                        
                    },

                    /* 結果表示のスタイル */
                    "show_style" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("数値のみ表示する"),
                            val : "style_a"
                        }, {
                            name : TB.$.s("「個数D面数→○○」で表示する"),
                            val : "style_b"
                        }, {
                            name : TB.$.s("「結果は○○です」で表示する"),
                            val : "style_c"
                        }],
                        default_val : "style_a",
                        name : TB.$.s("結果の表示スタイル"),
                        help : TB.$.s("結果をどのように表示するか指定します"),
                        
                    },

                    /* 履歴に残すかどうか */
                    "show_log" : {
                        type : "Select",
                        
                        select_list : [{
                            name : TB.$.s("結果と内訳を残す"),
                            val : "log_1"
                        }, {
                            name : TB.$.s("結果のみ残す"),
                            val : "log_2"
                        }, {
                            name : TB.$.s("内訳のみ残す"),
                            val : "log_3"
                        }, {
                            name : TB.$.s("結果も内訳も残さない"),
                            val : "log_4"
                        }],
                        default_val : "log_1",
                        name : TB.$.s("バックログに残す項目"),
                        help : TB.$.s("結果や内訳をバックログに表示するかどうか指定します"),
                        
                    },

                    /* 結果を格納する変数 */
                    "var_name" : {
                        type : "Text",
                        default_val : 'tf.dice',
                        name : TB.$.s("結果を格納する変数名"),
                        validate : {
                            required : true,
                        },
                        
                        /*
                            onChangeメソッド 
                            テキストが変更されたタイミングで、手動でパラメータを設定する必要があります。
                            Textの場合は必須です。
                        */
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "var_name", val);
                        }
                        
                    },

                    /* ダイスの大きさ */
                    "dice_img_size" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスの大きさ", /*パラメータ名*/
                        unit : "px", /*単位を表示できます*/
                        help : TB.$.s("ダイスの大きさを指定します(範囲：40～180px)"),
                        default_val : 130, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min :  40, /*入力の最小値*/
                            max : 180, /*入力の最大値*/
                            step : 2 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },


                    /* フォントサイズ */
                    "dice_font_size" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "文字の大きさ", /*パラメータ名*/
                        unit : "px", /*単位を表示できます*/
                        help : TB.$.s("ダイスに表示する文字のサイズを指定します"),
                        default_val : 60, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min :   1, /*入力の最小値*/
                            max : 500, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* ダイスの文字色 */
                    "dice_font_color" : {
                        type : "Color",
                        name : TB.$.s("ダイスの文字色"),
                        default_val : "0xEEEEEE",
                        validate : {
                            required : true
                        }
                    },

                    /* ダイスの背景色 */
                    "dice_bgcolor" : {
                        type : "Color",
                        name : TB.$.s("ダイスの背景色"),
                        default_val : "0x333333",
                        validate : {
                            required : true
                        }
                    },

                    /* 画像を使用するか */
                    "use_dice_image" : {
                        type : "Check",
                        text : TB.$.s("画像を使用する"),
                        help : TB.$.s("ダイスの背景に画像を使用する場合はチェック"),
                        default_val : false
                    },

                    /* ダイスの背景イメージ */
                    "dice_image" : {
                        type : "ImageSelect",
                        file_path : "fgimage/",
                        base_img_url : "data/fgimage/",
                        name : TB.$.s("画像"),
                        help : TB.$.s("ダイスの背景を指定した画像にします。画像は正方形のものを読み込んでください"),
                        vital : true,
                        default_val : "",
                        line_preview: "on",
                        validate : {
                            required : true
                        }
                    },

                    /* ダイスの自動配置 */
                    "dice_posx_auto" : {
                        type : "Check",
                        text : TB.$.s("ダイスのX座標を自動で配置する"),
                        default_val : true
                    },

                    /* ダイスのX座標 */
                    "dice_left" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスのX座標", /*パラメータ名*/
                        unit : "px", /*単位を表示できます*/
                        help : TB.$.s("ダイスを配置する左端からの座標を指定します（自動配置がオフのときのみ有効）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -2000, /*入力の最小値*/
                            max :  2000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* ダイスの自動配置 */
                    "dice_posy_auto" : {
                        type : "Check",
                        text : TB.$.s("ダイスのY座標を自動で配置する"),
                        default_val : true
                    },

                    /* ダイスのY座標 */
                    "dice_top" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスのＹ座標", /*パラメータ名*/
                        unit : "px", /*単位を表示できます*/
                        help : TB.$.s("ダイスを配置する上端からの座標を指定します（ダイスの自動配置がオフのときのみ有効）"),
                        
                        default_val : 0, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : -2000, /*入力の最小値*/
                            max :  2000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                    /* ダイスロールにかける時間 */
                    "roll_dice_time" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "ダイスロールの時間", /*パラメータ名*/
                        unit : "ミリ秒", /*単位を表示できます*/
                        help : TB.$.s("ダイスを表示するまでの時間を指定します（範囲：10～10000ミリ秒）"),
                        
                        default_val : 700, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min :    10, /*入力の最小値*/
                            max : 10000, /*入力の最大値*/
                            step : 10 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },

                },
            }
            
        };

        /* 画像つきダイス消去 */
        cmp["hide_dice_img_ko10panda"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("ダイス画像消去"),
                "help":TB.$.s("ダイス画像を消去します。消去にかかる時間を指定できます"), 
                "icon":TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : TB.$.s("ダイス画像消去"), /* コンポーネント名称 */
                component_type : "Simple", /*タイムラインのコンポーネントタイプ Simpleはバーのみ */
                
                /*ビューに渡す値*/
                default_view : {
                    base_img_url : "data/fgimage/",  /*画像選択のベースとなるフォルダを指定*/
                    icon : "s-icon-star-full", /*変更しない*/
                    icon_color : "#FFFF99", /*変更しない*/
                    category : "plugin" /*変更しない*/
                },
                
                /*変更しない*/
                param_view : {
                },
            
                /* コンポーネントのパラメータを定義していきます */
                param : {

                    /* 消去にかける時間 */
                    "time" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "消去にかける時間", /*パラメータ名*/
                        unit : "ミリ秒", /*単位を表示できます*/
                        help : TB.$.s("ダイス画像の消去にかける時間を指定します（初期値は300ミリ秒）"),
                        
                        default_val : 300, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 10, /*入力の最小値*/
                            max : 50000, /*入力の最大値*/
                            step : 1 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
                    },
                },
                
            }
            
        };



                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

