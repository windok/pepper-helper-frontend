import path from 'path';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

var isSourceMap = process.argv.indexOf('---devtool=source-map');

export default {
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
            Config: path.resolve(__dirname, 'src/config/index.js'),
            Store: path.resolve(__dirname, 'src/store/'),
            Models: path.resolve(__dirname, 'src/models/')
        },
        extensions: ['.js']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/,
                include: __dirname,
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: isSourceMap
                            }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('bundle.css'),
        new CircularDependencyPlugin()
    ]
};