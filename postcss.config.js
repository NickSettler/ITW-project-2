module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-nested'),
        require('stylelint')({
            fix: true,
        }),
        require('postcss-combine-media-query')
    ]
}