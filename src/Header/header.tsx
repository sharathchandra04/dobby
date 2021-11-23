import axios from 'axios';
import  React, { Component } from 'react';
import { Col, Row, Button, FormControl } from 'react-bootstrap'
import { Link } from "react-router-dom";

interface IProps {
  history: any
}

class Header extends Component<IProps> {
  constructor(props: IProps) {
      super(props)
      console.log(props)
      this.state = {
      }
  }
  componentDidMount(){
  	console.log(this.props)
  }
  public logout = () => {
    axios.get('api/v1/auth/logout')
    .then((res) => {
      console.log(res);
      localStorage.clear();
      this.props.history('/')
    })
    .catch((err) => {
      console.log(err);
    })
  }
  public test = () => {
    axios.get('api/v1/test')
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  }
  render() {
    return (
      <div className='' style={{}}>
        <Row className="p-2" style={{backgroundColor:'#FFE4E1'}}>
          <Col 
            sm={3} 
            className="p-1 ml-2" 
            style={{backgroundColor:'lightGray', textAlign:'center', borderRadius:'3px'}}
          >
            <h2> VOCAB BUILDER </h2>
          </Col>
          <Col sm={5}>
            <Row>
                <Button
                  className='ml-3 mt-3'
                  style={{width:'100px', backgroundColor:'transparent', border:'solid 1px grey'}}
                >
                  <Link style={{color: 'grey'}} to='/'>Search</Link>
                </Button>
                <Button
                  variant="outline-secondary"
                  className='ml-1 mt-3'
                  style={{width:'100px', backgroundColor:'transparent', border:'solid 1px grey'}}
                >
                  <Link style={{color: 'grey'}} to='/test'>Test</Link>
                </Button>
            </Row>
          </Col>
          <Col>
            {
              localStorage.getItem('authenticated') == 'true' ?
                <Row>
                  <Col>
                    Hi {localStorage.getItem('name')} !!
                  </Col>
                  <Col style={{margin:'auto'}}>
                    <Button
                      variant="outline-danger"
                      onClick={()=>{
                        // localStorage.clear();
                        this.logout();
                      }}
                    >
                      Logout
                    </Button>
                  </Col>  
                </Row>
                
                :
                null
            }
          </Col>
        </Row>
        {/* <Row>
          <Button
            onClick = { () => { this.test()}}
          >
            test
          </Button>
        </Row> */}
      </div>
    );
  }
}

export default Header;