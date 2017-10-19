const app = require('express')()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser)

app.listen(9000)

app.get('/', function(req,res){
    console.log(req)
    res.send('Hello World')
})

userData = {}

/*

userData = {
    
    {
        "id": "...",
        "groupid": "...",
        "currentClaim": "...",
        "totalReports": "...",
        "totalClaims": "...",
    }

}

*/

groupData = {}

/*

{
    {
        "id": "...",
        "userids": [
            ...
        ]
    }
}

*/

app.post('/claim', function(req,res){
    var userid = res.cookie('design', 'userID')
    for(user in userData){
        if(user.id == userid){
            user.currentClaim = true
            user.totalClaims ++
        }
    }
})

app.post('/reportclaim/:usrid', function(req,res){
    var groupid = res.cookie('design', 'groupID')
    var userid = req.params.userid
    for(user in userData){
        if(user.id == userid && user.groupid == groupid){
            user.totalReports ++
        }
    }
    // TODO : set a cookie for 1 day
})

app.get('/grouplist', function(req,res){
    res.writeHead(200, {'content-type': 'text/json'})
    res.end(groupData)
})

app.post('/joingroup/:grpid', function(req,res){

})

app.post('/exitgroup/:grpid', function(req,res){

})

app.get('reputation/:usrid', function(req,res){
    var userid = req.params.userid
    for(user in userData){
        if(user.id == userid){
            res.send(user.totalClaims - user.totalReports)
            break
        }
    }
})