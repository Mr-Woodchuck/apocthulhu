export async function formatRoll(
  chatMessage,
  html,
  data,
) {
  const colorMessage = true; // chatMessage.getFlag('apocthulhu', 'colorMessage') as boolean;
  const targetValue = chatMessage.getFlag('apocthulhu', 'targetValue');
  console.log(targetValue);
  // Little helper function
  const pushDice = (data, roll, faces) => {
    let color = 'black';
    let total = roll.total;

    let critical = ([1, 11, 22, 33, 44, 55, 66, 77, 88, 99, 100].indexOf(total) > -1);

    // 1 is always critical success, 100 is always a critical failure
    if (total == 1 || (total <= targetValue && total !== 100)) {
      if (critical) {
        // critical success
        color = 'blue';
      } else {
        // normal success
        color = 'green';
      }
    } else if (critical) {
      // critical failure
      color = 'red';
    }

    if (faces == 100) {
      data.dice.push({
        img: 'icons/svg/d10-grey.svg',
        result: total - (total % 10),
        color: color,
      });
      data.dice.push({
        img: 'icons/svg/d10-grey.svg',
        result: total % 10,
        color: color,
      });
    } else {
      let img = '';
      if ([4, 6, 8, 10, 12, 20].indexOf(faces) > -1) {
        img = `icons/svg/d10-grey.svg`;
      }
      data.dice.push({
        img: img,
        result: total,
        color: color,
      });
    }
  };

  const roll = Roll.fromJSON(data.message.roll);
  const chatData = { dice: [], result: 0 };

  console.log(roll.terms);
  for (const term of roll.terms) {
    if (term instanceof Die) {
      // Grab the right dice
      const faces = term.faces;
      let totalDice = 0;
      term.results.forEach((result) => {
        totalDice += result.result;
      });
      pushDice(chatData, roll, faces);
    } else {
      chatData.dice.push({
        img: null,
        result: term.expression,
        color: 'black',
        dice: false,
      });
    }
  }
  // Replace default dice-formula with custom html;
  const formulaTemplate = 'systems/apocthulhu/templates/chat/roll-formula.hbs';
  html
    .find('.dice-formula')
    .replaceWith(await renderTemplate(formulaTemplate, chatData));

  let results = { result: roll.total }
  if (chatMessage.getFlag('apocthulhu', 'isSkill')) {
    results.isSkill = true;
  }
  const resultTemplate = 'systems/apocthulhu/templates/chat/roll-result.hbs';
  html
    .find('.dice-total')
    .replaceWith(await renderTemplate(resultTemplate, results))
    .find('.item-edit').click(ev => {
      //figure out how to write back to item here
      new Dialog({
        title: title,
        content: template,
        buttons: {
          close: {
            label: "Close"
          }
        }
      }).render(true)

      // const li = $(ev.currentTarget).parents(".item");
      // const item = this.actor.items.get(li.data("itemId"));
      // item.sheet.render(true);
    });


}
