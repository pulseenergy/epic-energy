# after running `git merge master`...
lessc global.less global.css
git add .
git commit -av -m 'deploy'
git push origin gh-pages
