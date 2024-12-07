'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= TB.$.s("フィルター");
        this.plugin_text= TB.$.s("ゲーム画面にフィルターをかけるコンポーネントが追加されます。効果はグレースケール・セピア・階調反転・透明度・ぼかし");
        this.plugin_img = "tb_filter.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var cmp = {};
        var TB = this.TB;
        
        cmp["tb_filter_grayscale"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("グレースケール効果"),
                "help":TB.$.s("ゲーム画面にグレースケール効果をかけるコンポーネントが追加されます"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("グレースケール効果"),
                
                
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与えることができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "all"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "all",
            
                        //    default_val:3000,
                    },
                    
                    "grayscale" : {
                        type : "Num",
                        name : TB.$.s(TB.$.s("効果値")),
                        unit : "",
                        
                        default_val : 0,
                        
                        spinner : {
                            min : 0,
                            max : 100,
                            step : 10
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    _preview : {
                        type : "PreviewButton",
                        bound_type : "camera",
                        name : TB.$.s("フィルター効果を確認する"),
                        vital : false, //必須かどうか
                        default_val : "",
                    },

                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("効果のかかり方を設定できます"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                        }
                        
                    },
                                        
                },
                
                            
            }
            
        };
        
        
        cmp["tb_filter_sepia"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セピア効果"),
                "help":TB.$.s("ゲーム画面にセピア効果をかけるコンポーネントが追加されます"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("セピア効果"),
                
                               
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与える事ができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "all"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "all",
            
                        //    default_val:3000,
                    },
                    
                    "sepia" : {
                        type : "Num",
                        name : TB.$.s("効果値"),
                        unit : "",
                        
                        default_val : 0,
                        
                        spinner : {
                            min : 0,
                            max : 100,
                            step : 10
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    _preview : {
                        type : "PreviewButton",
                        bound_type : "camera",
                        name : TB.$.s("フィルター効果を確認する"),
                        vital : false, //必須かどうか
                        default_val : "",
                    },

                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("効果のかかり方を設定できます"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                        }
                        
                    },
                                        
                },
                
                            
            }
            
        };
        
        
        cmp["tb_filter_invert"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("階調反転効果"),
                "help":TB.$.s("ゲーム画面に階調反転効果をかけるコンポーネントが追加されます"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("階調反転効果"),
                
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与える事ができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "all"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "all",
            
                        //    default_val:3000,
                    },
                    
                    "invert" : {
                        type : "Num",
                        name : TB.$.s("効果値"),
                        unit : "",
                        
                        default_val : 0,
                        
                        spinner : {
                            min : 0,
                            max : 100,
                            step : 10
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    _preview : {
                        type : "PreviewButton",
                        bound_type : "camera",
                        name : TB.$.s("フィルター効果を確認する"),
                        vital : false, //必須かどうか
                        default_val : "",
                    },

                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("効果のかかり方を設定できます"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                        }
                        
                    },
                                        
                },
                
                            
            }
            
        };
        
        
        cmp["tb_filter_opacity"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("透過効果"),
                "help":TB.$.s("ゲーム画面に透過効果をかけるコンポーネントが追加されます"),
                "icon":"s-icon-star-full"
                
            },
            
            
            "component":{
                
                name : TB.$.s("透過効果"),
                
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与える事ができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "all"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "all",
            
                        //    default_val:3000,
                    },
                    
                    "opacity" : {
                        type : "Num",
                        name : TB.$.s("効果値"),
                        unit : "",
                        
                        default_val : 0,
                        
                        spinner : {
                            min : 0,
                            max : 100,
                            step : 10
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    _preview : {
                        type : "PreviewButton",
                        bound_type : "camera",
                        name : TB.$.s("フィルター効果を確認する"),
                        vital : false, //必須かどうか
                        default_val : "",
                    },

                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("効果のかかり方を設定できます"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                        }
                        
                    },
                                        
                },
                
                            
            }
            
        };
        
        cmp["tb_filter_blur"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("ぼかし効果"),
                "help":TB.$.s("ゲーム画面にぼかし効果をかけるコンポーネントが追加されます"),
                "icon":"s-icon-star-full"
                
            },
            
            "component":{
                
                name : TB.$.s("ぼかし効果"),
                
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与える事ができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "all"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "all",
            
                        //    default_val:3000,
                    },
                    
                    "blur" : {
                        type : "Num",
                        name : TB.$.s("効果値"),
                        unit : "",
                        
                        default_val : 0,
                        
                        spinner : {
                            min : 0,
                            max : 99999,
                            step : 10
                        },
                        
                        validate : {
                            number : true
                        }
        
                    },
                    
                    _preview : {
                        type : "PreviewButton",
                        bound_type : "camera",
                        name : TB.$.s("フィルター効果を確認する"),
                        vital : false, //必須かどうか
                        default_val : "",
                    },

                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("効果のかかり方を設定できます"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "name", val);
                        }
                        
                    },
                                        
                },
                
                            
            }
            
        };
        
        
        cmp["tb_free_filter"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("フィルター解除"),
                "help":TB.$.s("ゲーム画面のフィルター効果を解除できます。nameを指定すると特定のフィルターのみ解除することも可能"),
                "icon":"s-icon-star-full"
                
            },
            
            "component":{
                
                name : TB.$.s("フィルター解除"),
                
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
                    
                    layer : {
            
                        type : "Select",
                        name : TB.$.s("対象レイヤ"),
                        help : TB.$.s("特定のレイヤのみに効果を与える事ができます"),
                        
                        select_list : [{
                                name : TB.$.s("すべて"),
                                val : "undefined"
                            }, {
                                name : TB.$.s("背景"),
                                val : "base"
                            }, {
                                name : TB.$.s("キャラクター"),
                                val : "0"
                            }
                            ]
                        ,
                        
                        default_val : "undefined",
            
                        //    default_val:3000,
                    },
                    
                    "name" : {
                        type : "Text",
                        name : TB.$.s("フィルター名を指定"),
                        help : TB.$.s("特定のフィルターのみ解除することができます"),
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

