
// region Dependencies

import * as THREE from '../node_modules/three/src/Three.js';

// endregion Dependencies

// region Get Elements and Attributes

// The whole page
const body = document.body;

// Navbar
const firstname = document.querySelector(".nav-will-firstname");
const lastname = document.querySelector(".nav-will-lastname");
const headshot_image = document.querySelector(".nav-will-image");
const github_text = document.querySelector(".nav-github-title");
const github_image = document.querySelector(".nav-github-image");

// About Me
const about_me_image_sitting = document.querySelector(".about-me-image");

// Skills
const skills = document.getElementById("skills");
const skills_words = document.getElementsByClassName("skills-wordglobe");
const skills_words_subsets = [];
skills_words_subsets.length = document.getElementsByClassName("skills-wordglobe-subset").length;
for (let i = 0; i < skills_words_subsets.length; i++)
    skills_words_subsets[i] = document.getElementsByClassName("skills-wordglobe-subset")[i].children;

// endregion Get Elements and Attributes

// region Helper Methods

// Returns a style string
function hsva(hue, saturation, value, alpha)
{
    return 'hsla(' + hue.toString() + ', ' + saturation.toString() + '%, ' + value.toString() + '%, ' +
                     alpha.toString() + "%)"
}

// Rotates each word in the wordglobe by the given quaternion
function rotate_wordglobe(quaternion)
{
    // Get the center position of the wordglobe
    let center_x = skills.offsetLeft + skills.offsetWidth/2;
    let center_y = skills.offsetTop + skills.offsetHeight/2;

    // Get the width and height of the wordglobe
    let width = skills.offsetWidth * 0.25;
    let height = skills.offsetHeight / 3

    // Store the z value of each word
    const z_values = [0, 0, 0, 0, 0 ,0]

    // For each word, calculate it's position
    for (let i = 0; i < skills_words.length; i++)
    {
        // Find the position of this word
        let position = skill_word_positions[i].applyQuaternion(quaternion);

        // Get the euclidean position
        let x = width * position.x;
        let y = height * position.y;
        let z = position.z;

        // Store the word position
        let word_x = center_x + x;
        let word_y = center_y + y

        // Set the word position
        skills_words[i].style.left = (word_x - skills_words[i].offsetWidth/2).toString() + 'px';
        skills_words[i].style.top = (word_y - skills_words[i].offsetHeight/2).toString() + 'px';

        // Set the position of the word's subset
        for (let j = 0; j < skills_words_subsets[i].length; j++)
        {
            // Get the subword's rotation
            let rotation = (j / skills_words_subsets[i].length) * 2 * Math.PI;

            // Get the subword's distance from the center
            let sub_x = (width * ((j%2)===1 ? 0.8 : 1) * 0.7 * Math.cos(rotation));
            let sub_y = (height * 0.75 * Math.sin(rotation));

            // Set the subword's position
            skills_words_subsets[i][j].style.left = (word_x - sub_x -
                skills_words_subsets[i][j].offsetWidth/2).toString() + 'px';
            skills_words_subsets[i][j].style.top = (word_y - sub_y -
                skills_words_subsets[i][j].offsetHeight/2).toString() + 'px';
        }

        // Set the word's shading based on the z position
        skills_words[i].style.color = hsva(0, 0, 25*(z+1)+50,
            (40*(z+1)+20) * wordglobe_highlight_alpha[i]);

        // Set the word's size based on the z position
        skills_words[i].style.fontSize = (10 * (z+1) + 20).toString() + 'px';

        // Store the z value of each word so that we can adjust it's z position
        z_values[i] = [i, z];
        wordglobe_z_positions[i] = z;

    }

    // Sort the z values
    z_values.sort(function(a,b) { return a[1] - b[1]})

    // Set the word's z position so that it is in front/behind of other words according to it's z value
    for (let i = 0; i < z_values.length; i++) skills_words[z_values[i][0]].style.zIndex = i.toString()
}

// Stores whether the mouse is over

// endregion Helper Methods

// region Initialize Variables

// The rotation quaternions of each skill
const skill_word_positions = [
    new THREE.Vector3(1,0,0), new THREE.Vector3(-1,0,0),
    new THREE.Vector3(0,1,0), new THREE.Vector3(0,-1,0),
    new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,-1)
]

// The rotation speeds of the wordglobe
const wordglobe_rotation_speed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0.5,0), 1/200).normalize();

// The identity quaternion
const quaternion_identity = new THREE.Quaternion();

// The difference from the rotation speed quaternion and the identity quaternion
let wordglobe_rotation_speed_diff = wordglobe_rotation_speed.angleTo(quaternion_identity);

// Store the z positions of the words in the wordglobe
const wordglobe_z_positions = [0, 0, 0, 0, 0, 0];

// Store the colors of the words in the wordglobe
const wordglobe_highlight_alpha = [1, 1, 1, 1, 1, 1];

// Store the position of the mouse globally
let mouse_x = 0;
let mouse_y = 0;
let previous_x = 0;
let previous_y = 0;

// Track whether the wordglobe is being dragged
let dragging_wordglobe = false;

// Track the velocities of the wordglobe
const drag_speeds_x = []
const drag_speeds_y = []
drag_speeds_x.length = 20;
drag_speeds_y.length = 20;
for (let i = 0; i < drag_speeds_x.length; i++)
{
    drag_speeds_x[i] = 0;
    drag_speeds_y[i] = 0;
}
let drag_speeds_index = 0; // The position of the most recent speed

// The farthest back a word can be highlighted at
const highlight_min_z = -0.3

// endregion Initialize Variables

// region Window Resizing

// Condense or expand the window when resized
function condense()
{
    let screenwidth = document.documentElement.clientWidth
    let screenheight = document.documentElement.clientHeight

    // region Navbar

    // Condense the navbar
    if (screenwidth < 1120)
    {
        firstname.style.display = 'none';
        lastname.style.display = 'none';
        github_text.style.display = 'none';
        github_image.style.display = 'none';
        headshot_image.style.display = 'none';
    }
    else
    {
        firstname.style.display = 'initial';
        lastname.style.display = 'initial';
        github_text.style.display = 'initial';
        github_image.style.display = 'initial';
        headshot_image.style.display = 'initial';
    }

    // endregion Navbar

    // region About Me

    // Condense the About Me Image
    if (screenwidth < 1120)
    {
        about_me_image_sitting.style.width = '95vw';
        about_me_image_sitting.style.height = '135vw';
    }
    else
    {
        about_me_image_sitting.style.width = '550px';
        about_me_image_sitting.style.height = '820px';
    }

    // endregion About Me
}

// Set the window the run the condense script when resized
window.addEventListener('resize', condense)

// endregion Window Resizing

// region Mouse

// Store the mouse position
window.onmousemove = function(event)
{
    previous_x = mouse_x;
    previous_y = mouse_y;
    mouse_x = event.pageX;
    mouse_y = event.pageY;
}

// Drag the skill globe
skills.onmousedown = function(event)
{
    // Get the mouse position relative to the center of the wordglobe
    let x_dist = event.pageX-(skills.offsetLeft + skills.offsetWidth/2)
    let y_dist = event.pageY-(skills.offsetTop + skills.offsetHeight/2)

    // Get the vertical and horizontal radius of the wordglobe
    let horizontal_rad = 0.25 * skills.offsetWidth * 1.5
    let vertical_rad = (1/3) * skills.offsetHeight * 1.5

    // Find the mouse distance from the center of the skills div
    let mouse_distance = (x_dist/horizontal_rad)**2 + (y_dist/vertical_rad)**2

    // If the mouse is within a radius of the center
    if (mouse_distance <= 1)
    {
        dragging_wordglobe = true;
        wordglobe_rotation_speed.identity();
        wordglobe_rotation_speed_diff = 0;
        body.style.cursor = "grabbing";
        skills.style.cursor = 'grabbing';
        previous_x = mouse_x;
        previous_y = mouse_y;
        for (let i = 0; i < drag_speeds_x.length; i++)
        {
            drag_speeds_x[i] = 0;
            drag_speeds_y[i] = 0;
        }
    }
}

// Set the cursor and move the wordglobe when dragging
skills.onmousemove = function(event)
{
    // If the wordglobe is being dragged, adjust the position of the words so they follow the mouse
    if (dragging_wordglobe)
    {
        rotate_wordglobe(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(
            previous_y-mouse_y, mouse_x-previous_x, 0), 1/200).normalize());
    }

    // Find the x and y distances from the center of the wordglobe
    let x_dist = event.pageX-(skills.offsetLeft + skills.offsetWidth/2)
    let y_dist = event.pageY-(skills.offsetTop + skills.offsetHeight/2)

    // Get the vertical and horizontal radius of the wordglobe
    let horizontal_rad = 0.25 * skills.offsetWidth * 1.5;
    let vertical_rad = (1/3) * skills.offsetHeight * 1.5;

    // Find the mouse distance from the center of the skills div
    let mouse_distance = (x_dist/horizontal_rad)**2 + (y_dist/vertical_rad)**2;

    // Set the cursor style
    if (!dragging_wordglobe)
        if (mouse_distance <= 1) skills.style.cursor = 'grab';
        else skills.style.cursor = 'default';
}

// On global mouse release
window.onmouseup = function(event)
{
    // If you're dragging the wordglobe, release it
    if (dragging_wordglobe)
    {
        // Find the total dragspeed over the last 200 ms
        const dragspeed_sum = [0,0];
        for (let i = 0; i < drag_speeds_x.length; i++)
        {
            dragspeed_sum[0] += drag_speeds_x[i]
            dragspeed_sum[1] += drag_speeds_y[i]
        }
        //console.log(drag_speeds_x)

        // Find the average dragspeed
        dragspeed_sum[0] /= 50;
        dragspeed_sum[1] /= 50;

        // Set the rotation quaternion to be in the direction of the dragging
        wordglobe_rotation_speed.setFromAxisAngle(new THREE.Vector3(
            -dragspeed_sum[1], dragspeed_sum[0], 0), 1/200).normalize()
        wordglobe_rotation_speed_diff = wordglobe_rotation_speed.angleTo(quaternion_identity);

        // Reset the dragging variable
        dragging_wordglobe = false;

        // Reset the cursor sprite
        skills.style.cursor = 'grab';
        body.style.cursor = "default";
    }
}

// endregion Mouse

// region Initialization

// If dragging the wordglobe, store the mouse position every 10 ms
function wordglobe_store_dragspeed()
{
    // Update the dragspeed
    drag_speeds_x[drag_speeds_index] = mouse_x - previous_x;
    drag_speeds_y[drag_speeds_index] = mouse_y - previous_y;

    // Update the dragspeed index
    drag_speeds_index = (drag_speeds_index + 1) % drag_speeds_x.length;
}

// Set skills to bold when moused over
function wordglobeMouseHover()
{
    // If the angular momentum is too high or the , don't hover words and slow down the globe
    if (wordglobe_rotation_speed.angleTo(quaternion_identity) > 0.025 || dragging_wordglobe)
    {
        // Slow down the globe
        wordglobe_rotation_speed.slerp(quaternion_identity, 1/500);

        // Reset the alpha and highlighting of all words
        for (let i = 0; i < skills_words.length; i++)
        {
            skills_words[i].style.textShadow = 'none';
            wordglobe_highlight_alpha[i] = 1;
        }

        // Fade out all subsets
        for (let i = 0; i < skills_words_subsets.length; i++)
            for (let j = 0; j < skills_words_subsets[i].length; j++)
                skills_words_subsets[i][j].style.color = hsva(0, 0, 100, 0);

        return
    }

    // Find the distance of each word
    const word_distances = [];
    word_distances.length = skills_words.length;
    for (let i = 0; i < skills_words.length; i++)
    {
        // Find the distance from the mouse to the word
        let x_dist = mouse_x-(skills_words[i].offsetLeft + skills_words[i].offsetWidth/2);
        let y_dist = mouse_y-(skills_words[i].offsetTop + skills_words[i].offsetHeight/2);

        // Get the vertical and horizontal radius of the word
        let horizontal_rad = skills_words[i].offsetWidth
        let vertical_rad = skills_words[i].offsetHeight

        // Find the mouse distance from the center of the skills div
        let mouse_distance = 1000;
        if (wordglobe_z_positions[i] > highlight_min_z) mouse_distance = (x_dist/horizontal_rad)**2 + (y_dist/vertical_rad)**2;

        // Track this word's distance to the mouse
        word_distances[i] = [i, mouse_distance];
    }

    // Find the closest word
    word_distances.sort(function(a,b) {return a[1] - b[1]})

    // Fade out all subsets
    for (let i = 0; i < skills_words_subsets.length; i++)
        for (let j = 0; j < skills_words_subsets[i].length; j++)
            skills_words_subsets[i][j].style.color = hsva(0, 0, 100, 0);

    // If the closest word is not within the highlight zone, remove text shadow and transparency from all word
    if (word_distances[0][1] > 2 || wordglobe_z_positions[word_distances[0][0]] < highlight_min_z)
        for (let i = 0; i < skills_words.length; i++)
        {
            skills_words[i].style.textShadow = 'none';
            wordglobe_highlight_alpha[word_distances[i][0]] = 1;
        }

    // Otherwise, highlight the main word and fade out other words
    else
    {
        // For all other words, set them to be less conspicuous
        for (let i = 1; i < word_distances.length; i++)
        {
            // Remove any text shadow
            skills_words[word_distances[i][0]].style.textShadow = 'none';

            // If the mouse is close enough, fade out the other skill words
            if (word_distances[0][1] < 1.5)
                wordglobe_highlight_alpha[word_distances[i][0]] = Math.max((word_distances[0][1]-0.5), 0);
            else wordglobe_highlight_alpha[word_distances[i][0]] = 1;
        }

        // Reset the alpha of the main word
        wordglobe_highlight_alpha[word_distances[0][0]] = 1;
        // If the main word is within the closer bound, highlight it, and give it motion to bring it more central
        if (word_distances[0][1] < 1)
        {
            skills_words[word_distances[0][0]].style.textShadow = '0 0 15px black';
            if (!dragging_wordglobe) wordglobe_rotation_speed.slerp(new THREE.Quaternion().setFromAxisAngle(
                    new THREE.Vector3(skill_word_positions[word_distances[0][0]].y,
                        -skill_word_positions[word_distances[0][0]].x,
                        0), 1/100).normalize(), 1/100).normalize();
        }

        // If the main word is within the farther bound, fade in the word's subset
        if (word_distances[0][1] < 1.5)
        {
            for (let j = 0; j < skills_words_subsets[word_distances[0][0]].length; j++)
                skills_words_subsets[word_distances[0][0]][j].style.color = hsva(0, 0, 100,
                    Math.max(100*(1.5-word_distances[0][1])*(wordglobe_z_positions[word_distances[0][0]]**10), 0));
        }
    }
}

// Set the window to run all updates when initialized
window.onload = function()
{
    function update()
    {
        condense();
        rotate_wordglobe(wordglobe_rotation_speed);
        wordglobeMouseHover();
        wordglobe_store_dragspeed();
    }

    setInterval(update, 10);
}

// endregion Initialization