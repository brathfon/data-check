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


// 2022

// 2nd quarter 2022
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2022-2nd-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20220801a-wqp-2nd-quarter-2022-post-load/resultphyschem.tsv');

// 3rd quarter 2022
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2022-3rd-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20230215a-wqp-3rd-quarter-2022-post-load/resultphyschem.tsv');

// 4th quarter 2022
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2022-4th-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20230315a-wqp-4th-quarter-2022-post-load/resultphyschem.tsv');

// 2023

// 1st quarter 2023
//var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2023-1st-quarter.0.all-areas.tsv');
//var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20230704a-wqp-1st-quarter-2023-post-load/resultphyschem.tsv');

// 2nd quarter 2023
var aSamples = rsql.readWebExportFile('/Users/bill/development/water-quality/hui-reports/reports/web-export-quarterly-reports/2023-2nd-quarter.0.all-areas.tsv');
var bSamples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/20230816a-wqp-2nd-quarter-2023-post-load/resultphyschem.tsv');

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

