import React from 'react';
import { Redirect } from 'react-router-dom'
import * as ROUTES from './../../constants/routes';
import { withFirebase } from './../firebase';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DaoProfessor from './DaoProfessor';

class ListagemBase extends React.Component {

    constructor(props) {
        super(props);
        this.dao = new DaoProfessor(props.firebase);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onRequestTeacherUpdate = this.onRequestTeacherUpdate.bind(this);
        this.state = {
            cadastrarProfessor: false,
            atualizarProfessor: false
        };
    }

    render() {
        if (this.state.cadastrar) {
            return <Redirect to={ROUTES.PROFESSOR + "?cadastrar=true"} />
        } else if (this.state.atualizar) {
            return <Redirect to={ROUTES.PROFESSOR + "?indice=" + this.state.indice} />
        }
        return (
            <div>
                <div onClick={this.onClick}>
                    <AddCircleIcon />
                </div>

                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nome</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Telefone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {
                            this.state.lista ?
                                this.state.lista.map(
                                    ((prof, i) => {
                                        return (
                                            <TableRow id={i} onDoubleClick={this.onDoubleClick}
                                                key={i}>
                                                <TableCell align="center"> {prof.name} </TableCell>
                                                <TableCell align="center"> {prof.email} </TableCell>
                                                <TableCell align="center"> {prof.phone} </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : null
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }

    onClick(event) {
        this.setState({ cadastrar: true, atualizar: false })
    }

    onDoubleClick(event) {
        let id = event.currentTarget.id;
        this.setState({ cadastrar: false, atualizar: true, indice: id });
    }

    componentDidMount() {
        this.dao.getAll(
            lista => {
                this.props.definirLista(lista);
                this.setState({ 'lista': lista });
            }
        )
    }

    onRequestTeacherUpdate(event) {
        this.setState(
            {
                indice: event.target.id,
                cadastrar: false,
                atualizar: true
            }
        );
    }
}

const Listagem = withFirebase(ListagemBase);

export default Listagem;