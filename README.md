# Song Library Project

This project is a web-based application designed for organizing and managing songs for church services. It allows users to upload song details, including the song name, artist, sheet music (chord chart), YouTube link, BPM, and more. The data is stored in Supabase, and users can sort, search, and manage the songs through the user-friendly interface.

## Features

- **Add Songs**: Users can add new songs to the library, including metadata such as the song name, artist, BPM, sheet music, and YouTube link.
- **File Upload**: Upload and store chord charts for each song.
- **YouTube Link**: Display and send YouTube links as clickable hyperlinks.
- **Sorting and Searching**: Sort the songs by name, artist, or BPM, and search for specific songs easily.
- **Delete Songs**: Users can delete songs from the library, with a confirmation prompt before deletion.
- **Email Functionality**: Users can select multiple songs from the list and send them via email, including a link to the YouTube video and chord chart.
- **Authentication**: Only authenticated users can access the song library. Authentication is handled via Supabase using email and password.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase (for authentication, file storage, and database)
- **File Storage**: Supabase for chord chart storage
- **Database**: Supabase Postgres for storing song metadata
- **Bundler**: Webpack for bundling JavaScript files

## Installation and Setup

1. Clone the repository from GitHub.
2. Install all required dependencies.
3. Set up Supabase by creating a project and configuring your database, storage, and authentication.
4. Update the Supabase configuration in the project files with your credentials.
5. Bundle the project using Webpack.
6. Open the project in your browser or serve it locally using a development server.

## How to Use

### Add a Song
- Fill in the song details such as song name, artist, BPM, YouTube link, and upload chord chart.
- Submit the form, and the song will be added to the library and stored in Supabase.

### Manage Songs
- Use the sorting and searching features to find songs quickly.
- Delete songs by clicking the delete button, which includes a confirmation prompt.

### Email Selected Songs
- Select the songs by clicking checkboxes in the song list.
- Click the "Email Selected Songs" button to generate an email with all the selected song details, including clickable links for YouTube videos and chord charts.

### Authentication
- Users must log in using their email and password to access the song library.
- Only authenticated users can interact with the library.

## Contributions

Contributions are welcome! Please feel free to open an issue or submit a pull request with suggestions, improvements, or bug fixes.

## License

This project is open-source and available under the MIT License.
