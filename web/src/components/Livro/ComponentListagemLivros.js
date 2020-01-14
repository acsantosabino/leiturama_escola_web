import React from 'react'
import { withFirebase } from './../firebase'
import DaoLivro from './DaoLivro'
import { Container, Table, TableRow, TableCell, TableHead, TableBody, BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import CloseIcon from '@material-ui/icons/Close'
import AvailableIcon from '@material-ui/icons/Check'
import TextField from '@material-ui/core/TextField'
import {Button} from '@material-ui/core'

class ComponentListagemLivrosBase extends React.Component {

    constructor(props) {
        super(props)
        this.state = { estadoLivros: "ALL", livrosSemFiltro: [], livros: []}
        this.dao = new DaoLivro(this.props.firebase)
        this.onChangeBookFilter = this.onChangeBookFilter.bind(this)
        this.onChangeTermoPesquisado = this.onChangeTermoPesquisado.bind(this)
        this.confirmarAtualizacao = this.confirmarAtualizacao.bind(this)
    }

    render() {
        if (!this.state.livrosSemFiltro) {
            return <h1>Carregando livros</h1>
        } else {
            return <Container fixed>
                <BarraDeNavegacao estadoLivros={this.state.estadoLivros} onChange={this.onChangeBookFilter} />
                <TextField fullWidth id="edtTitle" label="Pesquisar" placeholder="Digite o título desejado"
                        margin="normal" variant="outlined" onChange={this.onChangeTermoPesquisado} value={this.state.termoPesquisado} />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Mudar status</TableCell>
                            <TableCell align="center">Título</TableCell>
                            <TableCell align="center">Proprietário</TableCell>
                            <TableCell align="center">Status</TableCell>
                            { this.state.estadoLivros==="RENT"?<TableCell align="center">Devolver</TableCell>:null }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.livros.map(
                                (book, index) => {
                                    return <TableRow key={index} id={index} name={index} >
                                        <TableCell align="center"> <ActiveStatusChanger book={book} daoLivro={this.dao} confirmUpdate={this.confirmarAtualizacao}/> </TableCell>
                                        <TableCell align="center"> {book.title} </TableCell>
                                        <TableCell align="center"> {book.owner.name}</TableCell>
                                        <TableCell align="center"> {book.status}</TableCell>
                                        { this.state.estadoLivros==="RENT"?<TableCell align="center"><Button variant="outlined" color="secondary">Devolver</Button></TableCell>:null }
                                    </TableRow>
                                }
                            )
                        }
                    </TableBody>
                </Table>
            </Container>
        }
    }
    onChangeTermoPesquisado(event) {
        let termoPesquisado = event.target.value
        
        if (termoPesquisado.length < 3) {
            let livrosSemFiltro = this.state.livrosSemFiltro
            this.setState({livros: livrosSemFiltro})
        } else {
            let livrosSemFiltro = this.state.livrosSemFiltro
            let livrosFiltrados = livrosSemFiltro.filter(
                livro => livro.title.startsWith(termoPesquisado)
            )
            this.setState({livros: livrosFiltrados})
        }
    }

    onChangeBookFilter(event, value) {
        if (value === "ALL") {
            this.setState({ estadoLivros: value, livros: this.state.allBooks, livrosSemFiltro: this.state.allBooks})
        } else if (value === "AVAILABLE") {
            this.setState({ estadoLivros: value, livros: this.state.availableBooks, livrosSemFiltro: this.state.availableBooks })
        } else {
            this.setState({ estadoLivros: value, livros: this.state.rentBooks, livrosSemFiltro: this.state.rentBooks })
        }
    }

    confirmarAtualizacao() {
        this.setState({lastUpdate: Date.now()})
    }

    componentDidMount() {
        this.dao.getLivrosPorProfessor(this.props.authUser.id,
            (
                listaTurmas => {
                    this.dao.getLivros(listaTurmas,
                        listaLivros => {
                            let allBooks = listaLivros
                            let availableBooks = []
                            let rentBooks = []
                            let livros = allBooks
                            listaLivros.forEach(
                                livro => {
                                    if (livro.status === 'AVAILABLE') {
                                        availableBooks.push(livro)
                                    } else {
                                        rentBooks.push(livro)
                                    }
                                }
                            )
                            this.setState(
                                {
                                    allBooks: allBooks,
                                    availableBooks: availableBooks,
                                    rentBooks: rentBooks,
                                    livros: livros,
                                    livrosSemFiltro: livros
                                }
                            )
                        }
                    )
                }
            )
        )
    }
}

function ActiveStatusChanger(props) {

    function changeStatus() {
        book.inactive = !book.inactive
        daoLivro.updateBook(book, props.confirmUpdate)
    }

    let book = props.book
    let daoLivro = props.daoLivro

    if (book.inactive) {
        return <Button variant="contained" color="primary" onClick={changeStatus}>Ativar</Button>
    }
    return <Button variant="contained" color="secondary" onClick={changeStatus}>Desativar</Button>
}

function BarraDeNavegacao(props) {
    return (
        <BottomNavigation value={props.estadoLivros} showLabels onChange={props.onChange} >
            <BottomNavigationAction value="ALL" label="Todos" icon={<LibraryBooksIcon />} />
            <BottomNavigationAction value="AVAILABLE" label="Disponíveis" icon={<AvailableIcon />} />
            <BottomNavigationAction value="RENT" label="Emprestados" icon={<CloseIcon />} />
        </BottomNavigation>
    )
}

let ComponentListagemLivros = withFirebase(ComponentListagemLivrosBase)

export default ComponentListagemLivros