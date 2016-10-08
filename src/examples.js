
import fs from 'fs';
import path from 'path';

import { svg } from './';

const media = path.join(__dirname, '..', 'media');

fs.writeFileSync(
  `${media}/hacker-news.svg`,
  svg('hacker-news', 'rgba(255,102,0,0.75)'),
  'utf8'
);

fs.writeFileSync(
  `${media}/briefcase-black.svg`,
  svg('briefcase', '#000'),
  'utf8'
);

fs.writeFileSync(
  `${media}/briefcase-opacity.svg`,
  svg('hacker-news', 'rgba(0,0,0,0.5)'),
  'utf8'
);

const imgs = [
  // eslint-disable-next-line max-len
  '<img src="https://cdn.rawgit.com/crocodilejs/font-awesome-assets/master/media/hacker-news.svg" width="100" height="100" title="hacker-news" alt="hacker-news" />',
  // eslint-disable-next-line max-len
  '<img src="https://cdn.rawgit.com/crocodilejs/font-awesome-assets/master/media/briefcase-black.svg" width="100" height="100" title="briefcase-black" alt="briefcase-black" />',
  // eslint-disable-next-line max-len
  '<img src="https://cdn.rawgit.com/crocodilejs/font-awesome-assets/master/media/briefcase-opacity.svg" width="100" height="100" title="briefcase-opacity" alt="briefcase-opacity" />'
];

fs.writeFileSync(path.join(__dirname, '..', 'media', 'examples.html'), imgs.join('\n\n'), 'utf8');
