# BD-Media-Player

This project is a simple multplatform web media player that allows you to play video and audio files directly in your browser. It uses standard web technologies such as HTML5, CSS, and JavaScript and Electron.

## Features

*   **Video and Audio Playback:** Supports playback of common video (mp4, webm, ogg, mov) and audio (mp3, wav, ogg) formats.
*   **Individual File Selection:** Allows the user to select a single media file from their file system.
*   **Loop:** Option to play the file in a continuous loop.
*   **Progress Bar:** Displays a visual progress bar to indicate the current playback position.
*   **Playback Speed Control:** Provides a dropdown menu to select different playback speeds.
*   **Fullscreen Mode:** Enables fullscreen playback for a more immersive experience.
*   **Intuitive Interface:** Clean and easy-to-use user interface.
*   **Multi Language** Both Spanish and English to use on interface

## Technologies Used

*   **HTML5:** Player structure and media elements (`<video>` and `<audio>`).
*   **CSS:** Visual styles and interface design.
*   **JavaScript:** Playback logic, event handling, and file selection.
*   **File API:** For accessing local files.

## How to Use

1.  Clone this repository:

    ```bash
    git clone https://github.com/JuanBerta/BD-Media-Player.git
    ```

2.  Open the `index.html` file in your browser.

3.  Click the "Select File" button.

4.  Select the media file you want to play.

5.  Use the player controls (play/pause, volume, progress bar, speed control, fullscreen) to control playback.

6.  Toggle looping with the "Loop" button.

## Limitations

*   **Individual Selection:** Only one file can be selected at a time. Playing entire folders is not supported.
*   **Format Compatibility:** Format compatibility depends on the browser. Although common formats are mentioned, some browsers may not support them all natively.
*   **Frontend Only:** This is a purely frontend project, so no server is required for basic functionality.

## Future Enhancements (Optional)

*   Add support for a playlist (allowing multiple file selection).
*   Improve error handling (e.g., for unsupported file types).

## Media Player Usage

This section details how to use the media player, its controls, and keyboard shortcuts.

### Loading Media

There are two primary ways to load media files:

1.  **Open File Button:** Click the **folder icon** (tooltip: "Open file (o)") on the control bar to open your system's file selection dialog. Select a media file to load it. This method also enables folder-based playlist functionality (see below).
2.  **Drag and Drop:** Drag a media file from your computer directly onto the video player area.

### Playback Controls

The control bar at the bottom of the player provides the following (from left to right, approximately):

*   **Replay:** (Circular arrow icon) Replays the current media. Double-clicking plays the previous media in the folder playlist.
*   **Play/Pause:** (Play/Pause icon) Toggles playback.
*   **Next Video:** (Skip next icon) Plays the next media file in the folder playlist.
*   **Open File:** (Folder icon) Opens a file selection dialog.
*   **Volume Control:**
    *   **Mute/Unmute:** (Speaker icon) Toggles audio mute.
    *   **Volume Slider:** Appears on hover over the speaker icon, allowing volume adjustment.
*   **Language Selector:** (Dropdown menu) Allows switching the interface language (e.g., English/Spanish).
*   **Progress Bar:** Shows playback progress. Click to seek.
*   **Time Display:** Shows current time / total duration.
*   **Miniplayer (Picture-in-Picture):** (PiP icon) Toggles PiP mode for video.
*   **Fullscreen:** (Fullscreen icon) Toggles fullscreen mode.
*   **Settings:** (Cog icon) Opens a menu for playback speed selection.
*   **Loop:** (Loop icon) Toggles looping for the current media.

### Keyboard Shortcuts

The following keyboard shortcuts are available:

| Key(s)             | Action                                   | Notes                                     |
|--------------------|------------------------------------------|-------------------------------------------|
| `Spacebar`, `k`    | Play / Pause                             |                                           |
| `m`                | Mute / Unmute                            |                                           |
| `l`                | Toggle Loop                              |                                           |
| `s`                | Open Settings (Playback Speed)           |                                           |
| `i`                | Toggle Miniplayer (Picture-in-Picture)   | For video content                         |
| `f`                | Toggle Fullscreen                        |                                           |
| `o`                | Open File                                | Shows file selection dialog               |
| `r`                | Replay current media                     | Single click                              |
| `r` (double-click) | Play Previous Media in Folder            | Double-click Replay button                |
| `ArrowRight`       | Seek Forward                             | Default: 5 seconds                        |
| `ArrowLeft`        | Seek Backward                            | Default: 5 seconds                        |
| `ArrowUp`          | Volume Up                                |                                           |
| `ArrowDown`        | Volume Down                              |                                           |

*Note: Shortcuts may not work if focus is on an input field or select dropdown.*

### Folder-Based Playlist

When you open a media file using the "Open File" button (folder icon), the player automatically creates a temporary playlist consisting of all supported media files found in the same directory as the selected file. This playlist is sorted alphabetically by filename.

*   **Next Video Button:** Use the **Next Video icon** (tooltip: "Next (n)") to play the next file in this automatically generated folder playlist. The button will be disabled if you are at the last file.
*   **Previous Video (via Replay Button):** Double-click the **Replay icon** (tooltip: "Replay (r)") to play the previous file in the folder playlist. This functionality is only available if there is a previous file (i.e., you are not on the first file in the folder).

### Other Features

*   **Playback Speed:** Click the **Settings icon** (cog) to open a menu where you can select different playback speeds (e.g., 0.5x, Normal, 1.5x, 2x).
*   **Loop Media:** Click the **Loop icon** to toggle continuous looping of the currently playing media. The icon will highlight when active.
*   **Miniplayer (Picture-in-Picture):** For video content, click the **Miniplayer icon** to switch to a floating Picture-in-Picture window. Click again (either in the main player or sometimes the PiP window itself, browser-dependent) to return to the main player view.
*   **Fullscreen:** Click the **Fullscreen icon** to enter or exit fullscreen playback mode.
*   **Language Selection:** Use the dropdown menu (e.g., showing "Español" or "Inglés") to change the language of the player's interface elements and tooltips.

## Screenshots (Optional)

![Screenshot 1](https://github.com/JuanBerta/BD-Media-Player/blob/main/Screenshots/Captura%20de%20pantalla%202024-12-15%20155808.png)
![Playing a video](https://github.com/JuanBerta/BD-Media-Player/blob/main/Screenshots/Captura%20de%20pantalla%202024-12-15%20155828.png)
(Reproduced Video is property of this Youtube Channel: https://www.youtube.com/watch?v=Sf7mxUCFuXg&list=RDGMEMXdNDEg4wQ96My0DhjI-cIg&index=22)


## Contributions

Contributions are welcome. If you find any bugs or have any suggestions for improvement, please open an issue or submit a pull request.

## License

MIT License
