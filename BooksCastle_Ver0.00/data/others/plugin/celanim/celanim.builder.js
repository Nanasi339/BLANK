'use strict';
module.exports = class plugin_setting {
    
    constructor(TB) {
        
        this.TB = TB;
        
        this.name= this.TB.$.s("セルアニメ");
        this.plugin_text= this.TB.$.s("セルアニメーションをゲームに表示できます");
        this.plugin_img = "celanim.png";
        
    }
    
    
    //インストールを実行した時、１度だけ走ります。フォルダのコピーなどにご活用ください。
    triggerInstall(){
        
    }
    
    //コンポーネント情報を取得する。
    defineComponents(){
        
        var that = this;
        var TB = this.TB;
        var $ = this.TB.$;
        
        var cmp = {};
        
        cmp["define_celanim"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セルアニメ定義"),
                "help":TB.$.s("セルアニメを使用する準備を行います"),
                "icon":TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : TB.$.s("セルアニメ定義"),
                component_type : "Image",
                
                //ビューに渡す固定値
                
                default_view : {
                    base_img_url : "data/bgimage/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                custom_image_url:function(component){
                    var img_path = "data/image/"+component.data.pm.storage;
                    return img_path;
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    image_url : "storage",
                    time : "time",
                    method : "method",
                    cross:"cross"
                },
            
                param:{
                    
                    
                    "anim" : {
                        type : "Text",
                        name : TB.$.s("セルアニメID"),
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "anim", val);
                        }
                    },
                    
                    "storage" : {
                        type : "ImageSelect",
                        name : TB.$.s("画像"),
                        help : TB.$.s("表示するイメージを選択します"),
                        vital : true, 
                        default_val : "",
                        file_path : "image/", 
                        base_img_url : "data/image/",
                        validate : {
                            required : true
                        }
                    },
                    
                    cel_width : {
                        type : "Num",
                        name : TB.$.s("コマ一つあたりの横幅"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメのコマ一つあたりの横幅を入力してください。"),
                        spinner : {
                            min : -10000,
                            max : 10000,
                            step : 10
                        },
                        validate : {
                            number : true
                        }
            
                    },
            
                    cel_height: {
                        type : "Num",
                        name : TB.$.s("コマ一つあたりの高さ"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメのコマ一つあたりの高さを入力してください。"),
                        spinner : {
                            min : -10000,
                            max : 10000,
                            step : 10
                        },
                        validate : {
                            number : true
                        }
            
                    },
                    
                    
                },
                
            }
            
        };
        
        
        cmp["tb_celanim"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セルアニメ表示"),
                "help":TB.$.s("セルアニメを表示します。"),
                "icon":TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : TB.$.s("セルアニメ表示"),
                component_type : "Simple",
                
                //ビューに渡す固定値
                
                header : function(obj) {
                    return obj.data.pm.anim;
                },
                
                default_view : {
                    base_img_url : "data/image/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                custom_image_url:function(component){
                    
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    
                },
            
                param:{
                    
                    
                    "anim" : {
                        type : "Text",
                        name : TB.$.s("セルアニメID"),
                        validate : {
                            required : true,
                        },
        
                        onChange : function(val, component) {
                            TB.component.changeParam(component, "anim", val);
                        }
                    },
                    
                    
                    _bound_select : {
                        
                        type : "BoundSelectPlugin",
                        bound_type : "plugin",
                        file_path : "image/", //背景画像からデフォルト選択するようになっていること。
                        name : TB.$.s("領域選択"),
                        help : TB.$.s("座標を見やすいツールを使って指定することができます"),
                        vital : false, //必須かどうか
                        default_val : "",
                        
                        drag_obj:function(pm){
                            
                            console.log(TB);
        
                            var project_path = TB.getProjectPath();
                            var img_path = project_path + "data/others/plugin/celanim/drag.png";
        
                            var html = '<img style="position:relative;width:100%;height:100%" src="'+img_path+'" />';
                            
                            var j_obj = TB.$(html);
                            
                            return j_obj
                            
                        },
                    },


                    x : {
                        type : "Num",
                        name : TB.$.s("X座標"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメを表示するX座標を設定"),
                        spinner : {
                            min : -10000,
                            max : 10000,
                            step : 10
                        },
                        validate : {
                            number : true
                        }
            
                    },
            
                    y : {
                        type : "Num",
                        name : TB.$.s("Y座標"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメを表示するY座標を設定"),
                        spinner : {
                            min : -10000,
                            max : 10000,
                            step : 10
                        },
                        validate : {
                            number : true
                        }
            
                    },
                    
                    width : {
                        type : "Num",
                        name : TB.$.s("横幅"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメの横幅を指定します"),
                        validate : {
                            number : true
                        },
                        
                        default_val:200,
                    },
                    
                    height : {
                        type : "Num",
                        name : TB.$.s("縦幅"),
                        unit : TB.$.s("px"),
                        help : TB.$.s("セルアニメの縦幅を指定します"),
                        validate : {
                            number : true
                        },
                        
                        default_val:200,
                    },
                    
                    time : {
                        
                        type : "Num",
                        name : $.s("フェードイン時間"),
                        unit : $.s("ﾐﾘ秒"),
                        default_val : 1000,
                        validate : {
                            required : true,
                            number : true,
                        },
                        spinner : {
                            min : 0,
                            max : 10000,
                            step : 100
                        }
            
                    },
                    
                    count : {
                        
                        type : "Num",
                        name : $.s("繰り返し回数"),
                        unit : $.s("回"),
                        default_val : 1,
                        validate : {
                            required : true,
                            number : true,
                        },
                        spinner : {
                            min : 0,
                            max : 10000,
                            step : 1
                        }
            
                    },
                    
                    speed : {
                        
                        type : "Num",
                        name : $.s("再生速度倍率。１が基準"),
                        unit : "",
                        default_val : 1,
                        validate : {
                            required : true,
                            number : true,
                        },
                        spinner : {
                            min : 0.1,
                            max : 10000,
                            step : 0.1
                        }
            
                    },

                    autodel : {
                        type : "Check",
                        text : $.s("再生完了後に削除する"),
                        default_val : true
                    },

                    wait : {
                        type : "Check",
                        text : $.s("完了を待つ"),
                        default_val : true
                    }

                    
                },
                
            }
            
        };
        
        cmp["free_celanim"] = {
            
            "info":{
                
                "default":true,
                "name":TB.$.s("セルアニメ削除"),
                "help":TB.$.s("セルアニメをすべて非表示にします。"),
                "icon":TB.$.s("s-icon-star-full")
                
            },
            
            
            "component":{
                
                name : TB.$.s("セルアニメ削除"),
                component_type : "Simple",
                
                //ビューに渡す固定値
                                
                default_view : {
                    base_img_url : "data/image/",
                    icon : "s-icon-star-full",
                    icon_color : "#FFFF99",
                    category : "plugin"
                },
                
                custom_image_url:function(component){
                    
                },
                
                //paramとひもづけるためのマップ
                param_view : {
                    
                },
            
                param:{
                }
                
            }
            
        };

        
            
                
        return cmp;
    
        
    }
    
    test(){
        
        
    }
        
}

