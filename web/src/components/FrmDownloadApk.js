import React from 'react'
import Container from '@material-ui/core/Container'
import GetAppIcon from '@material-ui/icons/GetApp'
import './../App.css'

class FrmDownloadApk extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Container fixed>
                <center>
                    <div>
                        <h1>Download apk Leiturama</h1>
                        <a target="_blank" href="https://drive.google.com/file/d/1upBYCfHVX6ubOxxO6lHNVfF3Kj9pC8Fz/view?usp=sharing">
                            <GetAppIcon/>
                        </a>
                    </div>
                </center>
            </Container>
        )
    }
}

export default FrmDownloadApk