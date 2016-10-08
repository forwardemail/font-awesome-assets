
import $ from 'cheerio';
import svg2png from 'svg2png';
import _ from 'lodash';
import svgfont2js from 'svgfont2js';
import fs from 'fs';

function applyAttributes($el, attrs) {
  // [ [ attr, val ], ... ]
  if (!_.isArray(attrs) || attrs.length === 0)
    return $el;
  const hasMissing = _.some(attrs, pair => {
    return !_.isArray(pair) || pair.length !== 2;
  });
  if (hasMissing) throw new Error('attribute pairs must be arrays with two keys [ attr, val ]');
  _.each(attrs, pair => {
    $el.attr(pair[0], pair[1]);
  });
  return $el;
}

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

export function svg(name, color, width, height, attrs) {

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
  let $svg = $('<svg>', {
    xmlMode: true
  });
  $svg.attr('xmlns', 'http://www.w3.org/2000/svg');
  $svg.attr('width', width);
  $svg.attr('height', height);
  $svg.attr('viewBox', `0 0 ${icon.width} ${icon.height}`);
  $svg = applyAttributes($svg, attrs);
  $svg.append(`<path fill="${color}" d="${icon.path}" />`);
  return $.html($svg);

}

export function img(name, color, width, height, attrs) {
  const str = svg(name, color);
  let $img = $('<img>');
  $img.attr('width', width);
  $img.attr('height', height);
  $img.attr('src', `data:image/svg+xml;base64,${new Buffer(str, 'binary').toString('base64')}`);
  $img = applyAttributes($img, attrs);
  return $.html($img);
}

export function png(name, color, width, height, attrs, size) {
  let str = svg(name, color);
  width = parseInt(width, 10) || 16;
  height = parseInt(height, 10) || 16;
  size = parseInt(size, 10) || 1;
  if (!_.isNumber(width)) throw new Error('fa.png width must be a number');
  if (!_.isNumber(height)) throw new Error('fa.png height must be a number');
  str = svg2png.sync(new Buffer(str, 'utf8'), {
    width: parseInt(width * size, 10),
    height: parseInt(height * size, 10)
  });
  let $img = $('<img>');
  $img.attr('width', width);
  $img.attr('height', height);
  $img.attr('src', `data:image/png;base64,${str.toString('base64')}`);
  $img = applyAttributes($img, attrs);
  return $.html($img);
}

export function png2x(name, color, width, height, attrs) {
  return png(name, color, width, height, attrs, 2);
}

export function png3x(name, color, width, height, attrs) {
  return png(name, color, width, height, attrs, 3);
}

export default {
  aliases,
  icons,
  iconsByUnicodeHex,
  img,
  svg,
  png,
  png2x,
  png3x
};
