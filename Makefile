MOCHA=./node_modules/mocha/bin/_mocha
ISTANBUL=./node_modules/.bin/istanbul

test-cov: clean
	$(ISTANBUL) cover $(MOCHA) --report lcovonly -- -R spec ./test/*/*.js

test-codecov:
	cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js --verbose

release-test:
	DELAY=20 npm test | npm run-script cov:100

clean:
	rm -rf coverage

minify:
	java -jar ../compiler-latest/compiler.jar --js ./lib/async.js --js_output_file ./lib/async.min.js

cp:
	cp ./lib/async.min.js ./dist/async.min.js
	cp ./lib/async.js ./dist/async.js

release: release-test minify cp
