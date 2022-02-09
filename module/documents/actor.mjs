import { RollDialog } from '../helpers/RollDialog.js';

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ApocthulhuActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags.apocthulhu || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const data = actorData.data;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(data.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const data = actorData.data;
    data.xp = (data.cr * data.cr) * 100;
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.data.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.data.type !== 'npc') return;

    // Process additional NPC data here.
  }

  takeSanDmg(html) {
    console.log("Taking Sanity Damage");
    this.rollAttributeCallback('con', 'Constitution save for Sanity', (success) => {

      let dialogTemplate = `
      <h1> How much damage for ${success ? "Success": "Failure"} </h1>
        <span style="flex:1"> <input  id="formula" style="width:150px;float:right" placeholder="1, 1d8, 1d6-1" /></span>
      `

      RollDialog.RollDialog("Sanity Damage",
      dialogTemplate,
      [
        RollDialog.simpleButton("Roll", async (html) => {
          let formula = html.find("#formula")[0].value;
          let roll = await new Roll(formula).evaluate({async: true});

          let flavor = "";
          await this.update({ 'data.sanity.value': this.data.data.sanity.value - roll.total });
          await this.update({ 'data.sanity.breakpoint': this.data.data.sanity.breakpoint - roll.total });

          if (this.data.data.sanity.value <= 0) {
            flavor = "Sad day, you are insane";
          } else if (this.data.data.sanity.breakpoint <= 0) {
            flavor = "You have increased in your temporary insanity";
          }

          // Print Chat
            let chatMessage = await roll.toMessage({
              speaker: {
                alias: this.name
              },
              flavor: flavor,
              rollMode: game.settings.get('core', 'rollMode'),
            });
        }),
        {
          label: "Close"
        }
      ]);
    });
  }

  addSan(html) {
    let dialogTemplate = `
    <h1> How much Sanity to add? </h1>
      <span style="flex:1"> <input  id="formula" style="width:150px;float:right" placeholder="1, 1d8, 1d6-1" /></span>
    `

    let buttons = [
      RollDialog.simpleButton("Roll", async (html) => {
        let formula = html.find("#formula")[0].value;
        let roll = await new Roll(formula).evaluate({async: true});

        let flavor = "";
        await this.update({ 'data.sanity.value': this.data.data.sanity.value + roll.total });
        await this.update({ 'data.sanity.breakpoint': this.data.data.sanity.breakpoint + roll.total });

        // Print Chat
        let chatMessage = await roll.toMessage({
          speaker: {
            alias: this.name
          },
          flavor: flavor,
          rollMode: game.settings.get('core', 'rollMode'),
        });
      }),
      {
        label: "Close"
      }
    ]

    if (game.user.isGM) {
      let setSan = (title, settingCallback) => {
        return RollDialog.simpleButton(title, async (html) => {
          let formula = html.find("#formula")[0].value;
          let roll = await new Roll(formula).evaluate({async: true});

          await settingCallback(roll.total);

          // Print Chat
          let chatMessage = await roll.toMessage({
            speaker: {
              alias: this.name
            },
            rollMode: game.settings.get('core', 'rollMode'),
          });
        })
      };
      buttons.push(setSan("Set Sanity", async (total) => {
        await this.update({ 'data.sanity.value': total });
      }),setSan("Set Breakpoint", async (total) => {
        await this.update({ 'data.sanity.breakpoint': total });
      }));
    }

    RollDialog.RollDialog("Adding Sanity",
    dialogTemplate, buttons);
  }

  rollAttribute(attribute, label) {
    this.rollAttributeCallback(attribute, label, (html) => { });
  }

  rollAttributeCallback(attribute, label, callback) {

    let actorAttributes = this.data.data.abilities;

    var attributeValue = actorAttributes[attribute].value * 5;

    let dialogTemplate = `
    <h1> Rolling ${attribute} </h1>
    <div style="display:flex">
      <div  style="flex:1">${attributeValue}</div>
      <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>
      </div>
    `
    RollDialog.RollDialog(`Roll ${label}`, dialogTemplate, {
        rollAtk: {
          label: `Roll ${label}`,
          callback: async (html) => {
            let attributeMod = parseInt(html.find("#mod")[0].value);
            // roll
            let roll = await new Roll("1d100").evaluate({async: true});

            // Print Chat
              let chatMessage = await roll.toMessage({
                speaker: {
                  alias: this.name
                },
                flavor: `${label} < ${attributeValue} + ${attributeMod}`,
                rollMode: game.settings.get('core', 'rollMode'),
              });
              chatMessage.setFlag('apocthulhu', 'targetValue', attributeValue + attributeMod);

              callback(roll.total <= attributeValue + attributeMod);
          }
        },
        close: {
          label: "Close"
        }
      });
  }
}
