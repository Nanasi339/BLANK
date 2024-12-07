[_tb_system_call storage=system/_scene1.ks]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[cm  ]
[tb_show_message_window  ]
[bg  time="1000"  method="crossfade"  storage="黄102.jpg"  ]
[tb_start_tyrano_code]
[position layer="message0" left="40" top="40" width="1200" height="630" frame="none"]
[font color="white"]
[_tb_end_tyrano_code]

[tb_eval  exp="sf.TSMode=1"  name="TSMode"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[tb_autosave  title="1章"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="令嬢の秘密.mp3"  ]
[tb_start_text mode=3 ]
#
図書館らしき建物を[emb exp="f.YukiName"]と共に見て回った。[l][r]
建物の構造については...分かったとも言えるし、分からなかったとも言える。[l][r]
何しろ広く、大きく、高く、深い。[l][r]
ものとしては確かに図書館ではあるのだが、[r]
その実、これではまるで城、或いは砦だ。[l][r]
所蔵している本の数についても正に圧巻。[l][r]
古今東西あらゆる書物全てがあるのではないかと思う程に、[r]
広い建物内の壁一面全てを本が埋めつくしていた。[l][r]
記憶を失った自分ですら、この異常さは理解できる。[l][r]
ここはとても重要な施設だ。[l][r]
恐らくは世界級の枠組みで。[p][r]
しかしここには自分達以外誰もいない。[l][r]
本を読む人間も、管理する人間も。[l][r]
明らかに異常だ。[l][r]
そしてそれにも増して異常なのは、[r]
自分達はその"誰もいない施設"に[r]
"何者かによって閉じ込められている"という事実だ。[l][r]
そう、かなり歩き回ったつもりだが、ここには出口が無い。[l][r]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[cm  ]
[bg  time="1000"  method="crossfade"  storage="赤192.jpg"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="夕暮れの散歩.mp3"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=3 ]
ここを管理していた人達が使っていたのか、[r]
どうやらトイレ、シャワールーム、ベッド、小さいキッチン付きの休憩室、[r]
食料品等各種揃った倉庫まであるようで[r]
見つかった時には、最低限当分の生存には事欠かなそうだ、と安堵したものだ。[l][r]
人が使っていたにしては生活感が無かったことが少し気になるが、さておき[r]
出口を探すにせよ、探索するにせよ、その保障が無ければ話にならない。[p][r]
気付いたことがもう1つある。[l][r]
この図書館には出口のみならず、窓も無い。[l][r]
昼夜が分からず居心地悪さを感じていたところ、休憩室に時計を見つけた。[l][r]
壊さないよう、軽く調べた所[r]
アナログ時計でありながら特殊な構造をしている物だった。[l][r]
時針の移動に合わせて中央下にある窓の内部が回転し青空、夕日、月、夜明け[r]
といったように朝から晩を表しており、午前、午後が分かるようになっている。[l][r]
見れば、夜の11時になっていた。[l][r]
"そうだ、デジタル時計でも見つかれば"と思ったが、[r]
残念ながらデジタル時計の類は一切見つからず、[r]
今が何年何月何日なのか、ここは何処の建物かといった手がかりにはならなかった。[p][r]
しかし、広大な施設を巡った疲労感と当面の生命保障の安心感から[r]
一旦、謎の追求は止め、[r]
本格的な行動は明日からとして[r]自分達は休憩室で食事と睡眠を摂ることにした。[l][r]
倉庫を漁ると想像以上の食料が眠っており、[r]
どれも保存が効きそうなものばかりで1年程度ならここで暮らせる程だった。[l][r]
食料品を2人で美味しく頂き、いざ寝ようと言うと[r]
[emb exp="f.YukiName"]が何やら赤面して慌てふためいていたが、[r]
言っていることが要領を得ず、仕方ないので放っておいて早々に眠った。[l][r]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[tb_eval  exp="f.Time=5"  name="Time"  cmd="="  op="t"  val="5"  val_2="undefined"  ]
[cm  ]
[tb_start_tyrano_code]
[position layer="message0" left="0" top="510" width="1280" height="237" frame="../others/plugin/theme_kopanda_01_HD/image/frame_message.png" opacity="&mp.frame_opacity" marginl="0" margint="0" marginr="150" ]
[resetfont]
[_tb_end_tyrano_code]

[tb_start_tyrano_code]
[eval exp="f.Time"]
[_tb_end_tyrano_code]

[tb_ptext_show  x="1200"  y="8"  size="30"  color="0xffffff"  time="1"  anim="false"  face="fantasy"  text="&f.Time"  edge="undefined"  shadow="undefined"  ]
[tb_ptext_show  x="1220"  y="4"  size="30"  color="0xffffff"  time="1"  text="時"  face="fantasy"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="かわいい眠り.mp3"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
さて、朝だ。[p]
正直ここに陽の光など無いので[r]実感が湧くかと言われると難しいが。[p]
ともあれ、早速行動方針を...[p]
と、思ったがまだ[emb exp="f.YukiName"]は眠っていた。[p]
時計を見れば朝の5時。[p]
それは寝ていてもおかしくはない。[r]寧ろこちらの睡眠時間が少ないくらいだ。[p]
ふむ、[p]
[_tb_end_text]

[glink  color="white"  storage="scene1.ks"  size="20"  text="...もう少し眠っておくか"  x="500"  y="100"  width=""  height=""  _clickable_img=""  target="*S1_1_1"  ]
[glink  color="white"  storage="scene1.ks"  size="20"  text="...しばらく、寝顔を見ていようか"  x="500"  y="200"  width=""  height=""  _clickable_img=""  target="*S1_1_2"  ]
[glink  color="white"  storage="scene1.ks"  size="20"  text="...余裕があるとはいえ、時間が惜しい"  x="500"  y="300"  width=""  height=""  _clickable_img=""  target="*S1_1_3"  ]
[s  ]
*S1_1_1

[tb_start_text mode=1 ]
#& f.PlayerName
...もう少し眠っておくか[p]
[_tb_end_text]

[stopbgm  time="1000"  fadeout="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[tb_eval  exp="f.Time=8"  name="Time"  cmd="="  op="t"  val="8"  val_2="undefined"  ]
[tb_ptext_hide  time="1000"  ]
[tb_ptext_show  x="1200"  y="8"  size="30"  color="0xffffff"  time="1"  anim="false"  face="fantasy"  text="&f.Time"  edge="undefined"  shadow="undefined"  ]
[tb_ptext_show  x="1220"  y="4"  size="30"  color="0xffffff"  time="1"  text="時"  face="fantasy"  ]
[bg  time="1000"  method="crossfade"  storage="背景黒塗り.png"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="ファンキーミドル.mp3"  ]
[tb_start_text mode=1 ]
#
3時間後...[p]
｢起きて下さーい！｣[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="手足・殴る、蹴る12.mp3"  ]
[quake  time="300"  count="1"  hmax="0"  wait="true"  vmax="10"  ]
[tb_start_text mode=1 ]
ガッ！[p]
｢[emb exp="f.PlayerName"]さーん！｣[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="金だらい・一斗缶01.mp3"  ]
[quake  time="300"  count="1"  hmax="0"  wait="true"  vmax="20"  ]
[tb_start_text mode=1 ]
ガンッ！[p]
｢もう朝の8時ですよーっ！｣[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="金だらい・一斗缶03.mp3"  ]
[quake  time="300"  count="1"  hmax="0"  wait="true"  vmax="30"  ]
[tb_start_text mode=1 ]
ガシャン！[p]
#& f.PlayerName
｢分かっ...分かっ、た、から殴る、のを、やめ｣[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="金だらい・一斗缶02.mp3"  ]
[quake  time="300"  count="3"  hmax="0"  wait="true"  vmax="40"  ]
[tb_start_text mode=1 ]
#
ガッシャーンッ！[p]
[_tb_end_text]

[chara_show  name="ユキ_通常"  time="1000"  wait="false"  storage="chara/2/2020-12-21-77.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[bg_rule  time="1000"  clickskip="false"  wait="true"  rule="003.png"  storage="赤192.jpg"  ]
[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-80.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
｢あっ！やっと起きましたー！｣[p]
[_tb_end_text]

[playse  volume="100"  time="1000"  buf="0"  storage="鉄の棒を落とす.mp3"  ]
[tb_start_text mode=1 ]
#
ガランカラン...[p]
#
意識を手放しそうなのを何とか抑え、[r]ゆっくりと立ち上がる。[p]
#& f.YukiName
｢おはようございます！[emb exp="f.PlayerName"]さん！｣[p]
#& f.PlayerName
｢あぁ...おはよう、[emb exp="f.YukiName"]。｣[p]
｢...二度寝したこちらも悪いが、多少は加減を頼む。｣[p]

[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2021-02-17-今回表情9.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
｢まぁ、二度寝したんですか？これはいけません！｣[p]
｢もう一発...！｣[p]
#& f.PlayerName
｢待て待て何故だ！必要無い、この通り目覚めている！｣[p]
[_tb_end_text]

[chara_mod  name="ユキ_通常"  time="600"  cross="true"  storage="chara/2/2020-12-21-77.png"  ]
[tb_start_text mode=1 ]
#& f.YukiName
｢あら、そうですか？｣[p]
#& f.PlayerName
｢降ろしてくれて何よりだ。｣[p]
｢もう一撃貰ったら再度起き上がれる自信が無い。｣[p]
｢ふぅ...」[p]
｢さて、8時か...朝食を摂ったら直ぐに行動に移るとしよう｣[p]
[_tb_end_text]

[stopbgm  time="1000"  fadeout="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[tb_eval  exp="f.Time=9"  name="Time"  cmd="="  op="t"  val="9"  ]
[tb_ptext_hide  time="1000"  ]
[tb_ptext_show  x="1200"  y="8"  size="30"  color="0xffffff"  time="1"  anim="false"  face="fantasy"  text="&f.Time"  edge="undefined"  shadow="undefined"  ]
[tb_ptext_show  x="1220"  y="4"  size="30"  color="0xffffff"  time="1"  text="時"  face="fantasy"  ]
[chara_hide_all  time="1000"  wait="true"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[jump  storage="scene1.ks"  target="*S1_2_1"  ]
*S1_1_2

[tb_eval  exp="f.YukiHeart+=1"  name="YukiHeart"  cmd="+="  op="t"  val="1"  val_2="undefined"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
...しばらく、寝顔を見ていようか。[p]
......[p]
...しかし、こう改めて見ると随分と幼く見える。[p]
雰囲気で少しばかり大人びて見えるだけで[r]実際には子供らしい。[p]
......[p]
それとも、或いは逆なのだろうか。[l][r]幼く見えるだけで実際は...[p]
本人に聞いてみたい気もするが、[r]言えば怒るだろうか。[p]
...やめよう。[r]どちらにしろ怒られる気がする。[p]
#& f.YukiName
「ん...」[p]
#& f.PlayerName
「起きたか。」[p]
#& f.YukiName
「[emb exp="f.PlayerName"]さん...?」[p]
「お早いですね...ふぁ...」[p]
#& f.PlayerName
「さ、食事が終わったら出発だ。」[p]
[_tb_end_text]

[stopbgm  time="1000"  fadeout="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[tb_eval  exp="f.Time=7"  name="Time"  cmd="="  op="t"  val="7"  val_2="undefined"  ]
[tb_ptext_hide  time="1000"  ]
[tb_ptext_show  x="1200"  y="8"  size="30"  color="0xffffff"  time="1"  anim="false"  face="fantasy"  text="&f.Time"  edge="undefined"  shadow="undefined"  ]
[tb_ptext_show  x="1220"  y="4"  size="30"  color="0xffffff"  time="1"  text="時"  face="fantasy"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[jump  storage="scene1.ks"  target="*S1_2_1"  ]
*S1_1_3

[tb_eval  exp="f.YukiHeart-=1"  name="YukiHeart"  cmd="-="  op="t"  val="1"  val_2="undefined"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="flow.mp3"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
...余裕があるとはいえ、時間が惜しい。[p]
[emb exp="f.YukiName"]には悪いが行動を始めるとしよう。[p]
まずは探索だ。[p]
[_tb_end_text]

[jump  storage="scene1.ks"  target="*S1_2_2"  ]
*S1_2_1

[chara_show  name="ユキ_通常"  time="1000"  wait="false"  storage="chara/2/2020-12-21-77.png"  width="427"  height="1027"  left="450"  top="60"  reflect="false"  ]
[playbgm  volume="100"  time="1000"  loop="true"  storage="yoru_no_zattou.mp3"  ]
[tb_start_text mode=1 ]
#& f.PlayerName
食事も済ませて気力も十分。[p]
さて、何処から探索を始めようか。[p]
#& f.YukiName
「それなら、この付近は見て回ったことですし[r]とりあえず上を目指してみませんか？」[p]
[_tb_end_text]

[tb_start_text mode=3 ]
#& f.PlayerName
「そうだな、そうしよう。」[p][r]
まずは上層へと向かうことにした。[p][r]
少しでも手掛かりが見つかればいいが。[p][r]
[_tb_end_text]

[chara_hide  name="ユキ_通常"  time="1000"  wait="true"  pos_mode="true"  ]
[bg  time="1000"  method="crossfade"  storage="黄102.jpg"  ]
[tb_start_text mode=3 ]
#& f.PlayerName
「上層か...まずどうやって行くかだな。」[p][r]
......[l][r]
[_tb_end_text]

[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[playse  volume="100"  time="1000"  buf="0"  storage="革靴で歩く.mp3"  loop="true"  ]
[wait  time="500"  ]
[playse  volume="100"  time="1000"  buf="1"  fadein="false"  loop="true"  storage="革靴で歩く.mp3"  ]
[wait  time="3000"  ]
[stopse  time="1000"  buf="0"  ]
[stopse  time="1000"  buf="1"  ]
[bg  time="1000"  method="crossfade"  storage="黄220.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=3 ]
#& f.PlayerName
探索を続けた所、意外にもすぐに見つかった。[p][r]
扉自体は。[p][r]
#& f.PlayerName
押しても引いてもびくともしない。[r]
鍵穴がある訳でも、仕掛けも見当たらない。[p][r]
壊そうかとも思ったが、道具も力も無しときた。[p][r]
八方塞がりと思ったその時、[p][r]
扉の近くに妙な文章を見つけた。[p][r]
「物語を修復するか、改竄するか。[r]　或いは新たに描き出すか。」[p][r]
「選ぶも、創るも。」[p][r]
「選択は君達の手に。」[p][r]
「物語の終わりに、扉は開く。」[p][r]
「例えそれが、どんな結末だったとしても。」[p][r]
...よく、分からないが。[p][r]
この扉を開けるためのヒントだろうか。[p][r]
だとしたら、どうやって...[p][r]
#& f.YukiName
「う～ん？」[p][r]
#& f.PlayerName
「どうした？[emb exp="f.YukiName"]。」[p][r]
#& f.YukiName
「見て下さい、[emb exp="f.PlayerName"]さん。」[p][r]
「ここにある本、途中のページから何も書いてないんです。」[p][r]
#& f.PlayerName
「ああ、本当だ」[p][r]
差し出された本を見ると、[r]
[emb exp="f.YukiName"]の言う通り途中から真っ新なページが続いていた。[p][r]
「これって...」[r]
先ほどの文章を思い返す。[p][r]
「物語を修復するか、改竄するか。[r]　或いは新たに描き出すか」[p][r]
「物語の終わりに、扉は開く。」[p][r]
「例えそれが、どんな結末だったとしても」[p][r]
だとしたらさっきの文章はコレのことを言っていたのか？[p][r]
この本の続きを書き足したら、扉が開く？[p][r]
自分でも何を言っているのかという[r]
荒唐無稽な話だが...[p][r]
[emb exp="f.YukiName"]に今の文章と[r]
自分の推測を話してみる。[p][r]
#& f.YukiName
「なるほど！やってみましょう！」[p][r]
#& f.PlayerName
「本当に？」[p][r]
自分で言ってみてなんだが、[r]
本当にうまくいくのだろうか...[p][r]
#& f.YukiName
「何事もまず行動！何も無かったら、[r]　それはその時、別の方法を考えましょう？」[p][r]
#& f.PlayerName
「まあ、それもそうか。」[p][r]
確かにそうだ。[p][r]
結果が出なくたって、[r]
やらないよりかずっと良い。[p][r]
とりあえず、やってみるか。[p][r]
[_tb_end_text]

[jump  storage="scene1.ks"  target="*S1_2_1_2"  cond="f.CantRead==1"  ]
*S1_2_1_1

[tb_start_text mode=1 ]
#& f.PlayerName
「ん?」[p]
#& f.YukiName
「どうかしました？」[p]
#& f.PlayerName
「いや...」[p]
「文字が読めない。」[p]
#& f.YukiName
「え？」[p]
「ちょっと見せて下さい。」[p]
「......」[p]
「これなら、私読めますよ？」[p]
#& f.PlayerName
「本当か！」[p]
#& f.YukiName
「ええ。」[p]
「じゃあ、とりあえずは私が読んで翻訳しますから、[r]　[emb exp="f.PlayerName"]さんは空白や消えてるページになったら、どう書くか教えてください。」[p]
「言葉の読み書きも一緒に教えますから。」[p]
「いつまでも読めないままじゃ、[emb exp="f.PlayerName"]さんも困るでしょう？」[p]
#& f.PlayerName
「ごめん...助かるよ。」[p]
[_tb_end_text]

[jump  storage="scene1.ks"  target="*Scene1_END"  ]
*S1_2_1_2

[tb_start_text mode=1 ]
#& f.PlayerName
「あ。」[p]
#& f.YukiName
「どうかしました？」[p]
#& f.PlayerName
「しまった。」[p]
「文字が読めないんだった...」[p]
#& f.YukiName
「え？」[p]
「あ...そうでしたね。」[p]
#& f.YukiName
「じゃあ、とりあえずは私が読んで翻訳しますから、[r]　[emb exp="f.PlayerName"]さんは空白や消えてるページになったら、どう書くか教えてください。」[p]
「言葉の読み書きも一緒に教えますから。」[p]
「いつまでも読めないままじゃ、[emb exp="f.PlayerName"]さんも困るでしょう？」[p]
#& f.PlayerName
「ごめん...助かるよ。」[p]
[_tb_end_text]

[jump  storage="scene1.ks"  target="*Scene1_END"  ]
*S1_2_2

[tb_start_text mode=1 ]
#& f.PlayerName
取り敢えず基点とするこの周辺は見て回ったが、[p]
さて、目指すは...[p]
[_tb_end_text]

[glink  color="white"  storage="scene1.ks"  size="20"  text="下層を目指す"  x="500"  y="200"  width=""  height=""  _clickable_img=""  target="*BE2"  ]
*S1_2_2_1

[s  ]
*BE2

[tb_start_text mode=3 ]
#& f.PlayerName
...下層を目指してみるか。[l][r]
確か、入り口自体は昨日の内に見つけていたはずだ。[p][r]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="黄220.jpg"  ]
[tb_start_text mode=3 ]
#& f.PlayerName
何となく嫌な予感がしたから昨日は探索をやめておいたが...[p][r]
いや、尻込みしている場合でもなし、[r]
行ってみるとしよう。[p][r]
[_tb_end_text]

[stopbgm  time="1000"  fadeout="true"  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[bg  time="1000"  method="crossfade"  storage="白351.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[playbgm  volume="100"  time="1000"  loop="true"  storage="tikakenkyuuzyo.mp3"  ]
[tb_start_text mode=3 ]
#& f.PlayerName
入ってみれば、より薄気味悪い。[p][r]
.........[p][r]
そろそろ、この通路も終わりだろうか。[p][r]
この様子から見て、この先は[r]
大分趣の異なったところに出そうだが...[p][r]
[_tb_end_text]

[bg  time="1000"  method="crossfade"  storage="黄221.jpg"  ]
[tb_start_text mode=3 ]
さて、どんな所に出るやら...[p][r]
........?[p][r]
[_tb_end_text]

[quake  time="300"  count="3"  hmax="10"  wait="true"  ]
[playse  volume="100"  time="1000"  buf="0"  storage="特殊攻撃04.mp3"  ]
[tb_start_text mode=3 ]
「っ！？」[p][r]
何...だ？[p][r]
ドアノブに触れた瞬間、[r]
電流が走ったような感覚に襲われ、[p][r]
意識は、急速に遠のいていった...[p][r]
......一体......何、が...[p][r]
[_tb_end_text]

[tb_start_text mode=3 ]
#
BADEND2　「蛮勇の代償」[p][r]
[_tb_end_text]

[stopbgm  time="1000"  fadeout="true"  ]
[cm  ]
[jump  storage="BADEND2.ks"  target=""  ]
[s  ]
*Scene1_END

[tb_start_text mode=1 ]
#& f.PlayerName
「さて、それじゃあ改めて...」[p]
#& f.PlayerName
「その本、何て題名だ？」[p]
#& f.YukiName
「白雪姫、です！」[p]
「これでやってみましょう！」[p]
#& f.PlayerName
「ああ、じゃあ翻訳よろしく頼む。」[p]
#& f.YukiName
「はい！」[p]
#
[_tb_end_text]

[cm  ]
[chara_hide_all  time="1000"  wait="true"  ]
[tb_eval  exp="f.First_Book=1"  name="First_Book"  cmd="="  op="t"  val="1"  val_2="undefined"  ]
[jump  storage="BookChoice1.ks"  target=""  ]
[s  ]
