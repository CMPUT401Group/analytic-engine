# RunWith-IT Analytic Engine

[![Build Status](http://162.246.157.107:8080/job/analytic-engine-unit-tests-dev/badge/icon)](http://162.246.157.107:8080/job/analytic-engine-unit-tests-dev/)


This package is the **Analytic Engine** in the RunWith-IT stack.

## Requirements
1. r-statistics
2. node 4.6.2
3. npm (should be installed automatically when node is installed).
4. gulp (do via `npm install -g gulp`)
5. For testing, `npm install -g jasmine`
6. `npm install -g node-gyp`
7. `sudo apt-get install libkrb5-dev libgssapi-krb5-2`
8. `npm install -g fibers`
9. [Install mongodb](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)

## Instructions
1. `npm install -g gulp`
2. `npm install`
3. `gulp  # This builds the src to the dist directory`
4. `cd dist`
5. `node r-adapter.js  # This is a test file and for testing r-statistics with node.`
6. 'node dist/long-running-process-test.js' #this will test comparing all metrics, which takes about 2 hours depending on hardware and internet bandwidth

## Testing
Tests utilize the Jasmine test framework. They should all be placed in _spec/analytic-engine_ directory. Note that we do not test any async methods with Jasmine as the famework seems to have issues with multithreading tests
1. `npm install`
2. `npm test`

## Structure
* r-modules/ - Contains *.R files which is called by the javascript files in src/ directory.
* src/ - Javascript files. We use _ES6_ since it is awesome.
* dist/ - Doesn't exist at first until `gulp` is executed. This contains the "compiled" .js files
* spec/ - Contains unit test directory.

## TODO:
* we need more robust interpolation of data points (currently, I think we might miss out on local minima and maxima in a dataset which could skew the results of covarance and correlation analysis)
* we need to make sure that when comapring sets of datapoints we comapre points which have the same time spacing. If there are differing intervals or gaps in a metric, we need to represent that in the number of datapoints for that metric (currently we assume that we are always comapring the same span of time and we simply interpolate more points in one of the metrics to match the other. We always create interpolated sets with even spacing in the timeframe and we need to ensure that is the case for the other metric as well. Possibly this means that we should interpolate both metrics, but I think we need to address whether interpolating is causing the data to lose possible points of interest which line up in time to points in the other data set anyway)
* we need to create the api to talk to a front end of some kind. This api just needs to call certain methods or functions which are performing anaysis.
* we need to save the results of anaysis in the database in case the program terminate
* we need a way to convert that saved output into a JSON grafana dashboard (ex. top 20 most correlated metrics to the search should create a dashboard with those metrics ordered on the page)



