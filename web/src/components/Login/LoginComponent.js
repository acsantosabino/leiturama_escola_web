import React from 'react';
import './LoginComponent.css';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { withFirebase } from './../firebase';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import * as ROUTES from "./../../constants/routes";
import { Link } from 'react-router-dom';

class LoginComponentBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.onChange = this.onChange.bind(this);
        this.cancelar = this.cancelar.bind(this);
        this.autenticar = this.autenticar.bind(this);
    }

    render() {
        return <Container fixed>
            <div>
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="E-mail"
                    placeholder="email"
                    margin="normal"
                    variant="outlined"
                    value={this.state.usuario}
                    onChange={this.onChange}
                />
            </div>
            <div>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="senha"
                        type='password'
                        value={this.state.senha}
                        onChange={this.onChange}
                        labelWidth={70}
                    />
                </FormControl>
                <Link to={ROUTES.ESQUECI_SENHA}>Esqueci a senha</Link> <br/>
                <Link to={ROUTES.PROFESSOR_PRIMEIRO_ACESSO}>É seu primeiro acesso professor?</Link>
            </div>
            <div className="confirmationControl">
                <Button variant="contained" color="primary" onClick={this.autenticar}>Autenticar</Button>
                &nbsp;
                <Button variant="contained" color="secondary" onClick={this.cancelar}>Limpar</Button>
            </div>
        </Container>
    }

    onChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }

    cancelar() {
        this.setState({ ...initialState });
    }

    autenticar() {
        this.props.firebase.doSignIn(this.state.email, this.state.senha, this.handleAuthenticationError);
    }

    handleAuthenticationError(error){
        console.log("===================================");
        console.log(error);
        console.log(error.message);
        console.log("===================================");
    }
}

const initialState = { email: "", senha: "" };

const LoginComponent = withFirebase(LoginComponentBase);

export default LoginComponent;