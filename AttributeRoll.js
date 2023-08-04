main()

async function main(){
  let selected = canvas.tokens.controlled;
  if(selected.length > 1){
    ui.notifications.error("Please select only one token")
    return;
  }
  let selected_actor = selected[0].actor;

  let actorAttributes = selected_actor.data.data.attributes.Attributes;
  let attributeOptions = ""
  Object.keys(actorAttributes).forEach(function (key) {
    var value = actorAttributes[key];
    attributeOptions += `<option value=${key}>${key} (${value.value}) </option>`
  })

  let dialogTemplate = `
  <h1> Pick an Attribute </h1>
  <div style="display:flex">
    <div  style="flex:1"><select id="attribute">${attributeOptions}</select></div>
    <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>
    <span style="flex:1"><input id="ignoreArmor" type="checkbox" checked /></span>
    </div>
  `
  new Dialog({
    title: "Roll Attribute",
    content: dialogTemplate,
    buttons: {
      rollAtk: {
        label: "Roll Attribute",
        callback: async (html) => {
          let attributeKey = html.find("#attribute")[0].value;
          let attribute = actorAttributes[attributeKey].value;
          let newRollString = `1d100cs<=(${attribute*5})`;
          let roll = await new Roll(newRollString).evaluate({async: true});

          // Print Chat
            let chatMessage = await roll.toMessage({
              speaker: {
                alias: selected_actor.name
              },
              flavor: `${attributeKey} save`,
            });
        }
      },
      close: {
        label: "Close"
      }
    }
  }).render(true)
}
