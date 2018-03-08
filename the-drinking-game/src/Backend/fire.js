import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyCTBmCz83tzekEsWpYbgk94bNo_0j37trQ",
    authDomain: "the-drinking-game-1.firebaseapp.com",
    databaseURL: "https://the-drinking-game-1.firebaseio.com",
    projectId: "the-drinking-game-1",
    storageBucket: "the-drinking-game-1.appspot.com",
    messagingSenderId: "745098135635"
};
let fire = firebase.initializeApp(config);

export default fire;