const users=[]

//add user
//remove user
//get user
//get users in room


const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return {
            error:"username and room are required"
        }
    }

    //check for existing user
    const existingUser=users.find((user)=> {
        return user.room === room && user.username===username
    })

    //validate username
    if(existingUser){
        return {
            error:"username is in user"
        }
    }

    //store user
    const user={id,username,room}
    users.push(user)
    return {user}

}


const removeUser=(id)=>{
    const index = users.findIndex((user)=> user.id === id)

        if( index !== -1){
            return users.splice(index,1)[0]
        }
    
}

const getUser=(id)=>{
    return users.find((user)=>user.id===id)
    // if(!id){
    //     return {
    //         error:"undefined"
    //     }
    // }
    // return user
}

const getUsersInRoom=(room)=>{
    return users.filter((user)=>user.room===room)
}


// addUser({
//     id:22,
//     username:"ishan    ",
//     room:"   123"
// })
// addUser({
//     id:22,
//     username:"ishan dawar   ",
//     room:"   123"
// })
// console.log(users)

// const res=addUser({
//     id:11,
//     username:"ishan",
//     room:"111"
// })
// console.log(res)

// const removedUser=removeUser(22)

// console.log(removeUser)
// console.log(users)




// const getUsers=getUser(212)
// console.log(getUsers)

// const userlist=getUsersInRoom("123")
// console.log(userlist)



module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}