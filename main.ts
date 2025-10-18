for (let index = 0; index <= 12; index++) {
    music.setVolume(79)
    TPBot.headlightColor(0xff0000)
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
    basic.showIcon(IconNames.Diamond)
    basic.pause(100)
    TPBot.headlightColor(0x0000ff)
    basic.showIcon(IconNames.SmallDiamond)
    basic.pause(100)
    TPBot.setTravelSpeed(TPBot.DriveDirection.Forward, 34)
    TPBot.setWheels(0, 35)
}
