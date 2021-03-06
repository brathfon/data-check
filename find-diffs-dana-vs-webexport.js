#!/usr/bin/env node

var util  = require('util');
var chalk = require("chalk");

var rssf  = require('./lib/readSingleSiteFiles');
var rwef  = require('./lib/readWebExportFile');


var aSamples = rssf.readSiteFiles('tsv-files/single-site-files');
var numASamples = Object.keys(aSamples).length;
var siteLocKey = "";


//var bSamples = rwef.readWebExportFile('tsv-files/webexport_2018-02-05.tsv');
//var bSamples = rwef.readWebExportFile('tsv-files/webexport_2018-02-05-fixed.tsv');
//var bSamples = rwef.readWebExportFile('tsv-files/webexport_2018-02-05-fixed-lat-lons.tsv');
//var bSamples = rwef.readWebExportFile('tsv-files/webexport_2018-02-05-fixed-site-names-lat-lons.tsv');
//var bSamples = rwef.readWebExportFile('tsv-files/webexport_2018-03-02.tsv');
var bSamples = rwef.readWebExportFile('deliveries/hui-west-maui-thru-2017-11-17.tsv');

var numBSamples = Object.keys(bSamples).length;

var sample = null;
var i      = 0;

// sometimes list A or B might have blank fields just to show that no samples were taken
var isEmptySample = function(sample) {
  return ((sample.Temp === '') && (sample.Salinity === '')) ? true : false; 
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

