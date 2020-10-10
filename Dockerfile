FROM ubuntu:18.04
LABEL maintainer="Baldur Karlsson <baldurk@baldurk.org>"

# Update apt repositories
RUN apt-get -qq update

# Install dependencies
RUN apt-get -qq -y install ruby npm wget libcurl3-gnutls git locales

# Set up en_US.UTF-8 locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Download and install roswell
RUN wget https://github.com/roswell/roswell/releases/download/v20.06.14.107/roswell_20.06.14.107-1_amd64.deb
RUN dpkg -i roswell_20.06.14.107-1_amd64.deb

# Make output directory and scratch directory
RUN mkdir /output
RUN mkdir /work
WORKDIR /work

# Setup roswell within /work
ENV ROSWELL_HOME /work
RUN ros setup

# Install asciidoctor-chunker roswell dependencies
RUN ros install alexandria
RUN ros install lquery
RUN ros install cl-fad

# Clone the asciidoctor-chunker repository
RUN git clone https://github.com/wshito/asciidoctor-chunker

# Lisp needs ~/common-lisp to contain the scripts to run
RUN ln -s /work /root/common-lisp

# Install lunr via npm for search index generation
RUN npm install lunr

# Copy in support files
COPY build-index.js /work
COPY custom.patch /work
COPY generate-index.rb /work
COPY chunked.css /work
COPY chunked.js /work
COPY run.sh /work

RUN mkdir /source

VOLUME /source
VOLUME /output

ENTRYPOINT [ "/work/run.sh" ]
