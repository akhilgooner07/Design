const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('./img'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/login', function(req,res){
  res.render('authenticate', {'login':true})
})

app.get('/signup', function(req,res){
  res.render('authenticate', {'login':false})
})

userData = {}

function User(name, password, roll_no){
  this.name = name
	this.password = password
	this.id = roll_no
	this.groupid = null
	function setGroupId(group_id){
	  this.groupid = group_id
	}
	this.claims = []
	this.totalClaims = 0
	this.totalReports = 0
	this.doClaim = function(){
	  this.totalClaims ++
		this.claim.push(new Date(Date.now()))
		return true
	}
	this.doReport = function(userId){
	  for(user in userData){
		  if(user.id == userId){
			  user.totalReports ++
				break
			}
		}
		return true
	}
	this.getReputation = function(){
	  return this.totalClaims - this.totalReports
	}
	this.joinGroup = function(groupId){
	  for(group in groupData){
		  if(group.id == groupId){
			  this.groupid = group.id
				group.users.push(this)
				break
			}
		}
	}
}

groupData = {}


function Group(name, id){
  this.name = name
	this.id = id
	this.users = []
}


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

app.listen(9000)
