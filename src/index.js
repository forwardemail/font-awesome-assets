
import svg2png from 'svg2png';
import _ from 'lodash';
import svgfont2js from 'svgfont2js';
import fs from 'fs';

// inspired by <https://github.com/riobard/font-awesome-svg/blob/master/extract.js>

function loadAliases(less) {

  const pairs = _.compact(_.map(less.split('\n'), line => {

    // line is `@fa-var-dropbox: "\f16b";`
    if (line.indexOf('@fa-var-') !== 0) return;

    // now it is `dropbox: "\f16b";`
    line = line.split('@fa-var-', 2)[1];

    // split the line by the `: ` delimiter
    line = line.split(': ');

    // now we have a line array that looks like:
    // [0] = `dropbox`
    // [1] = "\f16b";`

    // clean up the first key
    line[1] = line[1].split('"')[1].substring(1);

    return { name: line[0], unicode: line[1] };

  }));

  return _.zipObject(
    _.map(pairs, 'name'),
    _.map(pairs, 'unicode')
  );

}

export const aliases = loadAliases(
  fs.readFileSync(
    require.resolve('font-awesome/less/variables.less'),
    'utf8'
  )
);

export const icons = svgfont2js(
  fs.readFileSync(
    require.resolve('font-awesome/fonts/fontawesome-webfont.svg'),
    'utf8'
  )
);

export const iconsByUnicodeHex = _.zipObject(
  _.map(icons, 'unicode_hex'),
  icons
);

export function svg(name, color, width, height) {

  // set defaults
  name = name || 'smile-o';
  color = color || '#000';
  width = (width || '100%').toString();
  height = (height || '100%').toString();

  // check variable types
  if (!_.isString(name)) throw new Error('fa.svg `name` must be a String');
  if (!_.isString(color)) throw new Error('fa.svg `color` must be a String');

  // convert name to lowercase
  name = name.toLowerCase();

  // remove "fa-" prefix from name if it exists
  if (name.indexOf('fa-') === 0)
    name = name.substring(3);

  // ensure that the font exists, otherwise throw an error
  if (!_.isString(aliases[name]))
    throw new Error(`fa.svg name "${name}" must be a valid FontAwesome icon name`);

  // get the icon svg information
  const icon = iconsByUnicodeHex[aliases[name]];

  // ensure that the font svg exists, otherwise throw an error
  if (!_.isObject(icon))
    throw new Error(`fa.svg name "${name}" was missing its font SVG value parsed`);

  // return the svg
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${icon.width} ${icon.height}"><path fill="${color}" d="${icon.path}" /></svg>`;

}

export function img(name, color, width, height) {
  const str = svg(name, color);
  // eslint-disable-next-line max-len
  return `<img width="${width}" height="${height}" src="data:image/svg+xml;base64,${new Buffer(str, 'binary').toString('base64')}" />`;
}

export function png(name, color, width, height) {
  let str = svg(name, color);
  width = parseInt(width, 10) || 16;
  height = parseInt(height, 10) || 16;
  if (!_.isNumber(width)) throw new Error('fa.png width must be a number');
  if (!_.isNumber(height)) throw new Error('fa.png height must be a number');
  str = svg2png.sync(new Buffer(str, 'utf8'), { width, height });
  // eslint-disable-next-line max-len
  return `<img src="data:image/png;base64,${str.toString('base64')}" />`;
}

export default {
  aliases,
  icons,
  iconsByUnicodeHex,
  img,
  svg,
  png
};
