
# Apocthulhu System

This system is built for the APOCTHULHU System.

## Installing

To install, navigate to the `Game Systems` tab, and press the `Install System` button. Enter this into the Manifest URL box:

```
https://raw.githubusercontent.com/Mr-Woodchuck/apocthulhu/main/system.json
```

## Character setup

### Skills

Skills still need entered by hand. You can create a defaulted character, and drag skills over, or just duplicate the character for new characters.

Skills have Description if you wish to fill that out and in the Attributes tab, they list the target value, and if the skill has failed. If you are a GM, they will also have "Show in weapons" and "Removes Max Sanity". If you desire the skill to show up in a weapon's associated skill slot, so rolling a weapon will automatically roll the skill first, check the show in weapons. If the skill is or is like the unnatural skill, and should remove points from the showing max sanity, check the removes max sanity box. At the current moment, lowering the max sanity does not do any check or adjustment of current sanity.

### Weapons

Weapons will roll associated skill if set up in the associated skill slot. With a success, it will automatically roll damage. at the current time, there isn't a way to just roll damage, I do want to fix that.

Damage slot can take any rollable value `1d4`, `1d8 + 1d10`. If you want to add the strength bonus to a weapon, instead of setting it up on in the weapon's damage slot, there is a checkbox which will calculate survivor's Strength Bonus and apply it on the roll.

If the weapon has a Lethality, clear or leave the damage slot blank, and enter the Lethality percentage in the Lethality slot. In the weapons table it will display as `L54%` for a 54% Lethality. On a successful hit, but failed Lethality, it will display the roll, but add the 2d10 together as if it was 2d10 instead of 1d100. If it is at or lower than the Lethality percentage, it will display Fatal in the result box. If as the GM you wish to still do something different based on the result, the full results are still displayed.

### Sanity

For setting the character's default sanity, or adjusting the breakpoint, the GM will have two extra buttons under Sanity Adjustment -> Add Sanity. Set Sanity, and Set Breakpoint. When a character takes sanity damage, if that will bring the current sanity below the breakpoint, there is a message that displays on the damage roll, a statement about temporary insanity. After this message, you will need to go set a new breakpoint. If it reduces to 0, it will display you are insane.

## TODO

Things left undone so far

* Clean up Items
 * Add quality to items
 * Add quantity count to item table.
 * Drop weight from item sheets.
* Pushing sanity damage to bonds
* Compendiums
 * Skills
 * Archtypes
 * Bonds
 * Disorders
 * Temporary Insanities
* Localization

## Boilerplate System

This system built with the boilerplate system https://gitlab.com/asacolips-projects/foundry-mods/boilerplate that you can use as a starting point for building your own custom systems. It's similar to Simple World-building, but has examples of creating attributes in code rather than dynamically through the UI.
