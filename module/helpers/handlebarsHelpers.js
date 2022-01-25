export const registerCustomHelpers = function () {
  Handlebars.registerHelper('times', function (a, b) {
    return a * b;
  });

}
