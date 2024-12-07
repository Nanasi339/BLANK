/*
    ティラノビルダープラグイン開発用のテンプレート
    まず、このファイルを編集してプラグイン開発を試してみると良いでしょう。    
*/

'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        /* TBはティラノビルダーの機能にアクセスするためのインターフェスを提供する */
        this.TB = TB;
        
        /* プラグイン名を格納する */
        this.name= TB.$.s("ダイスロール");
        
        /*プラグインの説明文を格納する*/
        this.plugin_text= TB.$.s("ダイスを振ることができます");
        
        /*プラグイン説明用の画像ファイルを指定する。プラグインフォルダに配置してください*/
        this.plugin_img = "tb_dice.png";
        
    }
    
    
    /* プラグインをインストールを実行した時１度だけ走ります。フォルダのコピーなどにご活用ください。*/
    triggerInstall(){
        
        /*
        //プラグインからプロジェクトにファイルをコピーするサンプルです 
        var project_path = TB.getProjectPath() ; 
        var from_path = project_path + "data/others/plugin/plugin_template/copy_folder";
        var to_path = project_path + "data/image/copy_folder";
        TB.io.copy(from_path,to_path);
        */
        
    }
    
    /*
        追加するコンポーネントを定義します。
    */
    
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        
        /*
            cmp配列
            cmpにプラグイン用のコンポーネントを定義していきます。
            配列名にはタグ名を指定してください。
            他のタグと被らないように世界で一つだけの名称になるように工夫してください。
            （自分の所持しているドメイン名を含めるなど）
        */
        
        /*
            sample_component_1 
            次のパラメータのサンプルを設置
            Image:イメージ選択
            
        */
        
        cmp["dice"] = {
            
            "info":{
                
                "default":true, /*trueを指定するとコンポーネントがデフォルトで配置されます。*/
                "name":TB.$.s("ダイス"), /* コンポーネント名称 */
                "help":TB.$.s("ダイスをふります"), /* コンポーネントの説明を記述します */ 
                "icon":TB.$.s("s-icon-star-full") /* ここは変更しないでください */
                
            },
            
            /* コンポーネントの情報の詳細を定義します */
            
            "component":{
                
                name: TB.$.s("ダイスをふる"), /* コンポーネント名称 */
                
                header : function(obj) {
                    return obj.data.pm.roll;
                },
                
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
                    
                    "roll" : {
                        type : "Text",
                        name : TB.$.s("ダイス（例「6,6,6」「3d6」）"),
                        validate : {
                            required : true,
                        },
                        
                        help : TB.$.s("ふるダイスを記述。例えば6,6,6や3d6といった記述ができます"),

                        onChange : function(val, component) {
                            TB.component.changeParam(component, "roll", val);
                        }
                    },
                    
                    "result" : {
                        type : "Text",
                        name : TB.$.s("結果（未指定の場合はランダム）"),
                        validate : {
                        },
        
                        help : TB.$.s("予めダイス結果を指定したい場合。例えば3d6なら1,1,1など"),
                            
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "result", val);
                        }
                    },
                    
                    "output" : {
                        type : "Variable",
                        name : TB.$.s("結果をいれる変数"),
                        help : TB.$.s("ここで指定した変数にダイス結果が格納されます")
                    },
                    
                    "output_array" : {
                        type : "Variable",
                        name : TB.$.s("結果ダイス目"),
                        help : TB.$.s("ここで指定した変数に結果のダイス目が配列で格納されます")
                    },
                    
                    "scale" : {
                        type : "Num",
                        name : $.s("大きさ"),
                        unit : "",
                        help : $.s("ダイスの大きさを指定します"),
                        validate : {
                            number : true
                        },
                        spinner : {
                            min : 0.1,
                            step : 0.1
                        },
                        default_val : 1.5,

                    },
                    
                    "skiproll" : {
                        type : "Check",
                        text : TB.$.s("ダイス演出をスキップ"),
                        default_val : false,
                        //name:"",
                    },
                    
                    "min_left" : {
                        type : "Num",
                        name : $.s("範囲の左端"),
                        unit : "",
                        help : $.s("ダイスが転がる範囲の左端を指定します。中央からの相対距離を指定します"),
                        validate : {
                            number : true
                        },
                        spinner : {
                            step : 10
                        },
                        default_val :-450,

                    },
                    
                    "max_left" : {
                        type : "Num",
                        name : $.s("範囲の右端"),
                        unit : "",
                        help : $.s("ダイスが転がる範囲の右端を指定します。中央からの相対距離を指定します"),
                        validate : {
                            number : true
                        },
                        spinner : {
                            step : 10
                        },
                        default_val :150,

                    },
                    
                    "min_top" : {
                        type : "Num",
                        name : $.s("範囲の上端"),
                        unit : "",
                        help : $.s("ダイスが転がる範囲の上端を指定します。中央からの相対距離を指定します"),
                        validate : {
                            number : true
                        },
                        spinner : {
                            step : 10
                        },
                        default_val :-150,

                    },
                    
                    "max_top" : {
                        type : "Num",
                        name : $.s("範囲の下端"),
                        unit : "",
                        help : $.s("ダイスが転がる範囲の下端を指定します。中央からの相対距離を指定します"),
                        validate : {
                            number : true
                        },
                        spinner : {
                            step : 10
                        },
                        default_val :50,

                    },
                    
                     
                   
                    
                    
                },
                
                /*
                    途中からプレビューの時に実行するタグを返す。
                    例えば背景変更の機能をもったコンポーネントの場合、
                    途中からプレビューのときに背景変更のタグを実行しておかないと
                    途中からプレビューにこのコンポーネントが反映されません。
                    timeなどの時間は短くしておく必要があります。
                */
                /*
                preview_tag:function(preview,cmp){
                    
                    var storage = cmp.data.pm["storage"]; 
                    
                    //返却用のタグを設定
                    preview.code_current_bg ="[bg time=10 storage="+storage+" ] \n";
                             
                },
                */
            
            }
            
        };
        
        cmp["dice_hide"] = {
            
            "info":{
                
                "default":true, /*trueを指定するとコンポーネントがデフォルトで配置されます。*/
                "name":TB.$.s("ダイス消去"), /* コンポーネント名称 */
                "help":TB.$.s("振った後のダイスを画面上から非表示にします"), /* コンポーネントの説明を記述します */ 
                "icon":TB.$.s("s-icon-star-full") /* ここは変更しないでください */
                
            },
            
            /* コンポーネントの情報の詳細を定義します */
            
            "component":{
                
                name : TB.$.s("ダイス消去"), /* コンポーネント名称 */
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
                    
                    /*数値入力の例*/
                    "time" : {
                        type : "Num", /*Numは数字入力を設定できます*/
                        name : "時間", /*パラメータ名*/
                        unit : "ﾐﾘ秒", /*単位を表示できます*/
                        help : TB.$.s("指定した時間をかけてダイスが消えます"),
                        
                        default_val : 1000, /*初期値*/
                        
                        /*spinnerは数値をスピナー形式で表現します*/
                        spinner : {
                            min : 0, /*入力の最小値*/
                            max : 10000, /*入力の最大値*/
                            step : 500 /*スピナーを１回動かした時のステップ値*/
                        },
                        
                        validate : {
                            number : true /*数値か否かのチェックを有効化*/
                        }
        
                    },
                    
                },
                
                /*
                    途中からプレビューの時に実行するタグを返す。
                    例えば背景変更の機能をもったコンポーネントの場合、
                    途中からプレビューのときに背景変更のタグを実行しておかないと
                    途中からプレビューにこのコンポーネントが反映されません。
                    timeなどの時間は短くしておく必要があります。
                */
                /*
                preview_tag:function(preview,cmp){
                    
                    var storage = cmp.data.pm["storage"]; 
                    
                    //返却用のタグを設定
                    preview.code_current_bg ="[bg time=10 storage="+storage+" ] \n";
                             
                },
                */
            
            }
            
        };
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

