/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ApocthulhuItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["apocthulhu", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/apocthulhu/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    let skillList = [];

    for (let item of this.actor.items) {
      if (item.type === "skill" && item.system.showsInWeapons) {
        if (itemData.system.associatedSkill === item._id) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        skillList.push(item);
      }
    }

    console.log("This is here a weapon list");
    console.log(itemData.system.associatedSkill);
    console.log(skillList);
    context.weaponSkillList = skillList;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.item for easier access, as well as flags.
    context.item = itemData;
    context.flags = itemData.flags;

    context.enrichedDescription = itemData.system.description;

    context.isGM = game.user.isGM;

    console.log(context);
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
    html.find('.item-delete').click(ev => {
      this.close();
      this.item.delete();
    });
  }
}
