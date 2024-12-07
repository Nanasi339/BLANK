'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= this.TB.$.s("ルール背景変更");
        this.plugin_text= this.TB.$.s("ルール画像を使った背景変更に関するコンポーネントを追加できる");
        this.plugin_img = "bg_rule.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
        
        var project_path = this.TB.getProjectPath() ;
        
        var from_path = project_path + "data/others/plugin/bg_rule/bg_rule_image";
        var to_path = project_path + "data/image/bg_rule_image";
        
        this.TB.io.copy(from_path,to_path);
        
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        
        cmp["bg_rule"] = {
            
            "info":{
                
                "default":true,
                "name":this.TB.$.s("ルール背景変更"),
                "help":this.TB.$.s("ルール画像を使用した背景の変更を行うことができます。"),
                "icon":this.TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : this.TB.$.s("ルール背景変更"),
                component_type : "Image",
                
                //ビューに渡す固定値
                
                default_view : {
                    base_img_url : "data/bgimage/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    image_url : "storage",
                    time : "time",
                    method : "method",
                    cross:"cross"
                },
            
                param:{
                    
                    "storage" : {
                        type : "ImageSelect",
                        file_path : "bgimage/", //背景画像からデフォルト選択するようになっていること。
                        name : this.TB.$.s("背景画像"),
                        help : this.TB.$.s("指定した背景画像に切り替えます"),
                        vital : true, 
                        default_val : "",
                        line_preview: "on",
                        validate : {
                            required : true
                        }
                    },
                    
                    "rule" : {
                        type : "ImageSelect",
                        file_path : "image/bg_rule_image/", //背景画像からデフォルト選択するようになっていること。
                        base_img_url : "data/image/bg_rule_image/", //パラメータの中にコレがある場合、優先させる
                        name : this.TB.$.s("ルール画像"),
                        help : this.TB.$.s("トランジションで使用するルール画像を設定しいます"),
                        vital : true, 
                        default_val : "",
                        line_preview: "off",
                        validate : {
                            required : true
                        }
                    },
                    
                    "time" : {
                        type : "Num",
                        name : this.TB.$.s("時間"),
                        unit : this.TB.$.s("ﾐﾘ秒"),
                        help : this.TB.$.s("指定した時間をかけて背景が切り替わります"),
                        
                        default_val : 1000,
                        
                        spinner : {
                            min : 0,
                            step : 500
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    clickskip : {
                        type : "Select",
                        select_list : [{
                            name : this.TB.$.s("有効"),
                            val : "true"
                        }, {
                            name : this.TB.$.s("無効"),
                            val : "false"
                        }],
                        default_val : "false",
                        name : this.TB.$.s("演出スキップの可否"),
                        help : this.TB.$.s("切り替え中にクリックすることで演出をスキップできるようにするか否か"),
                        
                    },
                    
                    wait : {
                        type : "Select",
                        select_list : [{
                            name : this.TB.$.s("有効"),
                            val : "true"
                        }, {
                            name : this.TB.$.s("無効"),
                            val : "false"
                        }],
                        default_val : "true",
                        name : this.TB.$.s("完了を待つ"),
                        help : this.TB.$.s("切り替え完了まで進行を待機するか否か"),
                    },
                    
                    
                },
                
                //途中からプレビューの時に実行するタグを返す。
                preview_tag:function(preview,cmp){
                    
                    var storage = cmp.data.pm["storage"]; 
                    
                    //返却用のタグを設定
                    preview.code_current_bg ="[bg time=10 storage="+storage+" ] \n";
                             
                },
            
            }
            
        };
        
            
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

