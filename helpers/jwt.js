var { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL
    return jwt({
        secret,
        algorithms: ['HS256']
    }).unless({
        path: [
            {
                url: /\/api\/v1\/rooms(.*)/,
                methods: ['GET', 'OPTIONS'],
            },
            `${api}/users/login`,
            `${api}/users/register`,
            // { url: /(.*)/ },
        ],
    })
}

module.exports = authJwt;

