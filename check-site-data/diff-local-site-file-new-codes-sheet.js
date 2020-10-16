#!/usr/bin/env node


// This script is going to read the site file that is used for the hui-data reports and compare
// it to the site data from the "site code" sheet in google sheets that has been download with tabs
  

"use strict";

const util  = require('util');
const fs    = require('fs');
const path  = require('path');

//const readline = require('readline');   for checking to see if files already exit, but not using now

const scriptname = path.basename(process.argv[1]);

//var argv = require('minimist')(process.argv.slice(2));
//console.dir(`arguments passed in ${process.argv}`);
//console.dir(`arguments passed in ${util.inspect(process.argv, false, null)}`);

//console.dir(`args length ${process.argv.length}`);

const printUsage = function () {
  console.log(`Usage: ${scriptname} <site file> <tab delimited site code file>`);
}

if (process.argv.length != 4 ) {
  printUsage();
  process.exit();
}

let oldSiteFile  = process.argv[2];
let newSiteSheet = process.argv[3];

if (! fs.existsSync(oldSiteFile)) {
  console.error(`${oldSiteFile} does not exist .... exiting`);
}

if (! fs.existsSync(newSiteSheet)) {
  console.error(`${newSiteSheet} does not exist .... exiting`);
}


// This is sort of the global data.  It will be passed from function to function to store temporary results
// It will also have the args in it.
var data = {};
data['oldSiteFile'] = oldSiteFile;
data['newSiteSheet'] = newSiteSheet;

var rsf   = require('../lib/readSiteFile');
var rsgs  = require('../lib/readSiteGdriveSheet');


// this is how many significate digits should be printed in the report
const reportPrecision = {};
reportPrecision['Lat']       = 6;
reportPrecision['Long']      = 6;

var getPrecisionForMeasurement = function (column) {
  return reportPrecision[column];
};


// read the original site data that is used in the database and HUI reports

var getDbSiteData = function (data, callback) {

  console.log("In getDbSiteData");
  data['dbSites'] = rsf.readSiteFile(data.oldSiteFile);

  console.dir(data.dbSites);

  if (callback) {
    callback();
  }

};


// return the latitude for this site. Set the precision of the value before returning
// It is a critical error if there is a site called out that does data, so exit the program

var getLatFor = function (siteCode, data) {
   if (data.sites[siteCode]) {
     return setPrecision('Lat', data.sites[siteCode].lat);
   }
   else {
     console.error(`site code ${siteCode} not found in site data.  Exiting script.`);
     process.exit(1);
   }
}


// do the same for longitude

var getLongFor = function (siteCode, data) {
   if (data.sites[siteCode]) {
     return setPrecision('Long', data.sites[siteCode].lon);
   }
   else {
     console.error(`site code ${siteCode} not found in site data.  Exiting script.`);
     process.exit(1);
   }
}


// return the long name for this site. example: Kaanapali Shores
// It is a critical error if there is a site called out that does data, so exit the program

var getSiteNameFor = function (siteCode, data) {
   if (data.sites[siteCode]) {
     return  data.sites[siteCode].long_name;
   }
   else {
     console.error(`site code ${siteCode} not found in site data.  Exiting script.`);
     process.exit(1);
   }
}


// Read the tab separated data from the Google Sheets for each site

var readSiteGdriveData = function (data, callback) {

  console.log("In readSiteGdriveData");

  data['gDriveSites'] = rsgs.readSiteGdriveSheet(data.newSiteSheet);

  console.dir(data.gDriveSites);
  if (callback) {
    callback();
  }

};

/*

  Find the diffs in the sites.  Only interested in comparing a few of the attributes and
  are using the site_id/Hui_ID is a the key.
   
  from DB
  RNS: {
    site_id: '1',
    hui_abv: 'RNS',
    storet_code: '000723',
    long_name: 'Napili',
    lab_id: '1',
    default_sample_day: '1',
    default_sampling_order: '1',
    geo_order: 'NULL',
    lat: '20.994222',
    lon: '-156.667417',
    active: '1',
    description: 'NULL'
  },

  from gDrive sheet
  RNS: {
    Hui_ID: 'RNS',   <-- site_id from db
    Status: 'Active',
    Area: 'Ridge to Reef',
    Site_Name: 'Napili',     <-- this is the long_name from db
    Station_Name: 'Napili',
    Display_Name: 'Napili Bay',
    DOH_ID: '723',
    Surfrider_ID: '',
    Lat: '20.994222',
    Long: '-156.667417',
    Dates_Sampled: ''
  },
*/


var findDiffs = function (data, callback) {

  console.log("In findDiffs");
   
  //console.dir(data.gDriveSites);
  //console.dir(data.dbSites);

  console.log(`Number of key IDs in db:          ${Object.keys(data.dbSites).length}`);
  console.log(`Number of key IDs in gDriveSites: ${Object.keys(data.gDriveSites).length}`);

  // look for sites only in db sites
  for (let dbSite in data.dbSites) {
    if (! data.gDriveSites[dbSite]) {
      console.log(`site ${dbSite} missing from gDrive sites`);
    }
  }

  // look for sites only in gDrive sheet
  for (let gDriveSite in data.gDriveSites) {
    if (! data.dbSites[gDriveSite]) {
      let obj = data.gDriveSites[gDriveSite];  // convenience ref
      console.log(`site ${gDriveSite} missing from db sites ${obj.Site_Name}`);
    }
  }

  // now compare the common sites by matching IDs and then looking at several attributes
  for (let dbSite in data.dbSites) {
    let dbObj     = data.dbSites[dbSite];
    let gDriveObj = data.gDriveSites[dbSite];

    if (dbObj.long_name != gDriveObj.Site_Name) {
       console.log(`${dbSite} names do not match. db: ${dbObj.long_name} gDrive: ${gDriveObj.Site_Name}`);
    }

    if (dbObj.lat != gDriveObj.Lat) {
       console.log(`${dbSite} ${dbObj.long_name} latitudes do not match. db: ${dbObj.lat} gDrive: ${gDriveObj.Lat}`);
    }

    if (dbObj.lon != gDriveObj.Long) {
       console.log(`${dbSite} ${dbObj.long_name} longitudes do not match. db: ${dbObj.lon} gDrive: ${gDriveObj.Long}`);
    }

   if (dbObj.storet_code != "NULL") {
     const regex = /^0*/;
     let storetNoLeading0 = dbObj.storet_code.replace(regex, '') ;
     if (storetNoLeading0 != gDriveObj.DOH_ID) {
         //console.log(`${dbSite} ${dbObj.long_name} storet_codes do not match. db: ${dbObj.storet_code} gDrive: ${gDriveObj.DOH_ID}`);
         console.log(`${dbSite} ${dbObj.long_name} storet_codes do not match. db: ${storetNoLeading0} gDrive: ${gDriveObj.DOH_ID}`);
     }
   }

  }



  if (callback) {
    callback();
  }

};


// this is the main

getDbSiteData(data, function () {
  readSiteGdriveData(data, function () {
    findDiffs(data, null);
  });
});

