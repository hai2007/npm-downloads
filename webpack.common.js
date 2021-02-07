module.exports = {
    entry: ['./src/entry.js'],
    output: {
        path: __dirname,
        filename: 'dist/main.v4.js'
    },
    module: {
        rules: [{
            test: /\.clunch$/,
            loader: ['clunch/loader.js']
        }, {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader', 'postcss-loader']
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|jpeg|gif|bmp)$/,
            loader: [{
                loader: "url-loader",
                options: {
                    name: "dist/[name].[ext]",
                    context: "src/asset",
                    limit: 5000
                }
            }]
        }]
    }
};
