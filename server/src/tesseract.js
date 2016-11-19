let request = require('request')
let fs = require('fs')
let url = 'https://cloud.avalan.ch/s/fbyELHPmVwXfrLM/download'
let filename = 'menu.png'


import _ from "lodash";


let writeFile = fs.createWriteStream(filename)

/* request(url).pipe(writeFile).on('close', function () {
 console.log(url, 'saved to', filename)
 Tesseract.recognize(filename, {
 lang: 'fra',
 textord_tabfind_show_columns: 1
 }).progress(function (p) {
 console.log('progress', p)
 })
 .catch(err => console.error(err))
 .then(function (result) {
 console.log(result.text)
 process.exit(0)
 })
 }); */

const text = "MARGHERITA 16.50\n Sauce tomate maison et mozzarella. \n\nRUCO LA 1 7,00\nRoquette, parmesan, sauce tomate maison.\nSALAME 17.00\nSalami Napoli sur notre sauce tomate\n\nmaison et mozzarella.\n\nFUNGHI 17,00\nChampignons frais, sauce tomate\n\nmaison et mozzarella.";

const meals = parse(text);

function parse(plaintext) {
  const lines = plaintext.split("\n").map(x => x.trim()).filter(x => x !== '');

  let startingLines = lines.map(x => {
    let tmp = (_.dropWhile(x, _ == " ")).join("");
    return tmp.charAt(1) == tmp.charAt(1).toUpperCase();
  });

  let meals = [];
  let meal = [];
  for (let i = 0; i < lines.length; i++) {
    if (startingLines[i]) {
      if (i != 0) {
        meals.push(meal);
        meal = [];
        meal = [];
      }
    }
    meal.push(lines[i]);
  }
  meals.push(meal);

  let parsedMeals = meals.map(meal => {
    return splitMeal(meal)
  });

  console.log(parsedMeals);
  return parsedMeals;
}

function splitMeal(meal) {
  const nameAndPriceLine = meal[0];
  const descriptionLine = meal.slice(1);

  const words = nameAndPriceLine.split(" ");
  const dirtyPrice = words[words.length - 1];
  const price = parseFloat(dirtyPrice.replace(",", ".").replace(" ", ""));
  const name = nameAndPriceLine.slice(0, nameAndPriceLine.length - dirtyPrice.length).trim();

  let tmpDescription = [];
  descriptionLine.forEach(line => {
    const cleanedWords = line.split(" ").map(word => word.trim());
    tmpDescription.push(cleanedWords);
  });

  const description = _.flatten(tmpDescription);

  return {name, price, description}
}

function correctPrice(meal) {

  const nameWords = meal.name.split(" ");
  if (isNaN(nameWords[nameWords.length - 1]))
    return meal;

  let price = meal.price.toString();
  let i = 1;
  while (!isNaN(parseInt(nameWords[nameWords.length - i]))) {
    price = parseInt(nameWords[nameWords.length - i]) + price;
    i++;
  }

  return {name:nameWords.slice(0, i-1), price: parseFloat(price), description:meal.description}

}