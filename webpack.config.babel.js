import path from 'path';
import ClosureCompilerPlugin from 'webpack-closure-compiler';

export default {
    devtool: 'eval',
    entry: './src/index',
    output: {
        path: path.join(__dirname, 'public/static'),
        filename: 'bundle.js'
    },
    module: {
        // todo lint preloaders
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname,
        }],
    },
    // plugins: [
    //     new ClosureCompilerPlugin({
    //         compiler: {
    //             language_in: 'ECMASCRIPT6',
    //             language_out: 'ECMASCRIPT5',
    //             compilation_level: 'ADVANCED'
    //         },
    //         concurrency: 3,
    //     })
    // ]
};
