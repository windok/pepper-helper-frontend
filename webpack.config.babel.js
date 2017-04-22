import path from 'path';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export default {
    //devtool: 'source-map',
    entry: './src/index',
    output: {
        path: path.join(__dirname, 'public/static'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            actions: 'actions/',
            components: 'components/',
            reducers: 'reducers/',
            services: 'services/',
            productScreens: 'screens/product/'
        },
        extensions: ['.js']
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname,
        }]
    },
    plugins: [
        new CircularDependencyPlugin()
    ]
};
