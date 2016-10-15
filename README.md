# RunWith-IT Analytic Engine

This package is the **Analytic Engine** in the RunWith-IT stack.

## Requirements
1. r-statistics
2. node
3. npm (should be installed automatically when node is installed).
4. gulp (do via `npm install -g gulp`)
5. For testing, `npm install -g jasmine`

## Instructions (WIP - This is just to test r-statistics)
1. `npm install -g gulp`
2. `npm install`
3. `gulp  # This builds the src to the dist directory`
4. `cd dist`
5. `node r-adapter.js  # This is a test file and for testing r-statistics with node.`
6. `npm install -g fibers`

## Testing
Tests utilize the jasmine test framework. They should all be placed in _spec/analytic-engine_ directory.
1. `npm install`
2. `npm test`

## Structure
* r-modules/ - Contains *.R files which is called by the javascript files in src/ directory.
* src/ - Javascript files. We use _ES6_ since it is awesome.
* dist/ - Doesn't exist at first until `gulp` is executed.
* spec/ - Contains unit test directory.