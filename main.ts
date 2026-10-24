let policeMode = false
let silentDriveMode = false
let sirenStep = 0

// Variablen für die Erkennung von 2x A (Doppelklick)
let lastPressATime = 0
const DOUBLE_CLICK_TIME = 400 // Zeitfenster für den 2. Klick in Millisekunden

function startPoliceCar() {
    policeMode = true
    silentDriveMode = false
    sirenStep = 0
    music.setVolume(120)
    TPBot.setTravelSpeed(TPBot.DriveDirection.Forward, 100)
    TPBot.setWheels(42, 42)
}

function startWithoutSiren() {
    policeMode = false
    silentDriveMode = true
    sirenStep = 0
    music.stopAllSounds()
    TPBot.setTravelSpeed(TPBot.DriveDirection.Forward, 40)
    TPBot.headlightColor(0x000000) // Keine Lichter
    basic.showLeds(`
        . . . . .
        . # . # .
        . . . . .
        # . . . #
        . # # # .
    `)
}

function stopPoliceCar() {
    policeMode = false
    silentDriveMode = false
    music.stopAllSounds()
    TPBot.stopCar()
    TPBot.headlightColor(0x000000)
    basic.clearScreen()
}

function playGermanSiren() {
    // Deutsches Martins-Horn (DIN 14610)
    if (sirenStep % 2 === 0) {
        music.ringTone(440) // "Ta" (a')
    } else {
        music.ringTone(587) // "Tü" (d'')
    }
}

function policeLights() {
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
    const speeds: number[][] = [
        [42, 42],
        [18, 42],
        [42, 18],
        [26, 42],
        [42, 26],
        [42, 42],
        [42, 12]
    ]
    let currentSpeed = speeds[sirenStep % speeds.length]
    TPBot.setWheels(currentSpeed[0], currentSpeed[1])
}

function silentDrivePattern() {
    const speeds: number[][] = [
        [35, 35],
        [24, 42],
        [42, 24],
        [30, 40],
        [40, 30],
        [18, 42],
        [42, 18],
        [35, 35]
    ]
    let currentSpeed = speeds[sirenStep % speeds.length]
    TPBot.setWheels(currentSpeed[0], currentSpeed[1])
}

function ultrasensorAlert() {
    let distance = TPBot.sonarReturn(TPBot.SonarUnit.Centimeters)
    if (distance > 0 && distance < 25) {
        TPBot.setWheels(-25, -25)
        basic.pause(260)
        TPBot.setWheels(30, -30)
        basic.pause(350)
    }
}

// Event-Handling für Button A (Doppelklick-Logik)
input.onButtonPressed(Button.A, function () {
    let currentTime = control.millis()

    // Wenn bereits im lautlosen Modus ist, ein weiterer A-Klick startet die Polizei-Sirene erneut
    if (silentDriveMode) {
        startPoliceCar()
        return
    }

    // Prüfen, ob der 2. Klick innerhalb von 400 ms erfolgt ist
    if (currentTime - lastPressATime < DOUBLE_CLICK_TIME) {
        // Zweiter Klick (Doppelklick) -> Start ohne Sirene
        startWithoutSiren()
        lastPressATime = 0 // Timer zurücksetzen
    } else {
        // Erster Klick -> Kurze Verzögerung abwarten, um zu prüfen, ob noch ein 2. Klick kommt
        lastPressATime = currentTime
        control.inBackground(function () {
            basic.pause(DOUBLE_CLICK_TIME)
            // Wenn nach 400ms kein 2. Klick kam und noch nichts läuft -> Polizei-Modus starten
            if (lastPressATime === currentTime && !policeMode && !silentDriveMode) {
                startPoliceCar()
            }
        })
    }
})

// Button B stoppt das Fahrzeug (Egal in welchem Modus)
input.onButtonPressed(Button.B, function () {
    stopPoliceCar()
})

// Hauptschleife
basic.forever(function () {
    if (policeMode) {
        playGermanSiren()
        policeLights()
        policeDrivePattern()
        ultrasensorAlert()

        sirenStep += 1
        basic.pause(250)
    } else if (silentDriveMode) {
        silentDrivePattern()
        ultrasensorAlert()

        sirenStep += 1
        basic.pause(180)
    } else {
        basic.pause(30)
    }
})