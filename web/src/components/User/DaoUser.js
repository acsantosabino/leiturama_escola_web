class DaoUser {

    constructor (firebase) {
        this.firebase = firebase
    }

    updateUser(user, cbOk, cbFail) {
        this.firebase.firestore.collection("user").doc(user.id).set(user)
        .then(cbOk)
        .catch( error => cbFail(error) )
    }

    findUser(id, cbOk, cbFail) {
        this.firebase.firestore.collection("user").doc(id).get()
        .then(
            dataSnapshot => cbOk(dataSnapshot.data())
        )
        .catch( error => cbFail(error) )
    }
}

export default DaoUser