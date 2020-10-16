#!/usr/bin/env node


// This script reads the site code sheet from gdrive and the csv version of the data in wqx web
// from from the xcel spread sheet "MonitoringLocationsExport".
  

"use strict";

const util  = require('util');
const fs    = require('fs');
const path  = require('path');
var rsgs  = require('../lib/readSiteGdriveSheet');
var rwwml = require('../lib/readWQXWebMonitoringLocationsExport.js');

const scriptname = path.basename(process.argv[1]);

const printUsage = function () {
  console.log(`Usage: ${scriptname} <tab delimited site code file> <WQX Web Monitoring Locations csv file`);
}

if (process.argv.length != 4 ) {
  printUsage();
  process.exit();
}

let gDriveSiteSheet = process.argv[2];
let wqxWebSiteFile  = process.argv[3];

if (! fs.existsSync(wqxWebSiteFile)) {
  console.error(`${wqxWebSiteFile} does not exist .... exiting`);
}

if (! fs.existsSync(gDriveSiteSheet)) {
  console.error(`${gDriveSiteSheet} does not exist .... exiting`);
}


// This is sort of the global data.  It will be passed from function to function to store temporary results
// It will also have the args in it.
var data = {};
data['wqxWebSiteFile'] = wqxWebSiteFile;
data['gDriveSiteSheet'] = gDriveSiteSheet;

// read the original site data that is used in the database and HUI reports

var getWQXWebSiteData = function (data, callback) {

  console.log("In getWQXWebSiteData");
  data['wQXWebSites'] = rwwml.readWQXWebLocationsCsvFile(data.wqxWebSiteFile);

  console.dir(data.wQXWebSites);

  if (callback) {
    callback();
  }

};


// Read the tab separated data from the Google Sheets for each site

var readSiteGdriveData = function (data, callback) {

  console.log("In readSiteGdriveData");

  data['gDriveSites'] = rsgs.readSiteGdriveSheet(data.gDriveSiteSheet);

  console.dir(data.gDriveSites);

  if (callback) {
    callback();
  }

};

/*

  Find the diffs in the sites.  Only interested in comparing a few of the attributes and
  are using the site_id/Hui_ID is a the key.

  from WQX
  RNS: {
    Organization_ID: 'HUIWAIOLA_WQX',
    Monitoring_Location_ID: 'RNS',
    Monitoring_Location_Name: 'Napili (south end)',
    Monitoring_Location_Type: 'Ocean',
    Latitude: '20.994222',
    Longitude: '-156.667417',
    Last_Changed: '05-23-2017 12:11:17 AM'
  },

   
  from gDrive sheet
  RNS: {
    Hui_ID: 'RNS',
    Status: 'Active',
    Area: 'Ridge to Reef',
    Site_Name: 'Napili',
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
  //console.dir(data.wQXWebSites);

  console.log(`Number of key IDs in WQX:         ${Object.keys(data.wQXWebSites).length}`);
  console.log(`Number of key IDs in gDriveSites: ${Object.keys(data.gDriveSites).length}`);

  // look for sites only in WQX Web sites
  for (let wqxSite in data.wQXWebSites) {
    if (! data.gDriveSites[wqxSite]) {
      console.log(`site ${wqxSite} missing from gDrive sites`);
    }
  }

  // look for sites only in gDrive sheet
  for (let gDriveSite in data.gDriveSites) {
    if (! data.wQXWebSites[gDriveSite]) {
      let obj = data.gDriveSites[gDriveSite];  // convenience ref
      console.log(`site ${gDriveSite} missing from WQX sites ${obj.Site_Name}`);
    }
  }

  // now compare the common sites by matching IDs and then looking at several attributes
  for (let wqxSite in data.wQXWebSites) {
    let wqxObj    = data.wQXWebSites[wqxSite];
    let gDriveObj = data.gDriveSites[wqxSite];

    if (gDriveObj != null) {

      if (wqxObj.Monitoring_Location_Name != gDriveObj.Site_Name) {
         console.log(`${wqxSite} names do not match. WQX: ${wqxObj.Monitoring_Location_Name} gDrive: ${gDriveObj.Site_Name}`);
      }

      if (wqxObj.Latitude != gDriveObj.Lat) {
         console.log(`${wqxSite} latitudes do not match. WQX: ${wqxObj.Latitude} gDrive: ${gDriveObj.Lat}`);
      }

      if (wqxObj.Longitude != gDriveObj.Long) {
         console.log(`${wqxSite} longitudes do not match. WQX: ${wqxObj.Longitude} gDrive: ${gDriveObj.Long}`);
      }
   }

  }



  if (callback) {
    callback();
  }

};


// this is the main

getWQXWebSiteData(data, function () {
  readSiteGdriveData(data, function () {
    findDiffs(data, null);
  });
});

