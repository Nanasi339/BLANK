【名称】アクションイベントプラグイン
【種別】ティラノスクリプト用プラグイン
【開発環境】Windows 10 64bit OS
【製作者】荻原（おぎはら）
【連絡先】https://twitter.com/ogihara88sai
【バージョン】1.1.0
【最終更新日】2023.8.24 20:00:00
【説明ページ】https://harmless-drawer-b69.notion.site/a23fa059b24b4fdb8cf28c638cb5a418
【ダウンロード】

◆概要

『アクションイベントプラグイン』は、ティラノスクリプトのゲームにアクションイベント（いわゆるQTE: Quick Time Event）を実装するプラグインです。「時間内に特定の場所をタップせよ！」「時間内に特定のキーボード入力をせよ！」という感じをイベントを発生させます。

ティラノスクリプトV520以降に対応します。

◆ファイル構成

qte
├ init.ks
├ qte.css
├ qte.js
└ readme.txt

◆導入方法

zipファイルを展開して出てきたqteフォルダを
ティラノスクリプトのプロジェクトフォルダのdata/others/plugin/下に配置してください。
その後、first.ks等に以下のタグを記述してください。

[plugin name="qte"]

◆タグリファレンス

プラグインを読み込むと、以下のタグが新しく使えるようになります。

- [qte_tap] タップイベントの発生
- [qte_tap_clear] タップボタンの削除
- [qte_gauge] ゲージストップイベントの発生
- [qte_command] キーボード入力イベントの発生
- [qte_virtual_key] キーボード入力イベント用の仮想キーボードボタンの表示

各タグの詳細な説明については、以下のページをご覧ください。
https://harmless-drawer-b69.notion.site/a23fa059b24b4fdb8cf28c638cb5a418
