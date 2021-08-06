import './sass/main.scss';

import { request } from './js/api';
request('/call', { page: 1 }).then(data => console.log(data));
