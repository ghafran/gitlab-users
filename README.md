# Create users in batch

Create json file with users users.json
```
[{
    "username": "",
    "name": "",
    "email": ""
}]
```

Run import
```
export GITLAB_URL=<URL of gitlab server>
export GITLAB_TOKEN=<Your private token>
git clone https://github.com/ghafran/gitlab-users.git
cd gitlab-users
npm install
node index.js
```