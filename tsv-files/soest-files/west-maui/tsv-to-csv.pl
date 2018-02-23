#!/usr/bin/perl

######################################################################################
######################################################################################


use strict;
#use Time::Local;
use File::Basename;
#use File::Copy;
#use File::Path qw(make_path);

my $scriptname = basename($0);


my $debug = 0;

die "Usage: $scriptname <csv file>" unless (@ARGV == 1);

my $inFilename = $ARGV[0];

open( INFILE, $inFilename) || die "Unable to open $inFilename for reading";

local $/ = "\r";

while (<INFILE>)
{
  #chomp;
  my $currentCsvLine = $_;
  my $line = $_;
  $line =~ s/\t/,/g;
  print "$line";
}

exit;