class TurmaPersistence {

    constructor(firebase) {
        this.firebase = firebase;
        this.salvar = this.salvar.bind(this);
        this.atualizar = this.atualizar.bind(this);
    }

    salvar(turma, callbackOk) {
        let t = {}
        t.name = turma.name
        t.members = []
        t.adm = turma.adm
        this.firebase.firestore.collection("library").add(t)
            .then(callbackOk)
            .catch(
                function (error) {
                    console.log("Error saving document:", error);
                }
            );
    }

    atualizar(turma, callbackOk) {
        this.firebase.firestore
            .collection("library")
            .doc(turma.id)
            .set(turma)
            .then(() => {
                callbackOk();
            })
            .catch(function (error) {
                console.log("Error updating document:", error);
            });
    }

    getAll(callbackOk) {
        let lista = [];
        this.firebase.firestore.collection("library").get().then(
            querySnapshot => {
                querySnapshot.forEach(
                    doc => {
                        let turma = doc.data();
                        lista.push(turma);
                    }
                );
                callbackOk(lista);
            }
        );
    }

    getTurmasPorProfessor(profId, callbackOk) {
        let lista = [];
        this.firebase.firestore.collection("library").where("adm.id", "==", profId).get().then(
            querySnapshot => {
                querySnapshot.forEach(
                    doc => {
                        let turma = doc.data();
                        turma.id = doc.id;
                        lista.push(turma);
                    }
                );
                callbackOk(lista);
            }
        );
    }

    getAlunoPorTurma(turmaId, callbackOk) {
        
        this.firebase.firestore.collection("library").doc(turmaId).get().then(
            turma => {
                callbackOk(turma.data())
            }
        )
    }
}

export default TurmaPersistence;