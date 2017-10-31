const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const multer = require('multer')

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('./public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

userData = []

function User(name, password, roll_no){
    this.name = name
    this.password = password
    this.id = roll_no
    this.groupid = null
    this.image = 'dp_profile.png'
    function setGroupId(group_id){
        this.groupid = group_id
    }
    this.claims = []
    this.totalClaims = 0
    this.totalReports = 0
    this.doClaim = function(){
        this.totalClaims ++
        this.claim.push(new Date(Date.now()))
        
    }
    this.doReport = function(userId){
        userData.forEach(function(user){
            if(user.id == userId){
                user.totalReports ++
            }
        })
        
    }
    this.getReputation = function(){
        return this.totalClaims - this.totalReports
    }
    this.joinGroup = function(groupId){
        groupData.forEach(function(user){
            if(group.id == groupId){
                this.groupid = group.id
                group.users.push(this)
            }
        })
    }
}

groupData = []


function Group(name, id){
    this.name = name
    this.id = id
    this.users = []
}

app.get('/login', function(req,res){
    if(req.cookies['foodApp_design']){
        res.redirect('dashboard')
    } else {
        res.render('authenticate', {'login':true})
    }
})

app.get('/signup', function(req,res){
    if(req.cookies['foodApp_design']){
        res.redirect('dashboard')
    } else {
        res.render('authenticate', {'login':false})
    }
})

app.get('/logout', function(req,res){
    res.cookie('foodApp_design', '', { expires: new Date(0), httpOnly: true });
    res.send('logged out successfully')
})

app.post('/signup', function(req,res){
    var user = new User(req.body.name, req.body.password, req.body.rollno)
    userData.push(user)
    res.cookie('foodApp_design', req.body.rollno+' '+req.body.password, { expires: new Date(Date.now() + 172800000), httpOnly: true })
    res.send(req.cookies['foodApp_design'])
})

app.post('/login', function(req,res){
    var rollno = req.body.rollno
    var password = req.body.password
    userData.forEach(function(user){
        if(user.id == rollno && user.password == password){
            res.cookie('foodApp_design', rollno+' '+password, { expires: new Date(Date.now() + 172800000), httpOnly: true });
            res.render('profile', {'user': user})
        }
    })
})

app.get('/dashboard', function(req,res){
    res.render('dashboard')
})

app.get('/user', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0];
        var password = req.cookies['foodApp_design'].split(' ')[1];
        var found = false
        userData.forEach(function(user){
            if(user.id == rollno && user.password == password){
                found = true
                res.render('profile', {'user': user})
            }
        })
        if(!found){
            // redirect to signup
        }
    } else {
        res.send("You are not authorised to visit the page")
    }
})

app.post('/user', multer({dest: './public/img/'}).single('image'), function(req,res){
    var rollno = req.cookies['foodApp_design'].split(' ')[0];
    var password = req.cookies['foodApp_design'].split(' ')[1];
    userData.forEach(function(user){
        if(user.id == rollno && user.password == password){
            user.image = req.file.filename
            res.render('profile', {'user': user})
        }
    })
})

app.post('/claim', function(req,res){
    var userid = res.cookie('design', 'userID')
    userData.forEach(function(user){
        if(user.id == userid){
            user.currentClaim = true
            user.totalClaims ++
        }
    })
})

app.post('/reportclaim/:usrid', function(req,res){
    var groupid = res.cookie('design', 'groupID')
    var userid = req.params.userid
    userData.forEach(function(user){
        if(user.id == userid && user.groupid == groupid){
            user.totalReports ++
        }
    })
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
    userData.forEach(function(user){
        if(user.id == userid){
            res.send(user.totalClaims - user.totalReports)
        }
    })
})

app.listen(9500)
