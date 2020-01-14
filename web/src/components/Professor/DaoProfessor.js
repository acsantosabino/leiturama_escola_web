import Firebase from "./../firebase/Firebase"

class DaoProfessor {

    constructor(firebase) {
        this.firebase = firebase;
        this.getAll = this.getAll.bind(this);
    }

    getAll(callback) {
        let lista = [];
        this.firebase.firestore.collection("user").where("profiles.professor", "==", true).get().then(

            querySnapshot => {
                querySnapshot.forEach(
                    doc => {
                        let prof = doc.data();
                        prof.id = doc.id;
                        lista.push(prof);
                    }
                );
                callback(lista);
            }
        )
    }

    atualizar(id, professor, callback, error) {
        this.firebase.firestore.collection("user").doc(id)
            .set(professor)
            .then(callback())
            .catch(error(error))
    }

    inserir(professor, callback, error) {
        this.firebase.firestore.collection("teachers").add(professor)
            .then(callback())
            .catch(error(error))
    }

    autorizarUsuario(idUser, user) {
        this.firebase.firestore.collection("user").doc(idUser).set(user)
            .then(console.log("user adicionado com sucesso"))
            .catch( error => console.log(error) )
    }

    apagarTeacher(id) {
        this.firebase.firestore.collection("teachers").doc(id).delete().then(
            ()=>{console.log("teacher deletado com sucesso")}
        )
        .catch(
            error=>{console.log(error)}
        )
    }

    carregarDadosIniciaisProfessor(email, callback) {
        this.firebase.firestore.collection("teachers").where("email", "==", email).get().then(
            querySnapshot => {
                if (querySnapshot.empty) {
                    callback(null)
                } else {
                    let prof = querySnapshot.docs[0].data()
                    prof.id = querySnapshot.docs[0].id
                    callback(prof)
                }
            }
        )
    }
}

export default DaoProfessor;