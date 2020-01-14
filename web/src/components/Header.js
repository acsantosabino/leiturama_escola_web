import React from 'react'
import { Link } from 'react-router-dom';
import { withFirebase } from './firebase';
import * as ROUTES from './../constants/routes';

class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usuarioLogado: null
        }
    }

    render() {
        if (!this.props.authUser) { 
            return <AnonimousHeader/>
        } else if (this.props.authUser.profiles.administrator) {
            return <AdministratorHeader firebase={this.props.firebase} />
        } else if (this.props.authUser.profiles.professor) {
            return <ProfessorHeader firebase={this.props.firebase} />
        }
    }
}

function AdministratorHeader(props) {
    return (
        <header>
            <div>
                <Link to={ROUTES.HOME}> <img alt="imagem da logo" src={require('./../logo.png')} height="120px" /> </Link>
            </div>
            <ul className="navLinks">
                <li><Link to={ROUTES.ESCOLA}> Escola </Link></li>
                <li><Link to={ROUTES.PROFESSOR}> Professores </Link></li>
                <li><Link to={ROUTES.TURMA}> Turmas </Link></li>
            </ul>
            <div>
                <a href="#">
                    <div className="btnLogout" onClick={event => props.firebase.doSignOut()}>Sair</div>
                </a>
            </div>
        </header>
    )
}

function ProfessorHeader(props) {
    return (
        <header>
            <div>
                <Link to={ROUTES.HOME}> <img alt="imagem da logo" src={require('./../logo.png')} height="120px" /> </Link>
            </div>
            <ul className="navLinks">
                <li><Link to={ROUTES.TURMAS_DO_PROFESSOR}> Turmas </Link></li>
                <li><Link to={ROUTES.LIVROS_POR_PROFESSOR}> Livros </Link></li>
                <li><Link to={ROUTES.REGISTROS}> Registros </Link></li>
            </ul>
            <div>
                <a href="#">
                    <div className="btnLogout" onClick={event => props.firebase.doSignOut()}>Sair</div>
                </a>
            </div>
        </header>
    )
}

function AnonimousHeader(props) {
    return (
        <header>
            <Link to={ROUTES.HOME}> <img alt="imagem da logo" src={require('./../logo.png')} height="120px" /> </Link>
            <ul className="navLinks">
                <li><Link to={ROUTES.DOWNLOAD}> Download APK </Link></li>
            </ul>
        </header>
    )
}
export default withFirebase(Header);