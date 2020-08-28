// looks like this file was used to read sample data for a single site or something.
// don't remember how it was used, but was created when first check STORET.
// I think Dana had her spreadsheets organized by sites.

var util  = require('util');
var fs    = require('fs');
var path  = require('path');


// the key is the site code, which will be the key
var knownSites = [];
knownSites['OCO'] = 'Camp Olowalu';
knownSites['OLP'] = 'Launiupoko';
knownSites['OMM'] = 'Mile Marker 14';
knownSites['OPB'] = 'Papalaua Beach Park';
knownSites['OPM'] = 'Peter Martin Hale';
knownSites['OPP'] = 'Papalaua Pali';
knownSites['OSF'] = 'Olowalu Shore Front';
knownSites['OUB'] = 'Ukumehame Beach';
knownSites['PFF'] = '505 Front Street';
knownSites['PLH'] = 'Lindsey Hale';
knownSites['PLT'] = 'Lahaina Town';
knownSites['PPU'] = 'Puamana';
knownSites['RAB'] = 'Airport Beach';
knownSites['RCB'] = 'Canoe Beach';
knownSites['RFN'] = 'Fleming North';
knownSites['RFS'] = 'Fleming South';
knownSites['RHL'] = 'Honolua Bay';
knownSites['RKO'] = 'Ka\'opala Bay';
knownSites['RKS'] = 'Kaanapali Shores';
knownSites['RKV'] = 'Kahana Village';
knownSites['RNS'] = 'Napili south';
knownSites['RON'] = 'Oneloa Bay';
knownSites['RPO'] = 'Pohaku';
knownSites['RWA'] = 'Wahikuli Beach';

var isKnownSiteCode = function (siteCode) {
  return (knownSites[siteCode]) ? true : false;
}


var getSiteFiles = function(directory) {
  var siteFiles = [];
  console.log("checking directory " + directory);
  try {
     var files = fs.readdirSync(directory);
     files.map(function (file) {
         return path.join(directory, file);
     }).filter(function (file) {
         console.log("checking file " + file);
         return (
                  fs.statSync(file).isFile() &&
                  (path.basename(file).match(/locations/) != null) &&
                  (path.basename(file).match(/\.tsv$/) != null)
                );
     }).forEach(function (filteredFile) {
         //var hostname = path.basename(filteredFile).replace("\.local", "");
         //console.log("try-catch version %s (%s)", filteredFile, path.extname(filteredFile));
         //var base = path.basename(filteredFile);
         //console.log("adding " + filteredFile);
         siteFiles.push(filteredFile);
     });
  } catch (err) {
     console.log("ERROR CAUGHT in getSiteFiles: " + err);
    return null;
  }
  return siteFiles.sort();
}



var readSiteFile = function(teamFileFile) {
  var lineList = [];
  var lines;
  var pieces;
  var lineCount = 0;
  var j;
  var contents = fs.readFileSync(teamFileFile, 'utf8')
  //console.log("contents: " + contents);
  lines = contents.split("\r");
  lines.forEach( function (line) {
      //console.log("line: " + line);
      ++lineCount;
      pieces = line.split("\t");
      //console.log("line " + lineCount + " line length " + pieces.length);
        if ((pieces.length >= 2) && isKnownSiteCode(pieces[1])) {
         //console.log("knownSites['" + pieces[1] + "'] = '" + pieces[0] + "';" + " known -> " + isKnownSiteCode(pieces[1]));
         // console.log("line: " + line);
          //for (j = 0; j < pieces.length; ++j) {
            //console.log(pieces[j]);
          //}
          obj = {};
          obj['SiteName']      = pieces[0];
          obj['Location']      = pieces[1];
          obj['Date']          = pieces[2];
          obj['Time']          = pieces[3];
          obj['Temp']          = pieces[4];
          obj['Salinity']      = pieces[5];
          obj['DO']            = pieces[6];
          obj['DO%']           = pieces[7];
          obj['pH']            = pieces[8];
          obj['Turbidity']     = pieces[9];
          obj['TotalN']        = pieces[10];
          obj['TotalP']        = pieces[11];
          obj['Phosphate']     = pieces[12];
          obj['Silicate']      = pieces[13];
          obj['NNN']           = pieces[14];
          obj['NH4']           = pieces[15];
          lineList.push(obj);
        }
        else {
          //console.log("ERROR: unexpected number of column: " + pieces.length + ". Expecting 44.");
        }
    });
  return lineList;
};


var readSiteFiles = function(directory) {
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
  //console.log("sites " + util.inspect(locDateHash, false, null));
  return locDateHash;
};



exports.readSiteFiles = readSiteFiles;
//exports.getStartDate = getStartDate;
//exports.getLab = getLab;
