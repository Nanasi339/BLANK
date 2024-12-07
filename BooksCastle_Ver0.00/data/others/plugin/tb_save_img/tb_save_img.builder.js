'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("セーブキャプチャ画像設定プラグイン");
        this.plugin_text= TB.$.s("セーブ時のキャプチャ画像を好きな画像に変更できるようになります。設定をもとに戻したい時は「セーブ画像のリセット」を配置してください。");
        this.plugin_img = "no_image";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["tb_save_img"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セーブ画像の指定"),
                "help":TB.$.s("セーブ時のキャプチャ画像を自由に変更できます。デフォルトに戻したい場合は「セーブ画像のリセット」を配置してください"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("セーブ画像の指定"),
                
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
        
                        
                param : {
                    storage : {
                        type : "ImageSelect",
                        file_path : "bgimage/", //背景画像からデフォルト選択するようになっていること。
                        name : TB.$.s("セーブ画像"),
                        help : TB.$.s("セーブ時のキャプチャ画像を指定画像に切り替えます"),
                        vital : true, //必須かどうか
                        default_val : "",
                        validate : {
                            required : true
                        }
                    },
                
                },

                
                           
            }
            
        };
        
        
        cmp["tb_save_img_reset"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セーブ画像のリセット"),
                "help":TB.$.s("セーブ時のキャプチャ画像をデフォルト動作に戻します。"),
                "icon":"s-icon-star-full"
                
            },
            
                            
            "component":{
                
                name : TB.$.s("セーブ画像のリセット"),
                
                component_type : "Simple",
                

                //ビューに渡す固定値
                default_view : {
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },

                //paramとひもづけるためのマップ
                param_view : {
                },
        
                        
                param : {
                                    
                },

                
                           
            }
            
        };
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

