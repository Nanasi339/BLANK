[_tb_system_call storage=system/_prologue.ks]

[cm  ]
[bg  storage="本屋1.jpg"  time="1000"  ]
[tb_show_message_window  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="kioku.mp3"  ]
[tb_start_text mode=1 ]
#
.........[p]
[_tb_end_text]

[glink  color="white"  storage="prologue.ks"  size="20"  x="500"  y="100"  width="200"  height="20"  text="目覚める"  _clickable_img=""  target="*P_1_1"  ]
[glink  color="white"  storage="prologue.ks"  size="20"  x="500"  y="200"  width="200"  height="20"  text="目覚めない"  _clickable_img=""  target="*BE1"  ]
[s  ]
*BE1

[tb_start_text mode=1 ]
#
...このまま瞳を閉じていよう。[p]
目を開けぬ限り、何事も起こることはない。[p]
安寧に身を委ねるとしよう。永遠に...[p]
目覚めることを拒んだ彼は、二度とその目を開かなかった。[p]
BADEND1　「或いは一つの幸福」[p]
[_tb_end_text]

[jump  storage="BADEND1.ks"  target=""  ]
*P_1_1

[tb_start_text mode=1 ]
#
.........[p]
...ここは？[p]
図書館...だろうか...[p]
自分は何故こんな所に？[p]
何やら頭が痛む。[p]
...そもそも、自分は誰だ？[p]
何ということだ、自らの素性さえも思い出せない。[p]
...状況が分からないが、まずは...[p]
[_tb_end_text]

[glink  color="white"  storage="prologue.ks"  size="20"  text="辺りを調べてみよう"  x="500"  y="100"  width=""  height=""  _clickable_img=""  target="*P_2_1"  ]
[glink  color="white"  storage="prologue.ks"  size="20"  text="目に付いた本を読んでみる"  x="500"  y="200"  width=""  height=""  _clickable_img=""  target="*P_2_2"  ]
[s  ]
*P_2_1

[tb_start_text mode=1 ]
#
取り敢えず、辺りを調べてみよう。[p]
.........[p]
辺りを見回すと、あるのは本の山ばかり。[p]
本、本、本...[p]
本以外のものを探す方が大変だな、これは。[p]
ただ闇雲に近辺を歩き回っても収穫は無さそうだ。[p]
諦めて目覚めた場所に戻ると、そこには人影があった。[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_3"  ]
*P_2_2

[tb_start_text mode=1 ]
#
...この大量にある本を読んでみるか。[p]
ここがどこかのヒントになるかもしれない。[p]
パッと目に付いた本を開いてみる。[p]
.........[p]
...あぁ、駄目だこれは。[p]
どこのものかも分からないような文字で書かれている本ばかりで正直手に負えない。[p]
さて、どうするか。[p]
...と、頭を悩ませているところに人影が現れた。[p]
[_tb_end_text]

[tb_eval  exp="f.CantRead=1"  name="CantRead"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
*P_3

[chara_show  name="ユキ_通常"  time="1000"  wait="true"  storage="chara/2/2020-12-21-77.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「誰かいるんですか？」[p]
#
人影は、黒髪の少女だった。[p]
初めて自分以外の人に会えたことに安堵しつつ、彼女の方を見ると、[p]
[_tb_end_text]

[playbgm  volume="60"  time="1000"  loop="true"  storage="anata_wo_siritakute-Narr.mp3"  fadein="true"  ]
[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情8.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「良かったぁ...私以外にも人がいたんですね！」[p]
#
どうやら少女も一人で彷徨っていたのか、[r]泣きながらこちらに近寄ってきた。[p]
[_tb_end_text]

[mask  time="2000"  effect="fadeIn"  color="0x000000"  ]
[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情12.png"  ]
[mask_off  time="2000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
#
「落ち着いたか？」と尋ねると、[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「はい...ありがとうございます！」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「すみません、取り乱しちゃって...」[p]
#
少女も落ち着いたようなので、[r]話を聞いてみるとしよう。[p]
まずは...[p]
[_tb_end_text]

[glink  color="white"  storage="prologue.ks"  size="20"  text="少女について聞く"  x="500"  y="100"  width=""  height=""  _clickable_img=""  target="*P_4_1"  ]
[glink  color="white"  storage="prologue.ks"  size="20"  text="この場所について聞く"  x="500"  y="200"  width=""  height=""  _clickable_img=""  target="*P_4_2"  ]
[s  ]
*P_4_1

[tb_start_text mode=1 ]
#
この少女についてだ。[p]
何を聞くにしろ、まずは相手の素性を知らないことには[r]話にならない。[p]
自分を棚上げに何を、といった話ではあるが。[p]
「君はどうしてここに？」[p]
[_tb_end_text]

*P_4_2to4_1

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-79.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「え？」[p]
「...実は私、ここに来るまで...というか、ほとんどの記憶がなくて」[p]
#
.........[p]
自分もそうだと告げると、[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情11.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「じゃあ、私と一緒ですね！」[p]
#
「...名前は、覚えているか？」[p]
#黒髪の少女
「名前も...思い出せてなかったり」[p]
「貴方は覚えてますか？自分の名前」[p]
[_tb_end_text]

[tb_start_text mode=1 ]
#
「残念ながら、何も」[p]
...これは困った。[p]
何処だかよく分からない場所に、[r]記憶が無い素性不明の人間が二人。[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_1_1"  cond="f.CantRead==1"  ]
[tb_start_text mode=1 ]
#
残る手掛かりと言えば、この書物の山を漁ってみるぐらいか...？[p]
或いは、もう少し足を延ばして探索するか...[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_1_2"  ]
*P_4_1_1

[tb_start_text mode=1 ]
#
唯一の手掛かりだった本も読めなければただの紙束。[r]どうしたものか...[p]
とはいえ、まだ見ていない所もあるだろうし、[r]そちらに期待するとしよう。[p]
[_tb_end_text]

*P_4_1_2

[tb_start_text mode=1 ]
#
そんなことを考えていると、[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「そうだ！」[p]
「私たち、お互いに名前を覚えてないんですよね？」[p]
#
「ああ、そうなるな。」[p]
#黒髪の少女
「じゃあ、お互いに呼び名を決めませんか？」[p]
#
成程、確かに今後同じ目的で動くなら呼び名は必要だろう。[p]
「そうだな、じゃあ俺は」[p]
[_tb_end_text]

*P_4_1_N1

[edit  left="550"  top="100"  width="200"  height="40"  size="20"  maxchars="10"  name="f.PlayerName"  reflect="false"  ]
[button  storage="prologue.ks"  target="*P_4_1_N2"  graphic="OK.png"  width="100"  height="100"  x="755"  y="131"  _clickable_img=""  ]
[s  ]
*P_4_1_N2

[commit  ]
[cm  ]
[jump  storage="prologue.ks"  target="*P_4_1_N3"  cond="f.PlayerName!=''"  ]
[tb_start_text mode=1 ]
名前を入力してください[p]
[_tb_end_text]

[jump  storage="prologue.ks"  target="*P_4_1_N1"  ]
*P_4_1_N3

[tb_start_text mode=1 ]
#& f.PlayerName
[emb exp="f.PlayerName"]と呼んでくれ。[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「わかりました！じゃあこれからはそう呼びますね！[r][emb exp="f.PlayerName"]さん！」[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#黒髪の少女
「じゃあ、私は何と呼んでくれますか？」[p]
#& f.PlayerName
「それも俺が決めるのか？」[p]
「折角なら自分で決めた方が...」[p]
#黒髪の少女
「いいえ、私は[emb exp="f.PlayerName"]さんに決めて欲しいんです！」[p]
#& f.PlayerName
「そうか...」[p]
理由はよく分からないが、[r]それなら、そうだな...[p]
[_tb_end_text]

*P_4_1_N4

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
