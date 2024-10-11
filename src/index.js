import "./mychurch.css";
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = '' //Add your SupaBase URL 
const supabaseKey = process.env.SUPABASE_KEY; //Create .env file for your SupaBase Key
const supabase = createClient(supabaseUrl, supabaseKey)
const logOut = document.getElementById('log-out');

export default supabase;



document.addEventListener('DOMContentLoaded', async function () {
    await checkSession();




    const form = document.getElementById('songSubmissionForm');
    const tableBody = document.querySelector('#myTable tbody');
    const deleteFile = document.getElementById('delete-file');
    const emailBtn = document.getElementById('email-btn');

    
    
    

    // Load saved songs from Supabase when the page loads
    loadSongsFromSupabase();
    deleteFile.style.display = 'none';

    // Event listener for the file name display
    document.getElementById('sheetMusic').addEventListener('change', function(e) {
        const fileName = e.target.files[0].name;
        document.getElementById('sheetMusicFileName').textContent = fileName;
        deleteFile.style.display = 'inline-block';
    });

    deleteFile.addEventListener('click', function() {
        const fileInput = document.getElementById('sheetMusic');
        fileInput.value = "";
        document.getElementById('sheetMusicFileName').textContent = '';
        deleteFile.style.display = 'none';
    });

    // Event listener for form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const songName = document.getElementById('songName').value;
        const artist = document.getElementById('artist').value;
        const BPM = document.getElementById('BPM').value;
        const youtubeLink = document.getElementById('youtubeLink').value;
        const sheetMusicFile = document.getElementById('sheetMusic').files[0];

        if (!sheetMusicFile) {
            alert("Please select a file to upload.");
            return;
        }

        // Upload the file to Supabase Storage
        const { data: fileData, error: uploadError } = await supabase
            .storage
            .from('chord-charts')
            .upload(`sheet_music/${sheetMusicFile.name}`, sheetMusicFile);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return;
        }

      
        const { data, error: urlError } = supabase
        .storage
        .from('chord-charts')
        .getPublicUrl(`sheet_music/${sheetMusicFile.name}`);
        
        if (urlError) {
        console.error('Error getting public URL:', urlError);

    } else {
            console.log('Public URL:', data.publicUrl); // Log the public URL for files

    }
    

        // Insert song data into Supabase database
        const { data: songData, error: insertError } = await supabase
            .from('songs')
            .insert([
                {
                    artist: artist,
                    song_name: songName,
                    bpm: BPM,
                    chord_chart: data.publicUrl,
                    sheet_music_name: sheetMusicFile.name,
                    youtube_link: youtubeLink,

                }
                    
                
                
            ])

            .select()

        if (insertError) {
            console.error('Error inserting song:', insertError);
            return;
        }

        console.log('Inserted song data:', songData);


        // Add the song to the table
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" class="select-row" name="checkbox" ></td>
            <td>${songName}</td>
            <td>${artist}</td>
            <td><a target="_blank" style="color: white" href="${data.publicUrl}" download="${sheetMusicFile.name}">${sheetMusicFile.name}</a></td>
            <td><a style="color: white" target="_blank" href="${youtubeLink}">${youtubeLink}</a></td>
            <td>${BPM}</td>
            <td><button class="delete-btn" data-song-id="${songData[0].id}">x</button></td>
        `;

        newRow.querySelector('.delete-btn').addEventListener('click', async function(e) {
            const songId = e.target.getAttribute('data-song-id');

            confirmDelete();


        });

        tableBody.appendChild(newRow);

        // Clear the form
        form.reset();
        document.getElementById('sheetMusicFileName').textContent = '';
        deleteFile.style.display = 'none';
    });

    // Function to delete the song from Supabase
    async function deleteSongFromSupabase(songId) {
        const { data, error } = await supabase
            .from('songs')
            .delete()
            .eq('id', songId);

        if (error) {
            console.error('Error deleting song:', error);
            return;
        }

        console.log('Song deleted successfully');
    }

    // Function to load songs from Supabase
    async function loadSongsFromSupabase() {
        
        
        const { data: songs, error } = await supabase
            .from('songs')
            .select('*');

        if (error) {
            console.error('Error fetching songs:', error);
            return;
        }

        songs.forEach(song => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="checkbox" class="select-row" name="checkbox" ></td>
                <td>${song.song_name}</td>
                <td>${song.artist}</td>
                <td><a target="_blank" style="color: white" href="${song.chord_chart}" download="${song.sheet_music_name}">${song.sheet_music_name}</a></td>
                <td><a target="_blank" style="color: white" href="${song.youtube_link}" target="_blank">${song.youtube_link}</a></td>
                <td>${song.bpm}</td>
                <td><button class="delete-btn" data-song-id="${song.id}">x</button></td>
            `;

            newRow.querySelector('.delete-btn').addEventListener('click', async function(e) {
                const songId = e.target.getAttribute('data-song-id');
                confirmDelete();


            });

            tableBody.appendChild(newRow);
        });
    }

    // Clear Supabase songs and table button functionality
    document.getElementById('clearStorageBtn').addEventListener('click', async function() {
        await supabase
            .from('songs')
            .delete();
        
        console.log('Supabase songs cleared');
        location.reload(); // Reload the page to reflect changes
    });

    // Search function for filtering table rows
    window.songSearch = function() {
        let input, filter, tBody, tr, td, txtValue;
        input = document.getElementById('myInput');
        filter = input.value.toUpperCase();
        tBody = document.getElementById('table-body');
        tr = tBody.getElementsByTagName('tr'); // Get all rows in the table body

        for (let i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td'); // Get all cells in the current row
            let found = false;

            for (let j = 0; j < td.length; j++) {
                if (td[j]) {
                    txtValue = td[j].textContent || td[j].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        found = true; // Mark as found if any column matches
                        break;
                    }
                }
            }

            if (found) {
                tr[i].style.display = ""; // Show row if a match is found in any column
            } else {
                tr[i].style.display = "none"; // Hide row if no match
            }
        }
    };

    // Sorting function for table columns
    window.sortTable = function(n) {
        let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById("myTable");
        switching = true;
        dir = "asc"; // Set the sorting direction to ascending
    
        while (switching) {
            switching = false;
            rows = table.rows;
    
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
    
                // Check if the column contains numeric values
                let xValue = x.innerHTML.trim();
                let yValue = y.innerHTML.trim();
    
                // Determine if the content is numeric or not
                let xIsNumeric = !isNaN(parseFloat(xValue)) && isFinite(xValue);
                let yIsNumeric = !isNaN(parseFloat(yValue)) && isFinite(yValue);
    
                if (dir === "asc") {
                    if (xIsNumeric && yIsNumeric) {
                        // Numeric comparison
                        if (parseFloat(xValue) > parseFloat(yValue)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else {
                        // Text comparison
                        if (xValue.toLowerCase() > yValue.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                } else if (dir === "desc") {
                    if (xIsNumeric && yIsNumeric) {
                        // Numeric comparison
                        if (parseFloat(xValue) < parseFloat(yValue)) {
                            shouldSwitch = true;
                            break;
                        }
                    } else {
                        // Text comparison
                        if (xValue.toLowerCase() < yValue.toLowerCase()) {
                            shouldSwitch = true;
                            break;
                        }
                    }
                }
            }
    
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    };
    
    

    logOut.addEventListener('click', async function() {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error('Error logging out:', error.message);
        } else {
            console.log('Logout successful:');
            // Redirect to mychurch.html upon successful login
            window.location.href = '/login.html'; // Adjust the path as needed
        }
    })

//send email function: 
    emailBtn.addEventListener('click', function() {
        const selectedRows = [];
        const checkboxes = document.querySelectorAll('.select-row:checked');
        
        checkboxes.forEach((checkbox) => {
            const row = checkbox.closest('tr'); // Get the parent row
            const songName = row.cells[1].textContent;
            const artist = row.cells[2].textContent;
            const sheetMusic = row.cells[3].querySelector('a').href;
            const youtubeLink = row.cells[4].querySelector('a').href;
            
            selectedRows.push({
                songName: songName,
                artist: artist,
                sheetMusic: sheetMusic,
                youtubeLink: youtubeLink
            });
        });
        
        if (selectedRows.length === 0) {
            alert('No rows selected.');
            return;
        }
        
        // Convert the selected rows data to a string for the email
        let emailBody = 'Songs for Sunday:\n\n';
        selectedRows.forEach((row, index) => {
            emailBody += `Song ${index + 1}:\n`;
            emailBody += `Name: ${row.songName}\n`;
            emailBody += `Artist: ${row.artist}\n`;
            emailBody += `Chord Chart: ${row.sheetMusic}`;
            emailBody += `\nYouTube Link: ${row.youtubeLink}\n\n`;
        });
    
        // Trigger email (you can use mailto or an email service like SendGrid)
        window.location.href = `mailto:?subject=Songs for Sunday&body=${encodeURIComponent(emailBody)}`;
    });


    tableBody.addEventListener('change', function(event) {
        if (event.target && event.target.type === 'checkbox') {
            const checkboxes = document.querySelectorAll('input[type="checkbox"].select-row');
            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            
            // Show the email button if any checkbox is checked
            emailBtn.style.opacity = isAnyChecked ? '1' : '.6';
            emailBtn.style.cursor = isAnyChecked ? 'pointer' : 'not-allowed';
        }
    });

    




});

const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
        console.error('Error retrieving session:', error.message);
    } else {
        if (!session && window.location.pathname.includes('mychurch.html')) {
            // No active session, redirect to login page
            window.location.href = 'login.html'; 
        } else if (session && window.location.pathname.includes('login.html')) {
            window.location.href = 'mychurch.html'
        }
    }
};




const confirmDelete = async () => {
    let result = confirm("Are you sure you want to delete this song?");

    // If the user confirms, proceed with delete
    if (result) {
        try {
            // Remove the row from the UI
            newRow.remove();


            // Delete the song from Supabase
            await deleteSongFromSupabase(songId);

            // Optional: Show success message
            alert('Song deleted successfully!');
        } catch (error) {
            // Optional: Handle any errors, such as if deletion from Supabase fails
            console.error('Error deleting song:', error);
            alert('Failed to delete the song. Please try again.');
        }
    }
}
