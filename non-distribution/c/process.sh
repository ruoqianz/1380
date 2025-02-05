#!/bin/bash

# Convert input to a stream of non-stopword terms
# Usage: ./process.sh < input > output

# Convert each line to one word per line, **remove non-letter characters**, make lowercase, convert to ASCII; then remove stopwords (inside d/stopwords.txt)
# Commands that will be useful: tr, iconv, grep
tr -cs '[:alpha:]' '\n' |       
tr '[:upper:]' '[:lower:]' |    
iconv -f utf8 -t ascii//TRANSLIT |  
grep -v -w -f d/stopwords.txt 

