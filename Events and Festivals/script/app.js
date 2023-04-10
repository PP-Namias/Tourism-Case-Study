

// toggle dark mode and light mode
let lightTheme = document.querySelector('.light-theme');
let darkTheme = document.querySelector('.dark-theme');

// local storage
let SAVE_THEME = localStorage.getItem('data-theme');
let SAVE_TOGGLE = localStorage.getItem('theme-display');

document.documentElement.setAttribute('data-theme', SAVE_THEME);

lightTheme.style.display = SAVE_TOGGLE;
if(SAVE_TOGGLE == 'none'){
    darkTheme.style.display = 'flex';
}


lightTheme.addEventListener('click', ()=>{
    document.documentElement.setAttribute('data-theme', 'light');
    lightTheme.style.display = 'none';
    darkTheme.style.display = 'flex';
    localStorage.setItem('data-theme', 'light');  
    localStorage.setItem('theme-display', 'none');
})
darkTheme.addEventListener('click', ()=>{
    document.documentElement.setAttribute('data-theme', 'dark');
    lightTheme.style.display = 'flex';
    darkTheme.style.display = 'none';
    localStorage.setItem('data-theme', 'dark');
    localStorage.setItem('theme-display', 'flex');
})
//---------------------------------------------------------------------

// event of dropdown------------------------------------
let dropdow = document.querySelector('.dropdown');
let dropdownContent = document.querySelector('.dropdown-menu');

dropdow.addEventListener('click', ()=>{
    dropdownContent.classList.toggle('dropdown-hide');
})

// ------------------------------------------------
//i use this to convert the population into currency format haha. from this 40218234 to look like this 40,218,234
const formatter = new Intl.NumberFormat();
let countryContainer = document.querySelector('.countryInfo');
let countryData = [];

// fetching api in rest country api
 let countryList = async ()=>{
    try {
    let fetchCountryList = await fetch('https://restcountries.com/v2/all');
    countryData = await fetchCountryList.json();
    
    loadCountry(countryData);
    } catch (error) {
        alert(error);
    }
       
}
countryList();



// search country *************************************************
let searchCountry = document.querySelector('#inputCountry');
searchCountry.addEventListener('input', (e) =>{
    let search = e.target.value;

    // the function of this is make the first letter of input to capitalize
    const capitalizeSearch = search.charAt(0).toUpperCase() + search.slice(1);

    let searchCountry = countryData.filter(countries=>{

        return countries.name.includes(capitalizeSearch)

    })

    if(capitalizeSearch.match(searchCountry)){
        countryContainer.innerHTML = `
                      <div class="displayText">

                          <h1>Country Not Found</h1>

                      </div>`                 
    }
    else{
       loadCountry(searchCountry);               
    }
    
  
})
//******************************************************************************* */


// filter by region ***************************************************
let dropdownlist = document.querySelectorAll('.dropdown-menu li');
let countryListContainer = document.querySelectorAll('.countryList');
let filterRegionName = document.querySelector('#filter-region');

dropdownlist.forEach(listRegion =>{
    listRegion.addEventListener('click', (e)=>{
        let region = e.target.classList;

        if(region != 'All'){
            filteredRegion(region, countryData);
        }
        else{
            loadCountry(countryData);
        }
    })
})

//functon to filter country by region 
let filteredRegion = (targetRegion, country)=>{
    let countriesRegion = country.filter(countries=>{
        return countries.region.includes(targetRegion);
    })

    loadCountry(countriesRegion)
}
//***************************************************************************** */ 

// display country **************************************************************
let loadCountry = (country)=>{
    let dataGet = "";
    country.forEach((data) =>{
       dataGet +=  `
            <div id="${data.flags.png}" class="countryList transitionWidth">
                <div class="country-flag">
                    <img id="flag-image1" src="${data.flags.png}" alt="">
                </div>
                <div class="info">
                    <div class="country-name">
                        <p>${data.name}</p>
                    </div>
                    <div class="country-name-info">
                        <p>Population: <span class="population">${formatter.format(data.population)}</span></p>
                        <p>Region: <span class="region">${data.region}</span></p>
                        <p>Capital: <span class="capital">${data.capital}</span></p>
                    </div>
                </div>
            </div>      
        `
    })
    
    countryContainer.innerHTML = dataGet;
    

    let countryListContainer = document.querySelectorAll('.countryList');
    countryListContainer.forEach(country=>{
        country.addEventListener('click', ()=>{
            moreCountryInfo.classList.add('display');
            countryListInfo.style.display = 'none';
            let countryTarget = country.id;

            countryData.forEach(a=>{
                if(a.flags.png.match(countryTarget)){
                    dataCountry(a);
                }
            })
        })
    })

}
//******************************************************************************* */


// declaring varibles for the full country info
let backButton = document.querySelector('#back-home-btn');
let moreCountryInfo = document.querySelector('.more-country-info');
let countryListInfo = document.querySelector('.countryInfo');

let bigImage = document.querySelector('#country-data-big');
let countryName = document.querySelector('#country-name');
let nativeName = document.querySelector('#native-name');
let population = document.querySelector('#population');
let region = document.querySelector('#region');
let subRegion = document.querySelector('#sub-region');
let capital = document.querySelector('#capital');
let tDomain = document.querySelector('#t-domain');
let currencies = document.querySelector('#currencies');
let lng = document.querySelector('#languages');
let borderCountry = document.querySelector('#border-country');

// back to home button
backButton.addEventListener('click', ()=>{
    moreCountryInfo.classList.remove('display');
    countryListInfo.style.display = 'flex';

    bigImage.src = "";
    countryName.innerHTML = ` <p>N/A</p>`;
    nativeName.innerHTML = 'N/A';
    population.innerHTML = 'N/A';
    region.innerHTML = 'N/A';
    subRegion.innerHTML = 'N/A';
    capital.innerHTML = 'N/A';
    tDomain.innerHTML = 'N/A';
    currencies.innerHTML = 'N/A';
    lng.innerHTML = 'N/A';
})


// function to show more data about country
let dataCountry = (country) =>{
    bigImage.src = country.flags.png;
    countryName.innerHTML = ` <p>${country.name}</p>`;
    nativeName.innerHTML = country.nativeName;
    population.innerHTML = formatter.format(country.population);
    region.innerHTML = country.region;
    subRegion.innerHTML = country.subregion;
    capital.innerHTML = country.capital;
    tDomain.innerHTML = country.topLevelDomain;
    currencies.innerHTML = country.currencies[0].name;

    let languages = country.languages;
    let arrLanguages = [];
    languages.map(lang=>{
        arrLanguages.push(lang.name);
    })
    lng.innerHTML = arrLanguages;

}
