import React from "react";
import Container from '@material-ui/core/Container';
import { withFirebase } from './../firebase'
import DaoLivro from './../Livro/DaoLivro'
import DaoRegistro from './DaoRegistro'
import { Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core'

class CadastroBase extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
        this.daoLivro = new DaoLivro(this.props.firebase)
        this.dao = new DaoRegistro(this.props.firebase)
    }

    render() {
        if (!this.state.registros)
            return <h1>Carregando registros</h1>
        else if (!this.state.registros.length) {
            return <h1>Não há registros</h1>
        } else {
            return <Container>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Título</TableCell>
                            <TableCell align="center">Proprietário</TableCell>
                            <TableCell align="center">Evento</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.registros.map(
                                (registro, index) => {
                                    return <TableRow key={index} id={index} name={index} >
                                        <TableCell align="center"> {registro.book.title} </TableCell>
                                        <TableCell align="center"> {registro.book.owner.name} </TableCell>
                                        <TableCell align="center"> {registro.libraryEvent} </TableCell>
                                    </TableRow>
                                }
                            )
                        }
                    </TableBody>
                </Table>
            </Container>
        }
    }

    componentDidMount() {
        this.daoLivro.getLivrosPorProfessor(this.props.authUser.id,
            (
                listaTurmas => {
                    this.daoLivro.getLivros(listaTurmas,
                        listaLivros => {
                            this.dao.getRegistros(listaLivros,
                                registros => this.setState({ registros: registros })
                            )
                        }
                    )
                }
            )
        )
    }

}

const Cadastro = withFirebase(CadastroBase);

export default Cadastro;