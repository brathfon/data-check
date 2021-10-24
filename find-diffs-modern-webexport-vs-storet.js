#!/usr/bin/env node

// copied from find-diffs-mySQLexport-vs-storet.js on 7/6/2020
// This script will be used to check against web export files and the data dumped down from store / WQX

"use strict";

var util  = require('util');
var chalk = require("chalk");

var rspc  = require('./lib/readStoretPhysicalChemical');
var rsql  = require('./lib/readMySQLExportFile');



var siteLocKey = "";

// first check done back in june of 2018
//var aSamples = rsql.readWebExportFile('/Users/bill/Development/water-quality/db/reports/first-export-from-db.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/physical-chemical.csv');


// second check after finding that the storet data had not been deleted, but appeared to have some updates from last pull in June of 2018
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/water-quality-master/db/reports/hui-west-maui-thru-2018-01-09.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2019-04-30/physical-chemical-2019-04-30.csv');

// results were equal, so data didn't change between dates
//var aSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2019-04-30/physical-chemical-2019-04-30.csv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2019-12-02/physical-chemical-2019-12-02.csv');


// ran these against each other, not expecting to see any differences, but I did.
//var aSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2019-04-30/physical-chemical-2019-04-30.csv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2020-07-04/csv-data/physical-chemical.csv');

// 2021213 diffing latest web export again WQP (Storet) files after initial population of WQP
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2019-4th-quarter.1.all-labs.tsv');
//var aSamples = rsql.readWebExportFile('/tmp/2019-4th-quarter.1.all-labs.tsv');  // this was a file with errors added in for testing
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20201213-wqp-post-load-session-1-19w/result.tsv')

// final check of the reloaded data for storet that includes 2020 3rd quarter data
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2020-3rd-quarter.1.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20201221-wqp-post-load-cdx-transfer/result.tsv')

// 4th quarter 2020 check
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2020-4th-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20210216-wqp-4th-quarter-2020-post-load/result.tsv')

// 1st quarter 2021 check
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2021-1st-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20210719-wqp-1st-quarter-2021-post-load/result.tsv')

// 2nd quarter 2021 check
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2021-2nd-quarter.0.all-areas.tsv');

// check before EPABEACH update
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20210806-wqp-2nd-quarter-2021-post-load/result.tsv')

// check after EPABEACH update
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20210814-wqp-2nd-quarter-2021-post-epabeach-update/result.tsv')

// 3rd quarter 2021 check after first load
var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2021-3rd-quarter.0.all-areas.tsv');
var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20211021a-wqp-3rd-quarter-2021-post-first-load/result.tsv')

//console.log("aSamples " + util.inspect(aSamples, false, null));
var numASamples = Object.keys(aSamples).length;
//console.log("bSamples " + util.inspect(bSamples, false, null));
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
  var p;
  var param = null;

  for (param in sampleA) {
    if (sampleB[param]) {
      paramsInCommon.push(param);
    }
  }

  console.log("Number of params in common : " + paramsInCommon.length + " for sample " + sampleA.SampleID);

  //console.log("common params " + util.inspect(paramsInCommon, false, null));

  for (p = 0; p < paramsInCommon.length; ++p) {


    param = paramsInCommon[p];

    aValue = sampleA[param];
    bValue = sampleB[param];

    //console.log("param : " + param + " bValue " + bValue);

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
var aSample = null;
var bSample = null;

// first see if there anything in b that is not in a at a high level
for (siteLocKey in aSamples) {

  aSample = aSamples[siteLocKey];

  if (bSamples[siteLocKey]) {
    samplesInCommon.push(siteLocKey);
  }
  else {
    samplesInAOnly.push(siteLocKey);
    // don't need to fix the dates on this data
    //console.log("A sample " + fixDate(aSample.Date) + " @ " + aSample.Location + " NOT FOUND in B");
    console.log("A sample " + aSample.Date + " @ " + aSample.Location + " NOT FOUND in B");
  }
}

for (siteLocKey in bSamples) {

  bSample = bSamples[siteLocKey];

  // don't need to check about in common since we did that above for A vs B

  if (! aSamples[siteLocKey]) {
    //console.log("B sample " + siteLocKey + " NOT FOUND in A");
    samplesInBOnly.push(siteLocKey);
    // don't need to fix the dates on this data
    //console.log("B sample " + fixDate(bSample.Date) + " @ " + bSample.Location + " NOT FOUND in A");
    console.log("B sample " + bSample.Date + " @ " + bSample.Location + " NOT FOUND in A");
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

