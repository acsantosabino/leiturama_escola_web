import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { withFirebase } from './../firebase';
import { Redirect } from 'react-router-dom';
import * as ROUTES from "./../../constants/routes";

class EsqueciSenhaComponentBase extends React.Component {

    constructor(props) {
        console.log("FrmEsqueciSenha - constructor");
        super(props);
        this.state = { email: "", msg: "" };
        this.onChange = this.onChange.bind(this);
        this.resetar = this.resetar.bind(this);
        this.cancelar = this.cancelar.bind(this);
    }

    render() {
        if (this.state.encerrar) {
            return <Redirect to={ROUTES.HOME} />
        }
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="E-mail"
                        placeholder="E-mail"
                        margin="normal"
                        variant="outlined"
                        value={this.state.email}
                        onChange={this.onChange} />

                    <div className="confirmationControl">
                        <Button variant="contained" color="primary" onClick={this.resetar}>Resetar</Button>
                        &nbsp;
                <Button variant="contained" color="secondary" onClick={this.cancelar}>Cancelar</Button>
                    </div>
                </form>
                {this.state.msg ? this.state.msg : ""}
            </div>
        )
    }

    onChange(event) {
        this.setState({ email: event.target.value });
    }

    resetar(event) {
        this.props.firebase.doPasswordReset(this.state.email).
            then(
                () => {
                    this.setState({ email: "", msg: "Um email foi enviado para " + this.state.email + " com instruções para recuperar sua senha" });
                    this.setState({ encerrar: true });
                }
            ).catch(
                error => {
                    console.log("falha");
                    if (error.code === "auth/user-not-found") {
                        this.setState({ msg: "Email não encontrado" })
                    } else if (error.code === "auth/invalid-email") {
                        this.setState({ msg: "Email inválido" })
                    } else {
                        this.setState({ msg: "Falha na operação" })
                    }
                }
            );
    }

    cancelar() {
        this.setState({ encerrar: true });
    }

    componentDidMount() {

    }
}

const EsqueciSenhaComponent = withFirebase(EsqueciSenhaComponentBase);

export default EsqueciSenhaComponent;