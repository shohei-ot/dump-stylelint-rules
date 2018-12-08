stylelint-rules-dump
=======================

UNDER CONSTRUCTION.

## About

Showing current all applied rules of [Stylelint](https://stylelint.io).

## Motivation

Extending the `stylelint` rule makes tracking the currently applied rules tiresome.
I wanted to check it as one JSON file.

## Usage

```sh
# for npm scripts
stylelint-rules-dump
```

<!-- **npx:**

```sh
npx stylelint-rules-dump
``` -->

## Options

### `--input=<path>`, `-i <path>`

Path to your stylelint config file.  
**Default:** Search just under the working directory.  

examlpe:  

```sh
stylelint-rules-dump --input=./.stylelintrc
# or
stylelint-rules-dump --input=./stylelint.config.js
# or
stylelint-rules-dump --input=./package.json
```

### `--output=<path>`, `-o <path>`

The path for output json.  
**Default:** nop  

example:  

```sh
stylelint-rules-dump --output=./my-rules.json
```
