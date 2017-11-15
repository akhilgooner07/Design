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
    this.groupid = '--NULL--'
    this.image = 'dp_profile.png'
    function setGroupId(group_id){
        this.groupid = group_id
    }
    this.claim = null
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


function Group(id){
    this.id = id
    this.users = []
}

app.get('/login', function(req,res){
    if(req.cookies['foodApp_design']){
        res.redirect('dashboard')
    } else {
        res.render('authenticate', {'login':true, 'user_exists': false, 'name': ''})
    }
})

app.get('/signup', function(req,res){
    if(req.cookies['foodApp_design']){
        res.redirect('dashboard')
    } else {
        res.render('authenticate', {'login':false, 'user_exists': false, 'name': ''})
    }
})

app.get('/logout', function(req,res){
    res.cookie('foodApp_design', '', { expires: new Date(0), httpOnly: true });
    res.send('logged out successfully')
})

app.post('/signup', function(req,res){
    if(!userData.some(user => user.id == req.body.rollno)){
        var user = new User(req.body.name, req.body.password, req.body.rollno)
        userData.push(user)
        res.cookie('foodApp_design', req.body.rollno+' '+req.body.password, { expires: new Date(Date.now() + 172800000), httpOnly: true })
        res.redirect('/dashboard')
    }else{
        res.render('authenticate', {'login':false, 'user_exists': true, 'name': req.body.name})
    }
})

app.post('/login', function(req,res){
    var rollno = req.body.rollno
    var password = req.body.password
    userData.forEach(function(user){
        if(user.id == rollno && user.password == password){
            res.cookie('foodApp_design', rollno+' '+password, { expires: new Date(Date.now() + 172800000), httpOnly: true });
            res.redirect('/dashboard')
        }
    })
})

app.get('/dashboard', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                var groupFound = false
                groupData.forEach(function(group){
                    if(group.id==user.groupid){
                        groupFound = true
                        res.render('dashboard',{group:group.users,currentUser: user})
                    }
                })
                if(!groupFound){
                    res.render('dashboard',{group:{'users':[]}})
                }
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }
})

app.get('/user', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
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

app.get('/settings', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                res.render('settings',{'user':user})
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }
})

app.get('/editgroup', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                res.render('editgroup',{'user':user,'groups':groupData})
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }
})


app.post('/claim', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                var predate = -1
                try{
                    predate = user.claim.getDate()
                }catch(err){
                    predicate = -1
                }
                var datenow = new Date()
                if(predate!=datenow.getDate()){
                    user.totalClaim++
                    user.claim = datenow
                    res.send('Done')
                }else{
                    res.send('try-again')
                }
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }

})

app.post('/reportclaim/:usrid', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var groupid = null
        userData.forEach(function(user){
            if(user.id == rollno && user.id == password){
                groupid = user.groupid
            }
        })
        var userid = req.params.usrid
        var found = false
        userData.forEach(function(user){
            if(user.id == userid && user.groupid == groupid){
                user.totalReports ++
                found = true
            }
        })
        console.log(userid+' '+found+' '+groupid)
        if(found) res.send("done")
        else res.send("not-done")
    }else{
        res.send("you are not authorised to view this page")
    }
})

app.get('/grouplist', function(req,res){
    res.writeHead(200, {'content-type': 'text/json'})
    res.end(groupData)
})

/*
 * Ajax method
 *
 * */

app.post('/joingroup', function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                user.groupid = req.body.grpid
                groupData.forEach(function(group){
                    if(user.groupid == group.id){
                        group.users.push(user)
                    }
                })
                res.send("done")
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }

})

app.get('/formgroup',function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                res.render('makegroup',{unique:true})
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }
})

app.post('/formgroup',function(req,res){
    if(req.cookies['foodApp_design']){
        var rollno = req.cookies['foodApp_design'].split(' ')[0]
        var password = req.cookies['foodApp_design'].split(' ')[1]
        var found = false
        userData.forEach(function(user){
            if(user.id==rollno && user.password==password){
                found=true
                var unique = true
                groupData.forEach(function(group){
                    if(group.id==req.body.grpid) unique=false
                })
                if(unique){
                    user.groupid = req.body.grpid
                    var group = new Group(req.body.grpid)
                    group.users.push(user)
                    groupData.push(group)
                    res.send("done")
                }else{
                    res.render('makegroup',{unique:false})
                }
            }
        })
        if(!found){
            //redirect to signup
        }
    }else{
        res.send("You are not authorised to visit the page")
    }
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

/*
 * Dummy routes for debug and testing
 *
 * */

app.get('/form-dummy-group', function(req,res){
    var group1 = new Group('Dummy 1')
    var group2 = new Group('Dummy 2')
    groupData.push(group1)
    groupData.push(group2)
    res.send(groupData)
})

app.listen(9500)
