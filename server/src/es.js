import elasticsearch from "elasticsearch";
import _ from "lodash";

const host = 'http://163.172.173.89:53837';
const index = 'kyf';
const type = 'default';

const client = new elasticsearch.Client({
  host,
  /*log: 'trace',*/
});

async function search(values: array<string>) {
  const res = await client
    .msearch({
      body: _.flatMap(values, v => {
          return [{index}, {query: {match: {'fr': v}}, size: 1}];
      })
    });
  return _.zipObject(values, res.responses.map(x => _.head(x.hits.hits.map(x => x._source))));
}

/* search(['margherita', 'sauce tomate maison et mozarella']).then(res => {
  console.log(res)
}); */

// migros('lasagne').then(console.log)

export default search;
