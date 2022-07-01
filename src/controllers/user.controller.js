let database = []
let id = 0

let userController={
    addUser:(req, res)=>{
        let user = req.body
        id++
        console.log(`User: ${JSON.stringify(user)}`)
        user={
            id, 
            ...user,
        }
    
        database.push(user)
        console.log(`Database: ${JSON.stringify(database)}`)
        res.status(201).json({
            status: 201,
            result: user
        })
    },

    getAllUsers:(req, res) => {
        res.status(200).json({
            status: 200,
            result: database
        })
    },

    getPersonalUserProfile:(req, res) => {

    },

    getUserById:(req, res) =>{
        const userId = req.params.userId
        let user = database.filter((item) => item.id == userId)
        if(user.length > 0){
            console.log(user)
            res.status(200).json({
                status: 200,
                result: user
            })
        }else{
            res.status(404).json({
                status: 404,
                result: `Movie with ID ${userId} not found.`
            })
        }
    },

    updateUser:(req, res) =>{

    },

    deleteUser:(req, res) =>{
        const userId = req.params.userId
        let user = database.filter((item) => item.id == userId)
        if(user.length > 0){
            console.log(JSON.stringify(user))
            database.splice((item) => item.id == userId)
            res.status(200).json({
                status: 200,
                result: `User with ID: ${userId} was deleted succesfully.`
            })
        }else{
            res.status(404).json({
                status: 404,
                result: `Movie with ID ${userId} not found.`
            })
        }
    }
}

module.exports = userController