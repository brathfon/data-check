#!/usr/bin/env node

/* ***********************************************************************************************************
This script it for comparing the new exports coming out of the mysql database.  It should be used
every time a new web export file is created.  It expects a tsv file with \n endlines.
You should expect no diffs except for new date-location combos.  If you grep on DIFF in the results
and see nothing, that is GOOD!
*********************************************************************************************************** */

var util  = require('util');
var chalk = require("chalk");

var rwef  = require('./lib/readModernWebExportFile');


// comparisons for web export on 2018-06-19  results: no diffs, only new data
//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-01-09.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-03-16.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-01-24.2.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-04-06.0.tsv');

// comparison for web export on 2018-08-17  results: no diffs, only new data
//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-03-16.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-05-18.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-04-06.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-06-01.0.tsv');

// comparison for web export on 2018-11-20  results: no diffs, only new data
//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-05-18.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-west-maui-thru-2018-10-12.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-06-01.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/Development/water-quality/db/reports/hui-south-maui-thru-2018-10-05.0.tsv');

// comparison for web export on 2019-04-02  results: no diffs on old data, only new data
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-soest-branch/db/reports/hui-south-maui-thru-2018-10-05.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-soest-branch/db/reports/hui-south-maui-thru-2018-12-21.0.tsv');

//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-soest-branch/db/reports/hui-west-maui-thru-2018-10-12.0.tsv');
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-soest-branch/db/reports/hui-west-maui-thru-2018-12-14.0.tsv');

// comparison between end of 2018 and first quarter of 2019
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/change-no-nut-recording/db/reports/hui-west-maui-thru-2018-12-14.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/change-no-nut-recording/db/reports/hui-west-maui-thru-2019-1st-quarter.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/change-no-nut-recording/db/reports/hui-south-maui-thru-2018-12-21.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/change-no-nut-recording/db/reports/hui-south-maui-thru-2019-1st-quarter.0.tsv');

// diffing two first quarter reports, a reports have empty nutrient samples for samples not received yet, b goes back to old way of not reporting if no nutrient data
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-nutrient-w53-s28-29/db/reports/hui-south-maui-thru-2019-1st-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-nutrient-w53-s28-29/db/reports/hui-south-maui-thru-2019-1st-quarter.1.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-nutrient-w53-s28-29/db/reports/hui-west-maui-thru-2019-1st-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-nutrient-w53-s28-29/db/reports/hui-west-maui-thru-2019-1st-quarter.1.tsv');

// 7/14/19, 2nd quarter release
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-insitu-58w-34s-nutrient-31-s/db/reports/hui-west-maui-thru-2019-1st-quarter.1.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-insitu-58w-34s-nutrient-31-s/db/reports/hui-west-maui-thru-2019-2nd-quarter.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-insitu-58w-34s-nutrient-31-s/db/reports/hui-south-maui-thru-2019-1st-quarter.1.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-insitu-58w-34s-nutrient-31-s/db/reports/hui-south-maui-thru-2019-2nd-quarter.0.tsv');

// 10/07/19, 3rd quarter release
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2019-2nd-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2019-3rd-quarter.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2019-2nd-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2019-3rd-quarter.0.tsv');


//1/11/20, 4th quarter release for 2019
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-sessions-66w-42s/db/reports/hui-south-maui-thru-2019-3rd-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-sessions-66w-42s/db/reports/hui-south-maui-thru-2019-4th-quarter.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-sessions-66w-42s/db/reports/hui-west-maui-thru-2019-3rd-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/add-sessions-66w-42s/db/reports/hui-west-maui-thru-2019-4th-quarter.0.tsv');

// 2/10/20, checking 4th quarter nutrient completed release
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2019-4th-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2019-4th-quarter.1.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2019-4th-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2019-4th-quarter.1.tsv');

// checking 1st quarter release for 2020
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2019-4th-quarter.1.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2020-1st-quarter.0.tsv');

//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2019-4th-quarter.1.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2020-1st-quarter.0.tsv');

// checking 1st quarter release for 2020, second set
//var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2020-1st-quarter.0.tsv');
//var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2020-1st-quarter.1.tsv');

var aSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2020-1st-quarter.0.tsv');
var bSamples = rwef.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-south-maui-thru-2020-1st-quarter.1.tsv');

//console.log("aSamples " + util.inspect(aSamples, false, null));
//console.log("bSamples " + util.inspect(bSamples, false, null));
//process.exit(1);

var numASamples = Object.keys(aSamples).length;
var numBSamples = Object.keys(bSamples).length;
var siteLocKey = "";


var sample = null;
var i      = 0;

// sometimes list A or B might have blank fields just to show that no samples were taken
var isEmptySample = function(sample) {
  return ((sample.Temp === '') && (sample.Salinity === '')) ? true : false; 
};

/* *************************************************************************************
This function is called when there are differences detected to see if these differences
might be just blank nutrient values that now have values.  This happens quite often
because nutrient data must be sent to the lab and sometimes web exports are sent out
before the nutrient data is available and the collect only has insitu data.  If this
appears to be the case, a string is returned that states that it is probable that
this data is just an update of nutrient data, else it returns a blank ("").
************************************************************************************* */

var checkForUpdatedNutrients = function(param, valueA, valueB) {

  let returnStr = "";

  //console.log(`DEBUG param = |${param}| valueA = |${valueA}| valueB = |${valueB}|`);

  /*
  First case: nutrient data is pending and now is not in the QaIssues field, so
  return the warning string

  Lat     20.669565       20.669565
  Long    -156.442907     -156.442907
  QaIssues        nutrient data pending    DIFF
  ------------------ diffs found for WPO on 12/13/19  -----------------------
  SampleID        WPO191213       WPO191213
  ........

  Second case: for the various nutrient parameters, the old value was blank
  and the new value is the received nutrient data.

  pH      8.18    8.18
  Turbidity       0.40    0.40
  TotalN          100.21 DIFF
  TotalP          7.92 DIFF
  Phosphate               4.11 DIFF
  ......
  */

  if ((param == "QaIssues") && (valueA == 'nutrient data pending') && (valueB == '')) {
    returnStr = ` (Probably pending nutrients updated)`;
  }
  else if ( (param == "TotalN") ||
       (param == "TotalP") ||
       (param == "Phosphate") ||
       (param == "Silicate") ||
       (param == "NNN") ||
       (param == "NH4") ) {

    if ((valueA == '') && (valueB != '')) {
       //returnStr = `valueA = |${valueA}| valueB = |${valueB}|`;
       returnStr = ` (Probably pending nutrients updated)`;
    }
  }

  return returnStr;

};

var diffAB = function(sampleA, sampleB) {

  //console.log("sampleA " + util.inspect(sampleA, false, null));
  //console.log("sampleB " + util.inspect(sampleB, false, null));

  var diffsFound = false;
  var paramsInCommon = [];
  var aValue = null;
  var bValue = null;

  var aValueStripped = null;
  var bValueStripped = null;

  var i = 0;
  var theLocation
  var theDate;

  for (param in sampleA) {
    aValue = sampleA[param];
    if (sampleB[param] !== null) {
      paramsInCommon.push(param);

      bValue = sampleB[param];

      // get rid of leading trailing zeros on the numbers
      if (param !== "Date" ) {
        aValue = aValue.replace(/0+$/g, '').replace(/\.+$/g, '').replace(/^0+/g, '');
        bValue = bValue.replace(/0+$/g, '').replace(/\.+$/g, '').replace(/^0+/g, '');
      }

      //if ((aValue !== bValue) && (param !== "SiteName")) {   // DANGER: not comparing SiteName, but may later
      if ((aValue !== bValue)) {   // DANGER: not comparing SiteName, but may later
        //console.log("found a diff for param " + param);
        diffsFound = true;
      }
    }
    else {
      console.log("ERROR. Param " + param + " not found in sampleB");
    }
  }

  //console.log("common params " + util.inspect(paramsInCommon, false, null));
  //console.log("diffs found " + diffsFound);

  if (diffsFound === true) {
    theLocation = sampleA.Location;
    theDate = sampleA.Date;
    console.log("------------------ diffs found for " + theLocation + " on " + theDate + "  -----------------------");
    for (i = 0; i < paramsInCommon.length; ++i) {
      param = paramsInCommon[i];
      aValue = sampleA[param];
      bValue = sampleB[param];
      // get rid of leading trailing zeros on the numbers
      if (param !== "Date" ) {
        aValueStripped = aValue.replace(/0+$/g, '').replace(/\.+$/g, '').replace(/^0+/g, '');
        bValueStripped = bValue.replace(/0+$/g, '').replace(/\.+$/g, '').replace(/^0+/g, '');
      }
      //console.log("comparing param " + param + " with values " + aValue + " and " + bValue);
      //if ((aValueStripped !== bValueStripped) && (param !== "SiteName")){
      if (aValueStripped !== bValueStripped){
        //console.log(chalk.red(param + "\t" + aValue + "\t" + bValue + " DIFF"));
        console.log(chalk.red(`${param}\t${aValue}\t${bValue} DIFF ${checkForUpdatedNutrients(param, aValue, bValue)}`));
      }
      else {
        console.log(param + "\t" + aValue + "\t" + bValue);
      }
    }
  }
};


// don't think this is needed so just return the passed in to test that
var fixDate = function(aDate) {
   return aDate;
/*
   var parts = aDate.split("/");
   var year = parts[2];
   var day = parts[1];
   var month = parts[0];
   if (day < 10) {
     day = "0" + day;
   }
   if (month < 10) {
     month = "0" + month;
   }
   return year + "-" + month + "-" + day;
*/
};

console.log(numASamples + " samples found in group A");
console.log(numBSamples + " samples found in group B");

// these are lists of the keys
var samplesInAOnly = [];
var samplesInBOnly = [];
var samplesInCommon = [];

// first see if there anything in b that is not in a at a high level
for (siteLocKey in aSamples) {

  aSample = aSamples[siteLocKey];

  if (bSamples[siteLocKey]) {
    samplesInCommon.push(siteLocKey);
  }
  else {
    samplesInAOnly.push(siteLocKey);
    console.log("A sample " + fixDate(aSample.Date) + " @ " + aSample.Location + " NOT FOUND in B");
  }
}

for (siteLocKey in bSamples) {

  bSample = bSamples[siteLocKey];

  // don't need to check about in common since we did that above for A vs B

  if (! aSamples[siteLocKey]) {
    //console.log("B sample " + siteLocKey + " NOT FOUND in A");
    samplesInBOnly.push(siteLocKey);
    console.log("B sample " + fixDate(bSample.Date) + " @ " + bSample.Location + " NOT FOUND in A");
  }
}

console.log("Samples only in A: " + samplesInAOnly.length);
console.log("Samples only in B: " + samplesInBOnly.length);
console.log("Samples in common: " + samplesInCommon.length);

// Now loop through the common files
for (i = 0; i < samplesInCommon.length; ++i)
{

  siteLocKey = samplesInCommon[i];
  aSample = aSamples[siteLocKey];
  bSample = bSamples[siteLocKey];

  if (isEmptySample(aSample)) {
    console.log("A sample " + fixDate(aSample.Date) + " @ " + aSample.Location + " is empty");
  }
  else if (isEmptySample(bSample)) {
    console.log("B sample " + fixDate(bSample.Date) + " @ " + bSample.Location + " is empty");
  }
  else {
    diffAB(aSample, bSample);
  }

}

