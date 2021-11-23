import axios from 'axios';
import React, { Component } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import { GoogleLogin } from 'react-google-login';
interface IProps {
    history: any
}
interface IState {
}
class Login extends Component<IProps, IState> {
  constructor(props: IProps) {
      super(props)
      this.state = {
      }
  }
  componentDidMount(){
  }
  public handleLogin = async (googleData: any) => {
    const res = await axios.post("/api/v1/auth/google", {
      token: googleData.tokenId
    })
    const data = await res.data;
    console.log(data);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('authenticated', 'true');
    this.props.history('/')
  }
  public handleFailure = (googleData: any) => {
    localStorage.clear()
    window.alert(googleData);
  }
  render() {
    return (
      <div className='p-3'>
        <Row>
          {/* <Image src="./public/images/vocab-fav-icon.jpeg" roundedCircle /> */}
        </Row>
        <Row style={{marginTop:'200px'}}>
          <Col sm={4}></Col>
          <Col 
              sm={4} 
              style={{
                height:'100px',
                backgroundColor:'yellow', 
                display: 'flex',
                justifyContent: 'center'
                }}
            >
              <div style={{marginTop:'25px'}}>
                <GoogleLogin
                  clientId={process.env.GOOGLECLIENTAPI.trim()}
                  buttonText="Log in with Google"
                  onSuccess={this.handleLogin}
                  onFailure={this.handleFailure}         
                  cookiePolicy={'single_host_origin'}
                >
                  Signin with Google
                </GoogleLogin>
              </div>
          </Col>
          <Col sm={4}></Col>
        </Row>
      </div>
    );
  }
}
export default Login;
