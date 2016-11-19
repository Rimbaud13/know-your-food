import Tesseract from 'tesseract.js'
var request = require('request')
var fs = require('fs')
var url = 'https://cloud.avalan.ch/s/fbyELHPmVwXfrLM/download'
var filename = 'menu.png'

var writeFile = fs.createWriteStream(filename)

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
    const lines = plaintext.split("\n").map(x => x.trim()).filter(x => x !== '').filter(x => x.charAt(1) === x.charAt(1).toUpperCase());

    var meals = lines.map(x => {
        return splitLine(x)
    });

    console.log(meals);
    return meals;
}

function splitLine(line) {
    const words = line.split(" ");
    const dirtyprice = words[words.length-1];
    const price = parseFloat(dirtyprice.replace(",", ".").replace(" ", ""));
    const name = line.slice(0, line.length-dirtyprice.length).trim();

    return {name, price}
}