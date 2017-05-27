import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import Root from './Root';
import configureStore from './configureStore';

const store = configureStore();

render(
    <Root store={store}/>,
    document.getElementById('root')
);



import axios from 'axios';

const phClient = axios.create({
    baseURL: 'https://api.pepper-helper.dev:8080/',
    timeout: 2000,
    headers: {
        'ph-token': 'test',
        'Content-Type': 'application/json'
    }
});

phClient.get('/product-list')
    .then((result) => {
        console.log('success', result);

        return phClient.get('/list-item', [])
            .then((result) => {
                console.log('success', result);
            })
            .catch((error) => {
                console.log('error', error);
            });

    })
    .catch((error) => {
        console.log('error', error);
    });