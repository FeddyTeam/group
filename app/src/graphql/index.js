import gql from 'graphql-tag'

export const GET_BUBBLES = gql`query getBubbles($skip: Int, $count: Int) {
    bubbleList: getBubbles(skip: $skip, count: $count) {
        id,
        text,
        user {
            id,
            username,
            name,
            avatar
        },
        comments {
            id,
            content,
            createdAt,
            user {
                id,
                username,
                name,
                avatar
            }
        },
        createdAt
    }
}`

export const GET_BUBBLES_PAGE = gql`query getBubblesPage($skip: Int, $count: Int) {
    bubblesPage: getBubblesPage(skip: $skip, count: $count) {
        hasMore,
        bubbles {
            id,
            text,
            cover,
            link,
            user {
                id,
                username,
                name,
                avatar
            },
            comments {
                id,
                content,
                createdAt,
                user {
                    id,
                    username,
                    name,
                    avatar
                }
            },
            createdAt
        }
    }
}`

export const GET_COMMENTS = gql`query ($bubbleId: ID!, $skip: Int, $count: Int) {
    comments: getComments(bubbleId: $bubbleId, skip: $skip, count: $count) {
        id,
        content,
        createdAt,
        user {
            id,
            username,
            name,
            avatar
        }
    }
}
`

export const CREATE_COMMENT = gql`mutation ($comment: CommentInput!) {
    newComment: createComment(comment: $comment) {
        id,
        content,
        createdAt,
        user {
            id,
            username,
            name,
            avatar
        }
    }
}`

export const CREATE_BUBBLE = gql`mutation ($bubble: BubbleInput!) {
    newBubble: createBubble(bubble: $bubble) {
        id,
        text,
        user {
            id,
            username,
            name,
            avatar,
        },
        comments {
            id,
            content
        },
        createdAt
    }
}`

export const GET_PROFILE = gql`query {
    profile: getProfile {
        id,
        createdAt,
        updatedAt,

        status,
        username,
        name,
        email,
        bio,
        avatar,
        birthday,
        url
    }
}`

export const UPDATE_PROFILE = gql`mutation ($profile: ProfileInput!) {
    profile: updateProfile(profile: $profile) {
        id,
        createdAt,
        updatedAt,

        status,
        username,
        name,
        email,
        bio,
        avatar,
        birthday,
        url
    }
}`
