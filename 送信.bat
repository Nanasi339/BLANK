echo off
git add .
git commit -m "クイック更新テスト3"
git remote rm origin
git remote add origin https://github.com/Nanasi339/BLANK.git
git push origin master