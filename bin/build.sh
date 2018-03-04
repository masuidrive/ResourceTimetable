#!/bin/sh

export NODE_ENV=production
export DEPLOY_PREFIX=/ResourceTimetable

./node_modules/.bin/next build && \
./node_modules/.bin/next export
# && touch out/CNAME
# && echo \"example.com\" >> out/CNAME
