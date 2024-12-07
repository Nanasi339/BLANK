[_tb_system_call storage=system/_TestArea.ks]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[cm  ]
[tb_show_message_window  ]
[bg  time="1000"  method="crossfade"  storage="汎用戦闘5.jpg"  ]
[tb_eval  exp="sf.YNLOOP='ユキ'"  name="YNLOOP"  cmd="="  op="t"  val="ユキ"  val_2="undefined"  ]
[tb_start_tyrano_code]
[macro name=”Yuki”]
[emb exp=”f.YNLOOP”]
[endmacro]
[_tb_end_tyrano_code]

[mask_off  time="1000"  effect="fadeOut"  ]
*TestMessage

[tb_start_text mode=1 ]
#名前欄
テストメッセージです[p]
[_tb_end_text]

[tb_start_tyrano_code]
[position layer="message0" left="0" top="510" width="1280" height="237" frame="../others/plugin/theme_kopanda_01_HD/image/frame_message.png" opacity="&mp.frame_opacity" marginl="0" margint="0" marginr="150" ]
[resetfont]
[_tb_end_tyrano_code]

[tb_start_text mode=1 ]
#
テストメッセージです[p]
[_tb_end_text]

[qte_tap  time="3000"  text="TAP!"  mash_count="1"  x="313"  y="206"  width="200"  height="200"  area_left="0"  area_top="0"  area_width="1280"  area_height="920"  graphic="NA_curse_001.png"  random_position="true"  _clickable_img=""  tap_next="true"  waittime="0"  timeout_target=""  ]
[wait  time="3000"  ]
*test_end

[jump  storage="TestArea.ks"  target="*TestMessage"  ]
[s  ]
