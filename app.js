// set relative path to this file rather by the default dir from which you are in the time off calling node script
process.chdir(__dirname);

// Documentation - https://github.com/ddsol/speedtest.net
var speedtest = require('speedtest-net');
var fs = require('fs');
var path = require('path');

var test = speedtest({
  pingCount: 10, // default 5
  // maxTime: 100 // default 10000 - here smaller for faster app debug
  // maxServers: 1
});

var processData = function(err, data) {
  var timestamp = new Date().getTime();

  var folder = './logs';
  var file = 'logfile.json';
  var logfilePath = path.join(folder, file);

  // log error
  if(err) {
    data = {
      'error': err
    };
  }

  fs.readFile(logfilePath, 'utf-8', function(err, logfile) {

    // missing folder or file
    if(err){

      // check folder
      if(!fs.existsSync(folder))
        fs.mkdirSync(folder);

      // create log file
      fs.writeFileSync(logfilePath);
    }

    if(!logfile) {
      logfileData = {};
    } else {

      // Stripping and adding 'var dataJson = /* data */;' so that can load it in html with out creating a phython, node, php server.
      logfile = logfile.replace(/^(var dataJSON = )*/, '').replace(/(;*)$/, '');
      logfileData = JSON.parse(logfile);
    }

    logfileData[timestamp] = data;

    var outData = 'var dataJSON = ' + JSON.stringify(logfileData) + ';';
    fs.writeFileSync(logfilePath, outData);

    process.exit();
  });
};

test.on('data',function(data){
  processData(null, data);
});

test.on('error',function(err){
  processData(err);
});