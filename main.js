const mainConstruction = document.querySelector('.main-en-construction');
const pokemonsHtml = document.querySelector('.pokemons');
const pagerHtml = document.querySelector('.pager');


if (pagerHtml) {    
    const btnPrevious = pagerHtml.querySelector('.btn-previous');
    const btnFirstPage = pagerHtml.querySelector('.btn-first-page');
    const btnPageLess2 = pagerHtml.querySelector('.btn-page-less2');
    const btnPageLess1 = pagerHtml.querySelector('.btn-page-less1');
    const spanPageReal = pagerHtml.querySelector('.page-real');
    const btnPagePlus1 = pagerHtml.querySelector('.btn-page-plus1');
    const btnPagePlus2 = pagerHtml.querySelector('.btn-page-plus2');
    const btnLastPage = pagerHtml.querySelector('.btn-last-page');
    const btnNext = pagerHtml.querySelector('.btn-next');
    
    const modalHtml = document.querySelector('.modal');
    const modalContentHtml = modalHtml.querySelector('.modal-content');


    /* ------------------AFFICHER LISTE POKEMON------------------ */
    function fetchPokemonList(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                pokemonsHtml.innerHTML = '';

                data.results.forEach(result => {
                    pokemonsHtml.innerHTML += `<li><button class="btn-pokemon" data-url="${result.url}">${result.name}</button></li>`;
                });

                const btnsPokemonHtml = document.querySelectorAll('.btn-pokemon');
                btnsPokemonHtml.forEach(btn => {
                    btn.addEventListener('click', () => {
                        modalHtml.classList.remove('hidden');
                        fetchPokemon(btn.getAttribute('data-url'));
                    });
                });

                btnPrevious.setAttribute('data-url', data.previous);
                btnNext.setAttribute('data-url', data.next);
            });
    }


    /* ------------------AFFICHER POKEMON MODALE------------------ */
    function fetchPokemon(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Boucle pour les images
                const spriteEntries = Object.values(data.sprites).filter(sprite => typeof sprite === 'string' && sprite);
                const spritesHtml = spriteEntries.map(sprite => {
                    return `<li><img src="${sprite}" alt="${data.name} sprite"></li>`;
                }).join('');

                // Boucle pour les types
                const typesHtml = data.types.map(typeInfo => {
                    const type = typeInfo.type;
                    return `<li><a href="./enconstruction.html?typeUrl=${encodeURIComponent(type.url)}" target="_blank">${type.name}</a></li>`;
                }).join('');

                // Boucle pour les capacités
                const abilitiesHtml = data.abilities.map(abilityInfo => {
                    const ability = abilityInfo.ability;
                    return `<li><a href="./enconstruction.html?abilityUrl=${encodeURIComponent(ability.url)}" target="_blank">${ability.name}</a></li>`;
                }).join('');

                modalContentHtml.innerHTML = 
                `<button class="btn-close">X</button>
                <h2>${data.name}</h2>
                <h3>Sprites:</h3>
                <ul class="sprites">${spritesHtml}</ul>
                <h3>Type(s):</h3>
                <ul>${typesHtml}</ul>
                <div class="weight-height">
                    <h3>Height: ${data.height}</h3>
                    <h3>Weight: ${data.weight}</h3>
                </div>
                <h3>Abilities:</h3>
                <ul>${abilitiesHtml}</ul>`;

                const btnClose = document.querySelector('.btn-close');
                btnClose.addEventListener('click', () => {
                    modalHtml.classList.add('hidden');
                });
            });
    }


    /* ------------------GESTION DE L'AFFICHAGE DE LA MODALE------------------ */
    modalHtml.addEventListener('click', () => {
        modalHtml.classList.add('hidden');
    });

    const childrens = modalHtml.querySelectorAll('& > *');
    childrens.forEach(children => {
        children.addEventListener('click', e => {
            e.stopImmediatePropagation();
        });
    });


    /* ------------------PAGER------------------ */
    let offset = 0;
    let page = 1;
    const limit = 20;
    const count = 1302;
    const btnsPager = pagerHtml.querySelectorAll('button');


function updateTextBtns() {
    btnPageLess2.textContent = page - 2;
    btnPageLess1.textContent = page - 1;
    spanPageReal.textContent = page;
    btnPagePlus1.textContent = page + 1;
    btnPagePlus2.textContent = page + 2;
    btnPageLess1.classList.toggle('hidden', page <= 1);
    btnPageLess2.classList.toggle('hidden', page <= 2);
    btnPagePlus1.classList.toggle('hidden', offset + limit >= count);
    btnPagePlus2.classList.toggle('hidden', offset + limit * 2 >= count);
    btnPrevious.classList.toggle('hidden', page <= 1);
    btnNext.classList.toggle('hidden', offset + limit >= count);
}

btnsPager.forEach(btn => {
    btn.addEventListener('click', () => {
        updateTextBtns();
    });
});

btnPrevious.addEventListener('click', () => {
    if (offset > 0) {
        offset -= limit;
        page--;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnFirstPage.addEventListener('click', () => {
    fetchPokemonList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20");
    offset = 0;
    page = 1;
    updateTextBtns();
});

btnPageLess2.addEventListener('click', () => {
    if (offset >= limit * 2) {
        offset -= limit * 2;
        page -= 2;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnPageLess1.addEventListener('click', () => {
    if (offset >= limit) {
        offset -= limit;
        page--;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnPagePlus1.addEventListener('click', () => {
    if (count >= offset + limit) {
        offset += limit;
        page++;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnPagePlus2.addEventListener('click', () => {
    if (count >= offset + limit * 2) {
        offset += limit * 2;
        page += 2;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnNext.addEventListener('click', () => {
    if (count >= offset + limit) {
        offset += limit;
        page++;
        fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        updateTextBtns();
    }
});

btnLastPage.addEventListener('click', () => {
    offset = count - limit;
    page = Math.ceil(count / limit);
    fetchPokemonList(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    updateTextBtns();
});


    /* ------------------EXECUTION DES FONCTIONS------------------ */
    fetchPokemonList('https://pokeapi.co/api/v2/pokemon');
}



if (mainConstruction) {
    const urlParams = new URLSearchParams(window.location.search);
    const abilityUrl = urlParams.get('abilityUrl');
    const typeUrl = urlParams.get('typeUrl');
    
if (abilityUrl) {
    fetch(abilityUrl)
        .then(response => response.json())
        .then(data => {
            mainConstruction.innerHTML = `
                <h1>${data.name}</h1>
                <p>Page en construction</p>
            `;
        });
} else if (typeUrl) {
    fetch(typeUrl)
        .then(response => response.json())
        .then(data => {
            mainConstruction.innerHTML = `
                <h1>${data.name}</h1>
                <p>Page en construction</p>
            `;
        });
    }
}


