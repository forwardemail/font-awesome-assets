
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import { png, aliases } from './';
import Rainbow from 'rainbowvis.js';

const rainbow = new Rainbow();

rainbow.setNumberRange(0, _.keys(aliases).length);

// TODO: speed this up with async maybe
const imgs = _.map(_.keys(aliases), (alias, i) => {
  return png(alias, `#${rainbow.colourAt(i)}`);
});

fs.writeFileSync(path.join(__dirname, '..', 'rainbow.html'), imgs.join(' '), 'utf8');
