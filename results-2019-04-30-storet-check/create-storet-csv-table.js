#!/usr/bin/env node

"use strict";

var util  = require('util');
var chalk = require("chalk");

var rspc  = require('../lib/readStoretPhysicalChemical');






// going to sort by date, then time
// a and b will be sample objects
var sortThem = function(a,b) {
   var aParts = a[2].split('/');   // 3rd element is a date MM/DD/YY
   var aYear  = aParts[2];
   var aMonth = aParts[0];
   var aDay   = aParts[1];
   var aYMD   = aYear + aMonth + aDay;

   var bParts = b[2].split('/');
   var bYear  = bParts[2];
   var bMonth = bParts[0];
   var bDay   = bParts[1];
   var bYMD   = bYear + bMonth + bDay;

   //console.log("AYMD " + aYMD);

   if (aYMD < bYMD)
     return -1;
   if (aYMD > bYMD)
     return 1;
   if (a[3] < b[3])  // now compare time
     return -1;
   if (a[3] > b[3])
     return 1;
   if (a[1] < b[1]) // now compare hui location code
     return -1;
   if (a[1] > b[1])
     return 1;
   return 0;
};

// first comparison
//var samples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/physical-chemical.csv');

// second check 4/30/19
var samples = rspc.readStoretFile('/Users/bill/development/water-quality/water-quality-data/storet/download-on-2019-04-30/physical-chemical-2019-04-30.csv');

//console.log("samples " + util.inspect(samples, false, null));
var numBSamples = Object.keys(samples).length;


var columns = 
   [ "SampleID",
     "Location",
     "Date",
     "Time",
     "Temp",
     "Salinity",
     "DO",
     "DO%",
     "pH",
     "Turbidity",
     "TotalN",
     "TotalP",
     "Phosphate",
     "Silicate",
     "NNN",
     "NH4"
  ];


var i;
var siteLocKey;
var column;
var row;
var sample;
var rows = [];
for (siteLocKey in samples) {

  sample = samples[siteLocKey];

  row = [];
  for (i = 0; i < columns.length; ++i) {
    column = columns[i];
    if (sample[column]) {
      row.push(sample[column]);
    }
    else {
      row.push("");
    }
  }
  rows.push(row);
}

rows.sort(sortThem);

console.log(columns.join());

for (i = 0; i < rows.length; ++i) {
  console.log(rows[i].join());
}
