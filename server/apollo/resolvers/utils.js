const { isEmpty } = require('lodash')
const parseFeed = require('../../lib/feed')
const qiniu = require('qiniu')
const check = require('../../lib/check')
const upsert = require('../../lib/upsert')

const resolver = {
    Mutation: {
        async checkRSS(root, args, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'cms_rss' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@cms_rss')
                }

                const posts = await parseFeed('https://blog.feddy.org/rss')
                const items = posts.map(one => {
                    return {
                        ...one,
                        userId
                    }
                })

                await upsert('news', items)

                return posts.length
            } catch (e) {
                throw new Error(e)
            }
        },
        async mkQiniuToken(root, args, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'abc_qiniu' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@abc_qiniu')
                }

                const { QINIU_ACCESS_KEY, QINIU_SECRET_KEY, QINIU_BUCKET } = process.env

                const qiniuMac = new qiniu.auth.digest.Mac(QINIU_ACCESS_KEY, QINIU_SECRET_KEY)
                const putPolicy = new qiniu.rs.PutPolicy({
                    scope: QINIU_BUCKET
                })

                return putPolicy.uploadToken(qiniuMac)
            } catch(e) {
                throw new Error(e)
            }
        }
    }
}

module.exports = resolver
