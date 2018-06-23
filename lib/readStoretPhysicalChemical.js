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


// look up attribute name from Storet to find the one for doing the comparison
// Using the full attribute name  (col 31) works fine except for DO and DO %, which
// where both called Dissolved oxygen (DO).

var attrLookup = function(attr, attrUnits) {


  var storetToCommon = {
       '"Temperature'         : 'Temp',
       'Ammonia-nitrogen'     : 'NH4',
       Conductivity           :   'Salinity',
       Nitrate                : 'NNN',
       Nitrogen               : 'TotalN',
       'Phosphate-phosphorus' : 'Phosphate',
       Phosphorus             : 'TotalP',
       Silicate               : 'Silicate',
       Turbidity              : 'Turbidity',
       'pH'                   : 'pH'
  };

  if (attr === "Dissolved oxygen (DO)") {
    if (attrUnits === "mg/l") {
      return "DO";
    }
    else if (attrUnits === "%") {
      return "DO%";
    }
  }
  else {
    return storetToCommon[attr];
  }

}


var readStoretFile = function(storetFile) {
  var allSamples = [];
  var lines;
  var pieces;
  var lineCount = 0;
  var i;
  var j;
  var locDateHash = {};
  var hashID = null;

  var contents = fs.readFileSync(storetFile, 'utf8')
  //console.log("contents: " + contents);
  lines = contents.split("\n");
  for (i = 0; i < lines.length; ++i) {
     // console.log("line: " + line);
      ++lineCount;
      pieces = lines[i].split(",");
      //console.log("line " + lineCount + " line length " + pieces.length + " : " + lines[i]);
      //for (j = 0; j < pieces.length; ++j) { console.log(j + "\t" + pieces[j]); }
      if ((lineCount > 1) && (pieces.length == 63 || pieces.length == 64)){  // skip the header line some short last line
        //console.log("knownSites['" + pieces[2] + "'] = '" + pieces[3] + "';" + " known -> " + isKnownSiteCode(pieces[3]));
        obj = {};
        var imbeddedSampleID = pieces[2];
        obj['SampleID']      = imbeddedSampleID.substring(14,23);  // ex: PPU161019
        obj['Location']      = imbeddedSampleID.substring(14,17);  // hui_abv ex: PPU
        var imbeddedDate     = "20" + imbeddedSampleID.substring(17,23);   // HUIWAIOLA_WQX-PPU170419PO4, date from this is 170419
        var dateEntryNoDashes = pieces[6].substring(0,4) + pieces[6].substring(5,7) + pieces[6].substring(8);
        obj['Date'] = pieces[6].substring(5,7) + "/" + pieces[6].substring(8) + "/" + pieces[6].substring(2,4);  // MM/DD/YY
        obj['Time']          = pieces[7].substring(0,5);  // convert from HH:MM:SS to HH:MM;

        var sampleTypeFromCode = imbeddedSampleID.substring(23);  // HUIWAIOLA_WQX-PPU170419PO4, last chars after the date

        if (pieces.length == 64) {   // temperature measurement as a "," in it => Temperature, water
          obj['sampleType']     = attrLookup(pieces[31], pieces[35]);
          obj['sampleValue']    = pieces[34];
          obj['sampleUnits']    = pieces[35];
        }
        else if (pieces.length == 63) {   // other measurements do not have the , in them
          obj['sampleType']     = attrLookup(pieces[31], pieces[34]);
          obj['sampleValue']    = pieces[33];
          obj['sampleUnits']    = pieces[34];
        }
        else {
          console.error("Found a line length of neither 63 or 64 of ", pieces.length);
          process.exit(1);
        }
        //console.log("SAMPLE TYPE " + pieces[31] + ", "  + sampleTypeFromCode + ", " + obj.sampleType);
        if (imbeddedDate !== dateEntryNoDashes) {
          console.error("DATE DIFF SAME ENTRY WARNING " + obj.Location +  " " + imbeddedDate + " " + dateEntryNoDashes + " " + obj.sampleType + " " + obj.sampleValue);
          //console.log("DATE DIFF SAME ENTRY " + obj.Location +  " " + imbeddedDate + " " + dateEntryNoDashes + " " + obj.sampleType + " " + obj.sampleValue);
        }

        //obj['Temp']          = pieces[7];
        //obj['Salinity']      = pieces[8];
        //obj['DO']            = pieces[9];
        //obj['DO%']           = pieces[10];
        //obj['pH']            = pieces[11];
        //obj['Turbidity']     = pieces[12];
        //obj['TotalN']        = pieces[13];
        //obj['TotalP']        = pieces[14];
        //obj['Phosphate']     = pieces[15];
        //obj['Silicate']      = pieces[16];
        //obj['NNN']           = pieces[17];
        //obj['NH4']           = pieces[18];
        //obj['Lat']           = pieces[19];
        //obj['Long']          = pieces[20];
        //obj['QA_Issues']     = pieces[21];
        //obj['SiteNum']       = pieces[23];  no longer using this as of 2/7/18
        allSamples.push(obj);
        /*
        console.log("SITE {location: '" + obj.Location  + "', " 
                            + "siteName: '" + obj.SiteName  + "', "
                            + "lat: " + obj.Lat  + ", "
                            + "lon: " + obj.Long  + ", "
                            + "siteNum: " + obj.SiteNum + "},");
        */
      }
      else {
        //console.log("ERROR: unexpected number of column: " + pieces.length + ". Expecting 44.");
      }
  }

  for (j = 0; j < allSamples.length; ++j) {
    aMeasurement = allSamples[j];
    //console.log("aMeasurement " + j + " " + util.inspect(aMeasurement, false, null));
    var hashID = aMeasurement.Location + "-" + aMeasurement.Date;
    if (! locDateHash[hashID]) {  // first time seeing this hash id
      locDateHash[hashID] = {};
    }
    var sample = locDateHash[hashID];
    sample['SampleID'] = aMeasurement.SampleID;
    sample['Location'] = aMeasurement.Location;
    sample['Date'] = aMeasurement.Date;
    sample['Time'] = aMeasurement.Time;
    sample[aMeasurement.sampleType] = aMeasurement.sampleValue;
  }
  //console.log("sites " + util.inspect(locDateHash, false, null));
  return locDateHash;
};


// save this function in case it is needed and just have the other function return the list



exports.readStoretFile = readStoretFile;
