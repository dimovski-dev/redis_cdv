import express from 'express'
import redis from 'redis'
import fetch from 'node-fetch';

const app = express();

const REDIS_PORT = 6379;

const client = redis.createClient(REDIS_PORT);

const runClient = async () => {
    await client.connect();
}

runClient();

async function getRepos(req, res) {
    try {
        const username = req.params.username;
        const response = await fetch(`https://api.github.com/users/${username}`);

        const fetchGithubData = new Promise((resolve, reject) => {
                response.json().then((data) => resolve(data)).catch(err => reject(err));
        })

        fetchGithubData.then((response) => {
            client.set(username, JSON.stringify(response))
            return res.status(200).json(response)
        })
    } catch (err) {
        res.status(500)
    }
}




async function cache(req, res, next) {
    const username = req.params.username;

     client.get(username).then(response => {
        if(response !== null){
            console.log("Already cached")
            return res.json(response)
        }else{
            console.log("Not cached")
            next();
        }
     })

}

app.get(`/repos/:username`, cache, getRepos)

app.listen(3000, () => console.log("Working"))