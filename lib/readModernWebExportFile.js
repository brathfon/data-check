/* ***********************************************************************************************************
This reader is for reading the new exports coming out of the mysql database.  It expects a tsv file with \n endlines.
*********************************************************************************************************** */


var util  = require('util');
var fs    = require('fs');
var path  = require('path');



var readWebExportFile = function(teamFileFile) {
  var siteSamples = [];
  var lines;
  var pieces;
  var lineCount = 0;
  var j;
  var locDateHash = {};
  var hashID = null;

  var contents = fs.readFileSync(teamFileFile, 'utf8')
  //console.log("contents: " + contents);
  lines = contents.split("\n");
  lines.forEach( function (line) {
     // console.log("line: " + line);
      ++lineCount;
      pieces = line.split("\t");
     //console.log("line " + lineCount + " line length " + pieces.length);
     //for (j = 0; j < pieces.length; ++j) { console.log(j + "\t" + pieces[j]); }
        if (pieces.length === 22) {
          //console.log("knownSites['" + pieces[2] + "'] = '" + pieces[3] + "';" + " known -> " + isKnownSiteCode(pieces[3]));
          //console.log("line: " + line);
          obj = {};
          obj['SampleID']      = pieces[1];
          obj['SiteName']      = pieces[2];
          obj['Location']      = pieces[3];
          obj['Session']       = pieces[4];
          obj['Date']          = pieces[5];
          obj['Time']          = pieces[6];
          obj['Temp']          = pieces[7];
          obj['Salinity']      = pieces[8];
          obj['DO']            = pieces[9];
          obj['DO%']           = pieces[10];
          obj['pH']            = pieces[11];
          obj['Turbidity']     = pieces[12];
          obj['TotalN']        = pieces[13];
          obj['TotalP']        = pieces[14];
          obj['Phosphate']     = pieces[15];
          obj['Silicate']      = pieces[16];
          obj['NNN']           = pieces[17];
          obj['NH4']           = pieces[18];
          obj['Lat']           = pieces[19];
          obj['Long']          = pieces[20];
          obj['QaIssues']      = pieces[21];
          siteSamples.push(obj);
          /*
          console.log("SITE {location: '" + obj.Location  + "', " 
                              + "siteName: '" + obj.SiteName  + "', "
                              + "lat: " + obj.Lat  + ", "
                              + "lon: " + obj.Long  + ", "
                              + "siteNum: " + obj.SiteNum + "},");
          */
        }
        else {
          console.error("------------------------ ERROR--------------------------");
          console.error("unexpected number of columns: " + pieces.length + ". Expecting 22.");
          console.error(`line number ${lineCount} of file ${teamFileFile}`);
          console.error("line is : " + line);
        }
    });

  for (j = 0; j < siteSamples.length; ++j) {
    siteSample = siteSamples[j];
    //console.log("siteSample " + util.inspect(siteSample, false, null));
    var hashID = siteSample.Location + "-" + siteSample.Date;
    locDateHash[hashID] = siteSample;
  }
  //console.log("sites " + util.inspect(locDateHash, false, null));
  return locDateHash;
};


// save this function in case it is needed and just have the other function return the list
var oldreadSiteFiles = function(directory) {
  var i, j;
  var siteSamples = [];
  var siteSample = null;
  // this is what is returned: an object whos attributes are the combination of the code
  // and the date that site was collected.
  var locDateHash = {};
  var hashID = null;

  var siteFiles = getSiteFiles(directory); // returning a list of paths of the sheet files

  for (i = 0; i < siteFiles.length; ++i) {
    //console.log("Site file: " + siteFiles[i]);
    siteSamples = readSiteFile(siteFiles[i]);  // returns a list of objects, each object a site sample
    for (j = 0; j < siteSamples.length; ++j) {
      siteSample = siteSamples[j];
      //console.log("siteSample " + util.inspect(siteSample, false, null));
      var hashID = siteSample.Location + "-" + siteSample.Date;
      locDateHash[hashID] = siteSample;
    }
  }
  console.log("sites " + util.inspect(locDateHash, false, null));
  return locDateHash;
};



exports.readWebExportFile = readWebExportFile;
//exports.getStartDate = getStartDate;
//exports.getLab = getLab;
