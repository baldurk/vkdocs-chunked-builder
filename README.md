# Vulkan docs chunked build container

This is a container to chunk the Vulkan spec document with [asciidoctor-chunker](https://github.com/wshito/asciidoctor-chunker) and add some quality of life improvements.

## Build

Build using `docker build -t vkdocs-chunked-builder .`.

## Usage

This container expects two volumes to be mounted:

* `/source` pointing at the checkout of the Vulkan documentation repository
* `/output` pointing at the output directory. This will contain a katex directory and an html directory by the end.

An example call could look like this to download the latest 1.1 spec and chunk it:

```
$> mkdir source
$> wget https://www.khronos.org/registry/vulkan/specs/1.1-extensions/html/vkspec.html -O source/vkspec.html
$> docker run --rm -v $(pwd)/source:/source -v /path/to/output:/output vkdocs-chunked-builder
```

## License

This repository is licensed under the Apache 2.0 license.

Uses portions of code from loadJS. Copyright 2014 @scottjehl, Filament Group, Inc. Licensed MIT.
