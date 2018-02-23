#!/bin/bash


for filename in ./*.tsv
do
  newName=`echo $filename | sed 's/tsv/csv/g'`
  echo $filename $newName
  ./tsv-to-csv.pl $filename  > $newName
done