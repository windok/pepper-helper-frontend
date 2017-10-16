/* eslint-env node */

import path from 'path';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin';
import OfflinePlugin from 'offline-plugin';
import webpack from 'webpack';

const production = process.argv.indexOf('--env.development') === -1;
const sourceMap = process.argv.indexOf('--env.source-map') === -1;

const currentPath = path.dirname(__filename);
const client = path.resolve(currentPath, 'src', 'index.js');
const dist = path.resolve(currentPath, 'public');

// --------------------------------------------------------

const plugins = [];

plugins.push(new webpack.DefinePlugin({
    __DEV__: !production,
    'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
}));

plugins.push(new CircularDependencyPlugin());
plugins.push(new SpriteLoaderPlugin());

plugins.push(new webpack.LoaderOptionsPlugin({
    options: {
        eslint: {
            failOnError: true,
        },
        context: '/',
        debug: !production,
        postcss: [autoprefixer],
    },
}));

const extractStyles = new ExtractTextPlugin({
    filename: `styles${production ? '-[hash].min' : ''}.css`,
    allChunks: true,
    disable: !production,
});
plugins.push(extractStyles);

production && plugins.push(new OfflinePlugin({
    safeToUseOptionalCaches: true,
    responseStrategy: 'cache-first',
    externals: [
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700%7CMaterial+Icons',
    ],
    ServiceWorker: {
        events: true
    },
    AppCache: {
        events: true
    }
}));

plugins.push(new HtmlWebpackPlugin({
    title: 'Pepper Helper',
    inject: false,
    production: production,
    template: path.resolve(currentPath, 'src', 'setup', 'htmlTemplate.js'),
    appMountId: 'root',
    favicon: path.resolve(currentPath, 'src', 'favicon.ico'),
    externalCSS: [
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700%7CMaterial+Icons',
    ],
    externalJS: [
        // any umd builds
    ],
}));

production && plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        screw_ie8: true,
        warnings: false,
        drop_console: true,
    },
    output: {comments: false},
    sourceMap: sourceMap,
}));

production || plugins.push(new webpack.HotModuleReplacementPlugin());
production || plugins.push(new webpack.NamedModulesPlugin());
production || plugins.push(new webpack.NoEmitOnErrorsPlugin());

// --------------------------------------------------------

const developmentConfig = {
    cache: true,
    devtool: sourceMap ? 'eval-source-map' : undefined,
    devServer: {
        contentBase: dist,
        compress: true,
        inline: true,
        hot: true,
        port: 3000,
        stats: 'errors-only',
        historyApiFallback: true,
    },
    entry: [
        'babel-polyfill',
        'react-hot-loader/patch',
        client
    ]
};

export default {
    cache: false,
    devtool: sourceMap ? 'hidden-source-map' : undefined,
    entry: client,
    output: {
        path: dist,
        publicPath: '/',
        filename: `[name]${production ? '-[hash].min' : ''}.js`,
        chunkFilename: `[name]${production ? '-[chunkhash].min' : ''}.js`,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: extractStyles.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: sourceMap,
                        },
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: sourceMap,
                            importLoaders: 1
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: sourceMap,
                            sourceMapContents: true,
                            outputStyle: production ? 'compressed' : 'expanded',
                        },
                    }],
                    fallback: 'style-loader',
                }),
            }, {
                test: /\.json$/,
                exclude: /node_modules/,
                loader: 'json-loader',
            }, {
                test: /\.(woff2?|ttf|eot)$/,
                loader: 'url-loader?limit=10000',
                exclude: /node_modules|SVGIcon\/icons/,
            }, {
                test: /\.(svg)$/i,
                include: path.resolve(currentPath, 'src/assets'),
                loaders: [{
                    loader: 'svg-sprite-loader',
                    options: {
                        extract: true,
                        spriteFilename: 'icon-sprites.[hash:8].svg',
                    },
                }, 'svgo-loader']
            }],
    },
    plugins,
    resolve: {
        alias: {
            Actions: path.resolve(currentPath, 'src/actions/'),
            Assets: path.resolve(currentPath, 'src/assets/'),
            Components: path.resolve(currentPath, 'src/components/'),
            Config: path.resolve(currentPath, 'src/config/index.js'),
            Errors: path.resolve(currentPath, 'src/errors'),
            Models: path.resolve(currentPath, 'src/models/'),
            Reducers: path.resolve(currentPath, 'src/reducers/'),
            Screens: path.resolve(currentPath, 'src/screens/'),
            Services: path.resolve(currentPath, 'src/services/'),
            Store: path.resolve(currentPath, 'src/store/'),
            globals: path.resolve(currentPath, 'src', '_globals.scss'),
            'redux-offline': path.resolve(currentPath, 'node_modules/@redux-offline/redux-offline/'),
        },
        extensions: ['.js'],
        mainFiles: ['index', 'index.js'],
        modules: [
            'node_modules',
            'src',
        ],
    },
    stats: 'normal',
    ...(production ? {} : developmentConfig)
};