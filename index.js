const _ = require('lodash'),
    fs = require('fs'),
    promise = require('bluebird'),
    gitlab = require('gitlab').Gitlab;

var url = process.env.GITLAB_URL;

if (!url) {
    console.error('GITLAB_URL environment variable not set');
    process.exit();
}

var token = process.env.GITLAB_TOKEN;

if (!token) {
    console.error('GITLAB_TOKEN environment variable not set');
    process.exit();
}

const api = new gitlab({
    host: url,
    token: token,
});

let rawdata = fs.readFileSync('users.json');
let users = JSON.parse(rawdata);

promise.mapSeries(users, (user) => {
    return api.Users.search(user.email).then((existing) => {
        // console.log(existing);
        if (existing.length > 0) {
            console.log(`${user.email} already exists`);
        } else {
            console.log(`creating ${user.email} ...`);
            return api.Users.create({
                username: user.username,
                name: user.name,
                email: user.email,
                password: 'Password1234!',
                external: true,
                is_admin: false,
                skip_confirmation: true
            }).then((u) => {
                console.log(`${u.email} user created.`);
                return api.GroupMembers.add('scp-canary', u.id, 40).then(() => {
                    console.log(`${u.email} access granted`);
                });
            });
        }
    });
}).then(() => {
    console.log('done');
});
