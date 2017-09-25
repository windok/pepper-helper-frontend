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

const client = path.resolve(process.cwd(), 'src', 'index.js');
const dist = path.resolve(process.cwd(), 'public');

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
    template: path.resolve(process.cwd(), 'src', 'setup', 'htmlTemplate.js'),
    appMountId: 'root',
    favicon: path.resolve(process.cwd(), 'src', 'favicon.ico'),
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
                include: path.resolve(process.cwd(), 'src/assets'),
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
            Actions: path.resolve(process.cwd(), 'src/actions/'),
            Assets: path.resolve(process.cwd(), 'src/assets/'),
            Components: path.resolve(process.cwd(), 'src/components/'),
            Reducers: path.resolve(process.cwd(), 'src/reducers/'),
            Services: path.resolve(process.cwd(), 'src/services/'),
            Screens: path.resolve(process.cwd(), 'src/screens/'),
            Config: path.resolve(process.cwd(), 'src/config/index.js'),
            Store: path.resolve(process.cwd(), 'src/store/'),
            Models: path.resolve(process.cwd(), 'src/models/'),
            globals: path.resolve(process.cwd(), 'src', '_globals.scss'),
            'redux-offline': path.resolve(process.cwd(), 'node_modules/@redux-offline/redux-offline/'),
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