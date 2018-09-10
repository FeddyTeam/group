const FeedParser = require('feedparser')
const axios = require('axios')
const { get } = require('lodash')

function parseFeed(url) {
    const feedparser = new FeedParser()

    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url,
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(feedparser)
        }).catch(err => {
            reject(err)
        })

        feedparser.on('error', err => {
            reject(err)
        })

        feedparser.on('readable', function () {
            const stream = this
            const results = []

            stream.on('data', (item) => {
                const image = get(item, 'media:content.@.url', 'no-image')
                const { date, summary, guid, author, title, link } = item
                const post = {
                    title,
                    altTitle: author,
                    content: summary,

                    image,
                    altImage: image,
                    thumbnail: '',

                    status: 'actived',
                    level: 'normal',
                    type: 'post',

                    createdAt: date,
                    updatedAt: date,
                    activedAt: null,
                    expiredAt: null,

                    link,
                    color: '#ffffff',
                    id: `feddy_${guid}`
                }

                results.push(post)
            })

            stream.on('end', () => {
                resolve(results)
            })
        })
    })
}

// parseFeed('https://blog.feddy.org/rss')

module.exports = parseFeed
