var util  = require('util');
var fs    = require('fs');
var path  = require('path');


var parseSiteGdriveSheet = function(siteGdriveSheet) {

  // attribute will the be hui site id like "RNS" and value will be a object of key values of site information
  var sites = {};
  var lines;

  var contents = fs.readFileSync(siteGdriveSheet, 'utf8')
  //console.log("contents: " + contents);
  lines = contents.split("\n");


  // The first line is a header.  The rest are tab-delimited lines of site information
  // Hui ID  Status  Area    Site Name       Station Name    Display Name    DOH ID  Surfrider ID    Lat     Long    Dates Sampled^M
  // PFF     Active  Polanui 505 Front Street                505 Front St                    20.86732        -156.67605      ^M

  for (let i = 1; i < lines.length; ++i) 
  {
      const line = lines[i];
      //console.log("line: " + line);

      const pieces = line.split("\t");

      //console.log("line " + i + " line length " + pieces.length);
      //for (let j = 0; j < pieces.length; ++j) { console.log(j + "\t" + pieces[j]); }

      if (pieces.length == 11) {
        //console.log("line: " + line);
        obj = {};
        obj['Hui_ID']        = pieces[0].trim();
        obj['Status']        = pieces[1].trim();
        obj['Area']          = pieces[2].trim();
        obj['Site_Name']     = pieces[3].trim();
        obj['Station_Name']  = pieces[4].trim();
        obj['Display_Name']  = pieces[5].trim();
        obj['DOH_ID']        = pieces[6].trim();
        obj['Surfrider_ID']  = pieces[7].trim();
        obj['Lat']           = pieces[8].trim();  // ex: 20.994222
        obj['Long']          = pieces[9].trim(); // ex: -156.667417
        obj['Dates_Sampled'] = pieces[10].trim(); // a text description of the location

        // create a key-value pair of the hui_abv and the site data for easy of lookup
        // some of the sites in the table have no Hui ID, and we are not interested in them
        if (obj.Hui_ID != "") {
          sites[obj.Hui_ID] = obj;
        }
      }
      else {
        console.log("ERROR: unexpected number of column: " + pieces.length + ". Expecting 14 or more. Line: " + line);
      }
    };

  //console.log("sites " + util.inspect(sites, false, null));
  return sites;
};


var readSiteGdriveSheet = function(siteGdriveSheet) {

  return parseSiteGdriveSheet(siteGdriveSheet);

}


exports.readSiteGdriveSheet = readSiteGdriveSheet;
