import React from 'react'
import Table from '@material-ui/core/Table'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import { withFirebase } from '../firebase'
import TurmaPersistence from './TurmaPersistence'
import PeopleIcon from '@material-ui/icons/People'
import * as ROUTES from './../../constants/routes'
import { Redirect } from 'react-router-dom'

const base_link = "https://leiturama.page.link/?";
const link = "https://leituramaescola.com/";
const apn = "com.arthur.leituramaescola";
const afl = "/download";

class TurmaListagemComponentBase extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.turmaPersistence = new TurmaPersistence(props.firebase)
        this.definirListaTurmas = this.definirListaTurmas.bind(this)
        this.selecionarTurma = this.selecionarTurma.bind(this)
        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    render() {
        if (this.state.visualizarAlunos && this.state.turma) {
            return <Redirect to={ROUTES.ALUNOS_POR_TURMA + "?turma=" + this.state.turma.id} />
        } else if (!this.state.turmas) {
            return <div> <LoadingClasses /> </div>
        } else if (!this.state.turmas.length) {
            return <div> <h2>Não há turmas cadastradas</h2> </div>
        } else {
            return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Administrador</TableCell>
                        <TableCell align="center">Nome</TableCell>
                        <TableCell align="center">Convite</TableCell>
                        <TableCell align="center">Alunos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.state.turmas.map(
                            (turma, index) => {
                                return (
                                    <TableRow key={index} id={index} name={index}>
                                        <TableCell align="center"> {turma.name} </TableCell>
                                        <TableCell align="center"> {turma.adm.name} </TableCell>
                                        <TableCell align="center">
                                            <input id={"link" + turma.id}
                                                value={base_link + "link=" + encodeURIComponent(link + turma.id).replace('%20', '+')
                                                    + "&apn=" + encodeURIComponent(apn).replace('%20', '+')
                                                    + "&afl=" + encodeURIComponent(window.location.origin.toString() + afl).replace('%20', '+')} />
                                            <button id={"btn" + turma.id} onClick={this.copyToClipboard}> Convidar </button>

                                        </TableCell>
                                        <TableCell align="center">
                                            <PeopleIcon id={index} onClick={this.selecionarTurma}/>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        )
                    }
                </TableBody>
            </Table>
        }
    }

    selecionarTurma(event) {
        let index = event.target.id
        let turma = this.state.turmas[index]
        let members = turma?turma.members:[]
        console.log(members)
        this.setState({ visualizarAlunos: true, turma: (turma) })
    }

    definirListaTurmas(listaTurmas) {
        this.setState({ turmas: listaTurmas })
    }

    componentDidMount() {
        let id = this.props.authUser.id
        this.turmaPersistence.getTurmasPorProfessor(id, this.definirListaTurmas)
    }

    copyToClipboard(e) {
        let id = e.target.id.substr(3)
        let edtLink = document.getElementById("link" + id)
        edtLink.select()
        document.execCommand("copy")
        console.log("somente um teste")
    }
}

function LoadingClasses(props) {
    return <h2>
        Carregando turmas
    </h2>
}

const TurmaListagemComponent = withFirebase(TurmaListagemComponentBase)

export default TurmaListagemComponent