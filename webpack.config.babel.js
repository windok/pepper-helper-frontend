import path from 'path';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export default {
    // devtool: 'source-map',
    entry: './src/index',
    output: {
        path: path.join(__dirname, 'public/static'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            Actions: path.resolve(__dirname, 'src/actions/'),
            Components: path.resolve(__dirname, 'src/components/'),
            Reducers: path.resolve(__dirname, 'src/reducers/'),
            Services: path.resolve(__dirname, 'src/services/'),
            Screens: path.resolve(__dirname, 'src/screens/'),
            Config: path.resolve(__dirname, 'src/config.js'),
            Store: path.resolve(__dirname, 'src/store.js')
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
