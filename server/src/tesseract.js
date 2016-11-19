let request = require('request')

export default function imageProcess(url) {

    request({
            url: API_URL,
            method: 'POST',
            headers: { //We can define headers too
                'Ocp-Apim-Subscription-Key': '0d1e0f955fe848f0bedd13361ed9dd8f',
            },
            json: {
                url: url,
            }
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                let tex = "";
                console.log(response.statusCode, body);
                for (let i = 1; i < body.regions.length; i++) {
                    for (let j = 0; j < body.regions[i].lines.length; j++) {
                        for (let k = 0; k < body.regions[i].lines[j].words.length; k++) {
                            tex += body.regions[i].lines[j].words[k].text + " ";
                        }
                        tex += "\n";
                    }
                }
                console.log(tex);
                parse(tex);
            }
        }
    );

}

const text = "MARGHERITA\nuce totnate maison et tnozzarella.\nRUCOLA\nRoquette, partnesan, sauce totnate maison.\nSALAME\nSalami Napoli sur notre sauce tomate\nmaison et mozzarella.\nFUNGHI\nChampignons frais, sauce tomate\nmaison et mozzarella.\n\n16,50\n17,00\n17,00\n17,00\nPROSCIUTTO E FUNGHI\nJatnbon et champignons frais sur notre\nsauce totnate maison et mozzarella.\nCALZONE\nSalami piquant, jambon italien \net champignons frais, sauce tomate maison\net mozzarella.\nTONNO\nThon et oignons rouges, sur notre sauce\ntomate maison et mozzarella.\n\nVAPIANO bELLA CASA\n\n19,00\n19,50\n18,50\n20,50";

parse(text);

function parse(text) {

    const lines = text.split("\n").filter(x => x !== '');

    var array = [];

    let name = "";
    let description = [];
    let mealCount = 0;
    let priceCount = 0;
    for (let s in lines) {
        let line = lines[s];
        let isan = !isNaN(parseFloat(line));

        if (!isan && line.toUpperCase() === line) {

            if (mealCount > 0) {
                array.push({name, description});
                name = "";
                description = [];
            }

            name = line;
            mealCount++;
        } else if (!isan) {
            line.split(" ").forEach(x => description.push(x));
        }

        if (isan) {
            if (array[priceCount]) {
                array[priceCount].price = parseFloat(line.replace(',', '.'));
                priceCount++;
            }
        }

    }

    console.log(array);

}


/*
 */


// const text = "MARGHERITA 16.50\n S auce tomate maison et mozzarella. \n\nRUCO LA 1 7,00\nRoquette, parmesan, sauce tomate maison.\nSALAME 17.00\nSalami Napoli sur notre sauce tomate\n\nmaison et mozzarella.\n\nFUNGHI 17,00\nChampignons frais, sauce tomate\n\nmaison et mozzarella.";
// const text = "PESTO CON SPINACI 16,50\n Jeunes pousses d‘épinards fraîches et tomates\nmarinées sur une sauce crémeuse au pesto\net mozzarella.\n \n   l avec saumon fumé + 3,90\n\nl avec crevettes + 3.90\nBRUSCHETTA 19.00\nTomates marinées dans un mélange d‘huile d‘olive\net d‘ail avec roquette, Grana Padano D.O.P., sur\nnotre sauce tomate maison et mozzarella.\nVERDURE 1 9.50\nLégumes grillés maison, champignons frais,\n3m“ notre sauce tomate et mozzarella.";
/* console.log(text);
 const meals = parse(text);
 console.log(meals); */

/* function parse(plaintext) {
 const lines = plaintext.split("\n").map(x => x.trim()).filter(x => x !== '');

 let startingLines = lines.map(x => {

 let i = 0;
 let res = isNaN(parseInt(x.charAt(i)));
 while (isNaN(parseInt(x.charAt(i))) && res) {
 res = x.charAt(i) == x.charAt(i).toUpperCase();
 i++;
 }

 return res;
 });

 let meals = [];
 let meal = [];
 for (let i = 0; i < lines.length; i++) {
 if (startingLines[i]) {
 if (i != 0) {
 meals.push(meal);
 meal = [];
 }
 }
 meal.push(lines[i]);
 }
 meals.push(meal);

 let parsedMeals = meals.map(meal => {
 const parsedMeal = splitMeal(meal)
 return correctPrice(parsedMeal);
 });

 // console.log(parsedMeals);
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

 return {name: nameWords.slice(0, i), price: parseFloat(price), description: meal.description}

 } */