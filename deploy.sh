# after running `git merge master`...
./node_modules/.bin/lessc global.less global.css
git add .
git commit -av -m 'deploy'
git push origin gh-pages
