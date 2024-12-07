'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("ダイアログ表示");
        this.plugin_text= TB.$.s("ゲーム中に確認ダイアログを表示することができるようになります。");
        this.plugin_img = "tb_dialog.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["tb_alert_dialog"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("確認ダイアログ"),
                "help":TB.$.s("確認ダイアログを表示します。"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("確認ダイアログ"),
                
                header : function(obj) {
                    return obj.data.pm.text;
                },
                
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
            
                param:{
                    
                    "text" : {
                        type : "Text",
                        name : TB.$.s("ダイアログに表示する文字を指定してください"),
                        validate : {
                            required : true,
                        },
                        
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "text", val);
                        }
                    },
                    
                    "label_ok" : {
                        type : "Text",
                        name : TB.$.s("「OK」ボタンの文字を変更できます"),
                        validate : {
                            required : true,
                        },
                        default_val : "OK",
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "label_ok", val);
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

