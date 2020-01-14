import React from "react";
import { Redirect } from "react-router-dom";
import * as ROUTES from "./../../constants/routes";
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { withFirebase } from "./../firebase";
import DaoProfessor from "./DaoProfessor";

class CadastroBase extends React.Component {

    constructor(props) {
        super(props);
        this.initialState = {
            mudarPagina: false,
            professor: {
                name: "",
                email: "",
                phone: ""
            }
        };
        this.state = { ...this.initialState };
        this.onChange = this.onChange.bind(this);
        this.salvar = this.salvar.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.dao = new DaoProfessor(this.props.firebase);
    }

    render() {
        console.log("Professor - Cadastro - rendered");
        console.log(this.state);
        if (this.state.mudarPagina) {
            return <Redirect to={ROUTES.PROFESSOR} />
        }
        return (
            <Container fixed>
                <div>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Nome"
                        placeholder="Nome do professor"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.professor.name}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="E-mail"
                        placeholder="E-mail do professor"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.professor.email}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="Telefone"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.professor.phone}
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={this.salvar} >Salvar</Button>&nbsp;
                    <Button variant="contained" color="secondary" onClick={this.cancelar}>Cancelar</Button>
                </div>
            </Container>
        )
    }

    componentDidMount() {
        if (this.props.lista) {
            const prof = this.props.lista[this.props.indice];
            console.log("didMount Cadastro");
            console.log(prof);
            console.log("didMount Cadastro");
            this.setState({ professor: prof });
        }
    }

    onChange(event) {
        let p = this.state.professor;
        p[event.target.name] = event.target.value;
        this.setState({ professor: p });
    }

    cancelar(event) {
        this.setState({ mudarPagina: true });
    }

    salvar(event) {
        let prof = { ...this.state.professor };
        let id = prof.id;
        delete prof.id;
        delete prof.mudarPagina;
        if (id) {
            this.dao.atualizar(id, prof,
                () => {
                    console.log("Dados do professor atualizados com sucesso");
                    this.setState({ mudarPagina: true });
                },
                error => console.log(error.message)
            )
        } else {
            this.dao.inserir(prof,
                () => {
                    console.log("Dados do professor atualizados com sucesso");
                    this.setState({ mudarPagina: true });
                },
                error => console.log(error.message)
            )
        }

        this.props.firebase.firestore.collection("teachers").
            add(prof).
            then(
                () => {
                    console.log("Dados do professor salvos com sucesso");
                    this.setState({ mudarPagina: true });
                }
            )
    }
}
const Cadastro = withFirebase(CadastroBase);

export default Cadastro;