# after running `git merge master`...
./node_modules/.bin/lessc global.less global.css
git commit -av -m 'deploy'
git push origin gh-pages
