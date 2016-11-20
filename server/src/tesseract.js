import search from './es';
import util from 'util';
import request from "request-promise";

async function imageProcess(url) {

    const API_URL = 'https://api.projectoxford.ai/vision/v1.0/ocr';

    console.log("start image process");

    const res = await request({
        url: API_URL,
        method: 'POST',
        headers: { //We can define headers too
            'Ocp-Apim-Subscription-Key': '0d1e0f955fe848f0bedd13361ed9dd8f',
        },
        json: {
            url: url,
        }
    });

    console.log(res);
    let tex = "";
    for (let i = 1; i < res.regions.length; i++) {
        for (let j = 0; j < res.regions[i].lines.length; j++) {
            for (let k = 0; k < res.regions[i].lines[j].words.length; k++) {
                tex += res.regions[i].lines[j].words[k].text + " ";
            }
            tex += "\n";
        }
    }
    console.log("text", tex);

    const meals = parse(tex).filter(x => x.name !== "");
    console.log("meals", meals);

    const result = await searchMeals(meals);

    console.log("result", result);
    return result;

}

const text = "MARGHERITA\nuce totnate maison et tnozzarella.\nRUCOLA\nRoquette, partnesan, sauce totnate maison.\nSALAME\nSalami Napoli sur notre sauce tomate\nmaison et mozzarella.\nFUNGHI\nChampignons frais, sauce tomate\nmaison et mozzarella.\n\n16,50\n17,00\n17,00\n17,00";
const stopwords = ["quelle", "est", "ses", "etat", "avec", "mais", "elle", "que", "maintenant", "nommes", "devrait", "moins", "eu", "ton", "où", "quel", "par", "tu", "leur", "en", "chaque", "pourquoi", "debut", "tes", "ces", "plupart", "ta", "sur", "ça", "ce", "sujet", "ou", "peut", "ni", "nommés", "notre", "avoir", "fait", "ils", "car", "peu", "fois", "qui", "bon", "seulement", "elles", "ici", "votre", "sien", "doit", "quels", "meme", "essai", "donc", "trop", "alors", "mon", "sans", "les", "des", "voient", "vont", "cela", "nous", "vous", "le", "étions", "dehors", "ceux", "dans", "tandis", "faites", "soyez", "sous", "juste", "quelles", "parce", "ci", "tout", "du", "encore", "dedans", "comment", "aussi", "mot", "pas", "mine", "aucuns", "pour", "son", "etre", "quand", "si", "état", "je", "être", "hors", "tellement", "au", "ete", "il", "avant", "ma", "font", "comme", "étaient", "tous", "dos", "depuis", "etions", "la", "là", "tels", "très", "vu", "tres", "même", "et", "sa", "etaient", "sont", "été", "début", "autre", "mes"];

/* const meals = parse(text);
 searchMeals(meals).then(res => {
 console.log(util.inspect(res, false, null))
 }); */

async function searchMeals(meals) {

    let result = [];

    for (let meal of meals) {
        if (!hasNumbers(meal.name)) {
            const o = {name: meal.name.trim(), price: meal.price, description: meal.description};

            const terms = preprocess(meal.description);
            if (terms.length > 0) {
                console.log(terms);
                o.values = await search(terms);
                result.push(o);
            }
        }
    }

    return result;

}

function hasNumbers(t) {
    var regex = /\d/g;
    return regex.test(t);
}

function preprocess(description) {
    const nbDescr = description.length;
    let counter = 0;
    let terms = [];
    let tmpTerm = "";
    while (counter < nbDescr) {
        let w = description[counter].trim().toLowerCase();
        if (stopwords.includes(w)) {
            terms.push(tmpTerm);
            tmpTerm = "";
        } else {
            if (w.endsWith(".") || w.endsWith(",")) {
                w = w.replace(",", "");
                w = w.replace(".", "");
                tmpTerm = (tmpTerm + " " + w).trim();
                terms.push(tmpTerm);
                tmpTerm = "";
            } else {
                tmpTerm = (tmpTerm + " " + w).trim();
            }
        }
        counter++;
    }
    if (!stopwords.includes(tmpTerm.trim()))
        terms.push(tmpTerm.trim());

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
        let isanumber = !isNaN(parseFloat(line));

        if (!isanumber && line.toUpperCase() === line) {

            if (mealCount > 0) {
                array.push({name, description});
                name = "";
                description = [];
            }
            name = line;
            mealCount++;
        } else if (!isanumber) {
            if (line !== '') {
                line.replace(",", " ").replace(".", " ").split(" ").forEach(x => description.push(x));
            }
        }

        if (isanumber) {
            if (name !== "") {
                array.push({name, description});
                name = "";
                description = [];
            }

            if (array[priceCount]) {
                array[priceCount].price = parseFloat(line.replace(',', '.'));
                priceCount++;
            }
        }
    }
    return array;

}


export default imageProcess;