'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("バックログ拡張プラグイン");
        this.plugin_text= TB.$.s("バックログを一時的に記録停止・再開するコンポーネント。また、好きなタイミングでバックログに追加できる機能が追加されます");
        this.plugin_img = "no_image";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["tb_nolog"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("バックログ記録停止"),
                "help":TB.$.s("この場所から「バックログ記録再開」コンポーネントまでの間、バックログに記録されなくなります。"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("バックログ記録停止"),
                
                
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
                                       
                },
                
                           
            }
            
        };
        
        
        cmp["tb_endnolog"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("バックログ記録再開"),
                "help":TB.$.s("バックログの記録がここから再開されます。"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("バックログ記録再開"),
                
                
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
                                       
                },
                
                           
            }
            
        };
        
        
        cmp["tb_pushlog"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("バックログ追加"),
                "help":TB.$.s("バックログに好きな文字列を追加できます。"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("バックログ追加"),
                
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
                        name : TB.$.s("バックログに追加する文章"),
                        validate : {
                            required : true,
                        },
        
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "text", val);
                        }
                        
                    },
                    
                    join : {
                        type : "Check",
                        text : TB.$.s("前の文章に連結して追加する"),
                        default_val : false
                    },

                                       
                },
                
                           
            }
            
        };
        
            
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

