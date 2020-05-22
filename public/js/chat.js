const socket=io()

// socket.on('countUpdated',(countnumber)=>{
//     console.log("count updated",countnumber)
    
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('increment')
// })

const $messageForm = document.querySelector('#message-form')
const $sendLocation = document.querySelector('#send-location')
const $messageFormInput= $messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $messages=document.querySelector('#messages')



//template
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML



//options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    // new message ellement
    const $newMessage=$messages.lastElementChild

    // height of the new message
    const newMessageStyles=getComputedStyle($newMessage)
    const newMessageMargin=parseInt(newMessageStyles.marginBottom)
    const newMessageHeight=$newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight=$messages.offsetHeight

    //height of messages container
    const containerHeight=$messages.scrollHeight

    //how far have i scrolled
    scrollOffset=$messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}



socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    })

socket.on('roomData',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
    

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
//disable form
    const message=e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{            //mess is the callback from server callback function
        // console.log("mess was delivered",mess)

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
//enable form
        if(error){
            return console.log(error)
        }
        console.log("message delivered")
    })
})

$sendLocation.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser!')
    }

    $sendLocation.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        socket.emit('sendLocation',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            console.log("location shared")
        $sendLocation.removeAttribute('disabled')

        })

    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})