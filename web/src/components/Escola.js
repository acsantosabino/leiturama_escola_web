import React from 'react'

import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { withFirebase } from './firebase'
class Escola extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nomeEscola: "",
            cnpj: "",
            endereco: ""
        };

        this.componentDidMount = this.componentDidMount.bind(this);
        this.onChange = this.onChange.bind(this);
        this.salvar = this.salvar.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    render() {
        console.log("Escola - rendered")
        return (
            <Container fixed>
                <h1>Escola</h1>
                <div>
                    <TextField
                        fullWidth
                        id="iptNomeEscola"
                        name="nomeEscola"
                        label="Escola"
                        placeholder="Nome da escola"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.nomeEscola}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="iptCnpjEscola"
                        name="cnpj"
                        label="CNPJ"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.cnpj}
                    />
                </div>
                <div>
                    <TextField
                        fullWidth
                        id="iptEndereco"
                        name="endereco"
                        label="Endereço"
                        multiline
                        rows="6"
                        margin="normal"
                        variant="outlined"
                        onChange={this.onChange}
                        value={this.state.endereco}
                    />
                </div>
                <div>
                    <Button variant="contained" color="primary" onClick={this.salvar} >Salvar</Button>
                    &nbsp;
                <Button variant="contained" color="secondary" onClick={this.cancelar}>Cancelar</Button>
                </div>
            </Container>

        )
    }

    componentDidMount() {
        console.log("Escola - componentDidMount");
        let schoolReference = this.props.firebase.firestore.collection("school").doc("ftHhzHgJB1XTR9dDgbE8");
        schoolReference.get().then(doc => {
            if (doc.exists) {
                let school = doc.data();
                this.setState({ ...school });
                this.initialState = {...school};
            }
        }).catch(function (error) {
            console.log("Escola - Erro na busca dos dados da escola", error);
        });
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    salvar(event) {
        this.props.firebase.firestore.collection("school").doc("ftHhzHgJB1XTR9dDgbE8").
            set({ ...this.state }).
            then(function () {
                console.log("Dados da escola salvos com sucesso");
            })
    }

    cancelar(event){
        this.setState({...this.initialState});
    }
}

export default withFirebase(Escola);
