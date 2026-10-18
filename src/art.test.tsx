import {test} from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Art} from './Art';
import {allItems,pools} from './data';
test('Each pictured food, product and landmark has distinct artwork for its defined form or serving',()=>{const items=allItems.filter(i=>i.category!=='distance');assert.equal(new Set(items.map(i=>i.art)).size,items.length);const images=items.map(i=>renderToStaticMarkup(<Art kind={i.art}/>));assert.equal(new Set(images).size,images.length);for(const image of images){assert.ok(!image.includes('<image'));assert.ok(!image.includes('data:image'));assert.ok(!image.includes('NaN'));}});
test('Statue-only, pedestal, fruit types and multiple portions use the appropriate separate drawings',()=>{const find=(id:string)=>allItems.find(x=>x.id===id)!.art;assert.equal(find('statue'),'liberty-statue');assert.equal(find('liberty'),'liberty-pedestal');assert.equal(find('twopies'),'2x-pie');assert.equal(find('twofries'),'2x-fries');assert.equal(find('twomuffins'),'2x-muffin');assert.equal(find('threebananas'),'3x-banana');assert.equal(find('meal'),'burger-fries');assert.equal(find('doublearch'),'2x-arch');assert.equal(find('airtag4'),'tags-four');assert.equal(find('berries'),'berries');assert.notEqual(find('berries'),find('cherries'));assert.notEqual(find('grapes'),find('cherries'));assert.notEqual(find('cat'),find('dog'));assert.notEqual(find('goal'),find('net'));assert.notEqual(find('melon'),find('watermelonfood'));});
