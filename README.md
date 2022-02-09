
# Apocthulhu System

This system is built for the APOCTHULHU System, unofficially. It is still in the works, but should be mostly functional.

## TODO

I have plans on adding

* Computed Damage Bonus
* Resource Ratings
* Resource Checks
* Updating weapons
 * Adding weapon type
 * Allowing them to roll Damage
 * Allowing them to roll lethality
 * Adding some weapons to a compendium
* Pushing sanity damage to bonds
*  Rolling on bonds
* Compendiums
 * skills
 * Archtypes
 * Bonds
 * Disorders
 * temporary insanities
* Maybe Localization
 * Unfortunately I only speak English, but I should be able to get this to a place that others who do speak other languages can update a localization file for their language.

## Boilerplate System

This system built with the boilerplate system https://gitlab.com/asacolips-projects/foundry-mods/boilerplate that you can use as a starting point for building your own custom systems. It's similar to Simple World-building, but has examples of creating attributes in code rather than dynamically through the UI.

## Sheet Layout

This system includes a handful of helper CSS classes to help you lay out your sheets if you're not comfortable diving into CSS fully. Those are:

* `flexcol`: Included by Foundry itself, this lays out the child elements of whatever element you place this on vertically.
* `flexrow`: Included by Foundry itself, this lays out the child elements of whatever element you place this on horizontally.
* `flex-center`: When used on something that's using flexrow or flexcol, this will center the items and text.
* `flex-between`: When used on something that's using flexrow or flexcol, this will attempt to place space between the items. Similar to "justify" in word processors.
* `flex-group-center`: Add a border, padding, and center all items.
* `flex-group-left`: Add a border, padding, and left align all items.
* `flex-group-right`: Add a border, padding, and right align all items.
* `grid`: When combined with the `grid-Ncol` classes, this will lay out child elements in a grid.
* `grid-Ncol`: Replace `N` with any number from 1-12, such as `grid-3col`. When combined with `grid`, this will layout child elements in a grid with a number of columns equal to the number specified.

## Compiling the CSS

This repo includes both CSS for the theme and SCSS source files. If you're new to CSS, it's probably easier to just work in those files directly and delete the SCSS directory. If you're interested in using a CSS preprocessor to add support for nesting, variables, and more, you can run `npm install` in this directory to install the dependencies for the scss compiler. After that, just run `npm run gulp` to compile the SCSS and start a process that watches for new changes.

![image](http://mattsmith.in/images/boilerplate.png)
