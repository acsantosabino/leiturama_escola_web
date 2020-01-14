import TurmaPersistence from "../Turma/TurmaPersistence";

class DaoLivro {

    constructor(firebase) {
        this.firebase = firebase
        this.getLivros = this.getLivros.bind(this)
        this.getLivrosPorProfessor = this.getLivrosPorProfessor.bind(this)
    }

    updateBook(book, cbOk, cbFail) {
        this.firebase.firestore.collection("books").doc(book.id).set(book).then(
            cbOk,
            error => cbFail(error)
        )
    }

    getLivrosPorProfessor(profId, cbSetTurmas) {
        let turmaPersistence = new TurmaPersistence(this.firebase)
        turmaPersistence.getTurmasPorProfessor(profId, cbSetTurmas)
    }

    getLivros(listaTurmas, cbSetEmprestimos) {
        let membros = []
        listaTurmas.forEach(
            turma => {
                if (turma.members) {
                    turma.members.forEach(
                        memberTurma => {
                            let jaAdicionado = membros.find(
                                membro => membro.id === memberTurma.id
                            )
                            if (!jaAdicionado) {
                                membros.push(memberTurma)
                            }
                        }
                    )
                }
            }
        )

        let emprestimos = []
        membros.forEach(
            membro => {
                this.firebase.firestore.collection("books").where("owner.id", "==", membro.id).get().then(
                    querySnapshot => {
                        if (!querySnapshot.empty) {
                            querySnapshot.docs.forEach(
                                snapshot => {
                                    let book = snapshot.data()
                                    book.id = snapshot.id
                                    emprestimos.push(book)
                                }
                            )
                            cbSetEmprestimos(emprestimos)
                        }
                    }
                )
            }
        )
    }
}

export default DaoLivro