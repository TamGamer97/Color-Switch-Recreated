const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')


document.getElementById('canvas').width = window.innerWidth
document.getElementById('canvas').height = window.innerHeight

// Variables
let playerPos = 10
let playerPosRelative = 10
const playerPush = 50
let playerColor = 'purple'
const gravity = 1.7 // 1.7
let playerTarget = 0
const rotationSpeed = 1.5
let bgPos = 10
let bgTarget = 0
let SpiralsInfo = [
    [120, 0, 'red', 'red', 'green', 'blue', 'purple'], // [positon, rotation, currentColor, color1, color2, color3, color4]
]
let checkpointsSpawn = [
    [120, 'blue'], // [y-position, color to change to]
]
const avalibleColors = ['green', 'blue', 'red', 'pink', 'pink', 'yellow', 'orange']

// Objects

class Player{
    constructor(pos, color)
    {
        this.pos = pos
        this.color = color
    }

    draw()
    {
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(canvas.clientWidth / 2, (canvas.clientHeight - this.pos) - 100, 15, 0, 2 * Math.PI);
        ctx.fill()
    }
}

class Spiral{
    constructor(colors, pos, rotation)
    {
        this.colors = colors
        this.pos = pos
        this.rotation = rotation
    }

    draw()
    {
        // const startPos = canvas.clientWidth / 2

        ctx.save(); // save and restore before and after rotation for perfromace
        
        let rotationAngle = this.rotation
        rotationAngle = rotationAngle * Math.PI / 180
        ctx.translate( canvas.clientWidth / 2, this.pos + bgPos );
        ctx.rotate(rotationAngle)
        ctx.translate( -canvas.clientWidth / 2, -this.pos - bgPos );

        ctx.beginPath()
        ctx.arc(canvas.clientWidth / 2, this.pos + bgPos, 70, 0, Math.PI / 2, false)
        ctx.lineWidth = 10
        ctx.strokeStyle = this.colors[3]
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(canvas.clientWidth / 2, this.pos + bgPos, 70, 0, -Math.PI / 2, true)
        ctx.lineWidth = 10
        ctx.strokeStyle = this.colors[4]
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(canvas.clientWidth / 2, this.pos + bgPos, 70, Math.PI, -Math.PI / 2, false)
        ctx.lineWidth = 10
        ctx.strokeStyle = this.colors[5]
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(canvas.clientWidth / 2, this.pos + bgPos, 70, Math.PI, Math.PI / 2, true)
        ctx.lineWidth = 10
        ctx.strokeStyle = this.colors[6]
        ctx.stroke()



        ctx.restore(); // save and restore before and after rotation for perfromace
        
    }
}

class Checkpoint{
    constructor(pos, color)
    {
        this.pos = pos
        this.color = color
    }

    draw()
    {
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(canvas.clientWidth / 2, this.pos + bgPos, 15, 0, 2 * Math.PI);
        ctx.fill()
    }
}

// Functions

function initilize()
{
    let randPos = 120
    let colorChange = avalibleColors[rand(0, 6)]
    
    for (var i = 0; i<rand(5, 10); i++)
    {
        randPos -= 300

        checkpointsSpawn.push( [ randPos + 150, colorChange ] )

        SpiralsInfo.push( [randPos, 0, 'depricated-color', avalibleColors[rand(0, 6)], avalibleColors[rand(0, 6)], colorChange, avalibleColors[rand(0, 6)] ] )

        colorChange = avalibleColors[rand(0, 6)]
        
    }
    Update()
}

function Update()
{
    // Clear
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();

    // Gravity
    if(playerPos > 10 || bgPos != 10)
    {
        playerPos -= gravity
    }

    // Background
    if(bgTarget > 0)
    {
        bgPos += 5
        bgTarget -= 5
    }
    
    // Spirals
    SpiralsInfo.forEach((spir, spirInd) => {
        // console.log(spir)
        
        const s = new Spiral(spir, spir[0], spir[1])
        s.draw()
        
        
        // [120, 0, 'red', 'red', 'green', 'blue', 'purple']
        
        let bottomColor;
        let topColor;
        
        if(spir[1] < 90)
        {
            bottomColor = spir[3]
            topColor = spir[5]
        }
        
        if(spir[1] >= 90)
        {
            // console.log('green')
            bottomColor = spir[4]
            topColor = spir[6]
        }
        if(spir[1] >= 180)
        {
            // console.log('blue')
            bottomColor = spir[5]
            topColor = spir[3]
        }
        if(spir[1] >= 270)
        {
            // console.log('purple')
            bottomColor = spir[6]
            topColor = spir[4]
        }
        if(spir[1] == 360)
        {
            // console.log('360')
            SpiralsInfo[spirInd][1] = 0
        }
        // console.log(SpiralsInfo[spirInd][2])

        // console.log(bottomColor)

        // Collision
        if( (((((canvas.clientHeight - playerPos) - 100)) - (spir[0] + bgPos)) - 70) >= -20 && (((((canvas.clientHeight - playerPos) - 100)) - (spir[0] + bgPos)) - 70) <= 20)
        { // checks if the distance between the sprial's bottom and the player is between the players radius (20)
            if(bottomColor != playerColor)
            {
                console.log(bottomColor + " " + playerColor)
                GameOver()
                return
            }
        }

        if( (((((canvas.clientHeight - playerPos) - 100)) - (spir[0] + bgPos)) + 70) >= -20 && (((((canvas.clientHeight - playerPos) - 100)) - (spir[0] + bgPos)) + 70) <= 20)
        {
            // checks if the distance between the sprial's top and the player is between the players radius (20)
            if(topColor != playerColor)
            {
                console.log(topColor + " " + playerColor)
                GameOver()
                return
            }
        }


        SpiralsInfo[spirInd][1] += rotationSpeed
    });

    // Checkpoints
    checkpointsSpawn.forEach((checkP, checkPInd) => {
        const c = new Checkpoint(checkP[0], checkP[1])
        c.draw()

        if((((((canvas.clientHeight - playerPos) - 100)) - (checkP[0] + bgPos)) + 15) >= -30 && (((((canvas.clientHeight - playerPos) - 100)) - (checkP[0] + bgPos)) + 15) <= 30)
        {
            // console.log('checkpoint collided')
            // remove checkpoint
            checkpointsSpawn.splice(checkPInd, 1)
            // credit
            document.getElementById('scoreTxt').innerHTML = JSON.parse(document.getElementById('scoreTxt').innerHTML) + 1
            // change player's color
            playerColor = checkP[1]
            // console.log(playerColor)
        }
    })

    // Player
    if(playerTarget > 0)
    {
        playerPos += 10
        playerPosRelative += 10
        playerTarget -= 10
    }

    if(playerPos < -100 || playerPos > 500)
    {
        GameOver()
    }

    const p = new Player(playerPos, playerColor)
    p.draw()
    // console.log(playerPos)

    requestAnimationFrame(Update)
}

function GameOver()
{
    // alert('Game Over')
    location.href = '/index.html'
}

function rand(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Events

window.addEventListener('mousedown', (event) => {
    // console.log('clicked on page')
    playerTarget += playerPush
    bgTarget += 30
})

window.addEventListener('keypress', (event) => {
    // console.log('clicked on page')
    if(event.code == 'Enter')
    {
        // console.log('spiral pos: ' + (128 + bgPos) )
        // console.log('player pos: ' + (((canvas.clientHeight - playerPos) - 100)) )
    
    }
})


initilize()