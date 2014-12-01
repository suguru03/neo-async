MOCHA=./node_modules/mocha/bin/_mocha
ISTANBUL=./node_modules/.bin/istanbul

test-cov: clean
	$(ISTANBUL) cover $(MOCHA) --report lcovonly -- -R spec ./test/*/*.js

test-coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

clean:
	rm -rf coverage
