import React from 'react';
import { withFirebase } from "./firebase";
import * as ROUTES from "./../constants/routes";
import { Link } from 'react-router-dom';

class FrmSignInBase extends React.Component {

    constructor(props) {
        console.log("FrmAutenticacao - constructor");
        super(props);
        this.state = { usuario: "", senha: "" };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        console.log("FrmAutenticacao - Render");
        console.log("usuarioLogado..." + !!this.props.authUser);
        return (
            <div>
                <form onSubmit={onsubmit}>
                    <input placeholder="Usuário" name="usuario" value={this.state.usuario} onChange={this.onChange} /><br />
                    <input type="password" placeholder="Senha" name="senha" value={this.state.senha} onChange={this.onChange} /><br />
                    <button type="submit" onClick={this.onSubmit}>Enviar</button><br/>
                    <Link to={ROUTES.ESQUECI_SENHA}>Esqueci a senha</Link>
                </form>
            </div >
        )
    }

    onSubmit = event => {
        this.props.firebase.doSignIn(this.state.usuario, this.state.senha).
            catch(
                error => { console.log(error.message) }
            );
        event.preventDefault();
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
        event.preventDefault();
    }

    componentDidMount() {
        console.log("FrmAutenticacao DidMount");
    }

    signOut = event => {
        console.log("deslogou")
        this.props.firebase.doSignOut();
    }
}

const FrmSignIn = withFirebase(FrmSignInBase);

export default FrmSignIn; 