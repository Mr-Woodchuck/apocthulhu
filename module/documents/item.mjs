import { RollDialog } from '../helpers/RollDialog.js';
/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ApocthulhuItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.data.data);

    return rollData;
  }

  async rollItem(speaker, rollMode, label) {
    let item = this.data;

    if (!item.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.data.description ?? ''
      });
    }

    let rollData = this.getRollData();

    // Invoke the roll and submit it to chat.
    let roll = new Roll(rollData.item.formula, rollData);
    // If you need to store the value first, uncomment the next line.
    // let result = await roll.roll({async: true});
    roll.toMessage({
      speaker: speaker,
      rollMode: rollMode,
      flavor: label,
    });
    return roll;
  }

  async rollWeapon(speaker, rollMode, label) {

    let weapon = this.data;
    console.log(weapon);
    let skill = this.actor.items.get(weapon.data.associatedSkill);

    skill.rollSkill(speaker, rollMode, skill.name, async (success) => {
      if (!success) {
        return;
      }

      let range = weapon.data.range;
      let radius = weapon.data.radius;

      let damage = weapon.data.damage;
      let lethality = parseInt(weapon.data.lethality);

      let damageRoll = damage;

      // look up skill based off of name
      // roll skill, waiting for success/failure/whatever.
      if (damage == "") {
        if (lethality == 'NaN') {
          // Invalid
          return;
        }

        damageRoll = "1d100";
      } else if (weapon.data.strBonus) {
        console.log(this.actor.data.data.abilities.str);
        let bonus = -2;
        if (this.actor.data.data.abilities.str.value < 5) {
          bonus = -2;
        } else if (this.actor.data.data.abilities.str.value < 9) {
          bonus = -1;
        } else if (this.actor.data.data.abilities.str.value < 13) {
          bonus = 0;
        } else if (this.actor.data.data.abilities.str.value < 17) {
          bonus = 1;
        } else {
          bonus = 2;
        }
        damageRoll = `${damage} + ${bonus}`
      }

      console.log(damageRoll);
      let roll = await new Roll(damageRoll).evaluate({async: true});
      let flavor = `${label} damage`;
      if (damage == "" && lethality !== 'NaN' && roll.total > lethality) {
        // didn't kill the target.
        let lethalityDamage = Math.floor(roll.total/10) + roll.total % 10;
        flavor = `Failed lethality, took ${lethalityDamage} damage`;
      }

      // Print Chat
        let chatMessage = await roll.toMessage({
          speaker: speaker,
          flavor: flavor,
          rollMode: rollMode,
        });

      if (damage == "" && lethality !== "NaN") {
        if (roll.total > lethality) {
          let lethalityDamage = Math.floor(roll.total/10) + roll.total % 10;
          chatMessage.setFlag('apocthulhu', 'lethalityDamage', lethalityDamage);
        } else {
          chatMessage.setFlag('apocthulhu', 'lethality', true);
        }
      }
    });
  }


  rollSkill(speaker, rollMode, label) {
    this.rollSkill(speaker, rollMode, label, (success) => { });
  }

  rollSkill(speaker, rollMode, label, callback) {

      let rollData = this.getRollData();

      if (this.data.data.targetValue) {
        RollDialog.easyNormalHardMod(label, label, async (html, modAdjustment) => {
          // roll
          let roll = await new Roll("1d100").evaluate({async: true});

          let target = modAdjustment(parseInt(this.data.data.targetValue));
          // Print Chat
            let chatMessage = await roll.toMessage({
              speaker: speaker,
              flavor: `${label} target of ${target}`,
              rollMode: rollMode,
            });
            chatMessage.setFlag('apocthulhu', 'targetValue', target);
            chatMessage.setFlag('apocthulhu', 'isSkill', true);
            callback(roll.total < target);
        });
      }
    }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this.data;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    switch(this.type) {
      case "item":
        return this.rollItem(speaker, rollMode, label);
      case "weapon":
        return this.rollWeapon(speaker, rollMode, label);
      case "skill":
        return this.rollSkill(speaker, rollMode, label);
      case "spell":
        break;
      case "bond":
        break;
    }
    // If there's no roll data, send a chat message.
    // if (!this.data.data.formula && !this.data.data.targetValue) {
    //   ChatMessage.create({
    //     speaker: speaker,
    //     rollMode: rollMode,
    //     flavor: label,
    //     content: item.data.description ?? ''
    //   });
    // }
    // // Otherwise, create a roll and send a chat message from it.
    // else {
    //   // Retrieve roll data.
    //   const rollData = this.getRollData();
    //
    //   if (this.data.data.targetValue) {
    //     RollDialog.easyNormalHardMod(label, label, async (html, modAdjustment) => {
    //       // roll
    //       let roll = await new Roll("1d100").evaluate({async: true});
    //
    //       let target = modAdjustment(parseInt(this.data.data.targetValue));
    //       // Print Chat
    //         let chatMessage = await roll.toMessage({
    //           speaker: speaker,
    //           flavor: `${label} target of ${target}`,
    //           rollMode: rollMode,
    //         });
    //         chatMessage.setFlag('apocthulhu', 'targetValue', target);
    //         chatMessage.setFlag('apocthulhu', 'isSkill', true);
    //
    //     });
    //
    //     return;
    //   }

      // Invoke the roll and submit it to chat.
      // const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      // roll.toMessage({
      //   speaker: speaker,
      //   rollMode: rollMode,
      //   flavor: label,
      // });
      return roll;
    }
}
