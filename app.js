// set relative path to this file rather by the default dir from which you are in the time off calling node script
process.chdir(__dirname);

// Documentation - https://github.com/ddsol/speedtest.net
var speedtest = require('speedtest-net');
var fs = require('fs');
var path = require('path');

var test = speedtest({
  maxTime: 100 // for faster app debug
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

  fs.readFile(logfilePath, function(err, logfile) {

    // missing folder or file
    if(err){

      // check folder
      if(!fs.existsSync(folder))
        fs.mkdirSync(folder);

      // create log file
      fs.writeFileSync(logfilePath);
    }

    if(!logfile)
      logfile = '{}';

    var logfileData = JSON.parse(logfile);
    logfileData[timestamp] = data;

    fs.writeFileSync(logfilePath, JSON.stringify(logfileData));

    process.exit();
  });
};

test.on('data',function(data){
  processData(null, data);
});

test.on('error',function(err){
  processData(err);
});