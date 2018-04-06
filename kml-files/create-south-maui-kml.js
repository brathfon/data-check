#!/usr/bin/env node

var util  = require('util');
var chalk = require("chalk");

var sites = [
  {location:'KWP', siteName: 'Waipuilani Park'             , lat: 20.755056 , lon: -156.459602 },
  {location:'KKS', siteName: 'Kihei South (Lipoa)'         , lat: 20.747334 , lon: -156.457881 },
  {location:'KKP', siteName: 'Kalama Park'                 , lat: 20.730973 , lon: -156.45372 },
  {location:'KCP', siteName: 'Cove Park'                   , lat: 20.727434 , lon: -156.450077 },
  {location:'KKO', siteName: 'Kamaole Beach I'             , lat: 20.721985 , lon: -156.448183 },
  {location:'KKT', siteName: 'Kamaole Beach III'           , lat: 20.712908 , lon: -156.446596 },
  {location:'MML', siteName: 'Makena Landing'              , lat: 20.653913 , lon: -156.441174 },
  {location:'MMB', siteName: 'Maluaka Beach'               , lat: 20.645598 , lon: -156.443859 },
  {location:'MON', siteName: 'Oneuli'                      , lat: 20.639866 , lon: -156.447406 },
  {location:'MBS', siteName: 'Makena Beach Shoreline'      , lat: 20.63061 ,  lon: -156.446183 },
  {location:'MAN', siteName: 'Ahihi North'                 , lat: 20.618366 , lon: -156.437572 },
  {location:'MAS', siteName: 'Ahihi South'                 , lat: 20.6138 ,   lon: -156.436853 },
  {location:'NHP', siteName: 'Haycraft Park'               , lat: 20.796414 , lon: -156.503198 },
  {location:'NKP', siteName: 'Kealia Pond'                 , lat: 20.794936 , lon: -156.485587 },
  {location:'NSB', siteName: 'Sugar Beach'                 , lat: 20.784204 , lon: -156.466463 },
  {location:'NKC', siteName: 'Kihei Canoe Club'            , lat: 20.781403 , lon: -156.463176 },
  {location:'NMP', siteName: 'Mai Poina \'Oe Ia\'u'        , lat: 20.774894 , lon: -156.460776 },
  {location:'NKN', siteName: 'Kalepolepo North'            , lat: 20.765132 , lon: -156.459344 },
  {location:'WKD', siteName: 'Kilohana Dr'                 , lat: 20.702214 , lon: -156.445921 },
  {location:'WKB', siteName: 'Keawekapu Beach'             , lat: 20.695939 , lon: -156.444632 },
  {location:'WUL', siteName: 'Ulua Beach'                  , lat: 20.69112 ,  lon: -156.444201 },
  {location:'WWA', siteName: 'Wailea Beach'                , lat: 20.68156 ,  lon: -156.443524 },
  {location:'PL' , siteName: 'Palauea'                     , lat: 20.669565 , lon: -156.442907 },
  {location:'WPO', siteName: 'Poolenalena (Chang\'s Beach)', lat: 20.66339 ,  lon: -156.441968 }
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

