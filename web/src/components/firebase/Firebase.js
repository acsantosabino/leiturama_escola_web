import app from 'firebase/app';
import { auth } from "firebase/auth";
import { firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyABV35W-LGbtEVMZNVKFtHO9fczQp_b-yY",
    authDomain: "leiturama-40e49.firebaseapp.com",
    databaseURL: "https://leiturama-40e49.firebaseio.com",
    projectId: "leiturama-40e49",
    storageBucket: "leiturama-40e49.appspot.com",
    messagingSenderId: "697487135295",
    appId: "1:697487135295:web:5c4d501e75585b13f35e8a"
};

class Firebase {

    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth();
        this.firestore = app.firestore();
        this.authUser = null;
    }

    doSignUp(email, password, okCallback, errorCallback) {
        this.auth.createUserWithEmailAndPassword(email, password)
            .then( userCredential => okCallback(userCredential) )
            .catch( error => errorCallback(error) );
    }

    doSignIn(email, password, callback) {
        this.auth.signInWithEmailAndPassword(email, password).catch(callback);
    }

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

}

export default Firebase;
