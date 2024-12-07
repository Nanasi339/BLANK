'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("スリープ＆アウェイク");
        this.plugin_text= TB.$.s("ゲームの状態を一時保存した状態で他のシナリオに移動することができるようになります。アウェイクのタイミングでスリープを実行した状態に即座に復帰できます。");
        this.plugin_img = "no_image";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["sleepgame"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("スリープゲーム"),
                "help":TB.$.s("ゲームの状態を保存して、他のシナリオへジャンプすることができます。「アウェイク」で復帰します"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name :TB.$.s("スリープゲーム"),
    
                header : function(obj) {
        
                    obj.data.pm.storage || (obj.data.pm.storage = "");
                    obj.data.pm.target || (obj.data.pm.target = "");
        
                    return "" + obj.data.pm.storage + " " + obj.data.pm.target + "";
                    
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
                    storage : "storage",
                    target : "target",
                },
        
                param : {
        
                    storage : TB._pm_type["storage"],
                    target : TB._pm_type["target"],
        
                    next : {
                        type : "Check",
                        text : TB.$.s("復帰時に自動的に次の命令へ移動する"),
                        default_val : true,
                        //name:"",
                    },

                    cond : {
                        type : "Cond",
                        name : TB.$.s("フラグ判定用の式"),
                        help : TB.$.s("スリープに発動条件を付けたい場合、ここにスクリプト条件式を記述してください。条件が真の場合のみジャンプします"),
                        //変更された場合
                        /*
                         onChange:function(val,component,old_val){
        
                         }
                         */
                    },
        
                },
                           
            }
            
        };
        
        
        cmp["awakegame"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("アウェイクゲーム"),
                "help":TB.$.s("スリープゲームを実行した状態に戻ります"),
                "icon":"s-icon-star-full"
                
            },
            
                            
            "component":{
                
                name : TB.$.s("アウェイクゲーム"),
                
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
                    
                    variable_over : {
                        type : "Check",
                        text : TB.$.s("スリープ中のゲーム変数への変更を引き継ぐ"),
                        default_val : true,
                        //name:"",
                    },
                    
                    bgm_over : {
                        type : "Check",
                        text : TB.$.s("スリープ中のBGMを維持する"),
                        default_val : true,
                        //name:"",
                    },
                    

                                    
                },

                
                           
            },
            
            
            
            //breakgame
            
        };
        
        
        cmp["breakgame"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("ブレイクゲーム"),
                "help":TB.$.s("スリープゲーム実行後、アウェイクゲームを実行しない場合は、ブレイクゲームを配置する必要があります。"),
                "icon":"s-icon-star-full"
                
            },
            
                            
            "component":{
                
                name : TB.$.s("ブレイクゲーム"),
                
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

                
                           
            },
            
            
            
        };
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

