module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-nested'),
        require('postcss-merge-rules'),
        require('stylelint')({
            fix: true,
        }),
        require('postcss-combine-media-query')
    ]
}