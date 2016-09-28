const speedTest = require('speedtest-net');
const AioStream = require('adafruit-io/client/lib/stream');
const argv = require('yargs').argv;

const USERNAME = argv.u || argv.username || process.env.USERNAME;
const AIO_KEY = argv.k || argv.key || process.env.AIO_KEY;
const FEED_NAME = argv.f || argv.feed || process.env.FEED;
const DELAY = argv.d || argv.delay || process.env.DELAY || 1*60*60*1000;

const aio = new AioStream({username: USERNAME, key: AIO_KEY});
aio.connect(FEED_NAME);

function saveData (data) {
	aio._write(data.speeds.download, 'utf-8', () => {
		console.log(`Speed saved: ${data.speeds.download}`);
	});
}

function logError (err) {
	console.error(err);
}

function runTest () {
	const test = speedTest({maxTime: 5000});
	test.on('data', saveData);
	test.on('error', logError);
}

runTest()
setInterval(runTest, DELAY);
