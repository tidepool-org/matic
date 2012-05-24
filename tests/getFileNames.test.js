// Tested module
var getFileNames = require('../lib/getFileNames');

// Helper modules
var fs 			= require('fs'),
		exec 		= require('child_process').exec,
		Events 	=	require('events').EventEmitter;;

module.exports = {
	setUp: function(callback) {

		this.events = new Events();

		fs.mkdir('testFiles', function(err) {
			
			if(err) {
				console.log('testFiles folder already exists please delete it and run again');
				return;
			}

			fs.writeFileSync('./testFiles/test1.json', '{"test": "file 1"}');
			fs.writeFileSync('./testFiles/test2.json', '{"test": "file 2"}');
			fs.writeFileSync('./testFiles/test3.json', '{"test": "file 3"}');
			fs.writeFileSync('./testFiles/test4.txt', 'test file that should not be read');

			callback();	

		});

	},
	tearDown: function(callback) {
		// TODO: Need to make this deletion cross platform
		// I suppose we could write a big itterator class - but this seems easier
		// console.log(process.platform);
		exec('rm -rf testFiles', function() {
			callback();	
		});
		
	},
	getSpecific: function(test) {
		
		test.expect(1);

		this.events.on('gotFileNames', function(fileNames) {
			
			test.deepEqual(fileNames, [ 'test1.json', 'test2.json', 'test3.json' ]);
			
			test.done();

		});
		
		getFileNames(this.events, './testFiles/', 'json');
	
	},
	getAll: function(test) {
		
		test.expect(1);

		this.events.on('gotFileNames', function(fileNames) {

			test.deepEqual(fileNames, [ 'test1.json', 'test2.json', 'test3.json', 'test4.txt' ]);

			test.done();
		
		});

		// Call getFileNames without a file suffix filter
		getFileNames(this.events, './testFiles/');

	}
};