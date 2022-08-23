const theme = document.querySelector('.theme');
let darkMode = localStorage.darkMode === undefined ? false : JSON.parse(localStorage.darkMode)
theme.onclick = function() {
    if(darkMode){
        localStorage.darkMode = JSON.stringify(false)
        document.body.classList.remove('dark')
    }else{
        localStorage.darkMode = JSON.stringify(true)
        document.body.classList.toggle('dark')
    }
}

if(darkMode){
    document.body.classList.toggle('dark')
}

const filterSelect = document.querySelector('.filter-select'),
filterBtn = filterSelect.querySelector('.filter-btn'),
filterOptions = filterSelect.querySelectorAll('.options li')

const filterSearchInput = document.querySelector('.filter .search input');
const world = document.querySelector('main .world')


const modalCountry = document.querySelector('#modalCountry')
const modalCountryInfo = document.querySelector('#modalCountry .content div')
const closeModal = document.querySelector('.close-modal')


// Open Filter Menu
const openMenu = filterBtn.onclick = () => {
    filterSelect.classList.toggle('active')
}

// Get Countries with Fetch Api 
function getCountries () {
    fetch('https://restcountries.com/v3.1/all').then(response => {
        return data = response.json()
    }).then(response => {
        addCountries(response)
        filterSearch(response)
        filterByRegion(response)
        nameCountrySelected(response)
    })
}
getCountries()

// Add Countries in Html With createElement
function addCountries(countries){
    world.innerHTML = ''
    countries.forEach((country, index)=> {
        let div = document.createElement('div')
        div.className = 'country'

        // Photo Country
        let figure = document.createElement('figure') // Creating figure tag
        let img = document.createElement('img') // Creating img tag
        img.src = country.flags.png // adding src to img tag
        img.alt = country.name.common // adding alt to img tag
        figure.appendChild(img)  // adding img tag to figure tag

        let info = document.createElement('div') // Creating info Country
        info.className = 'info' // adding class info to div

        let h2 = document.createElement('h2') // Creating h2 tag || Country name
        h2.className = 'name' // adding class title to h2
        h2.setAttribute('data-id', country.name.common) // adding attribute to h2
        let nameCountry = document.createTextNode(country.name.common) // Country name
        h2.appendChild(nameCountry) // adding Country name to h2 tag
        
        let population = document.createElement('span'); // Creating Population div
        population.append(`Population : ${country.population}`) // Adding Population to div

        let region = document.createElement('span'); // Creating Region div
        region.append(`Region : ${country.region}`) // Adding Region to div

        let capital = document.createElement('span'); // Capital Copulation div
        capital.append(`Capital : ${country.capital}`) // Adding Copulation to div

        info.appendChild(h2) // Adding h2 to info country
        info.appendChild(population) // Adding Population to info country
        info.appendChild(region) // Adding Region to info country
        info.appendChild(capital) // Adding Copulation to info country

        div.appendChild(figure) // Adding figure to country div
        div.appendChild(info) // Adding info to country div

        world.appendChild(div) // Adding country div to world div
    })
}

// and filter by region
function filterByRegion(countries){
    filterOptions.forEach(option => {
        
        option.addEventListener('click', e => {
            // Set Region in text button 
            filterBtn.firstElementChild.innerHTML = `Filter by ${e.target.innerText}`
            // Close Menu Region
            openMenu()
            console.log(countries);
            // ccffr > Countries coming from the FilterRegion
            let ccffr = [];
            ccffr = countries.filter((country) => {
                return country.region === e.target.innerText
            })
            addCountries(ccffr)
            nameCountrySelected(ccffr)

        })
    });
}

// Filter By Search
function filterSearch(countries) {
    // ccfs > Countries coming from the search
    let ccfs = [];
    filterSearchInput.addEventListener('keyup', e => {
        ccfs = countries.filter((country) => {
            return country.name.common.toLowerCase().startsWith(e.target.value.toLowerCase())
        })
        addCountries(ccfs)
        nameCountrySelected(ccfs)
    })
}

function nameCountrySelected (countries) {

    let namesCountry = document.querySelectorAll('.world .info .name')
    let countrySelected;
    namesCountry.forEach((name => {
        name.addEventListener('click', (e) => {
            modalCountry.classList.toggle('active')
            countrySelected = countries.filter(country => {
                return country.name.common.startsWith(e.target.innerText)
            })
            addModalInfoCountry(countrySelected)
        })
    }))
    
}

nameCountrySelected()

closeModal.addEventListener('click', () => {
    modalCountry.classList.toggle('active')
})

function addModalInfoCountry(countries) { 
    modalCountryInfo.innerHTML = ''
    countries.forEach((country, index)=> {
        let div = document.createElement('div')
        div.className = 'info'

        // Photo Country
        let infoPhoto = document.createElement('div') // Creating figure tag
        infoPhoto.className = 'infoPhoto'
        let img = document.createElement('img') // Creating img tag
        img.src = country.flags.png // adding src to img tag
        img.alt = country.name.common // adding alt to img tag
        infoPhoto.appendChild(img)  // adding img tag to figure tag

        let infoCountry = document.createElement('div') // Creating info Country
        infoCountry.className = 'infoCountry' // adding class info to div

        let h2 = document.createElement('h2') // Creating h2 tag || Country name
        h2.className = 'name' // adding class title to h2
        h2.setAttribute('data-id', country.name.common) // adding attribute to h2
        let nameCountry = document.createTextNode(country.name.common) // Country name
        h2.appendChild(nameCountry) // adding Country name to h2 tag

        let ul = document.createElement('ul')

        let languagesNameCountry = ''
        for(var i in country.languages){
            languagesNameCountry += country.languages[i] + ' '
        }

        let li = `<li><b>Native Name</b> : ${Object.values(country.name.nativeName)[0].common}</li>
        <li><b>Top Level Domain:</b> ${country.tld[0]}</li>
        <li><b>Population:</b> ${country.population}</li>
        <li><b>Currencies:</b> ${Object.values(country.currencies)[0].name}</li>
        <li><b>Region:</b> ${country.region}</li>
        <li><b>Languages:</b> ${languagesNameCountry.split(' ').join(', ')}</li>
        <li><b>Sub Region:</b> ${country.subregion}</li>
        <li><b>Capital:</b> ${country.capital}</li>`



        ul.insertAdjacentHTML('beforeend', li)
        console.log(country);
        infoCountry.appendChild(h2) // Adding h2 to info country
        infoCountry.appendChild(ul)
        if(country.borders !== undefined){

            let borderCountries = document.createElement('div')
            borderCountries.className = 'borderCountries'
            let b = document.createElement('b')
            b.append('Border Countries : ')
            borderCountries.appendChild(b)

            let bcountries = document.createElement('div')
            bcountries.className = 'countries'
            let borders;

            country.borders.forEach(element => {
               borders += `<span>${element}</span>`
            });
            bcountries.insertAdjacentHTML('beforeend' ,borders)
            borderCountries.appendChild(bcountries)
            infoCountry.appendChild(borderCountries)
        }


        div.appendChild(infoPhoto) // Adding figure to country div
        div.appendChild(infoCountry) // Adding info to country div

        modalCountryInfo.appendChild(div) // Adding country div to world div
    })
}