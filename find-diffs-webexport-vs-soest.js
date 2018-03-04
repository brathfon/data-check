#!/usr/bin/env node

var util  = require('util');
var chalk = require("chalk");

var rsf  = require('./lib/readSoestFiles');
var rwef  = require('./lib/readWebExportFile');


var aSites = rsf.readSoestFiles('tsv-files/soest-files/west-maui');
//console.log("aSites " + util.inspect(aSites, false, null));

var bSites = rwef.readWebExportFile('tsv-files/webexport_2018-02-05-fixed.tsv');
//console.log("bSites " + util.inspect(bSites, false, null));

var sample = null;


// sometimes list A or B might have blank fields just to show that no samples were taken
var isEmptySample = function(sample) {
  //console.log("checking emptiness " + util.inspect(sample, false, null));
  return ((sample.TotalN === '') && (sample.TotalP === '')) ? true : false; 
  //return false;  // right now don't think it applies to nutrient data
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

      if (aValue !== bValue) {
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
      if (aValueStripped !== bValueStripped){
        console.log(chalk.red(param + "\t" + aValue + "\t" + bValue + " DIFF"));
      }
      else {
        console.log(param + "\t" + aValue + "\t" + bValue);
      }
    }
  }
};


var fixDate = function(aDate) {
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
};

// first see if there anything in b that is not in a at a high level
for (aSiteLocDate in aSites) {

  aSample = aSites[aSiteLocDate];

  if (isEmptySample(aSample)) {
    console.log("A sample " + fixDate(aSample.Date) + " @ " + aSample.Location + " is empty");
  }
  else if (! bSites[aSiteLocDate]) {
    console.log("A sample " + fixDate(aSample.Date) + " @ " + aSample.Location + " NOT FOUND in B");
  }
}

for (bSiteLocDate in bSites) {
  bSample = bSites[bSiteLocDate];

  if (isEmptySample(bSample)) {
    console.log("B sample " + fixDate(bSample.Date) + " @ " + bSample.Location + " is empty");
  }
  else if (! aSites[bSiteLocDate]) {
    //console.log("B sample " + bSiteLocDate + " NOT FOUND in A");
    console.log("B sample " + fixDate(bSample.Date) + " @ " + bSample.Location + " NOT FOUND in A");
  }
}

// now diff them
for (aSiteLocDate in aSites) {

  aSample = aSites[aSiteLocDate];

  if (! bSites[aSiteLocDate]) {
    console.log("Skipping " + aSiteLocDate + " because it is not in B");
  }
  else {  // it is both a and b
    bSample = bSites[aSiteLocDate];
    if (isEmptySample(aSample)) {
     console.log("Skipping " + aSiteLocDate + " in site A because it is empty");
    }
    else if (isEmptySample(bSample)) {
     console.log("Skipping " + aSiteLocDate + " in site B because it is empty");
    }
    else {
      diffAB(aSample, bSample);
    }
  }
}

