// region Get Elements and Attributes

// Navbar
const navbar = document.querySelector(".navbar")
const navbar_startpos = navbar.offsetTop
const navbar_will = document.querySelector(".nav-will")
const firstname = document.querySelector(".nav-will-firstname")
const lastname = document.querySelector(".nav-will-lastname")
const headshot_image = document.querySelector(".nav-will-image")
const github_text = document.querySelector(".nav-github-title")
const github_image = document.querySelector(".nav-github-image")

// About Me
const about_me = document.querySelector(".about-me")
const about_me_image_sitting = document.querySelector(".about-me-image")

// endregion Get Elements and Attributes

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

// Stick the navbar to the top of the page
function navupdate()
{
    return
}

// Set the window to run the navstick script when scrolled
window.onscroll = navupdate

// Run all update scripts once to initialize the page
function initialize()
{
    condense()
    navstick()
}

// Set the window to run all updates when initialized
window.onload = initialize