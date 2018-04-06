#!/usr/bin/env node

var util  = require('util');
var chalk = require("chalk");

var sites = [
  {location: 'OCO', siteName: 'Camp Olowalu', lat: 20.80986, lon: -156.61369, siteNum: 19},
  {location: 'OLP', siteName: 'Launiupoko', lat: 20.84236, lon: -156.653035, siteNum: 17},
  {location: 'OMM', siteName: 'Mile Marker 14', lat: 20.80915, lon: -156.60661, siteNum: 20},
  {location: 'OPB', siteName: 'Papalaua', lat: 20.793809, lon: -156.575211, siteNum: 22},
  {location: 'OPM', siteName: 'Peter Martin Hale', lat: 20.808444, lon: -156.619697, siteNum: 18},
  {location: 'OPP', siteName: 'Papalaua Pali', lat: 20.792747, lon: -156.567326, siteNum: 23},
  {location: 'OSF', siteName: 'Olowalu shore front', lat: 20.80916, lon: -156.62289, siteNum: 16},
  {location: 'OUB', siteName: 'Ukumehame Beach', lat: 20.79448, lon: -156.58142, siteNum: 21},
  {location: 'PFF', siteName: '505 Front Street', lat: 20.86732, lon: -156.67605, siteNum: 12},
  {location: 'PLH', siteName: 'Lindsey Hale', lat: 20.86485, lon: -156.67374, siteNum: 13},
  {location: 'PLT', siteName: 'Lahaina Town', lat: 20.86356, lon: -156.67297, siteNum: 14},
  {location: 'PPU', siteName: 'Puamana', lat: 20.859233, lon: -156.669442, siteNum: 15},
  {location: 'RAB', siteName: 'Airport Beach', lat: 20.936669, lon: -156.69278, siteNum: 9},
  {location: 'RCB', siteName: 'Canoe Beach', lat: 20.910347, lon: -156.689382, siteNum: 10},
  {location: 'RFN', siteName: 'Fleming N', lat: 21.005, lon: -156.65084, siteNum: 2},
  {location: 'RFS', siteName: 'Kapalua Bay', lat: 20.998924, lon: -156.666746, siteNum: 4},
  {location: 'RHL', siteName: 'Honolua', lat: 21.013058, lon: -156.63834, siteNum: 1},
  {location: 'RKO', siteName: 'Ka\'opala', lat: 20.982074, lon: -156.673398, siteNum: 6},
  {location: 'RKS', siteName: 'Kaanapali Shores', lat: 20.949331, lon: -156.691124, siteNum: 8},
  {location: 'RKV', siteName: 'Kahana Village', lat: 20.976561, lon: -156.678, siteNum: 7},
  {location: 'RNS', siteName: 'Napili (south end)', lat: 20.994222, lon: -156.667417, siteNum: 5},
  {location: 'RON', siteName: 'Oneloa', lat: 21.004056, lon: -156.65894, siteNum: 3},
  {location: 'RPO', siteName: 'Pohaku', lat: 20.967083, lon: -156.68139, siteNum: 7},
  {location: 'RWA', siteName: 'Wahikuli', lat: 20.904476, lon: -156.685931, siteNum: 11},
/* original
  {location: 'OCO', siteName: 'Camp Olowalu', lat: 20.80986, lon: -156.61369, siteNum: 19},
  {location: 'OLP', siteName: 'Launiupoko', lat: 20.84236, lon: -156.653035, siteNum: 17},
  {location: 'OMM', siteName: 'Mile Marker 14', lat: 20.80915, lon: -156.60661, siteNum: 20},
  {location: 'OPB', siteName: 'Papalaua', lat: 20.79348, lon: -156.57492, siteNum: 22},
  {location: 'OPM', siteName: 'Peter Martin Hale', lat: 20.808444, lon: -156.619697, siteNum: 18},
  {location: 'OPP', siteName: 'Papalaua Pali', lat: 20.79269, lon: -156.56872, siteNum: 23},
  {location: 'OSF', siteName: 'Olowalu shore front', lat: 20.80916, lon: -156.62289, siteNum: 16},
  {location: 'OUB', siteName: 'Ukumehame Beach', lat: 20.79448, lon: -156.58142, siteNum: 21},
  {location: 'PFF', siteName: '505 Front Street', lat: 20.86732, lon: -156.67605, siteNum: 12},
  {location: 'PLH', siteName: 'Lindsey Hale', lat: 20.86485, lon: -156.67374, siteNum: 13},
  {location: 'PLT', siteName: 'Lahaina Town', lat: 20.86356, lon: -156.67297, siteNum: 14},
  {location: 'PPU', siteName: 'Puamana', lat: 20.859233, lon: -156.669442, siteNum: 15},
  {location: 'RAB', siteName: 'Airport Beach', lat: 20.936669, lon: -156.69278, siteNum: 9},
  {location: 'RCB', siteName: 'Canoe Beach', lat: 20.910017, lon: -156.68917, siteNum: 10},
  {location: 'RFN', siteName: 'Fleming N', lat: 21.005, lon: -156.65084, siteNum: 2},
  {location: 'RFS', siteName: 'Kapalua Bay', lat: 20.998636, lon: -156.66667, siteNum: 4},
  {location: 'RHL', siteName: 'Honolua', lat: 21.013058, lon: -156.63834, siteNum: 1},
  {location: 'RKO', siteName: 'Ka\'opala', lat: 20.981967, lon: -156.67308, siteNum: 6},
  {location: 'RKS', siteName: 'Kaanapali Shores', lat: 20.949331, lon: -156.691124, siteNum: 8},
  {location: 'RKV', siteName: 'Kahana Village', lat: 20.9644444, lon: -156.6630556, siteNum: 7},
  {location: 'RNS', siteName: 'Napili (south end)', lat: 20.994222, lon: -156.667417, siteNum: 5},
  {location: 'RON', siteName: 'Oneloa', lat: 21.004056, lon: -156.65894, siteNum: 3},
  {location: 'RPO', siteName: 'Pohaku', lat: 20.967083, lon: -156.68139, siteNum: 7},
  {location: 'RWA', siteName: 'Wahikuli', lat: 20.90423, lon: -156.68593, siteNum: 11}
*/
];

for (var i = 0; i < sites.length; ++i) {

  //console.log(sites[i]);

  var placemark = 
  "\t\t" + "<Placemark>" + "\n" +
  "\t\t\t" + "<name>" + sites[i].siteName + "</name>" + "\n" +
  "\t\t\t" + "<visibility>0</visibility>" + "\n" +
  "\t\t\t" + "<styleUrl>#m_ylw-pushpin6</styleUrl>" + "\n" +
  "\t\t\t" + "<Point>" + "\n" +
  "\t\t\t\t" + "<gx:drawOrder>1</gx:drawOrder>" + "\n" +
  "\t\t\t\t" + "<coordinates>" + sites[i].lon +"," + sites[i].lat + "</coordinates>" + "\n" +
  "\t\t\t" + "</Point>" + "\n" +
  "\t\t" + "</Placemark>" + "\n";

  console.log(placemark);

}

var ending =
 "\t" + "</Folder>" + "\n" +
 "</Document>" + "\n" +
 "</kml>" + "\n";
console.log(ending);

