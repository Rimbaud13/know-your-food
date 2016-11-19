
# coding: utf-8

# In[1]:

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import word2vec
import re
import json
from elasticsearch import Elasticsearch


# In[2]:

es = Elasticsearch(hosts=['163.172.173.89:53837'])


# In[3]:

products = pd.read_csv('data/products.csv', index_col='id')
nutrients = pd.read_csv('data/nutrients.csv', index_col='id')
product_nutrients = pd.read_csv('data/product_nutrients.csv', index_col=['product_id', 'nutrient_id'])
categories = pd.read_csv('data/categories.csv', index_col='id')
categorisations = pd.read_csv('data/categorisations.csv', index_col=['category_id', 'categorisable_id'])
images = pd.read_csv('data/images.csv', index_col='id')


# In[4]:

def parse_fr(value):
    if pd.isnull(value):
        return np.nan
    langs = {lang: name for lang, name in re.findall(r'"([^"]+)" ?=> ?"([^"]+)"', value)}
    return langs.get('fr', np.nan)


# In[5]:

def join(i1, k1, i2, k2):
    return i1.reset_index().join(i2.reset_index().set_index(k2), on=k1, lsuffix='_')


# In[6]:

products['fr'] = products.name_translations.apply(parse_fr)
products.fr.count()


# In[7]:

nutrients['fr'] = nutrients.name_translations.apply(parse_fr)
nutrients.fr.count()


# In[8]:

fld_products = ['fr', 'barcode', 'unit', 'quantity', 'portion_quantity', 'alcool_by_volume']
sel_products = products[pd.notnull(products.fr)][fld_products].fillna(value=-1)
sel_products.head()


# In[9]:

fld_nutrients = ['product_id', 'fr', 'per_portion', 'per_day', 'per_hundred', 'unit']
sel_nutrients = join(product_nutrients, 'nutrient_id', nutrients, 'id')[fld_nutrients].fillna(value=-1)
sel_nutrients.head()


# In[14]:

prods = []
for idx, p in sel_products.iterrows():
    obj = p.to_dict()
    obj['nutrients'] = []
    for _, nut in sel_nutrients[sel_nutrients.product_id == idx].iterrows():
        obj['nutrients'].append(nut.to_dict())
    action = { 
        'index': {
            '_index': 'kyf',
            '_type': 'default',
            '_id': 
        }
    }
    prods.append(action)
    prods.append(obj)


# In[15]:

len(prods)


# In[16]:

prods[3]


# In[21]:

es.bulk(prods[:3])


# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:

data = re.sub('\s+', ' ', re.sub('[:\.\(\)0123456789%,–\?\\\&\']', '', ' '.join(product_fr.values).replace('-', ' ').lower()))


# In[ ]:

with open('data/names.txt', 'w') as f:
    f.write(data)
    f.close()


# In[ ]:

word2vec.word2phrase('data/names.txt', 'data/names-phrases.txt', verbose=True)


# In[ ]:

word2vec.word2vec('data/names.txt', 'data/names-model.bin', size=100, verbose=True)


# In[ ]:

word2vec.word2clusters('data/names.txt', 'data/names-clusters.txt', 100, verbose=True)


# In[ ]:

model = word2vec.load('data/names-model.bin')


# In[ ]:

clusters = word2vec.load_clusters('data/names-clusters.txt')


# In[ ]:

model.vocab


# In[ ]:

model.vectors.shape


# In[ ]:

indexes, metrics = model.analogy(pos=['snack'], neg=[], n=10)
model.generate_response(indexes, metrics).tolist()


# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:




# In[ ]:



