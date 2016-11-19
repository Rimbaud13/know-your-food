import search from './es'
let request = require('request')
import _ from "lodash";

export default async function imageProcess(url) {

    const API_URL = 'https://api.projectoxford.ai/vision/v1.0/ocr';

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

                const meals = parse(text);
                searchMeals(meals).then(result => {
                    return result;
                });
            }
        }
    );

}

const text = "MARGHERITA\nuce totnate maison et tnozzarella.\nRUCOLA\nRoquette, partnesan, sauce totnate maison.\nSALAME\nSalami Napoli sur notre sauce tomate\nmaison et mozzarella.\nFUNGHI\nChampignons frais, sauce tomate\nmaison et mozzarella.\n\n16,50\n17,00\n17,00\n17,00";
const stopwords = ["quelle", "est", "ses", "etat", "avec", "mais", "elle", "que", "maintenant", "nommes", "devrait", "moins", "eu", "ton", "où", "quel", "par", "tu", "leur", "en", "chaque", "pourquoi", "debut", "tes", "ces", "plupart", "ta", "sur", "ça", "ce", "sujet", "ou", "peut", "ni", "nommés", "notre", "avoir", "fait", "ils", "car", "peu", "fois", "qui", "bon", "seulement", "elles", "ici", "votre", "sien", "doit", "quels", "meme", "essai", "donc", "trop", "alors", "mon", "sans", "les", "des", "voient", "vont", "cela", "nous", "vous", "le", "étions", "dehors", "ceux", "dans", "tandis", "faites", "soyez", "sous", "juste", "quelles", "parce", "ci", "tout", "du", "encore", "dedans", "comment", "aussi", "mot", "pas", "mine", "aucuns", "pour", "son", "etre", "quand", "si", "état", "je", "être", "hors", "tellement", "au", "ete", "il", "avant", "ma", "font", "comme", "étaient", "tous", "dos", "depuis", "etions", "la", "là", "tels", "très", "vu", "tres", "même", "et", "sa", "etaient", "sont", "été", "début", "autre", "mes"];

/* const meals = parse(text);
searchMeals(meals).then(res =>{
    console.log(res);
}); */

async function searchMeals(meals) {

    let result = [];

    for (let meal of meals) {
        const o = {name: meal.name, price: meal.price, description: meal.description};

        const terms = _.flatten([meal.name, preprocess(meal.description)]);
        console.log(terms);
        o.values = await search(terms);
        result.push(o);
    }

    return result;

}

function preprocess(description) {
    const nbDescr = description.length;
    let counter = 0;
    let terms = [];
    let tmpTerm = "";
    while (counter < nbDescr) {
        if (stopwords.includes(description[counter])) {
            terms.push(tmpTerm);
            tmpTerm = "";
        } else {
            tmpTerm = tmpTerm + " " + description[counter];
        }
        counter++;
    }
    if (!stopwords.includes(tmpTerm))
        terms.push(tmpTerm);

    return terms;
}

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
            if (name !== "") {
                array.push({name, description});
                name = "";
                description = [];
            }

            array[priceCount].price = parseFloat(line.replace(',', '.'));
            priceCount++;
        }
    }
    return array;

}
