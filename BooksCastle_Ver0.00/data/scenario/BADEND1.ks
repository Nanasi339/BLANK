[_tb_system_call storage=system/_BADEND1.ks]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[stopbgm  time="1000"  ]
[tb_ptext_hide  time="1000"  ]
[tb_eval  exp="sf.BE1=1"  name="BE1"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[cm  ]
[bg  time="1000"  method="crossfade"  storage="白293.jpg"  ]
[tb_show_message_window  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[playbgm  volume="70"  time="1000"  loop="true"  storage="Soft_Lights.mp3"  ]
[chara_show  name="ユキ_学士服"  time="1000"  wait="true"  storage="chara/3/2020-12-21-5.png"  width="427"  height="1027"  left="875"  top="125"  reflect="false"  ]
[tb_start_text mode=1 ]
#???
はい、初めまして！[p]
始まりましたよくあるヒントコーナー、[p]
｢教えて、○○○○先生｣ー！[p]

[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="白294.jpg"  ]
[tb_ptext_show  x="243.00001525878906"  y="157"  size="60"  color="0xff0000"  time="1000"  text="教えて！"  face="sans-serif,'メイリオ'"  anim="false"  edge="0xff0000"  shadow="undefined"  ]
[tb_ptext_show  x="368.00001525878906"  y="286"  size="80"  color="0xff0000"  time="500"  text="○○○○先生！"  face="sans-serif,'メイリオ'"  anim="false"  edge="0xff0000"  shadow="undefined"  ]
[chara_mod  name="ユキ_学士服"  time="600"  cross="true"  storage="chara/3/2020-12-21-21.png"  ]
[tb_start_text mode=1 ]
さて、今回のバッドエンドの原因は...って。[p]
[_tb_end_text]

[chara_mod  name="ユキ_学士服"  time="600"  cross="true"  storage="chara/3/2021-02-17-45.png"  ]
[tb_start_text mode=1 ]
普通に起きて下さいよ！[r]何も話が始まらないじゃないですか！[p]
はい、今回は終了、ここまで！[p]
[_tb_end_text]

[chara_mod  name="ユキ_学士服"  time="600"  cross="true"  storage="chara/3/2021-02-17-43.png"  ]
[tb_start_text mode=1 ]
え？[p]
タイトルの○○○○先生って何？[r]私が誰か、ですか？[p]
それを聞く前にまずやることがあるのでは？[p]
[_tb_end_text]

[chara_mod  name="ユキ_学士服"  time="600"  cross="true"  storage="chara/3/2020-12-21-8.png"  ]
[tb_start_text mode=1 ]
さあ、色々言い訳して二度寝してないで、[r]起きて物語を始めましょう！[p]
[_tb_end_text]

[chara_hide_all  time="1000"  wait="true"  ]
[tb_ptext_hide  time="1000"  ]
[jump  storage="title_screen.ks"  target=""  ]