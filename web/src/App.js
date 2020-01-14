import React from 'react'
import './App.css'
import Header from './components/Header'
import Escola from './components/Escola'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { withFirebase } from './components/firebase'
import * as ROUTES from './constants/routes'
import Turmas, { ListagemTurmaProfessor } from './components/Turma'
import Professor from './components/Professor'
import Container from '@material-ui/core/Container'
import LoginComponent, { EsqueciSenhaComponent } from './components/Login'
import ComponentePrimeiroAcesso from './components/Professor/ComponentPrimeiroAcesso'
import ComponentListagemLivros from './components/Livro/ComponentListagemLivros'
import ComponentListagemRegistros from './components/Registro/ComponentListagemRegistros'
import AlunosListagemComponent from './components/Turma/ListagemAlunos'
import FrmDownloadApk from './components/FrmDownloadApk'

class AppBase extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      authUser: null,
    }
    this.setAuthUser = this.setAuthUser.bind(this);
  }

  render() {

    // Se usuário não estiver autenticado
    if (!this.state.authUser) {
      return <Container maxWidth="lg" className="app">
        <Router>
          <Header authUser={this.state.authUser} />
          <Switch>
            <Route path={ROUTES.ESQUECI_SENHA} component={EsqueciSenhaComponent} />
            <Route path={ROUTES.PROFESSOR_PRIMEIRO_ACESSO} component={ComponentePrimeiroAcesso} />
            <Route path={ROUTES.DOWNLOAD} component={FrmDownloadApk} />

            <Route path={ROUTES.HOME} component={LoginComponent} />
          </Switch>
        </Router>
      </Container>
    }

    // Se usuário autenticado for administrador
    if (this.state.authUser.profiles.administrator) {
      return (
        <Container maxWidth="lg" className="app">
          <Router>
            <Header authUser={this.state.authUser} />
            <Switch>
              <Route path={ROUTES.HOME} exact component={Home} />
              <Route path={ROUTES.ESCOLA} component={Escola} />
              <Route path={ROUTES.PROFESSOR} component={Professor} />
              <Route path={ROUTES.TURMA} component={Turmas} />
            </Switch>
          </Router>
        </Container>
      );
    }

    // Se usuário autenticado for professor
    if (this.state.authUser.profiles.professor) {
      return (
        <Container maxWidth="lg" className="app">
          <Router>
            <Header authUser={this.state.authUser} />
            <Switch>
              <Route path={ROUTES.HOME} exact component={Home} />
              <Route path={ROUTES.TURMAS_DO_PROFESSOR}>
                <ListagemTurmaProfessor authUser={this.state.authUser} />
              </Route>
              <Route path={ROUTES.LIVROS_POR_PROFESSOR} exact >
                <ComponentListagemLivros authUser={this.state.authUser} />
              </Route>
              <Route path={ROUTES.REGISTROS}>
                <ComponentListagemRegistros authUser={this.state.authUser} />
              </Route>
              <Route path={ROUTES.ALUNOS_POR_TURMA} component={AlunosListagemComponent} />
            </Switch>
          </Router>
        </Container>
      )
    }

    // Se usuário autenticado for estudante
    if (this.state.authUser.profiles.student) {
      return <div>Aluno não possui funcionalidades na plataforma Web</div>
    }
  }


  componentDidMount = () => {
    this.listener = this.props.firebase.auth.onAuthStateChanged(
      authUser => {
        if (authUser) {
          var docReference = this.props.firebase.firestore.collection("user").doc(authUser.uid);
          docReference.get().then(
            doc => {
              if (doc.exists) {
                let userData = doc.data();
                this.setState({ authUser: userData })
              } else {
                console.log("Usuário não autorizado pelo sistema");
              }
            }
          ).catch(
            function (error) {
              console.log("Error getting document:", error);
            }
          );
        } else {
          this.setState({ authUser: null });
        }
      },
    );
  }

  componentWillUnmount() {
    this.listener();
  }

  setAuthUser(user) {
    this.setState({ authUser: user })
  }

}

function Home() {
  return (<h1> Home </h1>);
}

const App = withFirebase(AppBase);

export default App;