class DaoRegistro {

    constructor(firebase) {
        this.firebase = firebase
    }

    getRegistros(livros, cbSetRegistros) {
        let registros = []
        livros.forEach(
            livro => {
                this.firebase.firestore.collection("registers").where("book.id", "==", livro.id).get().then(
                    querySnapshot => {
                        if (!querySnapshot.empty) {
                            querySnapshot.docs.forEach(
                                snapshot => {
                                    let registro = snapshot.data()
                                    registro.id = snapshot.id
                                    registros.push(registro)
                                }
                            )
                            cbSetRegistros(registros)
                        }
                    }
                )
            }
        )
    }
}

export default DaoRegistro