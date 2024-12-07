'use strict'

module.exports = class plugin_setting {
  constructor(TB) {
    // ティラノビルダーの機能にアクセスするためのインターフェイス
    this.TB = TB

    // プラグイン名
    this.name = TB.$.s('アクションイベント（QTE）')

    // プラグインの説明
    this.plugin_text = TB.$.s('アクションイベントを発生させるプラグインです。')

    // プラグイン説明用の画像ファイル（プラグインフォルダに配置）
    // "no_image"で画像なし
    this.plugin_img = 'sample.png'
  }

  // プラグインインストール時に一度だけ実行される
  triggerInstall() {}

  // コンポーネント定義
  defineComponents() {
    const TEXT_MAP = {
      qte_tap: {
        name: 'タップイベント',
        help: 'タップイベントを発生させます',
      },
      qte_command: {
        name: 'コマンドイベント',
        help: 'コマンド入力イベントを発生させます',
      },
      qte_ptext: {
        name: '制限時間テキスト',
        help: '制限時間を表示するテキストを配置できます',
      },
      qte_gauge: {
        name: 'ゲージイベント',
        help: 'ゲージストップイベントを発生させます',
      },
      qte_tap_clear: {
        name: 'タップクリア',
        help: 'タップイベントのボタンを削除します',
      },
    }

    const cmp = {}
    const TB = this.TB

    /**
     * - ジャンプ先storageを選択するパラメータを生成する
     * - ただしパラメータのnameを自由に設定できるようにする
     * @param {string} name
     * @returns
     */
    const createScenarioStorageParam = (name) => {
      const option = Object.assign({}, TB._pm_type['storage'])
      option.name = TB.$.s(name)
      return option
    }

    /**
     * - ジャンプ先targetを選択するパラメータを生成する
     * - ただしパラメータのnameを自由に設定できるようにする
     * @param {string} name
     * @returns
     */
    const createScenarioTargetParam = (name) => {
      const option = Object.assign({}, TB._pm_type['target'])
      option.name = TB.$.s(name)
      return option
    }

    /**
     * フォントを選択するパラメータを生成する
     * @returns
     */
    const getFontFaceList = () => {
      var array_font = TB.$.s('array_font')
      var array_select_list = []
      array_select_list.push({
        name: '---',
        val: '',
      })
      var map_font = app.config.project_config['map_font']
      for (key in map_font) {
        array_select_list.push({
          name: key,
          val: key,
        })
      }
      for (var i = 0; i < array_font.length; i++) {
        array_select_list.push({
          name: array_font[i].name,
          val: array_font[i].val,
        })
      }
      return array_select_list
    }

    //
    // [qte_tap]
    //

    cmp['qte_tap'] = {
      info: {
        default: true, // コンポーネントをデフォルトで配置するかどうか
        name: TB.$.s(TEXT_MAP['qte_tap']['name']), // コンポーネント名称（左カラムに表示される）
        help: TB.$.s(TEXT_MAP['qte_tap']['help']), // コンポーネントの説明
        icon: TB.$.s('s-icon-star-full'), // ここは変更しない
      },
      component: {
        name: TB.$.s(TEXT_MAP['qte_tap']['name']),
        component_type: 'Simple', // コンポーネントタイプ: Simple, Movie, Image, Text, Sound
        default_view: {
          base_img_url: 'data/image/',
          base_sound_url: 'data/sound/',
          icon: 's-icon-star-full',
          icon_color: '#FFFF99',
          category: 'plugin',
        },
        param_view: {},
        param: {
          tap_target: createScenarioTargetParam('タップ時ジャンプラベル'),
          timeout_target: createScenarioTargetParam('時間切れ時ジャンプラベル'),
          graphic: {
            name: TB.$.s('タップ画像'),
            help: TB.$.s('タップエリアに画像を使うことができます'),
            type: 'ImageSelect',
            file_path: 'image/',
            base_img_url: 'data/image/',
            vital: false,
            default_val: '',
            line_preview: 'on',
            validate: {
              required: false,
            },
          },
          time: {
            name: 'タップの制限時間',
            type: 'Num',
            unit: 'ﾐﾘ秒',
            help: TB.$.s('タップの制限時間です'),
            default_val: 3000,
            spinner: {
              min: 0,
              max: 10000,
              step: 1000,
            },
            validate: {
              number: true,
            },
          },
          waittime: {
            name: 'コンポーネントの待機時間',
            type: 'Num',
            unit: 'ﾐﾘ秒',
            help: TB.$.s('次のコンポーネントに進むまでの時間を指定できます'),
            default_val: 0,
            spinner: {
              min: 0,
              max: 10000,
              step: 100,
            },
            validate: {
              number: true,
            },
          },
          text: {
            name: TB.$.s('タップエリアのテキスト'),
            type: 'Text',
            default_val: 'TAP!',
            validate: {
              required: false,
            },
            onChange: function (val, component) {
              TB.component.changeParam(component, 'text', val)
            },
          },
          tap_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('タップ時の効果音'),
            vital: false,
            default_val: '',
          },
          mash_count: {
            type: 'Num',
            name: TB.$.s('タップ連打回数'),
            help: TB.$.s('この数値を増やすことでプレイヤーに要求する連打回数を指定できます'),
            unit: TB.$.s('回'),
            validate: {
              number: true,
            },
            spinner: {
              min: 1,
              max: 100,
              step: 1,
            },
            default_val: '1',
          },
          _clickable_img: {
            type: 'BoundSelect',
            bound_type: 'clickable',
            name: TB.$.s('領域選択'),
            help: TB.$.s('座標を見やすいツールを使って指定することができます'),
            vital: false,
            default_val: '',
          },
          x: {
            type: 'Num',
            name: TB.$.s('横位置'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージを表示する横位置を指定。'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          y: {
            type: 'Num',
            name: TB.$.s('縦位置'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージを表示する画面上部からのを位置を指定。'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          width: {
            type: 'Num',
            name: TB.$.s('横幅'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージの横幅を指定します'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          height: {
            type: 'Num',
            name: TB.$.s('高さ'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージの高さを指定します'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          tap_next: {
            type: 'Check',
            text: TB.$.s('タップ時ウェイトキャンセル'),
            help: TB.$.s(
              'タップしたときにゲームのウェイト状態をキャンセルして次のコンポーネントに進むようにできます',
            ),
            default_val: false,
          },
          random_position: {
            type: 'Check',
            text: TB.$.s('出現位置をランダムにする'),
            help: TB.$.s('タップボタンが指定領域からランダムに出現するようにできます'),
            default_val: false,
          },
          area_left: {
            type: 'Num',
            name: TB.$.s('ランダム出現領域の左端'),
            help: TB.$.s('ランダム出現領域の左端の位置'),
            unit: TB.$.s('px'),
            validate: {
              number: true,
            },
            default_val: '0',
          },
          area_top: {
            type: 'Num',
            name: TB.$.s('ランダム出現領域の上端'),
            help: TB.$.s('ランダム出現領域の上端の位置'),
            unit: TB.$.s('px'),
            validate: {
              number: true,
            },
            default_val: '0',
          },
          area_width: {
            type: 'Num',
            name: TB.$.s('ランダム出現領域の横幅'),
            help: TB.$.s('ランダム出現領域の横幅（0を指定すると画面サイズ全体が使用されます）'),
            unit: TB.$.s('px'),
            validate: {
              number: true,
            },
            default_val: '0',
          },
          area_height: {
            type: 'Num',
            name: TB.$.s('ランダム出現領域の高さ'),
            help: TB.$.s('ランダム出現領域の高さ（0を指定すると画面サイズ全体が使用されます）'),
            unit: TB.$.s('px'),
            validate: {
              number: true,
            },
            default_val: '0',
          },
          tap_exp: {
            type: 'Text',
            name: $.s('成功時JavaScript'),
            help: TB.$.s('タップに成功したときに実行するJavaScriptの文を指定できます'),
            validate: {
              required: false,
            },
          },
          timeout_exp: {
            type: 'Text',
            name: $.s('時間切れ時JavaScript'),
            help: TB.$.s(
              'タップに失敗し時間切れになったときに実行するJavaScriptの文を指定できます',
            ),
            validate: {
              required: false,
            },
          },
        },
      },
    }

    //
    // [qte_command]
    //

    cmp['qte_command'] = {
      info: {
        default: true,
        name: TB.$.s(TEXT_MAP['qte_command']['name']),
        help: TB.$.s(TEXT_MAP['qte_command']['help']),
        icon: TB.$.s('s-icon-star-full'),
      },
      component: {
        name: TB.$.s(TEXT_MAP['qte_command']['name']),
        component_type: 'Simple',
        default_view: {
          base_sound_url: 'data/sound/',
          icon: 's-icon-star-full',
          icon_color: '#FFFF99',
          category: 'plugin',
        },
        param_view: {},
        param: {
          success_target: createScenarioTargetParam('成功時ジャンプラベル'),
          failure_target: createScenarioTargetParam('失敗時ジャンプラベル'),
          timeout_target: createScenarioTargetParam('時間切れ時ジャンプラベル'),
          command: {
            name: TB.$.s('コマンド'),
            help: TB.$.s('入力させるコマンドを指定します'),
            type: 'Text',
            default_val: 'zxc',
            validate: {
              required: true,
            },
            onChange: function (val, component) {
              TB.component.changeParam(component, 'command', val)
            },
          },
          button: {
            name: TB.$.s('デザイン'),
            help: TB.$.s('画面に表示するコマンドのデザインを指定できます'),
            type: 'Text',
            default_val: 'black',
            validate: {
              required: false,
            },
            onChange: function (val, component) {
              TB.component.changeParam(component, 'button', val)
            },
          },
          text_size: {
            name: '文字サイズ',
            type: 'Num',
            unit: 'px',
            help: TB.$.s('画面に表示するコマンドの文字サイズを指定できます'),
            default_val: 40,
            spinner: {
              min: 0,
              max: 999,
              step: 1,
            },
            validate: {
              number: true,
            },
          },
          time: {
            name: 'イベントの制限時間',
            type: 'Num',
            unit: 'ﾐﾘ秒',
            help: TB.$.s(
              'コマンド入力の制限時間を指定できます（ゼロを指定すると制限時間がなくなります）',
            ),
            default_val: 0,
            spinner: {
              min: 0,
              max: 10000,
              step: 1000,
            },
            validate: {
              number: true,
            },
          },
          life: {
            name: 'ミス許容回数',
            type: 'Num',
            unit: '',
            help: TB.$.s(
              '入力ミスを何回許容するかを指定します（-1を指定すると制限がなくなります）',
            ),
            default_val: -1,
            spinner: {
              min: -1,
              max: 99,
              step: 1,
            },
            validate: {
              number: true,
            },
          },
          auto_clear: {
            type: 'Check',
            text: TB.$.s('イベント終了後自動で画面クリア'),
            default_val: true,
          },
          success_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('入力成功時の効果音'),
            vital: false,
            default_val: '',
          },
          failure_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('入力ミス時の効果音'),
            vital: false,
            default_val: '',
          },
          success_exp: {
            type: 'Text',
            name: $.s('成功時JavaScript'),
            help: TB.$.s('コマンド入力に成功したときに実行するJavaScriptの文を指定できます'),
            validate: {
              required: false,
            },
          },
          failure_exp: {
            type: 'Text',
            name: $.s('失敗時JavaScript'),
            help: TB.$.s('コマンド入力に失敗したときに実行するJavaScriptの文を指定できます'),
            validate: {
              required: false,
            },
          },
          timeout_exp: {
            type: 'Text',
            name: $.s('時間切れ時JavaScript'),
            help: TB.$.s(
              'コマンド入力を完了できず時間切れになったときに実行するJavaScriptの文を指定できます',
            ),
            validate: {
              required: false,
            },
          },
        },
      },
    }

    //
    // [qte_gauge]
    //

    cmp['qte_gauge'] = {
      info: {
        default: true,
        name: TB.$.s(TEXT_MAP['qte_gauge']['name']),
        help: TB.$.s(TEXT_MAP['qte_gauge']['help']),
        icon: TB.$.s('s-icon-star-full'),
      },
      component: {
        name: TB.$.s(TEXT_MAP['qte_gauge']['name']),
        component_type: 'Simple',
        default_view: {
          base_img_url: 'data/image/',
          base_sound_url: 'data/sound/',
          icon: 's-icon-star-full',
          icon_color: '#FFFF99',
          category: 'plugin',
        },
        param_view: {},
        param: {
          success_target: createScenarioTargetParam('成功時ジャンプラベル'),
          failure_target: createScenarioTargetParam('失敗時ジャンプラベル'),
          timeout_target: createScenarioTargetParam('時間切れ時ジャンプラベル'),
          _clickable_img: {
            type: 'BoundSelect',
            bound_type: 'clickable',
            name: TB.$.s('領域選択'),
            help: TB.$.s('座標を見やすいツールを使って指定することができます'),
            vital: false,
            default_val: '',
          },
          x: {
            type: 'Num',
            name: TB.$.s('横位置'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージを表示する横位置を指定。'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          y: {
            type: 'Num',
            name: TB.$.s('縦位置'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージを表示する画面上部からのを位置を指定。'),
            validate: {
              number: true,
            },
            default_val: '100',
          },
          width: {
            type: 'Num',
            name: TB.$.s('横幅'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージの横幅を指定します'),
            validate: {
              number: true,
            },
            default_val: '500',
          },
          height: {
            type: 'Num',
            name: TB.$.s('高さ'),
            unit: TB.$.s('px'),
            help: TB.$.s('イメージの高さを指定します'),
            validate: {
              number: true,
            },
            default_val: '60',
          },
          gauge_color: {
            type: 'Color',
            name: TB.$.s('ゲージの色'),
            default_val: '0xFF0000',
            validate: {
              required: true,
            },
          },
          bar_color: {
            type: 'Color',
            name: TB.$.s('バーの色'),
            default_val: '0xFFFFFF',
            validate: {
              required: true,
            },
          },
          bg_success: {
            type: 'Color',
            name: TB.$.s('成功ゾーンの色'),
            default_val: '0x008000',
            validate: {
              required: true,
            },
          },
          bg_failure: {
            type: 'Color',
            name: TB.$.s('失敗ゾーンの色'),
            default_val: '0x05004F',
            validate: {
              required: true,
            },
          },
          clickskip: {
            name: TB.$.s('バーが終端に来たときのアニメーション'),
            help: TB.$.s('バーが終端まで移動したあとどう動くかを指定できます'),
            type: 'Select',
            select_list: [
              {
                name: TB.$.s('最初の位置に戻る'),
                val: 'normal',
              },
              {
                name: TB.$.s('折り返す'),
                val: 'alternate',
              },
            ],
            default_val: 'normal',
          },
          anim_time: {
            name: 'アニメーション時間',
            type: 'Num',
            unit: 'ﾐﾘ秒',
            help: TB.$.s('ゲージやバーが動くアニメーション時間を指定できます'),
            default_val: 1500,
            spinner: {
              min: 0,
              max: 10000,
              step: 100,
            },
            validate: {
              number: true,
            },
          },
          time: {
            name: 'イベントの制限時間',
            type: 'Num',
            unit: 'ﾐﾘ秒',
            help: TB.$.s(
              'ゲージを止めるまでの制限時間を指定できます（ゼロを指定すると制限時間がなくなります）',
            ),
            default_val: 0,
            spinner: {
              min: 0,
              max: 10000,
              step: 1000,
            },
            validate: {
              number: true,
            },
          },
          border: {
            name: TB.$.s('ボーダー'),
            help: TB.$.s('ボーダーを指定できます'),
            type: 'Text',
            default_val: '5px solid yellow',
            validate: {
              required: false,
            },
            onChange: function (val, component) {
              TB.component.changeParam(component, 'border', val)
            },
          },
          range_success: {
            name: TB.$.s('成功位置'),
            help: TB.$.s('成功の位置を指定できます'),
            type: 'Text',
            default_val: '80-',
            validate: {
              required: false,
            },
            onChange: function (val, component) {
              TB.component.changeParam(component, 'range_success', val)
            },
          },
          vertical: {
            type: 'Check',
            text: TB.$.s('ゲージを縦向きにする'),
            default_val: false,
          },
          auto_next: {
            type: 'Check',
            text: TB.$.s('ストップ時ジャンプせず次のコンポーネントに進む'),
            default_val: false,
          },
          flash: {
            type: 'Check',
            text: TB.$.s('ストップ時フラッシュ演出'),
            default_val: true,
          },
          auto_clear: {
            type: 'Check',
            text: TB.$.s('ストップ時自動で画面クリア'),
            default_val: true,
          },
          bg_image: {
            name: TB.$.s('背景の画像'),
            help: TB.$.s('背景に画像を使うことができます'),
            type: 'ImageSelect',
            file_path: 'image/',
            base_img_url: 'data/image/',
            vital: false,
            default_val: '',
            line_preview: 'on',
            validate: {
              required: false,
            },
          },
          gauge_image: {
            name: TB.$.s('ゲージの画像'),
            help: TB.$.s('ゲージに画像を使うことができます'),
            type: 'ImageSelect',
            file_path: 'image/',
            base_img_url: 'data/image/',
            vital: false,
            default_val: '',
            line_preview: 'on',
            validate: {
              required: false,
            },
          },
          bar_image: {
            name: TB.$.s('バーの画像'),
            help: TB.$.s('バーに画像を使うことができます'),
            type: 'ImageSelect',
            file_path: 'image/',
            base_img_url: 'data/image/',
            vital: false,
            default_val: '',
            line_preview: 'on',
            validate: {
              required: false,
            },
          },
          padding: {
            type: 'Num',
            name: TB.$.s('背景画像とゲージの間の余白'),
            unit: TB.$.s('px'),
            help: TB.$.s('背景画像とゲージ部分の間に余白を付けたい場合に指定します'),
            validate: {
              number: true,
            },
            default_val: '0',
          },
          tap_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('タップ時の効果音'),
            vital: false,
            default_val: '',
          },
          success_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('入力成功時の効果音'),
            vital: false,
            default_val: '',
          },
          failure_se: {
            type: 'SoundSelect',
            file_path: 'sound/',
            name: TB.$.s('入力ミス時の効果音'),
            vital: false,
            default_val: '',
          },
          success_exp: {
            type: 'Text',
            name: $.s('成功時JavaScript'),
            help: TB.$.s('ゲージストップに成功したときに実行するJavaScriptの文を指定できます'),
            validate: {
              required: false,
            },
          },
          failure_exp: {
            type: 'Text',
            name: $.s('失敗時JavaScript'),
            help: TB.$.s('ゲージストップに失敗したときに実行するJavaScriptの文を指定できます'),
            validate: {
              required: false,
            },
          },
          timeout_exp: {
            type: 'Text',
            name: $.s('時間切れ時JavaScript'),
            help: TB.$.s(
              'ゲージストップを完了できず時間切れになったときに実行するJavaScriptの文を指定できます',
            ),
            validate: {
              required: false,
            },
          },
        },
      },
    }

    //
    // [qte_ptext]
    //

    cmp['qte_ptext'] = {
      info: {
        default: true,
        name: TB.$.s(TEXT_MAP['qte_ptext']['name']),
        help: TB.$.s(TEXT_MAP['qte_ptext']['help']),
        icon: TB.$.s('s-icon-star-full'),
      },
      component: {
        name: TB.$.s(TEXT_MAP['qte_ptext']['name']),
        component_type: 'Simple',
        default_view: {
          icon: 's-icon-star-full',
          icon_color: '#FFFF99',
          category: 'plugin',
        },
        param_view: {},
        param: {
          text: {
            type: 'Text',
            name: $.s('テキスト'),
            validate: {
              required: false,
            },
          },
          _clickable_img: {
            type: 'BoundSelectFont',
            bound_type: 'ptext',
            name: $.s('テキスト配置'),
            help: $.s('座標を見やすいツールを使って指定することができます'),
            vital: false,
            default_val: '',
          },
          face: {
            type: 'Select',
            name: $.s('フォント変更'),
            help: '',
            select_list: getFontFaceList(),
          },
          x: {
            type: 'Num',
            name: $.s('横位置'),
            default_val: 200,
            unit: $.s('px'),
            help: $.s('イメージを表示する横位置を指定。'),
            validate: {
              number: true,
            },
          },
          y: {
            type: 'Num',
            name: $.s('縦位置'),
            default_val: 300,
            unit: $.s('px'),
            help: $.s('イメージを表示する画面上部からのを位置を指定。'),
            validate: {
              number: true,
            },
          },
          size: {
            type: 'Num',
            name: $.s('サイズ'),
            default_val: 30,
            unit: $.s('px'),
            spinner: {
              min: 6,
              max: 200,
              step: 1,
            },
            validate: {
              number: true,
            },
          },
          color: {
            type: 'Color',
            name: $.s('色'),
            default_val: '0xffffff',
            validate: {
              required: true,
            },
          },
        },
      },
    }

    //
    // [qte_tap_clear]
    //

    cmp['qte_tap_clear'] = {
      info: {
        default: true,
        name: TB.$.s(TEXT_MAP['qte_tap_clear']['name']),
        help: TB.$.s(TEXT_MAP['qte_tap_clear']['help']),
        icon: TB.$.s('s-icon-star-full'),
      },
      component: {
        name: TB.$.s(TEXT_MAP['qte_tap_clear']['name']),
        component_type: 'Simple',
        default_view: {
          icon: 's-icon-star-full',
          icon_color: '#FFFF99',
          category: 'plugin',
        },
        param_view: {},
        param: {
          time: {
            type: 'Num',
            name: $.s('時間'),
            unit: $.s('ﾐﾘ秒'),
            help: $.s('削除されるまでの時間を指定します'),
            default_val: 0,
            validate: {
              number: true,
            },
            spinner: {
              min: 0,
              max: 10000,
              step: 100,
            },
          },
        },
      },
    }

    return cmp
  }
}
