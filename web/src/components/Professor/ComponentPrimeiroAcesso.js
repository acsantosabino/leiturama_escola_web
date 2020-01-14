import React from 'react';
import { withFirebase } from '../firebase';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { Container } from '@material-ui/core';
import DaoProfessor from './DaoProfessor';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Snackbar from '@material-ui/core/Snackbar';

class ComponentePrimeiroAcessoBase extends React.Component {

    constructor(props) {
        super(props)
        this.daoProfessor = new DaoProfessor(this.props.firebase);
        this.state = {
            user: { ...initialUser }
        }
        this.onChange = this.onChange.bind(this)
        this.onPasswdChange = this.onPasswdChange.bind(this)
        this.carregarDadosProfessor = this.carregarDadosProfessor.bind(this)
        this.onClick = this.onClick.bind(this)
        this.registerUser = this.registerUser.bind(this)
    }

    render() {
        console.log(this.state)
        return (
            <Container fixed>
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="E-mail"
                    placeholder="email"
                    margin="normal"
                    variant="outlined"
                    value={this.state.user.email}
                    onChange={this.onChange}
                />
                <br />

                {
                    !this.state.user.name ? null : <div>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Nome"
                            placeholder="Nome"
                            margin="normal"
                            variant="outlined"
                            value={this.state.user.name}
                            onChange={this.onChange}
                        />
                        <br />
                        <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label="Telefone"
                            placeholder="Telefone"
                            margin="normal"
                            variant="outlined"
                            value={this.state.user.phone}
                            onChange={this.onChange}
                        />
                        <br />
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="senha"
                                type='password'
                                value={this.state.password}
                                onChange={this.onPasswdChange}
                                labelWidth={70}
                            />
                        </FormControl>
                    </div>
                }
                <div className="confirmationControl">
                    <Button variant="contained" color="primary" onClick={this.onClick}> Iniciar </Button>
                    &nbsp;
                    <Button variant="contained" color="secondary" onClick={event => this.setState({ user: { ...initialUser } })}>Limpar</Button>
                </div>
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                    open={this.state.errorMessage}
                    autoHideDuration={1000}
                    onClose={ () => this.setState({errorMessage: null}) }
                    message={this.state.errorMessage}
                />
            </Container>
        )
    }

    showMessage(value) {

    }

    onPasswdChange(event) {
        let value = event.target.value
        this.setState({ senha: value })
    }

    onChange(event) {
        let value = event.target.value
        let id = event.target.id
        let user = this.state.user
        user[id] = value;
        this.setState({ user: user });
    }

    registerUser(userCredential) {
        let uidUser = userCredential.user.uid
        let idTeacher = this.state.teacherId
        let user = this.state.user
        user.id = uidUser

        this.daoProfessor.autorizarUsuario(uidUser, user)

        this.daoProfessor.apagarTeacher(idTeacher)
    }

    onClick(event) {
        if (this.state.user.name) {
            // Registra usuário no Firebase Authentication
            let email = this.state.user.email
            let senha = this.state.senha
            this.props.firebase.doSignUp(email, senha, this.registerUser, error => console.log(error))
        } else {
            // Usuário digitou email e carrega os dados do pre cadastro que já foi realizado
            this.daoProfessor.carregarDadosIniciaisProfessor(this.state.user.email,
                prof => {
                    if (prof) {
                        let id = prof.id;
                        delete (prof.id)
                        let oldProf = this.state.user
                        this.setState({ teacherId: id, user: { ...oldProf, ...prof } })
                    } else {
                        this.setState( {errorMessage: "Usuário inexistente"} )
                    }
                }
            )
        }
    }

    carregarDadosProfessor(email) {

    }
}

const ComponentePrimeiroAcesso = withFirebase(ComponentePrimeiroAcessoBase);

const initialUser = {
    name: "",
    n_borrowed: 0,
    n_lent: 0,
    n_read: 0,
    email: "",
    phone: "",
    profiles: {
        professor: true
    }
}

export default ComponentePrimeiroAcesso;