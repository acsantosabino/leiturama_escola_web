import React from 'react'
import { withFirebase } from '../firebase'
import * as ROUTES from './../../constants/routes'
import { Redirect } from 'react-router-dom'
import TurmaPersistence from './TurmaPersistence'
import DaoUser from './../User/DaoUser'
import { Table, TableHead, TableRow, TableCell, TableBody, Container } from '@material-ui/core'
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

class AlunosListagemComponentBase extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.daoTurma = new TurmaPersistence(this.props.firebase)
        this.daoUser = new DaoUser(this.props.firebase)
        this.confirmUpdate = this.confirmUpdate.bind(this)
    }

    render() {
        if (this.props.location.search) {
            if (this.props.location.search.substr(0, 7) === "?turma=") {
                if (!this.state.users) {
                    return <h1>Carregando dados dos alunos</h1>
                } else if (!this.state.users.length) {
                    return <h1>Turma não contém membros</h1>
                } else {
                    return (
                        <Container fixed>
                            <h1>{this.state.turma.name}</h1>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Nome</TableCell>
                                        <TableCell align="center">Email</TableCell>
                                        <TableCell align="center">Estado</TableCell>
                                        <TableCell align="center">Ação</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.users.map((aluno, index) => {
                                            return <TableRow key={index}
                                                id={index}
                                                name={index} >
                                                <TableCell align="center">{aluno.name}</TableCell>
                                                <TableCell align="center">{aluno.email}</TableCell>
                                                <TableCell align="center"> <ActiveIcon member={aluno}/> </TableCell>
                                                <TableCell align="center"> 
                                                    <Acao member={aluno} daoUser={this.daoUser} confirm={this.confirmUpdate}/> 
                                                </TableCell>
                                            </TableRow>
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Container>
                    )
                }
            }
        }
        return <Redirect to={ROUTES.TURMAS_DO_PROFESSOR} />
    }

    componentDidMount() {
        let users = []
        const turmaId = this.props.location.search.substr(7)
        this.daoTurma.getAlunoPorTurma( turmaId,
            turma => {
                this.setState( {turma: (turma)} )
                turma.members.forEach(
                    member => this.daoUser.findUser(
                        member.id, 
                        user => {
                            users.push(user)
                            this.setState( {users:(users)} )
                        },
                        error => console.log(error)
                    )
                )
            }, 
            error => console.log(error)
        )
    }

    confirmUpdate() {
        this.setState({ultimaAtualizacao: Date.now()})
    }
}

function ActiveIcon(props) {
    if (props.member.inactive) {
        return <CloseIcon/>
    } 
    return <DoneIcon/>
}

function Acao(props) {

    function handleChangeStatus() {
        let member = props.member
        member.inactive=!member.inactive
        props.daoUser.updateUser(member,
            props.confirm,
            error => console.log(error.message))
    }

    if (props.member.inactive) {
        return <span onClick={handleChangeStatus}>Ativar</span>
    } 
    return <span onClick={handleChangeStatus}>Desativar</span>
}

const AlunosListagemComponent = withFirebase(AlunosListagemComponentBase)

export default AlunosListagemComponent