/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/apocthulhu/templates/actor/parts/actor-features.html",
    "systems/apocthulhu/templates/actor/parts/actor-items.html",
    "systems/apocthulhu/templates/actor/parts/actor-skills.html",
    "systems/apocthulhu/templates/actor/parts/actor-spells.html",
    "systems/apocthulhu/templates/actor/parts/actor-effects.html",
    "systems/apocthulhu/templates/actor/parts/npc-features.html",
    "systems/apocthulhu/templates/actor/parts/npc-items.html",
    "systems/apocthulhu/templates/actor/parts/npc-skills.html",
  ]);
};
