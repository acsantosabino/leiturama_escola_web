import React from 'react'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import DaoProfessor from '../Professor/DaoProfessor'
import { withFirebase } from '../firebase'
import TurmaPersistence from './TurmaPersistence'

class CadastroBase extends React.Component {
    constructor(props) {
        super(props)

        this.persistence = new TurmaPersistence(this.props.firebase)

        this.state = { turma: props.turma }
        this.definirLista = this.definirLista.bind(this)
        this.confirmarCadastroDados = this.confirmarCadastroDados.bind(this)
        this.confirmarAtualizacaoDados = this.confirmarAtualizacaoDados.bind(this)
        this.salvar = this.salvar.bind(this)
        this.onAdministratorChange = this.onAdministratorChange.bind(this)
    }

    render() {
        console.log(this.props.turma)
        return <Container fixed>
            <div>
                <TextField fullWidth required id="name" label="Nome" margin="normal"
                    variant="outlined" onChange={this.props.onChange} value={this.props.turma.name} />
            </div>

            <div>
                <FormControl fullWidth>
                    <InputLabel id="lblAdministrator">  Administrador *</InputLabel>
                    <Select fullWidth id="administrator" label="Administrador" variant="outlined"
                        labelId="lblAdministrator" value={this.props.turma.adm.id} onChange={this.onAdministratorChange}>
                        {
                            this.state.listaProfessores ?
                                this.state.listaProfessores.map(
                                    (prof, indice) => {
                                        return <MenuItem value={prof.id} key={prof.id}>
                                            {prof.name}
                                        </MenuItem>
                                    }
                                ) : null
                        }
                    </Select>
                </FormControl>
            </div>

            <div>
                <Button variant="contained" color="primary" onClick={this.salvar} >Salvar</Button> &nbsp;
                <Button variant="contained" color="secondary" onClick={this.props.cancelarCadastro}>Cancelar</Button>
            </div>
        </Container>
    }

    componentDidMount() {
        let daoProf = new DaoProfessor(this.props.firebase)
        daoProf.getAll(this.definirLista)
    }

    definirLista(lista) {
        this.setState({ listaProfessores: lista })
    }

    confirmarCadastroDados() {
        console.log("Turma salva com sucesso")
        this.props.cancelarCadastro()
    }

    confirmarAtualizacaoDados() {
        console.log("Turma atualizada com sucesso")
        this.props.cancelarCadastro()
    }

    onAdministratorChange(event) {
        let componentValue = event.target.value;
        let adm = this.state.listaProfessores.find(
            element => element.id === componentValue
        )
        delete(adm.n_borrowed)
        delete(adm.n_lent)
        delete(adm.n_read)
        delete(adm.profiles)
        let turma = this.state.turma
        turma.adm = adm
        this.setState({turma: turma})
    }

    salvar(event) {
        if (this.state.turma.id) {
            this.persistence.atualizar(this.state.turma, this.confirmarCadastroDados)
        } else {
            this.persistence.salvar(this.state.turma, this.confirmarCadastroDados)
        }
        this.props.cancelarCadastro()
    }
}

const Cadastro = withFirebase(CadastroBase)

export default Cadastro