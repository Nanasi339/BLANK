;(() => {
  const that = TYRANO

  // ウェイト状態にする
  // セーブ不可になる
  const wait = () => {
    that.kag.stat.is_wait = true
  }

  // ウェイト状態を解く
  const unwait = () => {
    that.kag.stat.is_wait = false
  }

  // 効果音を再生する
  const playse = (storage) => {
    // 効果音ソースが"data/sound/"から始まっている場合
    // それをそのまま[playse]に渡すと参照に失敗するので削除しておく
    if (storage.startsWith('data/sound/')) {
      storage = storage.replace('data/sound/', '')
    }
    that.kag.ftag.startTag('playse', {
      storage: storage,
    })
  }

  if (!$.convertFontWeight) {
    $.convertFontWeight = (value) => {
      value = value.trim()
      if (value === 'true') return 'bold'
      if (value === 'false') return 'normal'
      return value
    }
  }

  if (!$.parseStorage) {
    const data_folder_names = [
      'scenario',
      'image',
      'fgimage',
      'bgimage',
      'video',
      'sound',
      'bgm',
      'others',
    ]
    $.parseStorage = function (storage, folder = '') {
      if (!storage) return ''
      if ($.isHTTP(storage)) {
        return storage
      }
      if (folder && data_folder_names.includes(folder.split('/').shift())) {
        folder = `data/${folder}`
      }
      let full_path = `/${folder}/${storage}`
      full_path = full_path.replace(/\/\.?\/+/g, '/')
      const path_hash = []
      full_path.split('/').forEach((item) => {
        if (item === '' || item === '.') {
          return
        }
        if (item === '..') {
          path_hash.pop()
          return
        }
        path_hash.push(item)
      })
      full_path = './' + path_hash.join('/')
      return full_path
    }
  }

  if (!that.kag.weaklyStop) {
    that.kag.weaklyStop = () => {
      that.kag.stat.is_stop = true
    }
    that.kag.cancelWeakStop = () => {
      that.kag.stat.is_stop = false
    }
    that.kag.stronglyStop = () => {
      that.kag.stat.is_strong_stop = true
    }
    that.kag.cancelStrongStop = () => {
      that.kag.stat.is_strong_stop = false
    }
  }

  // 画像要素を作成する関数
  function create_image(folder, storage) {
    const src = create_image_src(folder, storage)
    let j_img = $('<img />')
    if ($.getExt(storage) === 'svg' || $.getExt(storage) === 'SVG') {
      j_img = $("<object type='image/svg+xml' />")
      j_img.attr('data', src)
    }
    j_img.attr('src', src)
    return j_img
  }

  // 画像のソースを取得する関数
  function create_image_src(folder, storage) {
    let src
    if ($.isHTTP(storage)) {
      src = storage
    } else {
      src = './data/' + folder + '/' + storage
    }
    return src
  }

  // 画像のオリジナルサイズを取得する関数
  async function get_image_size(url) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.onerror = reject
        img.src = URL.createObjectURL(blob)
      })
    } catch (error) {
      console.error('Error fetching image:', error)
      throw error
    }
  }

  // =======================================
  // #[qte_ptext]
  // =======================================

  that.kag.ftag.master_tag['qte_ptext'] = {
    pm: {},
    start(pm) {
      pm.layer = '1'
      pm.page = 'fore'
      pm.name = 'qte_ptext'
      const j_layer = that.kag.layer.getLayer(pm.layer, pm.page)
      if (j_layer.css('display') === 'none') {
        j_layer.css('display', '')
        j_layer.attr('l_visible', 'true')
      }
      that.kag.ftag.startTag('ptext', pm)
    },
  }

  // =======================================
  // #[qte_tap_clear] タップボタンをクリアする
  // =======================================

  that.kag.ftag.master_tag['qte_tap_clear'] = {
    pm: {
      time: 0,
    },
    start(pm) {
      const time = parseInt(pm.time) || 0
      if (time) {
        const j_target = $('.qte-tap')
        j_target.each((i, elm) => {
          elm.tapped = true
          if (elm.anim_fadeout) {
            elm.anim_fadeout.pause()
          }
          const computed_style = window.getComputedStyle(elm)
          const current_style = {
            opacity: computed_style.getPropertyValue('opacity'),
          }
          elm.animate([current_style, { opacity: '0' }], {
            duration: time,
            easing: 'linear',
            fill: 'forwards',
          })
        })
        setTimeout(() => {
          j_target.remove()
          that.kag.ftag.nextOrder()
        }, time)
      } else {
        $('.qte-tap').remove()
        that.kag.ftag.nextOrder()
      }
    },
  }

  // =======================================
  // #[qte_tap] 指定領域をタップしてもらう
  // =======================================

  that.kag.ftag.master_tag['qte_tap'] = {
    //
    // パラメータ
    //

    pm: {
      // 横位置、縦位置、サイズ
      x: '',
      y: '',
      left: '',
      top: '',
      width: '100',

      // 出現領域を設定できる
      area_left: '',
      area_top: '',
      area_width: '',
      area_height: '',

      // 残り時間を示す円
      circle: 'true',
      circle_width: '2',
      circle_color: 'white',

      // 文字
      text: 'TAP!',
      text_color: 'white',
      text_size: '30',
      text_bold: 'true',
      text_face: '',

      // 文字の代わりに画像を使うことができる
      folder: 'image',
      graphic: '',

      // 表示中のアニメーション
      zoom: 'true',
      fadein: '100',
      fadeout: '100',

      // タップしたときのアニメーション
      tap_zoom: 'true',
      tap_fadeout: 'true',

      // タップしたときの効果音
      tap_se: '',

      // 時間切れに関する設定
      time: 1000,
      timeout_exp: '',
      timeout_storage: '',
      timeout_target: '',

      // [wait]をついでに発生させる
      waittime: '',

      // タップに成功したときの設定
      tap_exp: '',
      tap_storage: '',
      tap_target: '',

      // 連打回数
      mash_count: '1',
    },

    //
    // 処理
    //

    async start(pm) {
      wait()

      //
      // サイズを決定する
      //

      // 画像を使うか
      const use_image = Boolean(pm.graphic)

      // 横幅と高さがどちらも指定されているわけではなく、かつ、画像を使う場合
      // 画像のオリジナルサイズを確認する
      if (!(pm.width && pm.height)) {
        if (use_image) {
          const src = create_image_src(pm.folder, pm.graphic)
          try {
            const image_size = await get_image_size(src)
            if (pm.width && !pm.height) {
              // 横幅だけが指定されている場合
              // 高さは自動で決定してあげる
              pm.height = parseInt((parseFloat(pm.width) * image_size.height) / image_size.width)
            } else if (!pm.width && pm.height) {
              // 高さだけが指定されている場合
              // 横幅は自動で決定してあげる
              pm.width = parseInt((parseFloat(pm.height) * image_size.width) / image_size.height)
            } else if (!pm.width && !pm.height) {
              // 横幅も高さも指定されていない場合
              // 画像サイズをそのまま使用する
              pm.width = image_size.width
              pm.height = image_size.height
            }
          } catch (error) {
            console.error('Error:', error)
          }
        }
      }

      // サイズの最終確認
      if (pm.width && !pm.height) {
        // 横幅だけが指定されている場合
        // 高さは横幅を流用する
        pm.height = pm.width
      } else if (!pm.width && pm.height) {
        // 高さだけが指定されている場合
        // 横幅は高さを流用する
        pm.width = pm.height
      } else if (!pm.width && !pm.height) {
        // 横幅も高さも指定されていない場合
        // 100x100にする
        pm.width = 100
        pm.height = 100
      }

      // サイズを決定する
      const width = parseFloat(pm.width)
      const height = parseFloat(pm.height)

      //
      // 位置を決定する
      //

      let left, top

      // x, yが指定されている場合はそれをleft, topに流用する
      // ティラノビルダーの領域指定ツールを想定
      if (pm.x) pm.left = pm.x
      if (pm.y) pm.top = pm.y

      if (pm.left && pm.top && pm.random_position !== 'true') {
        // 横位置と縦位置がどちらも指定されている場合はそれを採用する
        if (pm.x && pm.y) {
          // ティラノビルダーの領域指定ツールが使われている場合
          left = parseFloat(pm.left)
          top = parseFloat(pm.top)
        } else {
          left = parseFloat(pm.left) - width / 2
          top = parseFloat(pm.top) - height / 2
        }
      } else {
        // 横位置と縦位置の少なくともどちらか一方が指定されていない場合は
        // 出現領域からランダムで決定する

        // まず出現領域を求める
        const sc_width = parseInt(that.kag.config.scWidth)
        const sc_height = parseInt(that.kag.config.scHeight)
        const pop_area_width = (parseInt(pm.area_width) || sc_width) - width
        const pop_area_height = (parseInt(pm.area_height) || sc_height) - height
        const pop_area_left = parseInt(pm.area_left) || 0
        const pop_area_top = parseInt(pm.area_top) || 0

        // 乱数を生成して出現領域からランダムに位置を決定
        const r1 = Math.random()
        const r2 = Math.random()
        left = parseInt(pop_area_left + pop_area_width * r1)
        top = parseInt(pop_area_top + pop_area_height * r2)
      }

      //
      // 変数
      //

      // 制限時間(ミリ秒)
      const qte_time = parseInt(pm.time)

      // 時間切れ処理用のsetTimeoutの戻り値
      let timer_id

      // Animationを格納する
      let anim_zoom
      let anim_fadeout

      //
      // DOM要素を作成していく
      //

      // 全体を格納するコンテナ
      const j_tap_container = $('<div>')
        .addClass('temp-element qte-plugin-item qte-tap')
        .css({
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        })
      const tap_container = j_tap_container.get(0)

      // タップしたかどうか
      tap_container.tapped = false

      const j_tap_container_2 = $('<div>').addClass('qte-tap-inner').appendTo(j_tap_container)

      // タップ部分
      let j_tap_event
      if (use_image) {
        // 画像を使用する場合
        j_tap_event = create_image(pm.folder, pm.graphic)
          .addClass('qte-tap-image')
          .css({
            width: `${width}px`,
            height: `${height}px`,
          })
      } else {
        // 文字を使用する場合
        j_tap_event = $(`<div><p>${pm.text}</p></div>`)
          .addClass('qte-tap-text')
          .css({
            'width': `${width}px`,
            'height': `${height}px`,
            'color': $.convertColor(pm.text_color),
            'font-weight': pm.text_bold === 'true' ? 'bold' : 'normal',
            'font-size': `${pm.text_size}px`,
            'font-family': pm.text_face || that.kag.stat.font.face,
          })
      }
      j_tap_container_2.append(j_tap_event)

      // 残り時間を示すサークル
      if (!use_image && pm.circle === 'true') {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.rotate(-Math.PI / 2)
        ctx.translate(-canvas.height, 0)
        const j_canvas = $(canvas).css({
          width: `${width}px`,
          height: `${height}px`,
          visibility: pm.circle === 'true' ? 'visible' : 'hidden',
        })
        j_tap_container_2.append(j_canvas)

        // サークル描画更新処理
        let start_time = null
        const update = (timestamp) => {
          // タップされたならなにもしない
          if (tap_container.tapped) {
            return
          }
          if (!start_time) {
            start_time = timestamp
          }
          const total_time = timestamp - start_time
          if (total_time < qte_time) {
            const ratio = 1 - total_time / qte_time
            arc(
              ctx,
              width,
              height,
              ratio,
              $.convertColor(pm.circle_color),
              parseInt(pm.circle_width),
            )
            requestAnimationFrame(update)
          }
        }
        requestAnimationFrame(update)
      }

      //
      // タップに成功したときの処理
      //

      let tap_count = 0
      const tap_count_target = parseInt(pm.mash_count) || 1
      const start_time = new Date().getTime()
      const handler_tap = (e) => {
        // すでにタップ済みならなにもしない
        if (tap_container.tapped) {
          return
        }

        // タップ回数を増やす
        tap_count += 1

        // 目標回数に達しているかどうかで場合分け
        if (tap_count < tap_count_target) {
          // 目標回数に達していない
          j_tap_container_2.removeClass('qte-tap-anim')
          j_tap_container_2.get(0).offsetWidth
          j_tap_container_2.addClass('qte-tap-anim')
        } else {
          // 目標回数に達した

          // タップフラグを立てる
          tap_container.tapped = true

          // 時間切れの処理予約を解除
          clearTimeout(timer_id)

          // タップした位置の中心からのズレを取得する（0～√2）
          let tap_x
          let tap_y
          const tap_rect = j_tap_container.get(0).getBoundingClientRect()
          const tap_elm_page_x = tap_rect.x + window.pageXOffset
          const tap_elm_page_y = tap_rect.y + window.pageYOffset
          if (e.type === 'touchstart') {
            const touch = e.touches[0]
            tap_x = parseInt(touch.pageX - tap_elm_page_x)
            tap_y = parseInt(touch.pageY - tap_elm_page_y)
          } else {
            tap_x = parseInt(e.pageX - tap_elm_page_x)
            tap_y = parseInt(e.pageY - tap_elm_page_y)
          }
          const radius = tap_rect.width / 2
          tap_x = tap_x - radius
          tap_y = tap_y - radius
          const distance = Math.sqrt(tap_x * tap_x + tap_y * tap_y)
          const tap_offset = distance / radius
          that.kag.variable.tf.tap_offset_px = distance
          that.kag.variable.tf.tap_offset_ratio = tap_offset

          // 表示からタップ完了までにかかった時間をミリ秒で測定する
          const tap_time = new Date().getTime()
          const elapsed_time = tap_time - start_time
          that.kag.variable.tf.tap_time = elapsed_time
          // console.error({elapsed_time, tap_offset})

          // 効果音の再生
          if (pm.tap_se) {
            playse(pm.tap_se)
          }

          // アニメーションを止める
          if (anim_zoom) anim_zoom.pause()
          if (anim_fadeout) anim_fadeout.pause()

          // タップ時アニメーションを開始する
          if (pm.tap_fadeout === 'true' || pm.tap_zoom === 'true') {
            // 現在のtransform, opacityプロパティの値を読み取っておく
            const computed_style = window.getComputedStyle(j_tap_container.get(0))
            const current_style = {
              transform: computed_style.getPropertyValue('transform'),
              opacity: computed_style.getPropertyValue('opacity'),
            }
            const target_style = {}
            if (pm.tap_zoom === 'true') {
              target_style['transform'] = 'scale(1.3)'
            }
            if (pm.tap_fadeout === 'true') {
              target_style['opacity'] = '0'
            }
            const anim = j_tap_container.get(0).animate([current_style, target_style], {
              duration: 80,
              easing: 'linear',
              fill: 'forwards',
            })

            // アニメーションを完了したら要素を削除する
            anim.onfinish = () => {
              j_tap_container.remove()
            }
          }

          // JS式を実行する
          if (pm.tap_exp) {
            that.kag.evalScript(pm.tap_exp)
          }

          // シナリオジャンプ
          if (pm.tap_storage || pm.tap_target) {
            // [wait]の解除
            clearTimeout(that.kag.tmp.wait_id)
            unwait()
            that.kag.ftag.startTag('jump', {
              storage: pm.tap_storage,
              target: pm.tap_target,
            })
          } else if (pm.tap_next === 'true') {
            clearTimeout(that.kag.tmp.wait_id)
            unwait()
            that.kag.cancelStrongStop()
            that.kag.cancelWeakStop()
            that.kag.ftag.nextOrder()
          }
        }
      }

      // タッチイベントとマウスダウンイベントにハンドラを仕込む
      j_tap_event.on('touchstart', handler_tap)
      j_tap_event.on('mousedown', handler_tap)

      //
      // 時間切れの処理
      //

      const timeout = () => {
        // タップ済みなら何もしない
        if (tap_container.tapped) {
          return
        }

        // 要素の削除
        j_tap_container.remove()

        // JS式を実行する
        if (pm.timeout_exp) {
          that.kag.evalScript(pm.timeout_exp)
        }

        // シナリオジャンプ
        if (pm.timeout_storage || pm.timeout_target) {
          // [wait]の解除
          clearTimeout(that.kag.tmp.wait_id)
          unwait()

          that.kag.ftag.startTag('jump', {
            storage: pm.timeout_storage,
            target: pm.timeout_target,
          })
        }
      }

      // 時間切れの処理を予約
      timer_id = setTimeout(timeout, qte_time)

      //
      // 登場アニメーション
      //

      const anim_time_entrance = parseInt(pm.fadein)
      const anim_time_exit = parseInt(pm.fadeout)
      const anim_time_move = qte_time

      if (pm.zoom === 'true') {
        anim_zoom = j_tap_container
          .get(0)
          .animate([{ transform: 'scale(1.00)' }, { transform: 'scale(1.15)' }], {
            duration: anim_time_move,
            easing: 'linear',
            fill: 'forwards',
          })
      }

      anim_fadeout = j_tap_container.get(0).animate(
        [
          { offset: 0, opacity: '0' },
          { offset: anim_time_entrance / qte_time, opacity: '1' },
          { offset: 1 - anim_time_exit / qte_time, opacity: '1' },
          { offset: 1, opacity: '0' },
        ],
        {
          duration: qte_time,
          easing: 'linear',
          fill: 'forwards',
        },
      )
      j_tap_container.get(0).anim_fadeout = anim_fadeout

      //
      // DOM要素を追加
      //

      const j_layer = $('#tyrano_base')
      j_layer.append(j_tap_container)
      j_tap_container.on('remove', () => {
        tap_container.tapped = true
      })

      //
      // 次のタグに進む
      //

      if (!pm.waittime || parseInt(pm.waittime) === 0) {
        // waittimeパラメータが設定されていなければ次のタグを読む
        that.kag.ftag.nextOrder()
      } else {
        // waittimeパラメータが設定されている場合は[wait]発生
        that.kag.ftag.startTag('wait', {
          time: pm.waittime,
        })
      }
    },
  }

  //
  // サークルを描く関数
  //

  function arc(ctx, width, height, angle_ratio, color, line_width) {
    const x = width / 2
    const y = height / 2
    const radius = width / 2 - line_width / 2
    const start_angle = (1 - angle_ratio) * (2 * Math.PI) // 開始角度（ラジアン）
    const end_angle = 1 * (2 * Math.PI) // 終了角度（ラジアン）
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = color
    ctx.lineWidth = line_width
    ctx.beginPath()
    ctx.arc(x, y, radius, start_angle, end_angle)
    ctx.stroke()
  }

  // =======================================
  // #[qte_command] キー入力してもらう
  // =======================================

  that.kag.ftag.master_tag['qte_command'] = {
    // パラメータ
    pm: {
      command: '',
      time: '',
      time_ptext: '',
      time_format: 'ss.SS',
      time_msec_size: '80',

      life: '-1',
      case_sensitive: 'false',

      // 効果音
      success_se: '',
      failure_se: '',

      success_exp: '',
      success_storage: '',
      success_target: '',

      failure_exp: '',
      failure_storage: '',
      failure_target: '',

      timeout_exp: '',
      timeout_storage: '',
      timeout_target: '',

      layer: '1',
      page: 'fore',

      // デザイン
      text_color: 'white',
      text_size: '40',
      text_bold: 'false',
      text_face: '',
      button: 'black',
      border_color: '',
      border_size: '',
      shadow_color: '',
      margin: '10',
      radius: '',
      bg_color: '',
      active_button: '',
      active_text_color: '',
      active_bg_color: '',
      behind_opacity: '80',

      // 自動で削除
      auto_clear: 'false',
    },

    // 処理
    start(pm) {
      wait()
      let finished = false

      // ======================
      // コマンドの処理
      // ======================

      // コマンド文字列を配列化したい
      // 例: ["a", "s", "d", "f"]
      let command_char_arr
      if (typeof pm.command === 'string') {
        command_char_arr = pm.command.split('')
      } else if (Array.isArray(pm.command)) {
        command_char_arr = pm.command
      }

      // いま何番目のコマンドを入力すべきか（0-based）
      let current_command_index = 0

      // ======================
      // DOM要素の作成
      // ======================

      // レイヤーを取得してそこに入れる
      const j_layer = that.kag.layer.getLayer(pm.layer, pm.page)

      // レイヤーが非表示であれば自動で表示してあげる
      if (j_layer.css('display') === 'none') {
        j_layer.css('display', '')
        j_layer.attr('l_visible', 'true')
      }

      const j_command_container = $(`<div>`)
        .addClass('qte_command qte-plugin-item qte-command')
        .css({
          width: '100%',
          height: '100%',
        })

      j_layer.append(j_command_container)

      const j_command_arr = []
      command_char_arr.forEach((char) => {
        const width = 100
        const height = 100
        // ゲージの枠線部分
        const j_command = $(`<div><p>${char}</p></div>`)
          .addClass('qte-command-char qte_command_key ahead')
          .css({
            width: `${width}px`,
            height: `${height}px`,
          })
        const css = {}
        if (pm.text_color) css['color'] = $.convertColor(pm.text_color)
        if (pm.text_size) css['font-size'] = pm.text_size + 'px'
        if (pm.text_bold) css['font-weight'] = $.convertFontWeight(pm.text_bold)
        if (pm.text_face) css['font-family'] = pm.text_face
        if (pm.bg_color) css['background-color'] = $.convertColor(pm.bg_color)
        if (pm.radius) css['border-radius'] = pm.radius + 'px'
        if (pm.border_color) css['border-color'] = $.convertColor(pm.border_color)
        if (pm.border_size) css['border-width'] = `${pm.border_size}px`
        if (pm.shadow_color)
          css['filter'] = `drop-shadow(0px 0px 5px ${$.convertColor(pm.shadow_color)})`
        if (pm.margin) css['margin'] = pm.margin + 'px'
        j_command.addClass(pm.button)
        j_command.css(css)
        j_command_container.append(j_command)
        j_command_arr.push(j_command)
      })

      // 先頭の要素をアクティブに
      const css_active = {}
      const class_active = `active ${pm.active_button}`
      if (pm.active_text_color) css_active['color'] = $.convertColor(pm.active_text_color)
      if (pm.active_bg_color) css_active['background-color'] = $.convertColor(pm.active_bg_color)
      j_command_arr[current_command_index]
        .removeClass('ahead')
        .addClass(class_active)
        .css(css_active)

      // ======================
      // イベントの処理
      // ======================

      let timer_id
      let life = pm.life ? parseInt(pm.life) : -1

      //
      // イベントを脱出するときの汎用処理
      //

      const exit = () => {
        unwait()
        finished = true
        clearTimeout(timer_id)
        if (pm.auto_clear === 'true') {
          j_command_container.remove()
        }
        $('body').off('keydown.qte_command')
        $('.qte-virturl-key').remove()
      }

      //
      // コマンド入力に成功したとき
      //

      const success = () => {
        exit()

        // JS式を実行する
        if (pm.success_exp) {
          that.kag.evalScript(pm.success_exp)
        }

        // ジャンプ
        if (pm.success_storage || pm.success_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.success_storage,
            target: pm.success_target,
          })
        }
      }

      //
      // コマンド入力に失敗したとき
      //

      const failure = () => {
        exit()

        // JS式を実行する
        if (pm.failure_exp) {
          that.kag.evalScript(pm.failure_exp)
        }

        // ジャンプ
        if (pm.failure_storage || pm.failure_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.failure_storage,
            target: pm.failure_target,
          })
        }
      }

      // 時間切れになったとき
      const timeout = () => {
        exit()

        const j_time = pm.time_ptext ? $('.' + pm.time_ptext) : $('.qte_ptext') || null
        const remaining_time_str = formatTime(0, pm.time_format, pm.time_msec_size)
        if (j_time) {
          j_time.html(remaining_time_str)
        }

        // JS式を実行する
        if (pm.timeout_exp) {
          that.kag.evalScript(pm.timeout_exp)
        }

        // ジャンプ
        if (pm.timeout_storage || pm.timeout_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.timeout_storage,
            target: pm.timeout_target,
          })
        }
      }

      // ======================
      // 入力受付処理
      // ======================

      const handler_input = (e) => {
        let current_requested_command_str = command_char_arr[current_command_index]
          .replace('←', 'ArrowLeft')
          .replace('→', 'ArrowRight')
          .replace('↑', 'ArrowUp')
          .replace('↓', 'ArrowDown')
        let key = e.key
        if (pm.case_sensitive === 'false') {
          key = key.toLowerCase()
          current_requested_command_str = current_requested_command_str.toLowerCase()
        }
        const class_behind = `behind ${pm.behind_button}`
        const class_active = `active ${pm.active_button}`
        if (current_requested_command_str === key) {
          //
          // コマンドの入力に1個成功した場合
          //

          // いまの表示キーのデザインを変更する
          // behindクラスを付与する処理など
          const css_behind = {}
          if (pm.text_color) css_behind['color'] = $.convertColor(pm.text_color)
          if (pm.bg_color) css_behind['background-color'] = $.convertColor(pm.bg_color)
          if (pm.behind_opacity) css_behind['opacity'] = $.convertOpacity(pm.behind_opacity)

          const j_success = j_command_arr[current_command_index]
          j_success.removeClass(class_active).addClass(class_behind).css(css_behind)

          if (pm.success_se) {
            // 効果音を鳴らす
            playse(pm.success_se)
          }

          current_command_index++

          if (current_command_index < command_char_arr.length) {
            //
            // まだ入力すべきコマンドがある
            //

            // 次の表示のデザインを変更する
            // activeクラスを付与する処理など
            const css_active = {}
            if (pm.active_text_color) css_active['color'] = $.convertColor(pm.active_text_color)
            if (pm.active_bg_color)
              css_active['background-color'] = $.convertColor(pm.active_bg_color)

            const j_next = j_command_arr[current_command_index]
            j_next.removeClass('ahead').addClass(class_active).css(css_active)

            // アニメーション付与 [mtext]
            // j_next.addClass('fadeInRightBig')
            // j_next.css('animation-duration', '1s')

            // アニメーション付与 [kanim]
            // const anim = $.extend({}, that.kag.stat.map_keyframe['hogehoge'])
            // const this_anim = $.extend(true, {}, anim)
            // this_anim.config = {
            //   duration: '1s',
            //   delay: '0s',
            // }
            // j_next.a3d(this_anim)

            // アニメーション付与 [kanim] -> Web Animation
            // j_success.animateWithTyranoKeyframes({
            //   keyframe: 'hogehoge',
            //   time: 1000,
            //   easing: 'ease',
            //   delay: '0',
            //   count: '1',
            //   mode: '',
            // })
          } else {
            // すべてのコマンドの入力に成功した！
            success()
          }
        } else {
          //
          // コマンド入力に失敗した場合
          //

          // 効果音を鳴らす
          if (pm.failure_se) {
            playse(pm.failure_se)
          }

          // ライフ処理
          if (life <= -1) {
            // ライフ制限がない場合はなにもしない
          } else {
            // ライフ制限がある場合はライフを減らす
            // 0未満になったら終了
            life--
            if (life < 0) {
              failure()
            }
          }
        }
      }
      $('body').on('keydown.qte_command', handler_input)

      // ======================
      // 時間切れの実装
      // ======================

      if (pm.time && parseInt(pm.time) > 0) {
        // 制限時間（ミリ秒）
        const time_limit = parseInt(pm.time)

        // 制限時間を表す[ptext]
        const j_time = pm.time_ptext ? $('.' + pm.time_ptext) : $('.qte_ptext') || null

        // 残り時間を計算して[ptext]に表示する
        let start_time = null
        const update = (timestamp) => {
          if (finished) {
            return
          }
          if (!start_time) {
            start_time = timestamp
          }
          const total_time = timestamp - start_time
          const remaining_time = time_limit - total_time
          const remaining_time_str = formatTime(remaining_time, pm.time_format, pm.time_msec_size)
          if (j_time) {
            j_time.html(remaining_time_str)
          }
          if (total_time < time_limit) {
            requestAnimationFrame(update)
          }
        }
        requestAnimationFrame(update)

        // 時間切れ処理の予約
        timer_id = setTimeout(timeout, time_limit)
      }

      // 要素が外的要因で削除された場合

      j_command_container.on('remove', () => {
        clearTimeout(timer_id)
        $('body').off('keydown.qte_command')
      })

      that.kag.ftag.nextOrder()
    },
  }

  // =======================================
  // #[qte_virtual_key] ソフトウェアキーボードを表示する
  // =======================================

  that.kag.ftag.master_tag['qte_virtual_key'] = {
    // パラメータ
    pm: {
      left: '0',
      top: '0',
      event_target: 'body',
      key: '←',
      width: '40',
      height: '',
      radius: '',
      text_color: '',
      text_size: '20',
      bg_color: '',
      border_color: '',
      button: '',
    },

    // 処理
    start(pm) {
      // キーに表示するテキスト 基本的にはkeyの流用でよい
      const text = pm.text || pm.key
      const width = pm.width
      const height = pm.height || pm.width

      // 要素作成
      const j_key = $(`<div>`)
        .text(text)
        .addClass('qte-plugin-item qte-virturl-key')
        .css({
          'left': `${pm.left}px`,
          'top': `${pm.top}px`,
          'width': `${width}px`,
          'height': `${height}px`,
          'z-index': '99999999',
          'font-family': that.kag.stat.font.face,
        })

      // [glink]のボタンデザインを流用できる
      if (pm.button) j_key.addClass(pm.button)

      // CSSのカスタマイズ
      const css = {}
      if (pm.text_color) css['color'] = $.convertColor(pm.text_color)
      if (pm.text_size) css['font-size'] = pm.text_size + 'px'
      if (pm.text_bold) css['font-weight'] = $.convertFontWeight(pm.text_bold)
      if (pm.text_face) css['font-family'] = pm.text_face
      if (pm.bg_color) css['background-color'] = $.convertColor(pm.bg_color)
      if (pm.radius) css['border-radius'] = pm.radius + 'px'
      j_key.css(css)

      // fixレイヤに追加
      $('#tyrano_base').append(j_key)

      that.kag.event.addEventElement({
        tag: 'qte_virtual_key',
        j_target: j_key,
        pm,
      })
      this.setEvent(j_key, pm)

      that.kag.ftag.nextOrder()
    },

    setEvent(j_key, pm) {
      // 矢印キーなど一部のキー名はわかりやすく記号で指定できるようにしておき
      // 内部で置換してやる
      const replace_map = {
        '→': 'ArrowRight',
        '←': 'ArrowLeft',
        '↑': 'ArrowUp',
        '↓': 'ArrowDown',
        'Space': ' ',
      }
      const key = replace_map[pm.key] || pm.key

      // タップ（マウスダウン）イベントハンドラ
      const handler_tap = () => {
        const event = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
          shiftKey: false,
          altKey: false,
          ctrlKey: false,
        })
        const event_element = $(pm.event_target).get(0)
        if (event_element) event_element.dispatchEvent(event)
      }
      j_key.on('mousedown', handler_tap)
      j_key.on('touchstart', handler_tap)
    },
  }

  /**
   * ミリ秒を時・分・秒・ミリ秒に切り刻んでオブジェクトで返す関数
   * @param {number} time
   * @returns {Object}
   */
  function getTimeMap(time) {
    time = Math.max(0, time)
    const ms = Math.floor(time % 1000)
    const s = Math.floor((time / 1000) % 60)
    const m = Math.floor((time / (1000 * 60)) % 60)
    const h = Math.floor(time / (1000 * 60 * 60))
    return { ms, s, m, h }
  }

  /**
   * ミリ秒を"h:mm:ss.SS"などのフォーマットで整形する
   * @param {number} time - 時刻を表す数値（ミリ秒）
   * @param {string} format - フォーマットを表す文字列
   * @returns {string} - 整形された時刻の文字列
   */
  function formatTime(time, format, msec_size = 100) {
    const time_map = getTimeMap(time)

    format = format.replace(/h+/g, (match) => {
      return time_map.h.toString().padStart(match.length, '0')
    })

    format = format.replace(/m+/g, (match) => {
      return time_map.m.toString().padStart(match.length, '0')
    })

    format = format.replace(/s+/g, (match) => {
      return time_map.s.toString().padStart(match.length, '0')
    })

    const ms = time_map.ms.toString().padStart(3, '0')
    format = format.replace(/S+/g, (match) => {
      return (
        `<span class="msec" style="font-size: ${msec_size}%;">` +
        ms.substring(0, match.length) +
        '</span>'
      )
    })

    return format
  }

  // =======================================
  // #[qte_gauge] 動くゲージをタイミングよく止めてもらう
  // =======================================

  that.kag.ftag.master_tag['qte_gauge'] = {
    // パラメータ
    pm: {
      layer: '1',
      page: 'fore',
      left: '0',
      top: '0',
      width: '500',
      height: '60',

      // 時間制限
      time: '', // 時間をミリ秒で指定
      time_ptext: '', // 制限時間をテキストで埋め込む[ptext]の名前
      time_format: 'ss.SS',
      time_msec_size: '80',

      // ゲージ
      gauge_color: 'red',
      gauge_image: '',
      gauge_image_type: 'clip', // clip, move

      // バー
      bar_color: 'white',
      bar_width: '',
      bar_height: '',
      bar_image: '',

      // 成功失敗の位置, 色
      range_success: '80-', // "-10, 40-80, 95-" のように複数指定可能
      bg_failure: '#05004F',
      bg_success: 'green',

      // 背景画像, 余白
      bg_image: '',
      padding: '',

      // アニメーション方向
      anim_dir: 'normal', // normal, alternate
      anim_time: '1500', // 端から

      // 縦向きにするか？
      vertical: 'false',

      flash: 'true',

      // 成功, 失敗, 時間切れ時のイベント設定
      auto_next: '',
      success_exp: '',
      success_storage: '',
      success_target: '',
      failure_exp: '',
      failure_storage: '',
      failure_target: '',
      timeout_exp: '',
      timeout_storage: '',
      timeout_target: '',
    },

    // 処理
    start(pm) {
      wait()

      //
      // 初期値設定
      //

      // x, yが指定されている場合はそれをleft, topに流用する
      // ティラノビルダーの領域指定ツールを想定
      if (pm.x) pm.left = pm.x
      if (pm.y) pm.top = pm.y

      // タテ向きか
      const is_vertical = pm.vertical === 'true'

      if (is_vertical) {
        pm.bar_width = pm.bar_width || ''
        pm.bar_height = pm.bar_height || '10'
      } else {
        pm.bar_width = pm.bar_width || '10'
        pm.bar_height = pm.bar_height || ''
      }

      // ==================================
      // DOMの作成
      // ==================================

      // 横位置、縦位置、幅、高さ
      const box_outer_left = parseFloat(pm.left)
      const box_outer_top = parseFloat(pm.top)
      const box_outer_width = parseFloat(pm.width)
      const box_outer_height = parseFloat(pm.height)

      let box_padding_width = 0
      let box_padding_height = 0
      if (pm.padding) {
        const hash = pm.padding.split(',')
        box_padding_height = parseFloat(hash[0])
        box_padding_width = hash[1] ? parseFloat(hash[1]) : box_padding_height
      }
      const box_inner_width = box_outer_width - box_padding_width * 2
      const box_inner_height = box_outer_height - box_padding_height * 2

      //
      // ゲージをまとめてコンテナに入れる
      // このコンテナはname="qte_gauge"で操作できる
      //

      const j_gauge_container = $('<div>')
        .addClass('qte_gauge qte-gauge qte-plugin-item')
        .css({
          left: `${box_outer_left}px`,
          top: `${box_outer_top}px`,
        })

      //
      // ゲージの枠線部分
      //

      if (pm.border) {
        pm.border = pm.border.replace(/=/g, ' ')
        pm.border = pm.border.replace(/:/g, ' ')
        const j_gauge_border = $('<div>')
          .addClass('qte-gauge-border')
          .css({
            width: `${box_outer_width}px`,
            height: `${box_outer_height}px`,
          })
        let border_width_sum = 0
        pm.border.split(',').forEach((item) => {
          const hash = item.trim().split(' ')
          const border_width = parseInt(hash[0])
          const border_color = hash[1] ? $.convertColor(hash[1]) : 'transparent'
          border_width_sum += border_width
          const j_gauge_border_inner = $('<div>')
            .addClass('qte-gauge-border-inner')
            .css({
              'width': `${box_outer_width + 2 * border_width_sum}px`,
              'height': `${box_outer_height + 2 * border_width_sum}px`,
              'border-width': `${border_width}px`,
              'border-color': border_color,
              'background-color': border_color,
              'margin-left': `-${border_width_sum}px`,
              'margin-top': `-${border_width_sum}px`,
            })
          j_gauge_border.prepend(j_gauge_border_inner)
        })
        j_gauge_container.append(j_gauge_border)
      }

      //
      // 背景画像
      //

      if (pm.bg_image) {
        const src = $.parseStorage(pm.bg_image, 'image')
        const j_gauge_outer_bg = $('<div>')
          .addClass('qte-gauge-outer-bg')
          .css({
            'width': `${box_outer_width}px`,
            'height': `${box_outer_height}px`,
            'background-image': `url(${src})`,
          })
        j_gauge_container.append(j_gauge_outer_bg)
      }

      //
      // 内部のゲージ部分のコンテナ
      //

      const j_gauge_gauge_container = $('<div>')
        .addClass('qte-gauge-gauge-container')
        .css({
          left: `${box_padding_width}px`,
          top: `${box_padding_height}px`,
        })
      j_gauge_container.append(j_gauge_gauge_container)

      //
      // 成功位置の指定（グラデーションCSSの作成）
      //

      const success_range_str = pm.range_success // '-10, 40-60, 80-'
      const success_ranges = []
      const success_range_stops = []
      success_range_str.split(',').map((item) => {
        item = item.trim()
        const hash = item.split('-')
        if (hash[0] === '') hash[0] = '0'
        if (hash[1] === '') hash[1] = '100'
        success_range_stops.push(parseInt(hash[0]))
        success_range_stops.push(parseInt(hash[1]))
        success_ranges.push([parseInt(hash[0]), parseInt(hash[1])])
      })
      const failure_color = $.convertColor(pm.bg_failure) || 'transparent'
      const success_color = $.convertColor(pm.bg_success) || 'transparent'
      let css = `${failure_color} 0%, ${failure_color} ${success_range_stops[0]}%`
      let is_success_zone = false
      for (let i = 0; i < success_range_stops.length; i++) {
        const stop = success_range_stops[i]
        if (is_success_zone) {
          css += `, ${success_color} ${stop}%`
          css += `, ${failure_color} ${stop}%`
        } else {
          css += `, ${failure_color} ${stop}%`
          css += `, ${success_color} ${stop}%`
        }
        is_success_zone = !is_success_zone
      }

      //
      // ゲージの背景部分
      //

      const dir = is_vertical ? 'to top' : 'to right'
      const j_gauge_inner_bg = $('<div>')
        .addClass('qte-gauge-inner-bg')
        .css({
          'background-image': `linear-gradient(${dir}, ${css})`,
          'width': `${box_inner_width}px`,
          'height': `${box_inner_height}px`,
        })
      j_gauge_gauge_container.append(j_gauge_inner_bg)

      //
      // ゲージ
      //

      const gauge_color = $.convertColor(pm.gauge_color) || 'transparent'
      const j_gauge_gauge = $('<div>')
        .addClass('qte-gauge-gauge')
        .css({
          'background-color': `${gauge_color}`,
          'width': `${box_inner_width}px`,
          'height': `${box_inner_height}px`,
        })

      // ゲージに画像を使う
      if (pm.gauge_image) {
        const src = $.parseStorage(pm.gauge_image, 'image')
        j_gauge_gauge.css({
          'background-image': `url(${src})`,
          'background-size': `${box_inner_width}px ${box_inner_height}px`,
        })
        // ゲージ画像の動き方
        // - 画像自体は固定でクリップ領域が変化するのか
        // - 画像自体がゲージと一緒に動くのか
        if (is_vertical) {
          if (pm.gauge_image_type === 'clip') {
            j_gauge_gauge.css({
              'background-position': 'left bottom',
            })
          }
        } else {
          if (pm.gauge_image_type === 'move') {
            j_gauge_gauge.css({
              'background-position': 'right top',
            })
          }
        }
      }
      j_gauge_gauge_container.append(j_gauge_gauge)

      //
      // バー
      //

      let bar_width, bar_height, bar_top, bar_left
      const bar_color = $.convertColor(pm.bar_color)
      if (is_vertical) {
        bar_left = box_inner_width / 2
        bar_top = 0
        bar_height = parseFloat(pm.bar_height)
        bar_width = pm.bar_width ? parseFloat(pm.bar_width) : box_inner_width
      } else {
        bar_left = 0
        bar_top = box_inner_height / 2
        bar_width = parseFloat(pm.bar_width)
        bar_height = pm.bar_height ? parseFloat(pm.bar_height) : box_inner_height
      }
      const j_gauge_bar = $('<div>')
        .addClass('qte-gauge-bar')
        .css({
          'background-color': bar_color,
          'left': `${bar_left}px`,
          'top': `${bar_top}px`,
          'width': `${bar_width}px`,
          'height': `${bar_height}px`,
          'transform': 'translate(-50%, -50%)',
        })
      if (pm.bar_image) {
        const src = $.parseStorage(pm.bar_image, 'image')
        j_gauge_bar.css({
          'background-image': `url(${src})`,
        })
      }
      j_gauge_gauge_container.append(j_gauge_bar)

      // レイヤーを取得してそこに入れる
      const j_layer = that.kag.layer.getLayer(pm.layer, pm.page)
      j_layer.append(j_gauge_container)

      // レイヤーが非表示であれば自動で表示してあげる
      if (j_layer.css('display') === 'none') {
        j_layer.css('display', '')
        j_layer.attr('l_visible', 'true')
      }

      // キーフレームの定義
      let keyframes, keyframes_bar, anim_time
      anim_time = parseFloat(pm.anim_time)
      if (is_vertical) {
        if (pm.anim_dir === 'alternate') {
          anim_time *= 2
          keyframes = [
            { height: '0px', top: `${box_inner_height}px` },
            { height: `${box_inner_height}px`, top: `0px` },
            { height: '0px', top: `${box_inner_height}px` },
          ]
          keyframes_bar = [
            { top: `${box_inner_height}px` },
            { top: `0px` },
            { top: `${box_inner_height}px` },
          ]
        } else {
          keyframes = [
            { height: '0px', top: `${box_inner_height}px` },
            { height: `${box_inner_height}px`, top: `0px` },
          ]
          keyframes_bar = [{ top: `${box_inner_height}px` }, { top: `0px` }]
        }
      } else {
        if (pm.anim_dir === 'alternate') {
          anim_time *= 2
          keyframes = [{ width: '0px' }, { width: `${box_inner_width}px` }, { width: '0px' }]
          keyframes_bar = [{ left: `0px` }, { left: `${box_inner_width}px` }, { left: '0px' }]
        } else {
          keyframes = [{ width: '0px' }, { width: `${box_inner_width}px` }]
          keyframes_bar = [{ left: `0px` }, { left: `${box_inner_width}px` }]
        }
      }

      // アニメーションを開始
      // 戻り値はAnimation (https://developer.mozilla.org/ja/docs/Web/API/Animation)
      const animation = j_gauge_gauge.get(0).animate(keyframes, {
        duration: anim_time,
        iterations: Infinity,
      })

      const animation_bar = j_gauge_bar.get(0).animate(keyframes_bar, {
        duration: anim_time,
        iterations: Infinity,
      })

      // クリック(タップ)を検知するための領域
      const j_event = $('<div>').css({
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
      })
      $('body').append(j_event)

      // ==================================
      // イベントの処理
      // ==================================

      let clicked = false
      let timer_id
      let bar_position = 0
      let is_success = false
      let finished = false

      //
      // イベントを脱出するときの汎用処理（前）
      //

      const exit = () => {
        finished = true

        // 時間切れ用のタイムアウトを削除
        clearTimeout(timer_id)

        // アニメーションを止める
        animation.pause()
        animation_bar.pause()

        // イベント検知用の領域を削除
        j_event.remove()

        // カーソルの横位置（0～100に正規化）
        if (is_vertical) {
          bar_position = parseInt((parseInt(j_gauge_gauge.css('height')) / box_inner_height) * 100)
        } else {
          bar_position = parseInt((parseInt(j_gauge_gauge.css('width')) / box_inner_width) * 100)
        }

        // カーソルの位置xが成功位置に入っているかを確認する
        for (const range of success_ranges) {
          if (range[0] <= bar_position && bar_position <= range[1]) {
            is_success = true
            break
          }
        }

        // 変数に値を入れる
        that.kag.variable.tf.gauge_position = bar_position

        // 次のタグへ
        unwait()
      }

      //
      // イベントを脱出するときの汎用処理（後）
      //

      const exit_end = () => {
        if (pm.auto_clear === 'true') {
          j_gauge_container.remove()
        }
      }

      //
      // コマンド入力に成功したとき
      //

      const success = () => {
        // 止めたときのエフェクトとして背景色を変更する
        if (gauge_color !== 'transparent' && pm.flash === 'true') {
          j_gauge_gauge.get(0).animate([{ background: 'white' }, { background: 'red' }], {
            duration: 500,
            iterations: 1,
          })
        }

        that.kag.variable.tf.gauge_result = 'success'

        if (pm.success_se) {
          playse(pm.success_se)
        }

        // JS式を実行する
        if (pm.success_exp) {
          that.kag.evalScript(pm.success_exp)
        }

        exit_end()

        // ジャンプ
        if (pm.success_storage || pm.success_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.success_storage,
            target: pm.success_target,
          })
        } else if (pm.auto_next === 'true') {
          that.kag.cancelStrongStop()
          that.kag.cancelWeakStop()
          that.kag.ftag.nextOrder()
        }
      }

      //
      // 失敗したとき
      //

      const failure = () => {
        // JS式を実行する
        if (pm.failure_exp) {
          that.kag.evalScript(pm.failure_exp)
        }

        that.kag.variable.tf.gauge_result = 'failure'

        if (pm.failure_se) {
          playse(pm.failure_se)
        }

        exit_end()

        // ジャンプ
        if (pm.failure_storage || pm.failure_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.failure_storage,
            target: pm.failure_target,
          })
        } else if (pm.auto_next === 'true') {
          that.kag.cancelStrongStop()
          that.kag.cancelWeakStop()
          that.kag.ftag.nextOrder()
        }
      }

      //
      // 時間切れになったとき
      //

      const timeout = () => {
        exit()

        const j_time = pm.time_ptext ? $('.' + pm.time_ptext) : $('.qte_ptext') || null
        const remaining_time_str = formatTime(0, pm.time_format, pm.time_msec_size)
        if (j_time) {
          j_time.html(remaining_time_str)
        }

        that.kag.variable.tf.gauge_result = 'timeout'

        // JS式を実行する
        if (pm.timeout_exp) {
          that.kag.evalScript(pm.timeout_exp)
        }

        exit_end()

        // ジャンプ
        if (pm.timeout_storage || pm.timeout_target) {
          that.kag.ftag.startTag('jump', {
            storage: pm.timeout_storage,
            target: pm.timeout_target,
          })
        } else if (pm.auto_next === 'true') {
          that.kag.cancelStrongStop()
          that.kag.cancelWeakStop()
          that.kag.ftag.nextOrder()
        }
      }

      //
      // もし制限時間がある場合はタイムアウト処理を登録する
      //

      if (pm.time && parseInt(pm.time) > 0) {
        const time_limit = parseInt(pm.time)

        // 時間切れ処理の予約
        timer_id = setTimeout(timeout, time_limit)

        // 制限時間を表す[ptext]
        const j_time = pm.time_ptext ? $('.' + pm.time_ptext) : $('.qte_ptext') || null

        // 残り時間を計算して[ptext]に表示する
        let start_time = null
        const update = (timestamp) => {
          if (finished) {
            return
          }
          if (!start_time) {
            start_time = timestamp
          }
          const total_time = timestamp - start_time
          const remaining_time = time_limit - total_time
          const remaining_time_str = formatTime(remaining_time, pm.time_format, pm.time_msec_size)
          if (j_time) {
            j_time.html(remaining_time_str)
          }
          if (total_time < time_limit) {
            requestAnimationFrame(update)
          }
        }
        requestAnimationFrame(update)
      }

      //
      // クリック時イベントハンドラ
      //

      const handler = () => {
        // クリック済みであれば反応しない
        if (clicked) {
          return
        }

        // クリック済み
        clicked = true

        exit()

        if (is_success) {
          success()
        } else {
          failure()
        }
      }

      j_event.on('touchstart', handler)
      j_event.on('mousedown', handler)

      that.kag.ftag.nextOrder()
    },
  }
})()
