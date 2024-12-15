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

1.  Clone this repository (optional, if it's in a repository):

    ```bash
    git clone [your-username/your-repository]
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

## Screenshots (Optional)

(Add screenshots of the player in action)

## Contributions

Contributions are welcome. If you find any bugs or have any suggestions for improvement, please open an issue or submit a pull request.

## License

(Add the license under which your project is distributed, e.g., MIT License)
