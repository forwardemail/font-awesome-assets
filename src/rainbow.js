
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { svg, aliases } from './';
import Rainbow from 'rainbowvis.js';

const rainbow = new Rainbow();

rainbow.setNumberRange(0, _.keys(aliases).length);

_.each(_.keys(aliases), (alias, i) => {
  const img = svg(alias, `#${rainbow.colourAt(i)}`);
  fs.writeFileSync(path.join(__dirname, '..', 'media', 'rainbow', `${alias}.svg`), img, 'utf8');
});

const imgs = _.map(_.keys(aliases), alias => {
  // eslint-disable-next-line max-len
  return `<img src="media/rainbow/${alias}.svg" width="16" height="16" title="${alias}" alt="${alias}" />`;
});

fs.writeFileSync(path.join(__dirname, '..', 'media', 'rainbow.html'), imgs.join(' '), 'utf8');
