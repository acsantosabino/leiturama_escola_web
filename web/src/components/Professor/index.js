import React from 'react';
import Listagem from './Listagem';
import Cadastro from './Cadastro';
import {withFirebase} from './../firebase';
 
class ProfessoresBase extends React.Component {

    constructor(props) {
        super(props);
        this.definirListaProfessores = this.definirListaProfessores.bind(this);
    }
    
    render() {
        console.log("Professores - render");
        if (this.props.location.search) {
            if (this.props.location.search.substr(0,8) === "?indice=") {
                const indice = this.props.location.search.substr(8)
                return <Cadastro lista={this.state.lista} indice={indice}/>
            }
            return <Cadastro/>
        } else {
            return <Listagem definirLista={this.definirListaProfessores} />
        }
    }

    definirListaProfessores(listaProfessores) {
        this.setState( {lista: listaProfessores} );
    }
}

const Professores = withFirebase(ProfessoresBase);

export default Professores;