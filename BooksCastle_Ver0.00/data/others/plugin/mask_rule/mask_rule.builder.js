'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= this.TB.$.s("ルールマスクプラグイン");
        this.plugin_text= this.TB.$.s("ルール画像を使ったマスクに関するコンポーネントを追加できる");
        this.plugin_img = "mask_rule.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
        
        var project_path = this.TB.getProjectPath() ;
        
        var from_path = project_path + "data/others/plugin/mask_rule/bg_rule_image";
        var to_path = project_path + "data/image/bg_rule_image";
        
        this.TB.io.copy(from_path,to_path);
        
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        
        cmp["mask_rule"] = {
            
            "info":{
                
                "default":true,
                "name":this.TB.$.s("ルールマスク"),
                "help":this.TB.$.s("ルール画像を使用した背景の変更を行うことができます。"),
                "icon":this.TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : this.TB.$.s("ルールマスク"),
                component_type : "Image",
                
                //ビューに渡す固定値
                
                default_view : {
                    base_img_url : "data/image/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    image_url : "storage",
                    time : "time",
                    method : "method",
                },
            
                param:{
                    
                    "graphic" : {
                        type : "ImageSelect",
                        file_path : "image/", //イメージ画像からデフォルト選択するようになっていること。
                        name : this.TB.$.s("マスク画像"),
                        help : this.TB.$.s("指定した画像でマスクをかけます。"),
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
                        help : this.TB.$.s("指定した時間をかけてマスクがかかります"),
                        
                        default_val : 1000,
                        
                        spinner : {
                            min : 0,
                            step : 500
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    /*カラー選択の形式*/
                    "color" : {
                        type : "Color",
                        name : this.TB.$.s("マスク色"),
                        default_val : "undefined",
                        validate : {
                            required : false
                        }
                    }
                    
                },
                
                
                            
            }
            
        };
        
        
        cmp["mask_off_rule"] = {
            
            "info":{
                
                "default":true,
                "name":this.TB.$.s("ルールマスク解除"),
                "help":this.TB.$.s("ルールマスクを解除することができます。"),
                "icon":this.TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : this.TB.$.s("ルールマスク解除"),
                component_type : "Simple",
                
                //ビューに渡す固定値
                
                default_view : {
                    base_img_url : "data/image/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    image_url : "storage",
                    time : "time",
                    method : "method",
                },
            
                param:{
                    
                                        
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
                        help : this.TB.$.s("指定した時間をかけてマスクがかかります"),
                        
                        default_val : 1000,
                        
                        spinner : {
                            min : 0,
                            step : 500
                        },
                        
                        validate : {
                            number : true
                        }
        
                    }
                    
                },
                
                
                            
            }
            
        };
        
            
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

