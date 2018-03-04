#!/bin/sh

./bin/build.sh &&
touch src/out/.nojekyll &&
git add -f src/out &&
TREE_OBJ_ID=`git write-tree --prefix=src/out` &&
git reset -- src/out &&
COMMIT_ID=`git commit-tree -p gh-pages -m "Deploy" $TREE_OBJ_ID` &&
git update-ref refs/heads/gh-pages $COMMIT_ID &&
git push
