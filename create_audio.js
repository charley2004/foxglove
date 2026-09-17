// create_audio.js
// Creates silent placeholder MP3 files for all 18 sound tracks
// Run once with: node create_audio.js
// Replace files later with real audio from Pixabay

const fs = require('fs');
const path = require('path');

// Valid minimal silent MP3 bytes
const silentMp3 = Buffer.from([
  0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
]);

const files = [
  // Focus
  'focus/focus_base.mp3',
  'focus/focus_brown.mp3',
  'focus/focus_binaural.mp3',
  'focus/focus_white.mp3',
  'focus/focus_cafe.mp3',
  // Sleep
  'sleep/sleep_pad.mp3',
  'sleep/sleep_ocean.mp3',
  'sleep/sleep_crickets.mp3',
  'sleep/sleep_delta.mp3',
  // Nature
  'nature/rain_light.mp3',
  'nature/rain_heavy.mp3',
  'nature/wind_layer.mp3',
  'nature/thunder_distant.mp3',
  'nature/fireplace.mp3',
  'nature/forest_birds.mp3',
  // Calm
  'calm/ambient_tone.mp3',
  'calm/singing_bowl.mp3',
  'calm/flute_soft.mp3',
];

const audioBase = path.join(__dirname, 'src', 'assets', 'audio');

files.forEach((file) => {
  const fullPath = path.join(audioBase, file);
  const dir = path.dirname(fullPath);

  // Create folder if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, silentMp3);
    console.log(`✅ Created: ${file}`);
  } else {
    console.log(`⏭  Exists:  ${file}`);
  }
});

console.log('\n🦊 All audio placeholders ready!');
console.log('Replace files in src/assets/audio/ with real MP3s when ready.\n');