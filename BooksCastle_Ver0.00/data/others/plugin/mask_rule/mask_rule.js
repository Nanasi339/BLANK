/*
Rule Transition Plugin v1.1.1
Includes:
# forked: forked from: Universal Transition - http://jsdo.it/nosemint/9OWJ
Licensed under the MIT license - http://opensource.org/licenses/MIT
*/
(function ($, TYRANO, object) {
  // [mask_rule]というタグが定義されているならここで帰ります
  if (typeof TYRANO.kag.ftag.master_tag.mask_rule !== 'undefined') {
    return;
  }
  
  
  
  // [mask_rule]を定義
  var tag = {};
  tag.mask_rule = {
    pm: {
      'graphic': 'xxx.jpg',
      'rule': 'xxx.png',
      'color': '',
      'time': '1000',
      'reverse': 'false',
      'folder': 'image',
      'rule_folder': 'image/bg_rule_image',
      
      // システム側で使っているパラメータ
      'mask_on': 'yes',
      
      // 没パラメータ
      'wait': 'true',
      'clickskip': 'false'
    },
    start: function (pm) {
      
      this.kag.layer.hideEventLayer();
        	
      var $layer = $('.layer_mask');
      var $canvas = $('#canvas_mask_rule');
      isMaskOn = (pm.mask_on === 'yes');
      // [mask_rule]として呼ばれた
      if (isMaskOn) {
        mainCanvas = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
        $layer = appendCanvas(mainCanvas);
      }
      // [mask_off_rule]として呼ばれた
      else {
        // マスクレイヤーがなぜか存在しない
        if ($layer.length === 0) {
          // とりあえず次のタグへ
          this.kag.layer.showEventLayer();
          return this.kag.ftag.nextOrder();
        }
        else {
          // キャンバスが存在しない
          // [mask]→[mask_off_rule]のパターン
          if ($canvas.length === 0) {
            // キャンバスを作成
            // マスクレイヤーにかかっていた効果は外す
            mainCanvas = createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
            $layer.append(mainCanvas);
            var _effect = $layer.attr("data-effect");
            $layer.removeClass("animated " + _effect);
          }
          // キャンバスが存在する
          // [mask_rule]→[mask_off_rule]のパターン
          else {
            // キャンバスを取得しなおす
            mainCanvas = $canvas.get(0);
            mainCanvas.ctx = mainCanvas.getContext('2d');
          }
         }
      }
      // マスクレイヤーを改めて取得
      maskLayer = $layer.get(0);
      
      
      
      // 現在トランジション中なら即時終了する
      /*
      if (isTrans) {
        finishTransition()
      }
      */
      
      
      
      // 次の背景画像ソースと使用するルール画像ソース
      var nextImageSrc;
      if (isMaskOn) {
        // 色指定があるなら…
        if (pm.color) {
          nextImageSrc = 'color:' + parseColor(pm.color);
        }
        else {
          nextImageSrc = parseSrc(pm.graphic, './data/' + pm.folder + '/');
        }
        mainCanvas.setAttribute('data-image', nextImageSrc);
      }
      var ruleImageSrc = parseSrc(pm.rule, './data/' + pm.rule_folder + '/');
      
      
      
      // 時間
      var time = parseInt(pm.time);
      // スキップを可能にするか
      //enableSkip = (pm.clickskip === 'true');
      enableSkip = false;
      // 完了を待つか
      //isWait = (pm.wait === 'true');
      isWait = true;
      // ルールを反転するか
      isReverse = (pm.reverse === 'true');
      // 現在スキップ中でかつトランジションカットが有効ならばtimeはゼロ
      if (isSkip() && enableShortCut) {
        time = 100;
      }
      if (isMaskOn) isReverse = !isReverse;
      
      
      
      // トランジションの開始
      beginTransition(getPrevImageSrc(), nextImageSrc, ruleImageSrc, time);
    }
  };
  tag.mask_off_rule = {
    start: function (pm) {
        pm.mask_on = 'no';
        this.kag.ftag.startTag('mask_rule', pm);
    }
  };
  var master_tag = TYRANO.kag.ftag.master_tag;
  for (var tag_name in tag) {
    master_tag[tag_name] = object(tag[tag_name]);
    master_tag[tag_name].kag = TYRANO.kag;
  }
  
  
  
  // requestAnimationFrameとcancelAnimationFrameの定義
  var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
  var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || function (timerId) {
    clearTimeout(timerId);
  };
  
  
  
  //
  var SCREEN_WIDTH = parseInt(TYRANO.kag.config.scWidth);
  var SCREEN_HEIGHT = parseInt(TYRANO.kag.config.scHeight);
  var renderTimerId = null;
  var prevImage = null;
  var nextImage = null;
  var ruleImage = null;
  var currentRule = null;
  var currentAlpha = null;
  var cacheRule = {};
  var passedTime = null;
  var prevTime = null;
  var transTime = null;
  var transFrame = 0;
  var transSpeed = 1;
  var isTrans = false;
  var enableSkip = true;
  var isWait = true;
  var isReverse = false;
  var isMaskOn = false;
  var maskLayer;
  var enableShortCut = (TYRANO.kag.stat.mp.shortcut !== 'false');
  
  
  
  /*
  var oldNextOrder = TYRANO.kag.ftag.nextOrder;
  TYRANO.kag.ftag.nextOrder = function () {
    if (isTrans && isWait) {
      return false
    }
    oldNextOrder.apply(this, arguments)
  };
  
  
  var oldLoadGameData = TYRANO.kag.menu.loadGameData;
  TYRANO.kag.menu.loadGameData = function () {
    if (isTrans) {
      isWait = false;
      finishTransition()
    }
    oldLoadGameData.apply(this, arguments)
  };
  */
  
  
  
  var mainCanvas;



  function createCanvas(width, height) {
    var canvasElement = document.createElement('canvas');
    canvasElement.width = width;
    canvasElement.height = height;
    canvasElement.id = 'canvas_mask_rule';
    canvasElement.style.position = 'absolute';
    canvasElement.style.zIndex = '100000000';
    canvasElement.ctx = canvasElement.getContext('2d');
    return canvasElement;
  }



  function appendCanvas(canvasElement) {
    var $layer = $("<div class='layer layer_mask' style='z-index:100000000;position:absolute;'>");
    $layer.append(canvasElement);
    $('.tyrano_base').append($layer);
    return $layer;
  }


/*
  function addEventListener(canvasElement) {
    TYRANO.kag.layer.layer_event.on('click.bg_rule', function () {
      if (isTrans && isWait && enableSkip) {
        skipTransition();
      }
    })
  }
*/


  function beginTransition(prevImageSrc, nextImageSrc, ruleImageSrc, _transTime) {
    transFrame = 0;         // 現在のフレーム
    transSpeed = 1;         // トランジションスピード（倍率）
    currentAlpha = 0;       // 現在の不透明度
    passedTime = 0;         // 経過時間
    prevTime = getTime();   // 前回フレームの時間
    transTime = _transTime; // トランジション時間
    // ローダーを生成
    var loader = new ImageLoader(0, 3, function () {
      // ロードが完了したとき…
      loader.onload = null;
      // トランジション時間がゼロよりも大きいなら
      if (transTime > 0) {
        // イベントレイヤーを表示
        //TYRANO.kag.layer.showEventLayer();
        // 現在のルールを取得
        currentRule = getRule(ruleImageSrc);
        // レンダー開始
        startRender();
      } else {
        finishTransition();
      }
      // もし完了を待たないなら次のタグへ
      if (!isWait) {
        TYRANO.kag.ftag.nextOrder();
      }
    });
    prevImage = loader.load(prevImageSrc);
    nextImage = loader.load(nextImageSrc);
    ruleImage = loader.load(ruleImageSrc);
  }



  function getTime() {
    return new Date().getTime();
  }



  function getRule(ruleImageSrc) {
    if (typeof cacheRule[ruleImageSrc] === 'undefined') {
      cacheRule[ruleImageSrc] = new Rule(ruleImage, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    return cacheRule[ruleImageSrc];
  }



  function getPrevImageSrc() {
    var $canvas = $('#canvas_mask_rule');
    if ($canvas.length > 0 && mainCanvas.getAttribute('data-image')) {
      return mainCanvas.getAttribute('data-image');
    }
    var base = maskLayer;
    var url = base.style.backgroundImage;
    var ret;
    if (url !== 'none' && url !== '') {
      var iUseMark = 0;
      var startMarks = ['\"', '\'', '('];
      var endMarks = ['\"', '\'', ')'];
      for (var i = 0; i < 3; i++) {
        if (url.indexOf(startMarks[i]) > -1) {
          iUseMark = i;
          break;
        }
      }
      var a = url.indexOf(startMarks[iUseMark]);
      var b = url.lastIndexOf(endMarks[iUseMark]);
      ret = url.substr(a + 1, b - a - 1);
    } else {
      ret = 'color:' + base.style.backgroundColor;
    }
    return ret;
  }



  // ImageLoader
  // ローダー
  function ImageLoader(count, needCount, onload) {
    this.count = count;
    this.needCount = needCount;
    this.onload = onload;
    return this;
  }
  // ImageLoader.load
  // ロード関数
  ImageLoader.prototype.load = function (imageSrc) {
    var that = this;
    if (!imageSrc) {
        imageSrc = 'color:rgba(0,0,0,0)';
    }
    // 色指定だったときの特殊処理
    if (imageSrc.indexOf('color:') === 0) {
      that.needCount--;
      if (that.count === that.needCount) {
        setTimeout(function () {
          if (typeof that.onload === 'function') {
            that.onload();
          }
        }, 1);
      }
      return imageSrc.substr(6);
    }
    // 画像だったら（通常処理）
    var imageElement = document.createElement('img');
    imageElement.onload = function (e) {
      that.count++;
      if (that.count === that.needCount) {
        if (typeof that.onload === 'function') {
          that.onload();
        }
      }
    };
    imageElement.onerror = function () {
      TYRANO.kag.error('\n画像ファイル「' + imageSrc + '」を探しましたが、見つかりませんでした。');
    };
    imageElement.src = imageSrc;
    return imageElement;
  };


  
  // startRender
  // レンダー開始
  function startRender() {
    prevTime = getTime();
    isTrans = true;
    if (!isMaskOn) {
        mainCanvas.ctx.globalAlpha = 1;
        drawImageOrColor(mainCanvas.ctx, prevImage, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    if (transTime < 1) {
        finishTransition();
    }
    else {
        render();
    }
  }



  // メインのレンダー処理
  function render() {
    transFrame++;
    cancelAnimationFrame(renderTimerId);
    renderTimerId = requestAnimationFrame(render);
    var now = getTime();
    var dif = now - prevTime;
    dif = dif * transSpeed;
    passedTime += dif;
    prevTime = now;
    currentAlpha = passedTime / transTime;
    mainCanvas.ctx.save();
    if (isMaskOn) {
        drawImageOrColor(mainCanvas.ctx, nextImage, SCREEN_WIDTH, SCREEN_HEIGHT);
        currentRule.applyRule(mainCanvas.ctx, 1 - currentAlpha);
        mainCanvas.ctx.globalCompositeOperation = 'destination-over';
        //drawImageOrColor(mainCanvas.ctx, nextImage, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    else {
        drawImageOrColor(mainCanvas.ctx, prevImage, SCREEN_WIDTH, SCREEN_HEIGHT);
        currentRule.applyRule(mainCanvas.ctx, currentAlpha);
        mainCanvas.ctx.globalCompositeOperation = 'destination-over';
        //drawImageOrColor(mainCanvas.ctx, prevImage, SCREEN_WIDTH, SCREEN_HEIGHT);
    }
    mainCanvas.ctx.restore();
    if (transFrame === 1) {
      clearLayer(maskLayer);
    }
    if (currentAlpha > 1) {
      finishTransition();
    }
  }



  // トランジションを終了する
  function finishTransition() {
    isTrans = false;
    cancelAnimationFrame(renderTimerId);
    clearLayer(maskLayer);
    
    TYRANO.kag.layer.showEventLayer();
        
    /*
    mainCanvas.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    */
    if (!isMaskOn) {
      $(maskLayer).remove();
    }
    if (isWait) {
      TYRANO.kag.ftag.nextOrder();
    }
  }



  function clearLayer(layer) {
    layer.style.backgroundImage = 'none';
    layer.style.backgroundColor = 'transparent';
  }


/*
  // トランジションをスキップする
  function skipTransition() {
    if (isTrans) {
      finishTransition()
    }
  }
*/


  // 画像もしくは色を描画する
  function drawImageOrColor(ctx, imageOrColor, width, height) {
    if (typeof imageOrColor !== 'string') {
      ctx.drawImage(imageOrColor, 0, 0, width, height);
    } else {
      ctx.fillStyle = imageOrColor;
      ctx.fillRect(0, 0, width, height);
    }
  }



  // 現在ティラノスクリプトがスキップ中か？
  function isSkip() {
    return TYRANO.kag.stat.is_skip === true || TYRANO.kag.stat.is_nowait === true;
  }



  // URLの変換処理
  function parseSrc(src, base) {
    if (src.substr(0, 4) === 'http') {
      return src;
    } else {
      return base + src;
    }
  }



  // カラーコードの変換処理
  function parseColor(color) {
    if (color.indexOf('0x') != -1) {
      return color.replace('0x', '#');
    }
    return color;
  }



  function Rule(imageElement, width, height) {
    this.imageElement = imageElement;
    this.width = width;
    this.height = height;
    this.tempCanvas1 = createCanvas(width, height);
    this.tempCanvas2 = createCanvas(width, height);
    this.alphaCanvas1 = createCanvas(width, height);
    this.alphaCanvas2 = createCanvas(width, height);
    this.alphaCanvas1.ctx.drawImage(imageElement, 0, 0, width, height);
    var imagedata = this.alphaCanvas1.ctx.getImageData(0, 0, width, height);
    var size = SCREEN_WIDTH * SCREEN_HEIGHT * 4;
    for (var i = 0; i < size; i += 4) {
      imagedata.data[i + 3] = imagedata.data[i];
    }
    this.alphaCanvas1.ctx.putImageData(imagedata, 0, 0);
    this.alphaCanvas2.ctx.fillStyle = '#000000';
    this.alphaCanvas2.ctx.globalCompositeOperation = 'xor';
    this.alphaCanvas2.ctx.fillRect(0, 0, width, height);
    this.alphaCanvas2.ctx.drawImage(this.alphaCanvas1, 0, 0, width, height);
  }
  
  
  
  Rule.prototype.applyRule = function (ctx, ratio) {
    ctx.save();
    ctx.globalCompositeOperation = 'xor';
    ctx.drawImage(this.makeRule(ratio), 0, 0);
    ctx.restore();
    return ctx;
  };
  
  
  
  Rule.prototype.makeRule = function (ratio) {
    var c1 = this.tempCanvas1.ctx;
    var c2 = this.tempCanvas2.ctx;
    var a1 = this.alphaCanvas1;
    var a2 = this.alphaCanvas2;
    if (isReverse) {
      a1 = this.alphaCanvas2;
      a2 = this.alphaCanvas1;
    }
    var a;
    this.tempCanvas1.width = this.tempCanvas1.width;
    this.tempCanvas2.width = this.tempCanvas2.width;
    if (ratio <= 0.5) {
      a = 1 - ratio * 2;
      c2.drawImage(a1, 0, 0);
      c2.globalCompositeOperation = 'lighter';
      c2.fillStyle = 'rgba(0, 0, 0,' + a + ')';
      c2.fillRect(0, 0, this.width, this.height);
      c1.fillStyle = '#000000';
      c1.fillRect(0, 0, this.width, this.height);
      c1.globalCompositeOperation = 'xor';
      c1.drawImage(this.tempCanvas2, 0, 0, this.width, this.height);
    } else {
      a = (ratio - 0.5).toFixed(5) * 2;
      c1.drawImage(a2, 0, 0, this.width, this.height);
      c1.globalCompositeOperation = 'lighter';
      c1.fillStyle = 'rgba(0, 0, 0,' + a + ')';
      c1.fillRect(0, 0, this.width, this.height);
    }
    return this.tempCanvas1;
  };
}(window.jQuery, window.TYRANO, window.object));