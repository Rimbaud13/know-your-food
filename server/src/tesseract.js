let request = require('request')

export default function imageProcess(url) {

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
                parse(tex);
            }
        }
    );

}

const text = "MARGHERITA\nuce totnate maison et tnozzarella.\nRUCOLA\nRoquette, partnesan, sauce totnate maison.\nSALAME\nSalami Napoli sur notre sauce tomate\nmaison et mozzarella.\nFUNGHI\nChampignons frais, sauce tomate\nmaison et mozzarella.\n\n16,50\n17,00\n17,00\n17,00";

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

        console.log(line);

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

    console.log(array);

}
