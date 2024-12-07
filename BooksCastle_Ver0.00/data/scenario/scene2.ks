[_tb_system_call storage=system/_scene2.ks]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[cm  ]
[tb_show_message_window  ]
[tb_autosave  title="1章"  ]
[bg  time="1000"  method="crossfade"  storage="黄220.jpg"  ]
[jump  storage="scene2.ks"  target="*SWGE"  cond="f.SWED==1"  ]
*SWBE

[playbgm  volume="60"  time="1000"  loop="true"  storage="anata_wo_siritakute-Narr.mp3"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
「......」[p]
[_tb_end_text]

[chara_show  name="ユキ_通常"  time="1000"  wait="false"  storage="chara/2/2021-02-17-今回表情7.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「......」[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="鍵を開ける1.mp3"  ]
[tb_start_text mode=1 ]
#
ガチャリ...[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「あ、開きましたよ。[emb exp="f.PlayerName"]さん。」[p]
#& f.PlayerName
「ああ、そうだな。」[p]
「...本当に、どんな終わりでも結末を迎えれば開くってことか。」[p]
[_tb_end_text]

[tb_start_text mode=1 ]
#& f.YukiName
「今日は、帰りましょうか。」[p]
「この先は明日からにしましょう？」[p]
#& f.PlayerName
「そうだな。」[p]
「そうだ、帰ったらここの本の読み書きを教えてくれるか？」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「ええ、勿論です！」[p]
[_tb_end_text]

[chara_hide_all  time="1000"  wait="true"  ]
[playse  volume="100"  time="1000"  buf="0"  storage="革靴で歩く.mp3"  loop="true"  ]
[wait  time="500"  ]
[playse  volume="100"  time="1000"  buf="1"  storage="革靴で歩く.mp3"  loop="true"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「...どうしたら、白雪姫を助けられたんでしょうね。」[p]
[_tb_end_text]

[jump  storage="scene2.ks"  target="*SWBE2"  cond="f.SW2!=0"  ]
*SWBE1

[tb_start_text mode=1 ]
#& f.PlayerName
「あの狩人が暗殺を断ったとしても、他の狩人が引き受けてしまう以上、[r]　どうしたら良いんだろうな。」[p]
#& f.YukiName
「でも、あの狩人さん、根はとても良い人のように思えますけど。」[p]
「暗殺を引き受けたところで、実行できたんですかね？」[p]
#& f.PlayerName
「確かに。あれって書き換えとかできるのかな。[r]　......後で試してみようか。」[p]
#& f.YukiName
「そうですね！私も手伝います！」[p]
......[p]
[_tb_end_text]

[jump  storage="scene2.ks"  target="*SWBE_E"  ]
*SWBE2

[tb_start_text mode=1 ]
#& f.PlayerName
「...切っ掛け、か,,,」[p]
#& f.YukiName
「え？」[p]
#& f.PlayerName
「ほら、最後の方。切っ掛けでもあれば目を覚ますんじゃないかって、[r]　書いてあったんだろ？」[p]
#& f.YukiName
「ええ、そうですね。」[p]
#& f.PlayerName
「じゃあ、その切っ掛けが何かあれば良いんじゃないか？」[p]
#& f.YukiName
「なるほど...うーん、何でしょうね、切っ掛け。」[p]
#& f.PlayerName
「...後で色々試してみようか。」[p]
#& f.YukiName
「そうですね！私も手伝います！」[p]
......[p]
[_tb_end_text]

*SWBE_E

[wait  time="3000"  ]
[stopse  time="1000"  buf="0"  ]
[stopse  time="1000"  buf="1"  ]
[jump  storage="TRIALEND.ks"  target=""  ]
[s  ]
*SWGE

[playbgm  volume="60"  time="1000"  loop="true"  storage="yoru_no_zattou.mp3"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
「よし、これでどうだ。」[l][p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="鍵を開ける1.mp3"  ]
[tb_start_text mode=1 ]
#
ガチャリ...[p]
#& f.PlayerName
「開いた！」[p]
[_tb_end_text]

[chara_show  name="ユキ_通常"  time="1000"  wait="false"  storage="chara/2/2021-02-17-今回表情12.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「ふう...」[p]
#& f.PlayerName
「[emb exp="f.YukiName"]も翻訳お疲れ。」[p]
「本当に助かった。」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「どういたしまして。」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情7.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「でも、これは戻ったら特訓ですね。」[p]
「毎回これは、さすがに私も疲れますから...」[p]
#& f.PlayerName
「そうだよな、本当にありがとう。」[p]
「じゃあ、今日のところは帰るか。」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「はい！」[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="革靴で歩く.mp3"  loop="true"  ]
[wait  time="500"  ]
[playse  volume="100"  time="1000"  buf="1"  storage="革靴で歩く.mp3"  loop="true"  ]
[chara_hide_all  time="1000"  wait="true"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
「次はちゃんと言葉を覚えておかないとな。」[p]
#& f.YukiName
「大丈夫です！私がバッチリ教えますから！」[p]
#& f.PlayerName
「はは、お手柔らかに。」[p]
#
[_tb_end_text]

[wait  time="3000"  ]
[stopse  time="1500"  buf="0"  fadeout="true"  ]
[stopse  time="1500"  buf="1"  fadeout="true"  ]
*TrialVer

[chara_hide_all  time="1000"  wait="true"  ]
[jump  storage="TRIALEND.ks"  target=""  cond=""  ]
[s  ]
