const checked = 'checked.png'
const unChecked = 'images/unchecked.png'
const api_key = 'd9f6ff038b8b04e7946af08974d64aec'
const client_id='5ae481bf592b4df69bbadf33c2c09c38';
const client_secret='dcb848768462429b8c775625ac5d6298';
let token;

let scelta='';
let informazioni= {
  'one': '',
  'two': '',
  'three': ''
}

const domande= document.querySelectorAll('.choice-grid div');

const pulsante = document.querySelector('#ricominciamo')
pulsante.addEventListener('click', Reset);

const risultato=document.querySelector(".risultato");

for (const domanda of domande) {
  domanda.addEventListener('click', seleziona);
}

let risposte = {
  'one': '',
  'two': '',
  'three': ''
}

function risposteSelezionate() {
    if(risposte['one']==='') 
      return false
        if(risposte['two']==='')
            return false;
          if(risposte['three']==='')
              return false;
   return true;  
}


function seleziona(e) {
const sectionElement = e.currentTarget;
const sceltaID=sectionElement.dataset.choiceId
const sceltaQuestionId= sectionElement.dataset.questionId;
const scartati=[];
if (!risposteSelezionate()){

 for (const domanda of domande) {
  if(domanda.dataset.choiceId === sceltaID && domanda.dataset.questionId === sceltaQuestionId ){
    scelta=domanda;
  }else if(sceltaQuestionId === domanda.dataset.questionId){
    scartati.push(domanda);
  }
}
  for (const scarto of scartati){
    const noSpunta= scarto.querySelector('.checkbox');
    noSpunta.src=unChecked;
    scarto.style.backgroundColor= "#f4f4f4";
    scarto.classList.add('opacizza');
      }
  const Spunta= scelta.querySelector('.checkbox');
  Spunta.src=checked;
  scelta.classList.remove('opacizza');
  scelta.style.backgroundColor= "#cfe3ff";
  risposte[sceltaQuestionId]=sceltaID;
  /* api*/
  searchInfo();
    }
    if (risposteSelezionate()){
      risultati();
      }
  }


function risultati(){
let max;

if (risposte['one']===risposte['two']){
  max=risposte['one'];
} else if (risposte['one']===risposte['three']){
  max=risposte['one'];
} else if (risposte['two']===risposte['three']){
  max=risposte['two'];
} else {
  max=risposte['one'];
}
const titolo=risultato.querySelector('#titolo');
const testo=risultato.querySelector('#Contenuto');
testo.innerHTML= RESULTS_MAP[max].contents;
titolo.innerHTML= RESULTS_MAP[max].title;
risultato.classList.remove("hidden");
}

function Reset(){
  for (const domanda of domande) {
  domanda.classList.remove("opacizza");
  domanda.style.backgroundColor = "#f4f4f4";
  const resetIMG= domanda.querySelector('.checkbox');
  resetIMG.src=unChecked;
  risultato.classList.add("hidden");
     } 
   risposte = {
    'one': '',
    'two': '',
    'three': ''
   }
}







function searchInfo() {
console.log('Eseguo ricerca');
if (scelta.dataset.questionId==='one') {
  {
 
    console.log('sono il primo');
    const album_value= encodeURIComponent(scelta.dataset.type);
    console.log('Eseguo ricerca: ' + album_value);
    fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
      {
        headers:
        {
          'Authorization': 'Bearer ' + token
        }
      }
    ).then(onResponse).then(onJsonSpotify);
    
  }
}
if (scelta.dataset.questionId==='two') {
  console.log('sono il secondo');
  const pietanza= encodeURIComponent(scelta.dataset.type);
  console.log('Eseguo ricerca: '+pietanza);
  rest_url= 'https://api.edamam.com/api/recipes/v2?q='+pietanza + '&app_key=' + api_key+'&_cont=CHcVQBtNNQphDmgVQntAEX4BYVdtAgYDS2ZAA2ERYFF7AgADUXlSC2pAYFB0VQpUF2xDBmFHYwB3UFICFjYSUjMWYgR0BVYVLnlSVSBMPkd5BgMbUSYRVTdgMgksRlpSAAcRXTVGcV84SU4%3D&type=public&app_id=1db4c0cb'   ;
  console.log('URL: ' + rest_url);
  fetch(rest_url).then(onResponse).then(onJsonFood);
  }

}



function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}
function onTokenJson(json)
{
  console.log(json)
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}
function onJsonFood(json) {
  console.log('JSON ricevuto');
  const results = json.hits;
  let num_results= results.length;
  if(num_results>1){
    num_results=1;
    const result= results[num_results].recipe;
    const title= result.label;
    const images= result.image;
    const newInformation= document.createElement('div');
    newInformation.classList.add('scelta')
    const imageSelected = document.createElement('img');
    const caption = document.createElement('span');
    caption.textContent=title;
    imageSelected.src=images;
    caption.classList.add('text');
    imageSelected.classList.add('photo');
    newInformation.appendChild(caption);
    newInformation.appendChild(imageSelected);
    newInformation.classList.add('sistemazione');
    scelta.appendChild(newInformation);
  } else {
    console.log("Nessun risultato trovato");
  }
}

fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);


function onJsonSpotify(json) {
  console.log('JSON ricevuto');
  console.log(json);

  const results = json.albums.items;
  console.log(results);

  let num_results = results.length;
  if(num_results > 1){
    num_results = 1;

    const album_data = results[num_results]
    console.log(album_data);
    const title = album_data.name;
    const uscita= album_data.release_date;
    const selected_image = album_data.images[0].url;
    const album = document.createElement('div');
    const img = document.createElement('img');
    const caption = document.createElement('span');
    img.src = selected_image;
    caption.textContent = " " + title + " " + uscita;
    img.classList.add('photo');
    caption.classList.add('text');
    album.appendChild(img);
    album.appendChild(caption);
    scelta.appendChild(album);
    scelta .classList.add('sistemazione');

  }
}