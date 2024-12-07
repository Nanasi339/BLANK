[_tb_system_call storage=system/_title_screen.ks]

[hidemenubutton]

[tb_clear_images]

[tb_keyconfig  flag="0"  ]
[stopbgm  time="1000"  ]
[tb_hide_message_window  ]
[jump  storage="title_screen.ks"  target="*title_TRIALEND"  cond="sf.TSMode==101"  ]
[jump  storage="title_screen.ks"  target="*title_1"  cond="sf.TSMode==1"  ]
*title_0

[bg  storage="本屋1.jpg"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="anata_wo_siritakute-Narr.mp3"  ]
[jump  storage="title_screen.ks"  target="*title"  ]
*title_1

[bg  storage="赤192.jpg"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="yoru_no_zattou.mp3"  ]
[jump  storage="title_screen.ks"  target="*title"  ]
*title_TRIALEND

[bg  storage="l01.png"  ]
[playbgm  volume="60"  time="1000"  loop="true"  storage="星降る空.mp3"  ]
[jump  storage="title_screen.ks"  target="*title"  ]
*title

[tb_image_show  time="1000"  storage="default/BOOKSCASTLE_A.gif"  width="800"  height="450"  x="509"  y="-26"  _clickable_img=""  name="img_19"  ]
[glink  color="black"  text="New&nbsp;Game"  x="1000"  y="400"  size="20"  target="*start"  width=""  height=""  _clickable_img=""  ]
[glink  color="black"  text="Load&nbsp;Game"  x="1000"  y="500"  size="20"  target="*load"  ]
[jump  storage="title_screen.ks"  target="*CLOSE"  cond="sf.MemoryOpen!=1"  ]
[glink  color="black"  storage="title_screen.ks"  size="20"  x="285"  y="370"  width=""  height=""  text="Continue"  _clickable_img=""  target="*Continue"  ]
[glink  color="black"  storage="memorys.ks"  size="20"  target=""  x="285"  y="469"  width=""  height=""  text="Memorys"  _clickable_img=""  ]
*CLOSE

[s  ]
[jump  storage="title_screen.ks"  target=""  ]
[s  ]
*start

[tb_image_hide  time="1000"  ]
[showmenubutton]

[cm  ]
[tb_keyconfig  flag="1"  ]
[jump  storage="prologue.ks"  target=""  ]
[s  ]
*load

[tb_image_hide  time="1000"  ]
[cm  ]
[showload]

[jump  target="*title"  storage=""  ]
[s  ]
*Continue

[tb_autoload  ]
[s  ]
