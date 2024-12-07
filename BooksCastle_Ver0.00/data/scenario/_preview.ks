[_tb_system_call storage=system/_preview.ks ]

[mask time=10]
[bg  storage="本屋1.jpg"  time="10"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="anata_wo_siritakute-Narr.mp3"  fadein="true"  ]
[tb_show_message_window] 
[chara_mod  name="ユキ_通常"  time="10"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[chara_show  name="ユキ_通常"  time="10"  wait="true"  storage="chara/2/2020-12-21-77.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[mask_off time=10]
[edit  left="550"  top="100"  width="200"  height="40"  size="20"  maxchars="10"  name="f.YukiName"  reflect="false"  ]
[button  storage="prologue.ks"  target="*P_4_1_N5"  graphic="OK.png"  width="100"  height="100"  x="755"  y="131"  _clickable_img=""  ]
[s  ]
*P_4_1_N5

[commit  ]
[cm  ]
[jump  storage="prologue.ks"  target="*P_4_1_N6"  cond="f.YukiName!=''"  ]
[tb_start_text mode=1 ]
名前を入力してください[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_1_N4"  ]
*P_4_1_N6

[tb_autosave  title="互いの呼び方"  ]
[tb_eval  exp="sf.PNLOOP=f.PlayerName"  name="PNLOOP"  cmd="="  op="h"  val="PlayerName"  val_2="undefined"  ]
[tb_eval  exp="sf.YNLOOP=f.YukiName"  name="YNLOOP"  cmd="="  op="h"  val="YukiName"  val_2="undefined"  ]
[jump  storage="prologue.ks"  target="*Name_Yuki"  cond="f.YukiName=='ユキ'"  ]
[tb_start_text mode=3 ]
#& f.PlayerName
「[emb exp="f.YukiName"]...なんてどうだ」[l][r]
[_tb_end_text]

[playbgm  volume="60"  time="1000"  loop="true"  storage="anata_wo_siritakute.mp3"  fadein="true"  ]
[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「[emb exp="f.YukiName"]...良い名前ですね！」[p]
「是非、それでお願いします！」[p]
#& f.PlayerName
「気に入ってくれて何よりだ。」[p]
「それじゃあ、[emb exp="f.YukiName"]、これからどうする？」[p]
#& f.YukiName
「そうですね...」[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*NormalName"  ]
*Name_Yuki

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情7.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「えっ...」[p]
.........[p]
#& f.PlayerName
...何か、おかしなことを言っただろうか？[p]
「...この名前は嫌か？」[p]
#黒髪の少女
「あ、いえ、そういうわけではないですけど...」[p]
「...ごめんなさい、やっぱり別の名前でお願いします。」[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_1_N4"  ]
*NormalName

[jump  storage="prologue.ks"  target="*P_5_2"  cond="f.CantRead==1"  ]
*P_5_1

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「とりあえず、中を一通り周ってみませんか？」[p]
#& f.PlayerName
「ああ、そうだな。そうしよう。」[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*Prologue_END"  ]
*P_5_2

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
「そういえば、さっき本を読んでいませんでしたか？」[p]
#& f.PlayerName
「あぁ、あれか。」[p]
「これだけ本が置いてあるなら、ここがどこかの手掛かりには[r]なるかと思ってな」[p]
#& f.YukiName
「なるほど！　それで、何か分かりました？」[p]
#& f.PlayerName
「それが、どの本も読めなくてな。」[p]
#& f.YukiName
「読めない...ですか？」[p]
#& f.PlayerName
「さっぱりだ。どこの言葉かも分からない」[p]
#& f.YukiName
「ちょっと貸してみて下さい」[p]
#& f.YukiName
.........[p]
「この言葉......私、読めますよ」[p]
#& f.PlayerName
「本当か！」[p]
[_tb_end_text]

[glink  color="white"  storage="prologue.ks"  size="20"  text="どこの言葉だ？"  x="500"  y="100"  width=""  height=""  _clickable_img=""  target="*P_5_2_1"  ]
[glink  color="white"  storage="prologue.ks"  size="20"  text="何が書いてある？"  x="500"  y="200"  width=""  height=""  _clickable_img=""  target="*P_5_2_2"  ]
[s  ]
*P_5_2_1

[tb_start_text mode=1 ]
#& f.PlayerName
「どこの言葉だ？」[p]
これで此処が何処かくらいは分かるかもしれない。[p]
そう期待して聞いたが、残念ながら[p]
#& f.YukiName
「ごめんなさい。読めるのは読めるんですけど、どこの言葉かまでは...」[p]
「それに、ここの本はそれぞれ色んな言語で書かれているみたいで、[r]分かったとしてもあんまり手掛かりにはならないかもしれません。」[p]
#& f.PlayerName
「そうか...いや、ごめん。気が急いた。」[p]
...いや、そもそも。[p]
冷静に考えれば自分達は記憶喪失な訳で。[p]
地域や国、言語という概念は理解できる。[p]
覚えているが、[r]少なくとも自分は、何処にどんな国があるかさえ覚えていない。[p]
[emb exp="f.YukiName"]もそうなのだろうか。[p]
「聞いて良いか？」[p]
#& f.YukiName
「はい、何でしょう？」[p]
#& f.PlayerName
「[emb exp="f.YukiName"]は、自分の国とか、周りにどんな国があったかって覚えてるか？」[p]
#& f.YukiName
「あはは...そうですね、私も全然記憶がなくて...」[p]
#& f.PlayerName
「やっぱりか...」[p]
どうやら自分と[emb exp=f.YukiName]の記憶喪失の程度は同じらしい。[p]
残っているのは基本的概念や情報だけで、"過去"と"外の記憶"をすべて失っている。[p]
何とも前途多難だ。[p]
...しかし、[emb exp="f.YukiName"]がここの本の言葉を読めるのは有難い。[r]本が情報源になるし、何よりそれ自体が彼女の記憶に繋がっているかもしれない。[p]
大きな収穫と、前向きに受け止めるとしよう。[p]
であれば、今はそれよりも...[p]
[_tb_end_text]

*P_5_2_2

[tb_start_text mode=1 ]
#& f.PlayerName
「何が書いてあるんだ？」[p]
#& f.YukiName
「うーん、ここは童話や物語を置いているみたいですね。」[p]
「他の所に行けば、違った本を置いているのかもしれないですけど」[p]
#& f.PlayerName
「なら、他の所も周ってみるか」[p]
#& f.YukiName
「はい、そうしましょう！」[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*Prologue_END"  ]
*P_4_2

[tb_start_text mode=1 ]
#
この場所について聞いてみよう。[r]もしかしたら自分より知っていることが多いかもしれない。[p]
「ところで、君はここがどういう場所か知っているのか？」[p]
#黒髪の少女
「いえ、私も詳しくは...」[p]
[_tb_end_text]

[tb_start_text mode=1 ]
#
......まさか、この少女も...[p]
やはり、先に聞くべきことがあるらしい。[p]
自分を棚上げに何を、といった話ではあるが。[p]
「君はどうしてここに？」[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_2to4_1"  ]
*Prologue_END

[stopbgm  time="1000"  fadeout="true"  ]
[cm  ]
[chara_hide_all  time="1000"  wait="true"  ]
[jump  storage="scene1.ks"  target=""  ]
[s  ]
