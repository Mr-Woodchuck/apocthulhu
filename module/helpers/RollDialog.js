export class RollDialog {
  static rollAttribute(attribute, label, selectedActor) {

    let actorAttributes = selectedActor.data.data.abilities;
    console.log(actorAttributes);

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
                  alias: selectedActor.name
                },
                flavor: `${label} < ${attributeValue} + ${attributeMod}`,
                rollMode: game.settings.get('core', 'rollMode'),
              });
              chatMessage.setFlag('apocthulhu', 'targetValue', attributeValue + attributeMod)
          }
        },
        close: {
          label: "Close"
        }
      });
  }

  static easyNormalHardMod(title, label, callback) {
    let dialogTemplate = `
    <div style="display:flex">
      <div  style="flex:1">${label}</div>
      <span style="flex:1">Mod <input  id="mod" type="number" style="width:50px;float:right" value=0 /></span>
    </div>
  `

    RollDialog.RollDialog(title,
      dialogTemplate,
       {
         easyRoll: RollDialog.simpleButton("Easy", (html) => {
           callback(html, (value) => {
             let modifier = parseInt(html.find("#mod")[0].value);
             return value * 2 + modifier;
           });
         }),
         normalRoll: RollDialog.simpleButton("Normal", (html) => {
           callback(html, (value) => {
             let modifier = parseInt(html.find("#mod")[0].value);
             return value + modifier;
           });
         }),
         hardRoll: RollDialog.simpleButton("Hard", (html) => {
           callback(html, (value) => {
             let modifier = parseInt(html.find("#mod")[0].value);
             return value / 2 + modifier;
           });
         }),
         close: {
           label: "Close"
         }
       });
  }

  static simpleButton(label, callback) {
    return {
        label: label,
        callback: async (html) => {
          callback(html);
      }
    };
  }

  static simpleCallback(title, template, goLabel, callback) {

    new Dialog({
      title: title,
      content: template,
      buttons: {
          roll: {
            label: goLabel,
            callback: async (html) => {
              callback(html)
            }
          },
          close: {
            label: "Close"
          }
        }
    }).render(true)
  }

  static RollDialog(title, template, buttons) {

    new Dialog({
      title: title,
      content: template,
      buttons: buttons
    }).render(true)
  }
}
