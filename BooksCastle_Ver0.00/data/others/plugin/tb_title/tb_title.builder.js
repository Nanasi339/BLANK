'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("タイトル変更");
        this.plugin_text= TB.$.s("ゲームのタイトル部分を途中で変更することができます。例えば、章ごとにタイトルを変えるとプレイヤーからわかりやすくなります。");
        this.plugin_img = "tb_title.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["tb_title"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("タイトル変更"),
                "help":TB.$.s("ゲームのタイトルを途中で変更することができます。"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("タイトル変更"),
                
                header : function(obj) {
                    return obj.data.pm.name;
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
                    
                    "name" : {
                        type : "Text",
                        name : TB.$.s("タイトル名"),
                        validate : {
                            required : true,
                        },
        
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                            
        
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

