var popup = document.querySelector('.popup');
var popupContent = document.querySelector('.content');
var loader = document.getElementById('loader');
var close = document.getElementById('close-content');

var initialIndex = 100000;

// Firebase init && config
firebase.initializeApp(config);
var db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

// Get length of collection on first load
db.collection('urls').get().then((snapshots) => {
  snapshots.forEach(snapshot => {
    initialIndex += 1;
  });
});


let urlField = document.getElementById('url');

urlField.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    if (is_url(urlField.value)) {
      popup.style.display = 'block';
      loader.style.display = 'block';
      popupContent.style.display = 'none';

      let firebaseDocument = {
        longUrl: urlField.value,
        shortUrl: `myurlshortener/${btoa(initialIndex)}`,
        createdAt: new Date().toLocaleDateString()
      }

      db.collection('urls').doc(initialIndex.toString()).set(firebaseDocument)
      .then((success) => {
        console.log('Saved to database');
        loader.style.display = 'none';
        popupContent.style.display = 'block';
        initialIndex++;
        console.log(firebaseDocument.shortUrl);
      }).catch((error) => {
        console.log('Something went wrong' + error);
      });

    }
  }
});


let shortenedUrlField = document.getElementById('shortened');
// the block retrives the long url from firebase
shortenedUrlField.addEventListener('keypress', (event) => {
  if (event.keyCode === 13) {
    db.collection('urls').where('shortUrl', '==', shortenedUrlField.value).get()
    .then((doc) => {
      doc.forEach((item) => {
        console.log(item.data().longUrl);
      })
    }).catch((error) => {
      console.log('Something went wrong' + error);
    });
  }
});

// Test to determine if the text is valid html
function is_url(str)
{
  regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } return false;
}

function closePopup () {
  popup.style.display = 'none';
}
