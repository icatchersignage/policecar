let policeMode = false
let sirenStep = 0

function startPoliceCar() {
    policeMode = true
    music.setVolume(90)
    TPBot.setTravelSpeed(TPBot.DriveDirection.Forward, 35)
    TPBot.setWheels(30, 30)
}

function stopPoliceCar() {
    policeMode = false
    music.stopAllSounds()
    TPBot.stopCar()
    TPBot.headlightColor(0x000000)
    basic.clearScreen()
}

function policeLights() {
    sirenStep += 1

    if (sirenStep % 2 == 0) {
        TPBot.headlightColor(0xff0000)
        basic.showLeds(`
            .#.#.
            .#.#.
            ##.##
            .#.#.
            .#.#.
        `)
    } else {
        TPBot.headlightColor(0x0000ff)
        basic.showLeds(`
            #.#..
            #.#..
            ##.##
            #.#..
            #.#..
        `)
    }
}

function policeDrivePattern() {
    if (sirenStep % 4 == 0) {
        TPBot.setWheels(20, 35)
    } else if (sirenStep % 4 == 1) {
        TPBot.setWheels(35, 20)
    } else if (sirenStep % 4 == 2) {
        TPBot.setWheels(25, 35)
    } else {
        TPBot.setWheels(35, 25)
    }
}

basic.forever(function () {
    if (input.buttonIsPressed(Button.A) && !policeMode) {
        startPoliceCar()
    } else if (input.buttonIsPressed(Button.B) && policeMode) {
        stopPoliceCar()
    }

    if (policeMode) {
        if (sirenStep % 2 == 0) {
            music.playTone(660, 120)
        } else {
            music.playTone(440, 120)
        }
        policeLights()
        policeDrivePattern()
        basic.pause(160)
    } else {
        basic.pause(20)
    }
})