[_tb_system_call storage=system/_SisterMemory1.ks]

*SM1_Start

[tb_replay_start  ]
[mask  time="1000"  effect="fadeIn"  color="0x000000"  ]
[chara_hide_all  time="1000"  wait="true"  ]
[cm  ]
[tb_show_message_window  ]
[bg  time="1000"  method="crossfade"  storage="白49.jpg"  ]
[mask_off  time="1000"  effect="fadeOut"  ]
[tb_start_text mode=1 ]
ある女性の記憶[p]
#女性
「さあさあ、こっちだよ。」[p]
「今日から、ここが私の...私たちの家です！」[p]
#男の子
「わあ...」[p]
ここまでは、予定通りだ。[p]
#女性
「まずは食事にしましょう。」[p]
「お腹、空いてるでしょ？」[p]
男の子は一瞬、キョトンとしてこちらを見ていた。[p]
その後、お腹がぐうとなり、男の子はようやく気付いたらしい。[p]
[_tb_end_text]

[jump  storage="SisterMemory1.ks"  target="*SM1_2"  ]
*SM1_1

[tb_start_text mode=1 ]
#女性
マジか。[p]
この兄は全く、本当に...[p]
妹のこととなると自分の身体さえ限度無くなるとか、[r]シスコンもいい加減にして下さい。[p]
...まあ、私が言えた義理ではないですけど。[p]
[_tb_end_text]

*SM1_2

[tb_start_text mode=1 ]
#女性
「...ふう」[p]
「まずは自分の体を大事にしないとね？」　[p]
「その子は一旦私が預かるよ。」[p]
[_tb_end_text]

[jump  storage="SisterMemory1.ks"  target="*SM2_2"  ]
*SM2_1

[tb_start_text mode=1 ]
#女性
これは...酷い。[p]
この世界で、私は助からなかった。[p]
兄は必死に守ろうとしたが、その手は届かなかった。[p]
守れたのは自分のみ。[r]	この兄にとって、それは如何に無念だっただろう。[p]
私には、誰よりそれが分かる。[r]だからこそ、私はこの子を守らなければならない。[p]
そして、辿り着かなければならない。[p]
[_tb_end_text]

*SM2_2

[tb_start_text mode=1 ]
#女性
「ふう、食べた食べた！」[p]
「さて、じゃあ早速、私の秘密兵器をお見せしましょう！」[p]
「これが秘密兵器、その名も「FORTUNE」！」[p]
「君にも機能を追々教えてあげるから、一緒に頑張ろうね！」[p]
そう、これが私たちの長い旅の始まり。[p]
[_tb_end_text]

[jump  storage="SisterMemory1.ks"  target="*SM1_END"  ]
*SM3_1

[tb_start_text mode=1 ]
#女性
ブラコンとシスコンがイチャイチャやってるだけじゃん、なんて[r]言わないで下さいね？[p]
[_tb_end_text]

*SM1_END

[tb_replay  id=""  ]
[jump  storage="title_screen.ks"  target=""  ]
[s  ]
