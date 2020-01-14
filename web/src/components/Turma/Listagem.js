import React from 'react';
import Turma from './Turma';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Cadastro from './Cadastro';
import { withFirebase } from '../firebase';
import TurmaPersistence from './TurmaPersistence';

class TurmaListagemComponentBase extends React.Component {

    constructor(props) {
        super(props);
        this.turmaPersistence = new TurmaPersistence(props.firebase);
        this.state = { cadastrar: false };
        this.solicitarCadastro = this.solicitarCadastro.bind(this);
        this.cancelarCadastro = this.cancelarCadastro.bind(this);
        this.onChangeDadosTurma = this.onChangeDadosTurma.bind(this);
        this.definirListaTurmas = this.definirListaTurmas.bind(this);
        this.solicitarAtualizacao = this.solicitarAtualizacao.bind(this);
    }

    render() {
        if (this.state.cadastrar) {
            return <Cadastro turma={this.state.turma}
                firebase={this.props.firebase}
                cancelarCadastro={this.cancelarCadastro}
                salvar={this.salvar}
                onChange={this.onChangeDadosTurma} />
        }
        
        if (this.state.turmas) {
            return <div>
                <AddCircleIcon onClick={this.solicitarCadastro} />
                {this.state.turmas.length > 0 ?
                    <TableOfClasses listaTurmas={this.state.turmas}
                        onDoubleClick={this.solicitarAtualizacao}/>:
                    <h2>Não há turmas cadastradas</h2>}
            </div>
        } else {
            return <div>
                <AddCircleIcon onClick={this.solicitarCadastro}/>
                <LoadingClasses />
            </div>
        }
    }

    onChangeDadosTurma(event) {
        let componentId = event.target.id;
        let componentValue = event.target.value;

        let turma = this.state.turma;
        turma[componentId] = componentValue;
        this.setState({ turma: (turma) });
    }

    solicitarCadastro() {
        let turma = new Turma();
        this.setState({ cadastrar: true, turma: (turma) });
    }

    solicitarAtualizacao(event) {
        let index = event.currentTarget.id;
        let turma = this.state.turmas[index];
        console.log(turma);
        this.setState({ cadastrar: true, turma: (turma) });
    }

    cancelarCadastro() {
        this.setState({ cadastrar: false });
    }

    definirListaTurmas(listaTurmas) {
        this.setState({ turmas: listaTurmas });
    }

    componentDidMount() {
        this.turmaPersistence.getAll(this.definirListaTurmas);
    }
}

function TableOfClasses(props) {
    return <div>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">Nome</TableCell>
                    <TableCell align="center">Administrador</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.listaTurmas.map((turma, index) => {
                        return <TableRow key={index} 
                        id={index}
                        name={index} 
                        onDoubleClick={props.onDoubleClick}>
                            <TableCell align="center">{turma.name}</TableCell>
                            <TableCell align="center">{turma.adm.name}</TableCell>

                        </TableRow>
                    })
                }
            </TableBody>
        </Table>
    </div>
}

function LoadingClasses(props) {
    return <h2>
        Carregando turmas
    </h2>
}

const TurmaListagemComponent = withFirebase(TurmaListagemComponentBase);
export default TurmaListagemComponent;