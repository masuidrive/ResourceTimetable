#!/bin/sh

git checkout gh-pages &&
git fetch origin gh-pages &&
git checkout develop &&
docker-compose run react ./bin/build.sh &&
touch out/.nojekyll &&
git add -f out &&
TREE_OBJ_ID=`git write-tree --prefix=out` &&
git reset -- out &&
COMMIT_ID=`git commit-tree -p gh-pages -m "Deploy" $TREE_OBJ_ID` &&
git update-ref refs/heads/gh-pages $COMMIT_ID &&
git checkout gh-pages &&
git push origin gh-pages &&
git checkout develop
