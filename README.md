# RunWith-IT Analytic Engine

[![Build Status](http://162.246.157.107:8080/job/analytic-engine-unit-tests/badge/icon)](http://162.246.157.107:8080/job/analytic-engine-unit-tests/)

This package is the **Analytic Engine** in the RunWith-IT stack.

## Requirements
1. r-statistics
2. node
3. npm (should be installed automatically when node is installed).
4. gulp (do via `npm install -g gulp`)
5. For testing, `npm install -g jasmine`
6. `npm install -g node-gyp`
7. `sudo apt-get install libkrb5-dev libgssapi-krb5-2`
8. `npm install -g fibers`
9. [Install mongodb](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

## Instructions (WIP - This is just to test r-statistics)
1. `npm install -g gulp`
2. `npm install`
3. `gulp  # This builds the src to the dist directory`
4. `cd dist`
5. `node r-adapter.js  # This is a test file and for testing r-statistics with node.`

## Testing
Tests utilize the jasmine test framework. They should all be placed in _spec/analytic-engine_ directory.
1. `npm install`
2. `npm test`

## Structure
* r-modules/ - Contains *.R files which is called by the javascript files in src/ directory.
* src/ - Javascript files. We use _ES6_ since it is awesome.
* dist/ - Doesn't exist at first until `gulp` is executed.
* spec/ - Contains unit test directory.