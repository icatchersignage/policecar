let policeMode = false
let sirenStep = 0

function startPoliceCar() {
    policeMode = true
    sirenStep = 0
    music.setVolume(120)
    TPBot.setTravelSpeed(TPBot.DriveDirection.Forward, 35)
}

function stopPoliceCar() {
    policeMode = false
    music.stopAllSounds()
    TPBot.stopCar()
    TPBot.headlightColor(0x000000)
    basic.clearScreen()
}

function playGermanSiren() {
    // Deutsches Martins-Horn (DIN 14610):
    // Wechselt exakt zwischen a' (440 Hz) und d'' (587 Hz)
    if (sirenStep % 2 === 0) {
        music.ringTone(440) // "Ta" (Tiefer Ton: a')
    } else {
        music.ringTone(587) // "Tü" (Hoher Ton: d'')
    }
}

function policeLights() {
    // Deutsche Polizeifahrzeuge nutzen reines Blaulicht (Doppelblitz / Wechselblitz)
    if (sirenStep % 2 === 0) {
        TPBot.headlightColor(0x0000ff) // Blau Links
        basic.showLeds(`
            # . . . .
            # # . . .
            # . # . .
            # # . . .
            # . . . .
        `)
    } else {
        TPBot.headlightColor(0x0000ff) // Blau Rechts
        basic.showLeds(`
            . . . . #
            . . . # #
            . . # . #
            . . . # #
            . . . . #
        `)
    }
}

function policeDrivePattern() {
    // Dynamische Kurvenfahrten im Einsatz
    const speeds: number[][] = [
        [20, 35],
        [35, 20],
        [25, 35],
        [35, 25]
    ]
    let currentSpeed = speeds[sirenStep % speeds.length]
    TPBot.setWheels(currentSpeed[0], currentSpeed[1])
}

function ultrasensorAlert() {
    let distance = TPBot.sonarReturn(TPBot.SonarUnit.Centimeters)
    // Hinderniserkennung
    if (distance > 0 && distance < 25) {
        TPBot.setWheels(-25, -25)
        basic.pause(300)
        TPBot.setWheels(30, -30)
        basic.pause(400)
    }
}

basic.forever(function () {
    if (input.buttonIsPressed(Button.A) && !policeMode) {
        startPoliceCar()
    } else if (input.buttonIsPressed(Button.B) && policeMode) {
        stopPoliceCar()
    }

    if (policeMode) {
        playGermanSiren()
        policeLights()
        policeDrivePattern()
        ultrasensorAlert()

        sirenStep += 1
        // Pause bestimmt das Tempo des "Ta-Tü"-Wechsels (ca. 350-400ms pro Ton entspricht dem realen Horn)
        basic.pause(380)
    } else {
        basic.pause(30)
    }
})