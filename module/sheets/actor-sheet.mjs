import {onManageActiveEffect, prepareActiveEffectCategories} from "../helpers/effects.mjs";
import { RollDialog } from "../helpers/RollDialog.js"

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ApocthulhuActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["apocthulhu", "sheet", "actor"],
      template: "systems/apocthulhu/templates/actor/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }]
    });
  }

  /** @override */
  get template() {
    return `systems/apocthulhu/templates/actor/actor-${this.actor.data.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.data.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.data = actorData.data;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    context.showsSanity = game.user.isGM || game.settings.get('apocthulhu', 'showsSanity');

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle ability scores.
    for (let [k, v] of Object.entries(context.data.abilities)) {
      v.label = game.i18n.localize(CONFIG.apocthulhu.abilities[k]) ?? k;
    }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const weapons = [];
    const skills = [];
    const spells = [];
    const tomes = [];
    const bonds = {
      individual: {
        type: "individual",
        label: "Individual",
        bonds: []
      },
      community: {
        type: "community",
        label: "Community",
        bonds: []
      }
    };
    const motivations = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      // Append to gear.
      if (i.type === 'item') {
        i.img = i.img || DEFAULT_TOKEN;
        gear.push(i);
      }
      // Append to skills.
      else if (i.type === 'skill') {
        i.img = i.img || "icons/svg/d20-black.svg";
        skills.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        i.img = i.img || "icons/svg/explosion.svg";
        console.log(i);
          spells.push(i);
      }
      else if (i.type === 'tome') {
        i.img = i.img || "icons/svg/book.svg";
        tomes.push(i);
      }
      // Append to bonds.
      else if (i.type === 'bond') {
        if (i.data.individual) {
          bonds.individual.bonds.push(i);
        } else {
          bonds.community.bonds.push(i);
        }
      }
      // Append to weapons
      else if (i.type === 'weapon') {
        i.img = i.img || "icons/svg/sword.svg";
        let range = i.data.range;
        if (range == null) {
          range = "";
        }

        let radius = i.data.radius;
        if (range == null) {
          radius = "";
        }

        let damage = i.data.damage;
        if (damage == "") {
          let lethality = i.data.lethality;
          if (lethality == "") {
            // if it doesn't have damage, or lethality, skip it.
            continue;
          }
          damage = `L${lethality}%`;
        }

        weapons.push({
          "_id": i._id,
          "name": i.name,
          "img": i.img,
          "damage": damage,
          "range": range,
          "radius": radius
        });
      }
      // Append to Motivations
      // else if (i.type === 'motivation') {
      //   motivations.push(i);
      // }
    }

    // Assign and return
    context.gear = gear;
    context.skills = skills;
    context.spells = spells;
    context.tomes = tomes;
    context.bonds = bonds;
    context.weapons = weapons;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.san-adjust').click(event => {
      // Adjust
      // this.actor
      RollDialog.RollDialog("Sanity Adjustment",
      "I need some template here, but lets see what this does",
      [
          RollDialog.simpleButton("Add Sanity", (html) => { this.actor.addSan() } ),
          RollDialog.simpleButton("Take Damage", (html) => { this.actor.takeSanDmg() }),
          {
            label: "Close"
          }
      ]
      );
    });
    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.skill-check').click(async ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));

      await item.update({ "data.failed": item.data.data.failed == false });
    });

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;

    let type = header.dataset.type;

    // Grab any data associated with this control.
    let data = duplicate(header.dataset);
    if (type === "individual" || type === "community") {
      data.individual = type === "individual";
        type = "bond";
    }

    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    let img = "icons/svg/item-bag.svg";
    switch (type) {
    case 'item':
      break;
    case 'skill':
      img = "icons/svg/d20-black.svg";
      break;
    case 'spell':
      img = "icons/svg/explosion.svg";
      break;
    case 'tome':
      img = "icons/svg/book.svg";
      break;
    case 'weapon':
      img = "icons/svg/sword.svg";
      break;
    default:
      img = null;
      break;
    }
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data,
      img: img
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    if (dataset.roll === "resources") {
      return this.actor.rollWithMod("Resources", "resources", this.actor.data.data.resources.value * 5, () => {})
    }

    if (dataset.roll) {
      this.actor.rollAttribute(dataset.roll, dataset.label);
    }
  }
}
