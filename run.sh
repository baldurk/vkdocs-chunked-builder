#!/bin/bash
set -x

# Copy spec file in
cp /source/vkspec.html /work

# Patch to add Preamble TOC entry and extra js/css for search & other improvements
patch vkspec.html custom.patch

# Temp hack
sed -i -e 's/\x01/A/' vkspec.html

# Generate the chunked spec
ros dynamic-space-size=4000 -Q -L sbcl-bin asciidoctor-chunker/roswell/asciidoctor-chunker.ros vkspec.html -o /output/html/

# Generate the search index
ruby generate-index.rb /output/html/chap*.html  | node build-index.js > /output/html/search.index.js

# Copy in css/js
cp chunked.css chunked.js /output/html/
