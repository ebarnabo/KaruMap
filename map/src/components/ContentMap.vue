<template>
  
  <div id="app">
    <div v-if="showSplash" id="splashScreen"><i class="fa-solid fa-hourglass-start fa-spin m-5 txt-primary"></i> Chargement... <i class="fa-solid fa-hourglass-start fa-spin m-5 txt-primary"></i></div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg mb-5 mt-4">
      <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand" href="#">
          <img src="../assets/logo.png" height="120" alt="Vue logo" id="logo" class="d-inline-block align-top magic-hover magic-hover__square">
        </a>
        
        <!-- Zone de recherche -->
        <div class="search ml-auto nav-btn" id="sr-zone" >
          <form class="search-container" autocomplete="off" @submit.prevent="rechercherMarqueur">
            <input id="search-box" type="text" class="search-box magic-hover magic-hover__square" name="q" v-model="searchTerm" @input="mettreAJourSuggestions" @blur="fermerSuggestions" ref="searchBox" />
            <label for="search-box"><span class="fa-search fa-solid search-icon"></span></label>
            <div class="suggestions-container" ref="suggestionsContainer">
              <ul v-if="suggestions.length">
                <li v-for="suggestion in suggestions" :key="suggestion" @click="selectionnerSuggestion(suggestion)">
                  {{ suggestion }}
                </li>
              </ul>
            </div>

            <input type="submit" id="search-submit" class="magic-hover magic-hover__square"/>
          </form>
        </div>
        <button class="btn nav-btn magic-hover cursorOuter" @click="toggleMenu" ref="menuButton" id="btn_list"><i class="fa-solid fa-caret-left"></i></button>
      </div>
    </nav>

    <!-- Contenu de l'application -->
    <div class="container">
      <div id="appli" class="">
      <div  class="container-fluid ">
        <div class="l-map-container width-transition" :class="{
            'col-xxl-11-animated': isMenuOpen, 
            'col-xxl-12-animated': !isMenuOpen,
            'col-lg-10-animated': isMenuOpen, 
            'col-lg-12-animated': !isMenuOpen,
          }">          
          <!-- Taille de la carte -->
          <l-map :zoom="zoom" :center="center" @click="Ajouter_Marqueur" class="l-map no-cursor" zoomControl="true">
            <select v-model="currentStyle"  id="mapselector" @click.stop>
              <option v-for="style in styles" :value="style.value" :key="style.value">
                {{ style.name }}
              </option>
            </select>
            <div class="filters" @click.stop>
              <h1>Filtres</h1>
              <div class="filter-option">
                <div  class="filter-text">Jardins</div>
                <label class="toggle-switch">
                  <input id="jardin" type="checkbox" v-model="filters.jardins">
                  <span class="slider round"></span>
                </label>
              </div>
              <div class="filter-option">
                <div class="filter-text">Sites et Monuments</div>
                <label class="toggle-switch">
                  <input id="monument" type="checkbox" v-model="filters.sitesEtMonuments">
                  <span class="slider round"></span>
                </label>
              </div>
            </div>
        <!-- Boutton de reset -->
        <button class="magic-hover magic-hover__square btn btn-reset" @click="resetMap" @click.stop>
          <i class="fas fa-undo"></i>
        </button>
            <l-tile-layer :url="tileLayerUrl"></l-tile-layer>
            <l-marker  v-for="(marker, index) in filteredMarqueurs" :key="index" :lat-lng="marker.coordinates" :icon="getIcon(marker.type)" @click="centerOnMarker(marker.coordinates[0], marker.coordinates[1], index)">          
              <l-popup>
                <h1 class="popup_titre">{{ marker.name }}</h1>
                <div><p class="popup-txt"><b>Code postal : </b> {{ marker.code_postal }}</p></div>
                <div class="mb-3"> <p class="popup-txt"><b>Commune : </b>{{ marker.commune }}</p></div>
                <button class="btn-primary btn mx-2 mt-2 " @click="Modif_Marqueur(index)">Modifier <i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-danger btn mx-2 mt-2" @click="Supprimer_Marqueur(index)">Supprimer <i class="fa-solid fa-delete-left"></i></button>
                <!-- BOUTON ouvris le gps -->
              </l-popup>
            </l-marker>
          </l-map>
        </div>
        
          <!-- Menu caché -->
          <transition name="menu">
            <div class="menu col-lg-2 col-xl-2 col-xxl-1" v-show="isMenuOpen" ref="menu">
              <div v-if="Marqueurs.length > 0">
                <div v-for="(marqueur, index) in Marqueurs" :key="index" class="card" @click="centerOnMarker(marqueur.coordinates[0], marqueur.coordinates[1])">
                  <div class="card-body">
                    <img :src="getBadgeUrl(marqueur.type)" class="badge-icon" alt="Type">
                    <h5 class="card-title">{{ marqueur.name }}</h5>
                    <p class="card-text">Code postal: {{ marqueur.code_postal }}</p>
                    <p class="card-text">Commune: {{ marqueur.commune }}</p>
                    <button class="btn btn-primary magic-hover" @click.stop.prevent="ouvrirApplicationGPS(marqueur)">Itinéraires <i class="fa-solid fa-turn-up"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
      </div>
      <div class="container-fluid text-center">
        <div class="row justify-content-center">
          <div class="col-3 ">
            <button class="btn btn-primary mt-3 mb-2 magic-hover magic-hover__square" @click="Import_donnes" @mouseover="addSpin" @mouseleave="removeSpin">Maj des données depuis l'API <i class="fas fa-arrows-spin"></i> </button>
          </div>
        </div>

      <div class="row justify-content-center">
        <div class="col">
          <button id="theme-toggle" class="theme-toggle-button  magic-hover magic-hover__square" @click="toggleTheme">
            <i v-if="isDarkMode" class="fas fa-moon" id="theme-icon"></i>
            <i v-else class="fas fa-sun" id="theme-icon"></i> 
          </button>
        </div>

      </div>  
      </div>
      <div class="stats" v-if="marqueurs && marqueurs.length > 0">
      <div class="stat-item  magic-hover magic-hover__square">
        <h5 class="txt-secondary">{{ nombreJardins }}</h5>
        <p>Jardins</p>
      </div>
      <div class="stat-item">
        <h5 class="txt-primary">{{ nombreMonuments }}</h5>
        <p>Monuments</p>
      </div>
      <div class="additional-text">
        <p>Données statistiques</p>
      </div>
    </div>


      </div>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import L from 'leaflet';

import jardinBadge from '../assets/img/jardin-badge.png';
import monumentBadge from '../assets/img/monument-badge.png';
import { magicMouse } from 'magicmouse.js'

const hauteurIcone = 70;
const ratio = 170 / 261;
const largeurIcone = hauteurIcone * ratio;

const jardinIcon = L.icon({
  iconUrl: require('../assets/img/jardin.png'), 
  iconSize: [largeurIcone, hauteurIcone], 
});

const monumentIcon = L.icon({
  iconUrl: require('../assets/img/muse.png'), 
  iconSize: [largeurIcone, hauteurIcone],
});
console.log(process.env.VUE_APP_API_URL);


export default {
  name: 'KaruData',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  mounted() {
    setTimeout(() => {
      this.showSplash = false; 
    }, 650); // Temps reload 
    // Charge les données de l'API et de la BD au lancement de l'appli
    this.Import_data();
    console.log(this.marqueurs); 
    this.fetchMarqueurs();
    //this.Import_donnes();
    this.applySystemTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this.applySystemTheme());
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('click', this.gererClicDocument);
    this.initMagicMouse();
},
  data() {
    return {
      center: [16.265, -61.550], // Coordonnées de la Guadeloupe
      zoom: 10.4,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      isMenuOpen: false, 
      isCursorHidden: true,
      showSplash: true, // Afficher l'écran de splash
      Marqueurs: [],
      nombreJardins: 0,
      nombreMonuments: 0,
      suggestions: [],
      ouvertSuggestions: false,
      searchTerm: '',
      Marqueur_Select: null,
      Marqueur_Nom: '',
      AjoutMarquer: false,
      selectedMarkerIndex: null, 
      dernierMarqueur: null,
      isDarkMode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
      filters: {
      jardins: true,
      sitesEtMonuments: true,
      },
      currentStyle: 'jawg-streets', // Carte active
      styles: [
        { name: 'Streets', value: 'jawg-streets' },
        { name: 'Terrain', value: 'jawg-terrain' },
        { name: 'Light', value: 'jawg-light' },
        { name: 'Dark', value: 'jawg-dark' },
        { name: 'Matrix', value: 'jawg-matrix' },
        { name: 'Sunny', value: 'jawg-sunny' }
      ],
      showSearch: false,
    };
  },
  computed: {
    tileLayerUrl() {
      return `https://{s}.tile.jawg.io/${this.currentStyle}/{z}/{x}/{y}{r}.png?access-token=${process.env.VUE_APP_JAWG_MAPS_ACCESS_TOKEN}`
    },
    filteredMarqueurs() {
    return this.Marqueurs.filter(marqueur => {
      if (this.filters.jardins && marqueur.type === 'jardins') return true;
      if (this.filters.sitesEtMonuments && marqueur.type === 'SitesEtMonuments') return true;
      return false;
    });
  },
  },
  beforeUnmount() {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.applySystemTheme);
  document.removeEventListener('click', this.handleOutsideClick);
  document.removeEventListener('click', this.gererClicDocument);
},

  methods: {
    toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log(`Menu basculé : ${this.isMenuOpen ? 'Ouvert' : 'Fermé'}`);
  },
    handleOutsideClick(e) {
      if (this.$refs.menu && !this.$refs.menu.contains(e.target) && !this.$refs.menuButton.contains(e.target)) {
      console.log("Click dehors, fermeture menu.");
      this.isMenuOpen = false;
    }
    },
    toggleSearch() {
      this.showSearch = !this.showSearch;
    },
  // Ouvrir les positions dans une appli gps
    ouvrirApplicationGPS(marqueur) {
    Swal.fire({
      title: 'Ouvrir avec',
      html: `
        <div style="text-align: center;">
          <p>Choisissez votre application pour aller à la position :</p>
          <button id="openGoogleMaps" class="swal2-confirm swal2-styled btn" style="display: inline-block; margin: 0.5em;">
          </button>
          <button id="openWaze" class="swal2-confirm swal2-styled btn" style="display: inline-block; margin: 0.5em;">
          </button>
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      cancelButtonColor: '#cc1c35',
      showConfirmButton: false, 
      preConfirm: () => {}, 
      didOpen: () => {
        // ouvrir Google Maps
        document.getElementById('openGoogleMaps').addEventListener('click', () => {
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${marqueur.coordinates[0]},${marqueur.coordinates[1]}`;
          window.open(googleMapsUrl, '_blank');
          Swal.close();
        });
        // ouvrir Waze
        document.getElementById('openWaze').addEventListener('click', () => {
          const wazeUrl = `https://waze.com/ul?ll=${marqueur.coordinates[0]}%2C${marqueur.coordinates[1]}&navigate=yes`;
          window.open(wazeUrl, '_blank');
          Swal.close();
        });
      }
    });
    },
    toggleTheme() {
    this.isDarkMode = !this.isDarkMode; // Bascule sur le thème sombre
    document.body.classList.toggle('dark-mode');
    this.currentStyle = this.isDarkMode ? 'jawg-streets' : 'jawg-dark';
    },
    applySystemTheme() {
      const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode = isSystemDark;
      this.toggleTheme(); // Appliquer le thème
    },
    initMagicMouse() {
      const options = {
      "outerStyle": "circle",
      "hoverEffect": "circle-move",
      "hoverItemMove": false,
      "defaultCursor": false,
      "outerWidth": 30,
      "outerHeight": 30
    }
    magicMouse(options);
    },
    rechercherMarqueur() {
    const searchTerm = document.getElementById('search-box').value.toLowerCase();
    const foundMarker = this.Marqueurs.find(marker => marker.name.toLowerCase().includes(searchTerm));
    
    if (foundMarker) {
      this.centerOnMarker(foundMarker.coordinates[0], foundMarker.coordinates[1]);
    } else {
      alert('Marqueur non trouvé.');
    }
    },
    mettreAJourSuggestions() {
    const searchTerm = this.searchTerm.toLowerCase();
    this.suggestions = this.Marqueurs.filter(marker => marker.name.toLowerCase().includes(searchTerm))
      .map(marker => marker.name)
      .slice(0, 3); // Limite à 3 suggestions
    
    this.ouvertSuggestions = this.suggestions.length > 0;
    },
    selectionnerSuggestion(suggestion) {
      this.searchTerm = suggestion; // Maj du champ de recherche avec la suggestion sélectionnée
      this.suggestions = []; 
      this.ouvertSuggestions = false;
      const foundMarker = this.Marqueurs.find(marker => marker.name === suggestion);
      if (foundMarker) {
        this.centerOnMarker(foundMarker.coordinates[0], foundMarker.coordinates[1]);
      }
    },
    gererClicDocument(e) {
      if (this.ouvertSuggestions && !this.$refs.searchBox.contains(e.target) && !this.$refs.suggestionsContainer.contains(e.target)) {
        this.suggestions = [];
        this.ouvertSuggestions = false;
      }
    },
    addSpin(event) {
      if (event.target.classList.contains('btn')) {
        event.target.querySelectorAll('i').forEach((icon) => {
          icon.classList.add('fa-spin');
        });
      }
    },
    removeSpin(event) {
    if (event.target.classList.contains('btn')) {
      event.target.querySelectorAll('i').forEach((icon) => {
        icon.classList.remove('fa-spin');
      });
    }
    },
    async Import_donnes() {
  try {
    console.log('Début de l\'importation des données...');
    await Promise.all([
    axios.get(`${process.env.VUE_APP_API_URL}/jardins`),
    axios.get(`${process.env.VUE_APP_API_URL}/monuments`)
    ]);
    console.log('Import des données OK');
    
    const marqueurs_données = await axios.get(`${process.env.VUE_APP_API_URL}/marqueurs`);
    console.log('Récupération des données des marqueurs OK', marqueurs_données.data);

    this.Marqueurs = marqueurs_données.data.map((marqueur) => {
      let type = marqueur.type;
      return {
        coordinates: [marqueur.latitude, marqueur.longitude],
        name: marqueur.nom,
        type: type,
        code_postal: marqueur.code_postal || marqueur.cp,
        commune: marqueur.commune,
        adresse_complete: marqueur.adresse_complete,
      };
    });
    this.reloadWithSplash();
    console.log('Transformation des données des marqueurs OK', this.Marqueurs);
  } catch (error) {
    console.error("Erreur lors de l'importation des données:", error);
  }
  
    },
    async Import_data() {
          try {
        console.log('Début de l\'importation des données des marqueurs...');
        const marqueurs_données = await axios.get(`${process.env.VUE_APP_API_URL}/marqueurs`);
        console.log('Récupération des données des marqueurs OK', marqueurs_données.data);

        this.Marqueurs = marqueurs_données.data.map((marqueur) => {
          return {
            coordinates: [marqueur.latitude, marqueur.longitude],
            name: marqueur.nom,
            type: marqueur.type,
            code_postal: marqueur.code_postal || marqueur.cp, // Utilisez 'marqueur.cp' si 'marqueur.code_postal' n'est pas disponible
            commune: marqueur.commune,
            adresse_complete: marqueur.adresse_complete,
          };
        });

        console.log('Transformation et importation des données des marqueurs OK');
      } catch (error) {
        console.error("Erreur lors de l'importation des données des marqueurs:", error);
      }
    },    
    Modif_Marqueur(index) {
    const currentMarker = this.Marqueurs[index];
    const originalName = currentMarker.name;

    Swal.fire({
      html: `
        <h2 class="txt-primary">Modifier un marqueur</h2>
        <input id="nom" class="swal2-input" value="${currentMarker.name}" placeholder="Nom">
        <input id="code_postal" class="swal2-input" value="${currentMarker.code_postal}" placeholder="Code Postal">
        <input id="commune" class="swal2-input" value="${currentMarker.commune}" placeholder="Commune">
      <div class="mt-3">
            <h5 class="txt-primary">Choix du type</h5>
            <label>
              <input type="radio" name="type" value="jardins" ${currentMarker.type === 'jardins' ? 'checked' : ''}>
              <img src="${jardinBadge}" alt="Jardin" style="width: 50px;">
            </label>
            <label>
              <input type="radio" name="type" value="SitesEtMonuments" ${currentMarker.type === 'SitesEtMonuments' ? 'checked' : ''}>
              <img src="${monumentBadge}" alt="Monument" style="width: 50px;">
            </label>
      </div>
      `
      ,
      preConfirm: () => {
        return {
          name : document.getElementById('nom').value,
          code_postal: document.getElementById('code_postal').value,
          commune: document.getElementById('commune').value,
          type: document.querySelector('input[name="type"]:checked').value,
        };
      },
      confirmButtonText: 'Valider les modifications',
      focusConfirm: false,
    }).then((result) => {
      // Après avoir cliquer sur le bouton de modal
      if (result.isConfirmed) {
        // Mise à jour du marqueur dans l'interface utilisateur
        const updatedMarker = {
          ...currentMarker,
          name: result.value.name,
          code_postal: result.value.code_postal,
          commune: result.value.commune,
          type: result.value.type,
        };

        this.Marqueurs[index] = updatedMarker; 
        this.Marqueur_Select = updatedMarker; 
        this.Marqueur_Update(originalName);
      }
    });
    },
    Marqueur_Update(originalName) {
      const { name, code_postal, commune, type } = this.Marqueur_Select;
      axios.put(`${process.env.VUE_APP_API_URL}/marqueurs/${originalName}`, {
        new_nom: name,
        new_code_postal: code_postal ,
        new_commune: commune,
        type: type,
      })
      .then(() => {
        console.log('Mise à jour Marqueur OK');
        this.Marqueur_Select = null; // Réinitialiser après la mise à jour
      })
      .catch(error => {
        console.error('Mise à jour Marqueur KO :', error);
      });
    },
    Annuler() {
      if (this.AjoutMarquer && this.dernierMarqueur !== null) {
        this.Marqueurs.splice(this.dernierMarqueur, 1);
        this.dernierMarqueur = null;
      }
      this.Marqueur_Select = null;
      this.AjoutMarquer = false; 
    },
    Supprimer_Marqueur(index) {
      const currentMarker = this.Marqueurs[index];
      Swal.fire({
        title: 'Êtes-vous sûr de vouloir supprimer ce marqueur ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#5457f6',
        cancelButtonColor: '#cc1c35',
        confirmButtonText: 'Oui, supprimer !'
      }).then((result) => {
        if (result.isConfirmed) {
          this.Marqueurs.splice(index, 1);
          axios.delete(`${process.env.VUE_APP_API_URL}/marqueurs/${currentMarker.name}`)
            .then(() => {
              console.log('Suppression Marqueur OK');
              this.calculateStats();
              //this.resetMap();
              location.reload();
            })
            .catch(error => {
              console.error('Suppression Marqueur KO :', error);
            });
        }
      });
    },
    Ajouter_Marqueur(event) {
  console.log("Début de la fonction Ajouter_Marqueur");
  const latitude = event.latlng.lat;
  const longitude = event.latlng.lng;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

  // Appel de l'API pour obtenir la liste des communes 
  axios.get('https://geo.api.gouv.fr/communes')
    .then(response => {
      const communes = response.data.map(commune => ({
        nom: commune.nom,
        code_postal: commune.codesPostaux[0] 
      }));
      console.log(`Nombre de communes récupérées : ${communes.length}`);

      // La liste des options pour l'autocomplétion
      const options = communes.map(commune => `${commune.nom} (${commune.code_postal})`);
      console.log(`Options pour l'autocomplétion construites : ${options.length} options`);

      // Affichage du formulaire Swal
      Swal.fire({
        html: `
          <h1 class="txt-primary">Ajouter un centre d'intérêt <i class="fa-solid txt-dark fa-map-pin txt-danger"></i></h1>
          <input id="nom" class="swal2-input" placeholder="Nom">
          <input id="commune" class="swal2-input" placeholder="Commune" list="communes">
          <div class="mt-3">
            <h5 class="txt-primary">Choix du type</h5>
            <label>
              <input type="radio" name="type" value="jardins" checked required>
              <img src="${jardinBadge}" alt="Jardin" style="width: 50px;">
            </label>
            <label>
              <input type="radio" name="type" value="SitesEtMonuments">
              <img src="${monumentBadge}" alt="Monument" style="width: 50px;">
            </label>
          </div>
        `,
        focusConfirm: false,
        preConfirm: () => {
          console.log("Validation du formulaire Swal");
          const nom = document.getElementById('nom').value;
          const commune_input = document.getElementById('commune').value;
          const type = document.querySelector('input[name="type"]:checked').value;

          if (!nom || !commune_input) {
            console.log("Échec de la validation : champs manquants");
            Swal.showValidationMessage("Veuillez remplir tous les champs.");
            return false;
          }
          console.log(`Formulaire validé avec : nom=${nom}, commune=${commune_input}, type=${type}`);
          const match = commune_input.match(/(.*) \((\d+)\)/);
          const commune = match ? match[1] : commune_input;
          const code_postal_autocomplete = match ? match[2] : '';

          return { nom, type, code_postal: code_postal_autocomplete, commune };
        },
        didOpen: () => {
          console.log("Ouverture du Swal pour ajout de marqueur");
          const datalist = document.createElement('datalist');
          datalist.id = 'communes';
          options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            datalist.appendChild(optionElement);
          });
          document.getElementById('commune').appendChild(datalist);
        }
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Marqueur confirmé pour ajout");
          const Nouveau_Marqueur = {
            coordinates: [latitude, longitude],
            name: result.value.nom,
            type: result.value.type, 
            code_postal: result.value.code_postal || '',
            commune: result.value.commune || '',
            adresse_complete: '',
          };
          console.log(`Nouveau marqueur : ${JSON.stringify(Nouveau_Marqueur)}`);
          this.Marqueur_Select = Nouveau_Marqueur; 
          this.Enregistrer_Marqueur();
          this.Import_donnes();
          location.reload();
        }
        else{
          console.log("Ajout de marqueur annulé ou non confirmé");
        }
      });
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des communes:', error);
    });
    console.log("Fin de la fonction Ajouter_Marqueur");
    },
    Enregistrer_Marqueur() {
      if (!this.Marqueur_Select.type) {
        console.error("Le type de marqueur est indéfini");
        return;
      }
      console.log("Type de marqueur :", this.Marqueur_Select.type);
      axios.post(`${process.env.VUE_APP_API_URL}marqueurs`, {
          type: this.Marqueur_Select.type,
          nom: this.Marqueur_Select.name,
          latitude: this.Marqueur_Select.coordinates[0],
          longitude: this.Marqueur_Select.coordinates[1],
          code_postal: this.Marqueur_Select.code_postal,
          commune: this.Marqueur_Select.commune,
          adresse_complete: this.Marqueur_Select.adresse_complete,
        })
        .then(() => {
          console.log('Ajout Marqueur OK');          
        })
        .catch(error => {
          console.error("Ajout Marqueur KO:", error);
        });
    },
    centerOnMarker(lat, lng, index) {
      this.center = [lat, lng];
      this.zoom = 20;
      this.selectedMarkerIndex = index; // Mise à jour de l'index du marqueur sélectionné
      if (this.$refs.map && this.$refs.map.mapObject) {
        const map = this.$refs.map.mapObject;
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker && layer.options.index === index) {
            map.setView([lat, lng], this.zoom);
            layer.openPopup();
          }
        });
      }
    },
    reloadWithSplash() {
      this.showSplash = true;
      setTimeout(() => {
        window.location.reload(); 
      }, 100);
    },
    // Fonction pour revenir au Zoom de base
    resetMap() {
      this.zoom = 10.4; 
      this.center = [16.265, -61.550];
    },
    getIcon(type) {
      console.log(`Recherche de l'icône pour le type: ${type}`); 
      if (type === 'jardins') {
        console.log('Retour de l\'icône pour les jardins'); 
        return jardinIcon;
      } else if (type === 'SitesEtMonuments') {
        console.log('Retour de l\'icône pour les Sites et Monuments');
        return monumentIcon;
      } else {
        console.log('Type non reconnu, retour d\'une icône par défaut'); 
        return L.icon({
          iconUrl: '../assets/img/default.png', 
          iconSize: [largeurIcone, hauteurIcone],
        });
      }
    },
    getBadgeUrl(type) {
    if (type === 'jardins') {
      return require('../assets/img/jardin-badge.png');
    } else if (type === 'SitesEtMonuments') {
      return require('../assets/img/monument-badge.png');
    } else {
      return require('../assets/img/default-badge.png');
    }
    },
    async fetchMarqueurs() {
      try {
        const response = await axios.get('${process.env.VUE_APP_API_URL}marqueurs');
        this.marqueurs = response.data;
        this.calculateStats();
      } catch (error) {
        console.error('Erreur lors de la récupération des marqueurs:', error);
      }
    },
    //functions de calcul des stats de la base
    calculateStats() {
      this.nombreJardins = this.marqueurs.filter(m => m.type === 'jardins').length;
      this.nombreMonuments = this.marqueurs.filter(m => m.type === 'SitesEtMonuments').length;
    },
  },
};
</script>
<style>
</style>